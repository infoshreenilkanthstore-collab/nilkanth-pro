import { NextResponse } from "next/server";

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const BASE_URL = `https://${STORE_DOMAIN}/admin/api/2024-01`;

async function shopifyStorefrontFetch({ query, variables }) {
  const endpoint = `https://${STORE_DOMAIN}/api/2024-01/graphql.json`;
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
    const body = await result.json();
    return { status: result.status, body };
  } catch (error) {
    console.error("Storefront Fetch Error:", error);
    return { status: 500, error };
  }
}

function getNumericId(id) {
  if (!id) return id;
  const s = String(id);
  return s.includes('gid://') ? s.split('/').pop() : s;
}

function ensureGid(id, type) {
  if (!id) return id;
  const s = String(id);
  if (s.startsWith('gid://')) return s;
  return `gid://shopify/${type}/${s}`;
}

async function getCustomerCart(customerId) {
  const numericId = getNumericId(customerId);
  const res = await fetch(`${BASE_URL}/customers/${numericId}/metafields.json?namespace=custom&key=cart`, {
    headers: { "X-Shopify-Access-Token": ADMIN_TOKEN },
    cache: "no-store",
  });
  const data = await res.json();
  const mf = data.metafields?.[0];
  if (!mf?.value) return [];
  try {
    return JSON.parse(mf.value);
  } catch {
    return [];
  }
}

async function updateCustomerCart(customerId, cart) {
  const numericId = getNumericId(customerId);
  const existingRes = await fetch(`${BASE_URL}/customers/${numericId}/metafields.json?namespace=custom&key=cart`, {
    headers: { "X-Shopify-Access-Token": ADMIN_TOKEN },
    cache: "no-store",
  });
  const existingData = await existingRes.json();
  const mf = existingData.metafields?.[0];

  const value = JSON.stringify(cart);
  const body = { metafield: { namespace: "custom", key: "cart", value, type: "json" } };

  if (mf) {
    body.metafield.id = mf.id;
    const res = await fetch(`${BASE_URL}/metafields/${mf.id}.json`, {
      method: "PUT",
      headers: { "X-Shopify-Access-Token": ADMIN_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.error("Cart PUT metafield failed:", await res.text());
  } else {
    const res = await fetch(`${BASE_URL}/customers/${numericId}/metafields.json`, {
      method: "POST",
      headers: { "X-Shopify-Access-Token": ADMIN_TOKEN, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) console.error("Cart POST metafield failed:", await res.text());
  }
  return cart;
}

async function getFullCartDetails(rawCart) {
  if (!rawCart || rawCart.length === 0) return [];

  const productIds = rawCart.map(item => ensureGid(item.productId, 'Product'));
  console.log("Fetching cart details for GIDs:", productIds);

  const { body, status } = await shopifyStorefrontFetch({
    query: `query getProducts($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on Product {
          id
          title
          handle
          images(first: 1) { edges { node { url } } }
          variants(first: 10) { edges { node { id title price { amount } weight weightUnit } } }
        }
      }
    }`,
    variables: { ids: productIds }
  });

  const nodes = body?.data?.nodes || [];
  console.log("Storefront Nodes found:", nodes.filter(n => n !== null).length);

  return rawCart
    .map(item => {
      const itemNumericId = getNumericId(item.productId);
      const details = nodes.find(node => node && node.id.includes(itemNumericId));

      if (!details) {
        console.warn(`Could not find details for product ${item.productId}`);
        return null;
      }

      // Find the specific variant matched by the stored variantId
      const variantNode = details.variants?.edges?.find(edge => edge.node.id === item.variantId)?.node 
                       || details.variants?.edges[0]?.node;

      return {
        ...item,
        title: details.title || "Unknown Product",
        variantTitle: variantNode?.title || "",
        image: details.images?.edges[0]?.node?.url || "",
        price: variantNode?.price?.amount || details.variants?.edges[0]?.node?.price?.amount || "0.00",
        weight: variantNode?.weight || details.variants?.edges[0]?.node?.weight || 0,
        weightUnit: variantNode?.weightUnit || details.variants?.edges[0]?.node?.weightUnit || "GRAMS"
      };
    })
    .filter(item => item !== null); // Filter out products not found in Shopify
}

export async function GET(req) {
  const url = new URL(req.url);
  const customerId = url.searchParams.get("customerId");
  if (!customerId) return NextResponse.json({ success: false, error: "Missing customerId" }, { status: 400 });

  try {
    const rawCart = await getCustomerCart(customerId);
    const fullCart = await getFullCartDetails(rawCart);
    return NextResponse.json({ success: true, cart: fullCart });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to load full cart" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { customerId, productId, variantId, qty, action, cart: newFullCart } = await req.json();
    if (!customerId) return NextResponse.json({ success: false, error: "Missing customerId" }, { status: 400 });

    let finalCart;

    if (newFullCart && Array.isArray(newFullCart)) {
      // Full cart sync - client is providing the source of truth
      console.log(`Full cart sync for customer ${customerId}, items: ${newFullCart.length}`);
      // Strip extra details for storage to keep metafield small
      finalCart = newFullCart.map(i => ({
        productId: i.productId,
        variantId: i.variantId,
        qty: Number(i.qty)
      }));
    } else {
      // Item-level update - backward compatibility
      if (!variantId) return NextResponse.json({ success: false, error: "Missing variantId for single update" }, { status: 400 });

      let cart = await getCustomerCart(customerId);
      const index = cart.findIndex(i => i.variantId === variantId);

      if (action === "add") {
        if (index === -1) cart.push({ productId, variantId, qty: Number(qty || 1) });
        else cart[index].qty += Number(qty || 1);
      } else if (action === "update") {
        if (index !== -1) cart[index].qty = Math.max(1, Number(qty));
      } else if (action === "remove") {
        if (index !== -1) cart.splice(index, 1);
      }
      finalCart = cart;
    }

    await updateCustomerCart(customerId, finalCart);
    const fullCart = await getFullCartDetails(finalCart);
    return NextResponse.json({ success: true, cart: fullCart });
  } catch (err) {
    console.error("Cart update error:", err);
    return NextResponse.json({ success: false, error: "Cart update failed" }, { status: 500 });
  }
}
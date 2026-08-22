import { NextResponse } from "next/server";
import { shopfrontFetch } from "@/lib/shopify";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, products: [], collections: [], articles: [] });
  }

  console.log("Search query:", q);

  // 1. Fetch products from Shopfront Backend
  let products = [];
  try {
    const { status, body } = await shopfrontFetch(`/products?search=${encodeURIComponent(q)}`);
    const rawProducts = (status === 200 && body?.success && Array.isArray(body?.data)) ? body.data : [];

    products = rawProducts.map(p => {
      const handle = p.handle || String(p.id);

      let imgEdges = [];
      if (Array.isArray(p.images) && p.images.length > 0) {
        imgEdges = p.images.map(img => ({
          node: { url: typeof img === "string" ? img : (img.url || img.src || ""), altText: p.title }
        }));
      } else if (p.image_url) {
        imgEdges = [{ node: { url: p.image_url, altText: p.title } }];
      } else if (p.image) {
        const url = typeof p.image === "string" ? p.image : (p.image.url || p.image.src || "");
        if (url) imgEdges = [{ node: { url, altText: p.title } }];
      }

      let priceAmount = 0;
      if (p.priceRange?.minVariantPrice?.amount !== undefined) {
        priceAmount = p.priceRange.minVariantPrice.amount;
      } else if (p.price?.amount !== undefined) {
        priceAmount = p.price.amount;
      } else if (typeof p.price === "number" || typeof p.price === "string") {
        priceAmount = p.price;
      } else if (p.variants?.[0]?.price?.amount !== undefined) {
        priceAmount = p.variants[0].price.amount;
      } else if (typeof p.variants?.[0]?.price === "number" || typeof p.variants?.[0]?.price === "string") {
        priceAmount = p.variants[0].price;
      }

      return {
        ...p,
        id: p.id,
        title: p.title,
        handle,
        images: { edges: imgEdges },
        priceRange: {
          minVariantPrice: {
            amount: priceAmount,
            currencyCode: "INR"
          }
        }
      };
    });
  } catch (error) {
    console.error("Error fetching products for search:", error);
  }

  // 2. Fetch collections from Shopfront Backend
  let collections = [];
  try {
    const { status: colStatus, body: colBody } = await shopfrontFetch(`/collections?limit=50`);
    const rawCollections = (colStatus === 200 && colBody?.success && Array.isArray(colBody?.data)) ? colBody.data : [];
    const lowerQ = q.toLowerCase();
    collections = rawCollections
      .filter(c => {
        const count = Number(c.product_count ?? c.products_count ?? c.productsCount ?? (c.products?.length || 0));
        return count > 0 && (
          c.title?.toLowerCase().includes(lowerQ) ||
          c.handle?.toLowerCase().includes(lowerQ) ||
          c.description?.toLowerCase().includes(lowerQ)
        );
      })
      .map(c => ({
        id: c.id,
        title: c.title,
        handle: c.handle || String(c.id),
        image: c.image_url ? { url: c.image_url, altText: c.title } : (c.image ? (typeof c.image === "string" ? { url: c.image } : c.image) : null)
      }));
  } catch (error) {
    console.error("Error fetching collections for search:", error);
  }

  // 3. Fetch blog articles from Shopfront Backend
  let articles = [];
  try {
    const lowerQ = q.toLowerCase();
    const url = `${process.env.SHOPFRONT_API_URL}/api/shop/cms/blogs/news?limit=50`;
    const res = await fetch(url, {
      headers: {
        'X-Shopfront-Token': process.env.SHOPFRONT_TOKEN,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 0 }
    });
    const blogData = await res.json();
    if (blogData.success) {
      const allArticles = blogData.data?.posts || [];
      articles = allArticles.filter(a => a.title?.toLowerCase().includes(lowerQ) || a.excerpt?.toLowerCase().includes(lowerQ));
    }
  } catch (error) {
    console.error("Error fetching blogs for search:", error);
  }

  return NextResponse.json({ success: true, products, collections, articles });
}


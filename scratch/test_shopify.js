
const SHOPIFY_STORE_DOMAIN = "store-nilkanthdham.myshopify.com";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = "db8db884e407de8c5076eaca2c5bf6fc";

async function test() {
  const query = `{ shop { name } }`;
  try {
    const res = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

test();

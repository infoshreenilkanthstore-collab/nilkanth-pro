import ProductDetails from "../../../components/ProductDetails";
import { getProduct } from "@/lib/shopify";

const SITE_URL = "https://store.nilkanthdham.in";

// 1. Dynamic Server-Side Metadata for Meta Crawler (OpenGraph & Meta Catalog)
export async function generateMetadata({ params }) {
    const { handle } = await params;
    let product = null;

    try {
        const res = await getProduct(handle);
        product = res.body?.data?.product || null;
    } catch (e) {
        console.error("Error fetching product metadata:", e);
    }

    if (!product) {
        return {
            title: "Product Not Found | Nilkanth Store",
            description: "Browse authentic religious and spiritual products at Nilkanth Store.",
        };
    }

    const cleanId = String(product.id || "").replace(/^gid:\/\/shopify\/Product\//, "");
    const title = product.title || product.name || "Product";
    const rawDescription = product.seo_description || product.description || product.bodySummary || product.body || "";
    const description = rawDescription
        .replace(/<[^>]*>?/gm, "")
        .trim()
        .slice(0, 300);

    const imageUrl = product.images?.edges?.[0]?.node?.url ||
        (Array.isArray(product.images) && typeof product.images[0] === 'string' ? product.images[0] : product.images?.[0]?.url) ||
        "";

    const price = Number(
        product.priceRange?.minVariantPrice?.amount ||
        product.price ||
        product.variants?.edges?.[0]?.node?.price?.amount ||
        0
    );

    const isAvailable = product.availableForSale !== false && product.totalInventory !== 0;
    const canonicalUrl = `${SITE_URL}/products/${handle}`;

    return {
        title: `${title} | Nilkanth Store`,
        description: description || `Buy ${title} online at best price from Nilkanth Store.`,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: `${title} | Nilkanth Store`,
            description: description || `Buy ${title} online at Nilkanth Store.`,
            url: canonicalUrl,
            siteName: "Nilkanth Store",
            images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
            type: "website",
        },
        other: {
            // Required Meta Catalog OpenGraph Microdata
            "product:retailer_item_id": cleanId,
            "product:price:amount": String(price),
            "product:price:currency": "INR",
            "product:availability": isAvailable ? "in stock" : "out of stock",
            "product:condition": "new",
            "product:brand": "Nilkanth Store",
            "og:price:amount": String(price),
            "og:price:currency": "INR",
        },
    };
}

// 2. Server Component rendering Schema.org JSON-LD Structured Data & Product Page
export default async function ProductPage({ params }) {
    const { handle } = await params;
    let product = null;

    try {
        const res = await getProduct(handle);
        product = res.body?.data?.product || null;
    } catch (e) {
        console.error("Error prefetching product for JSON-LD:", e);
    }

    // Build Schema.org JSON-LD Structured Data for Meta Catalog Microdata Crawler
    let jsonLd = null;
    if (product) {
        const cleanId = String(product.id || "").replace(/^gid:\/\/shopify\/Product\//, "");
        const title = product.title || product.name || "";
        const rawDescription = product.seo_description || product.description || product.bodySummary || product.body || "";
        const description = rawDescription
            .replace(/<[^>]*>?/gm, "")
            .trim();

        const images = (
            product.images?.edges?.map(e => e.node?.url) ||
            product.images?.map(img => (typeof img === "string" ? img : img?.url)) ||
            []
        ).filter(Boolean);

        const price = Number(
            product.priceRange?.minVariantPrice?.amount ||
            product.price ||
            product.variants?.edges?.[0]?.node?.price?.amount ||
            0
        );

        const isAvailable = product.availableForSale !== false && product.totalInventory !== 0;
        const productUrl = `${SITE_URL}/products/${handle}`;

        jsonLd = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "@id": `${SITE_URL}/products/${handle}#product`,
            "name": title,
            "image": images.length > 0 ? images : undefined,
            "description": description,
            "sku": cleanId,
            "productID": cleanId,
            "brand": {
                "@type": "Brand",
                "name": "Nilkanth Store"
            },
            "offers": {
                "@type": "Offer",
                "url": productUrl,
                "priceCurrency": "INR",
                "price": price,
                "itemCondition": "https://schema.org/NewCondition",
                "availability": isAvailable
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": "Nilkanth Store"
                }
            }
        };
    }

    return (
        <main className="min-h-screen bg-white">
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductDetails
                key={handle}
                handle={handle}
                initialProduct={product}
            />
        </main>
    );
}
// const domain = process.env.SHOPIFY_STORE_DOMAIN;
// const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// async function shopifyFetch({ query, variables }) {
//     const endpoint = `https://${domain}/api/2024-01/graphql.json`;

//     try {
//         const result = await fetch(endpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
//             },
//             body: JSON.stringify({ query, variables }),
//         });

//         let text = await result.text();
//         text = text.replace(/https:\/\/ecommerce-annapurna\.megascale\.co\.in/g, 'https://megaecomm.megascale.co.in');

//         return {
//             status: result.status,
//             body: JSON.parse(text),
//         };
//     } catch (error) {
//         console.error('Error fetching from Shopify:', error);
//         return {
//             status: 500,
//             error: 'Error receiving data from Shopify',
//         };
//     }
// }

// export async function shopfrontFetch(endpoint, options = {}) {
//     const baseUrl = process.env.SHOPFRONT_API_URL;
//     const { method = 'GET', body, headers = {} } = options;

//     if (!baseUrl) {
//         console.error('Error: SHOPFRONT_API_URL is not defined in environment variables');
//         return {
//             status: 500,
//             body: { success: false, errors: 'SHOPFRONT_API_URL is missing' }
//         };
//     }

//     const url = endpoint.startsWith('/api/') ? `${baseUrl}${endpoint}` : `${baseUrl}/api/shop${endpoint}`;

//     try {
//         const result = await fetch(url, {
//             method: method,
//             headers: {
//                 'X-Shopfront-Token': process.env.SHOPFRONT_TOKEN,
//                 'x-store-id': '16',
//                 'Content-Type': 'application/json',
//                 ...headers
//             },
//             body: body ? JSON.stringify(body) : undefined,
//             next: { revalidate: 0 }
//         });



//         let text = await result.text();
//         text = text.replace(/https:\/\/ecommerce-annapurna\.megascale\.co\.in/g, 'https://megaecomm.megascale.co.in');
//         let resBody;
//         try {
//             resBody = JSON.parse(text);
//         } catch (e) {
//             resBody = { success: false, errors: 'Invalid JSON response from server', raw: text.substring(0, 100) };
//         }

//         return {
//             status: result.status,
//             body: resBody,
//         };

//     } catch (error) {
//         console.error('Error fetching from Shopfront:', error);
//         return {
//             status: 500,
//             body: { success: false, errors: error.message || 'Error receiving data from Shopfront' }
//         };
//     }
// }



// export async function getPages() {
//     return shopifyFetch({
//         query: `
//         {
//             pages(first: 20) {
//                 edges {
//                     node {
//                         id
//                         title
//                         handle
//                         body
//                         bodySummary
//                     }
//                 }
//             }
//         }
//         `
//     });
// }



// export async function getProducts(first = 250) {
//     const { status, body } = await shopfrontFetch(`/products?limit=${first}`);


//     if (status !== 200 || !body?.success) {
//         return { status, body };
//     }

//     const edges = (body.data || []).map(product => {
//         const variants = (product.variants || []).map(v => ({
//             ...v,
//             price: v.price || { amount: v.price_amount || v.price || 0, currencyCode: "INR" },
//             compareAtPrice: v.compareAtPrice || (v.compare_at_price ? { amount: v.compare_at_price, currencyCode: "INR" } : null)
//         }));

//         return {
//             node: {
//                 ...product,
//                 images: { edges: product.images?.map(img => ({ node: img })) || [] },
//                 variants: { edges: variants.map(v => ({ node: v })) || [] },
//                 collections: { edges: [] },
//                 priceRange: product.priceRange || {
//                     minVariantPrice: { amount: product.price || 0, currencyCode: "INR" }
//                 },
//                 compareAtPriceRange: product.compareAtPriceRange || {
//                     minVariantPrice: {
//                         amount: product.compare_at_price || product.compareAtPrice || product.price || 0,
//                         currencyCode: "INR"
//                     }
//                 }
//             }
//         };
//     });

//     return {
//         status: 200,
//         body: {
//             data: {
//                 products: { edges }
//             }
//         }
//     };
// }

// export async function shopifyAdminFetch({ query, variables }) {
//     const endpoint = `https://${domain}/admin/api/2024-04/graphql.json`;

//     try {
//         const result = await fetch(endpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
//             },
//             body: JSON.stringify({ query, variables }),
//         });

//         let text = await result.text();
//         text = text.replace(/https:\/\/ecommerce-annapurna\.megascale\.co\.in/g, 'https://megaecomm.megascale.co.in');

//         return {
//             status: result.status,
//             body: JSON.parse(text),
//         };
//     } catch (error) {
//         console.error('Error fetching from Shopify Admin:', error);
//         return { status: 500, error: 'Error receiving data from Shopify Admin' };
//     }
// }

// export async function getProduct(handle) {
//     const { status, body } = await shopfrontFetch(`/products/${handle}`);

//     if (status !== 200 || !body?.success) {
//         return { status, body };
//     }

//     const product = body.data;

//     if (!product) {
//         return {
//             status: 200,
//             body: { data: { product: null } }
//         };
//     }

//     const variants = (product.variants || []).map(v => ({
//         ...v,
//         price: v.price || { amount: v.price_amount || v.price || 0, currencyCode: "INR" },
//         compareAtPrice: v.compareAtPrice || (v.compare_at_price ? { amount: v.compare_at_price, currencyCode: "INR" } : null)
//     }));

//     return {
//         status: 200,
//         body: {
//             data: {
//                 product: {
//                     ...product,
//                     images: { edges: product.images?.map(img => ({ node: img })) || [] },
//                     variants: { edges: variants.map(v => ({ node: v })) || [] },
//                     collections: { edges: [] },
//                     priceRange: product.priceRange || {
//                         minVariantPrice: { amount: product.price || 0, currencyCode: "INR" }
//                     },
//                     compareAtPriceRange: product.compareAtPriceRange || {
//                         minVariantPrice: {
//                             amount: product.compare_at_price || product.compareAtPrice || product.price || 0,
//                             currencyCode: "INR"
//                         }
//                     }
//                 }
//             }
//         }
//     };
// }

// export async function calculateDraftOrder(variables) {
//     const draftOrderCalculateMutation = `
//         mutation draftOrderCalculate($input: DraftOrderInput!) {
//             draftOrderCalculate(input: $input) {
//                 calculatedDraftOrder {
//                     totalTax
//                     subtotalPrice
//                     totalPrice
//                     taxLines {
//                         title
//                         rate
//                         price
//                     }
//                 }
//             }
//         }
//     `;

//     return shopifyAdminFetch({
//         query: draftOrderCalculateMutation,
//         variables
//     });
// }


// src\lib\shopify.js

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ query, variables }) {
    const endpoint = `https://${domain}/api/2024-01/graphql.json`;

    try {
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
            },
            body: JSON.stringify({ query, variables }),
        });

        let text = await result.text();
        text = text.replace(/https:\/\/ecommerce-annapurna\.megascale\.co\.in/g, 'https://megaecomm.megascale.co.in');

        return {
            status: result.status,
            body: JSON.parse(text),
        };
    } catch (error) {
        console.error('Error fetching from Shopify:', error);
        return {
            status: 500,
            error: 'Error receiving data from Shopify',
        };
    }
}

export async function shopfrontFetch(endpoint, options = {}) {
    const baseUrl = process.env.SHOPFRONT_API_URL;
    const { method = 'GET', body, headers = {} } = options;

    if (!baseUrl) {
        console.error('Error: SHOPFRONT_API_URL is not defined in environment variables');
        return {
            status: 500,
            body: { success: false, errors: 'SHOPFRONT_API_URL is missing' }
        };
    }

    const url = endpoint.startsWith('/api/') ? `${baseUrl}${endpoint}` : `${baseUrl}/api/shop${endpoint}`;

    try {
        const result = await fetch(url, {
            method: method,
            headers: {
                'X-Shopfront-Token': process.env.SHOPFRONT_TOKEN,
                'x-store-id': '16',
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : undefined,
            next: { revalidate: 0 }
        });



        let text = await result.text();
        text = text.replace(/https:\/\/ecommerce-annapurna\.megascale\.co\.in/g, 'https://megaecomm.megascale.co.in');
        let resBody;
        try {
            resBody = JSON.parse(text);
        } catch (e) {
            resBody = { success: false, errors: 'Invalid JSON response from server', raw: text.substring(0, 100) };
        }

        return {
            status: result.status,
            body: resBody,
        };

    } catch (error) {
        console.error('Error fetching from Shopfront:', error);
        return {
            status: 500,
            body: { success: false, errors: error.message || 'Error receiving data from Shopfront' }
        };
    }
}



export async function getPages() {
    return shopifyFetch({
        query: `
        {
            pages(first: 20) {
                edges {
                    node {
                        id
                        title
                        handle
                        body
                        bodySummary
                    }
                }
            }
        }
        `
    });
}



export async function getProducts(first = 250) {
    const { status, body } = await shopfrontFetch(`/products?limit=${first}`);


    if (status !== 200 || !body?.success) {
        return { status, body };
    }

    const edges = (body.data || []).map(product => {
        const variants = (product.variants || []).map(v => ({
            ...v,
            price: v.price || { amount: v.price_amount || v.price || 0, currencyCode: "INR" },
            compareAtPrice: v.compareAtPrice || (v.compare_at_price ? { amount: v.compare_at_price, currencyCode: "INR" } : null)
        }));

        const handle = product.handle || String(product.id);

        return {
            node: {
                ...product,
                handle,
                images: { edges: product.images?.map(img => ({ node: img })) || [] },
                variants: { edges: variants.map(v => ({ node: v })) || [] },
                collections: { edges: [] },
                priceRange: product.priceRange || {
                    minVariantPrice: { amount: product.price || 0, currencyCode: "INR" }
                },
                compareAtPriceRange: product.compareAtPriceRange || {
                    minVariantPrice: {
                        amount: product.compare_at_price || product.compareAtPrice || product.price || 0,
                        currencyCode: "INR"
                    }
                }
            }
        };
    });

    return {
        status: 200,
        body: {
            data: {
                products: { edges }
            }
        }
    };
}

export async function shopifyAdminFetch({ query, variables }) {
    const endpoint = `https://${domain}/admin/api/2024-04/graphql.json`;

    try {
        const result = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '',
            },
            body: JSON.stringify({ query, variables }),
        });

        let text = await result.text();
        text = text.replace(/https:\/\/ecommerce-annapurna\.megascale\.co\.in/g, 'https://megaecomm.megascale.co.in');

        return {
            status: result.status,
            body: JSON.parse(text),
        };
    } catch (error) {
        console.error('Error fetching from Shopify Admin:', error);
        return { status: 500, error: 'Error receiving data from Shopify Admin' };
    }
}

export async function getProduct(handle) {
    if (!handle || handle === "null" || handle === "undefined") {
        return {
            status: 400,
            body: { success: false, error: "Invalid product handle or ID" }
        };
    }

    let status, body;
    try {
        const res = await shopfrontFetch(`/products/${handle}`);
        status = res.status;
        body = res.body;
    } catch (e) {
        status = 500;
        body = { success: false };
    }

    if (status !== 200 || !body?.success || !body?.data) {
        try {
            const searchTerms = handle.replace(/-/g, ' ');
            const searchRes = await shopfrontFetch(`/products?search=${encodeURIComponent(searchTerms)}`);
            if (searchRes.status === 200 && searchRes.body?.success && Array.isArray(searchRes.body?.data) && searchRes.body.data.length > 0) {
                status = 200;
                body = { success: true, data: searchRes.body.data[0] };
            }
        } catch (err) {
            console.error("Error fetching fallback product from Shopfront backend:", err);
        }
    }

    if (status !== 200 || !body?.success) {
        return { status, body };
    }

    const product = body.data;

    if (!product) {
        return {
            status: 200,
            body: { data: { product: null } }
        };
    }

    const variants = (product.variants || []).map(v => ({
        ...v,
        price: v.price || { amount: v.price_amount || v.price || 0, currencyCode: "INR" },
        compareAtPrice: v.compareAtPrice || (v.compare_at_price ? { amount: v.compare_at_price, currencyCode: "INR" } : null)
    }));

    const handleVal = product.handle || String(product.id || handle);

    return {
        status: 200,
        body: {
            data: {
                product: {
                    ...product,
                    handle: handleVal,
                    images: { edges: product.images?.map(img => ({ node: img })) || [] },
                    variants: { edges: variants.map(v => ({ node: v })) || [] },
                    collections: { edges: [] },
                    priceRange: product.priceRange || {
                        minVariantPrice: { amount: product.price || 0, currencyCode: "INR" }
                    },
                    compareAtPriceRange: product.compareAtPriceRange || {
                        minVariantPrice: {
                            amount: product.compare_at_price || product.compareAtPrice || product.price || 0,
                            currencyCode: "INR"
                        }
                    }
                }
            }
        }
    };
}

export async function calculateDraftOrder(variables) {
    const draftOrderCalculateMutation = `
        mutation draftOrderCalculate($input: DraftOrderInput!) {
            draftOrderCalculate(input: $input) {
                calculatedDraftOrder {
                    totalTax
                    subtotalPrice
                    totalPrice
                    taxLines {
                        title
                        rate
                        price
                    }
                }
            }
        }
    `;

    return shopifyAdminFetch({
        query: draftOrderCalculateMutation,
        variables
    });
}


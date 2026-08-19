import { NextResponse } from "next/server";

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

        if (result.status !== 200) {
            const errorText = await result.text();
            console.error(`Shopify API Error (${result.status}):`, errorText);
            return {
                status: result.status,
                body: { errors: [{ message: errorText }] },
            };
        }

        return {
            status: result.status,
            body: await result.json(),
        };
    } catch (error) {
        console.error('Error fetching from Shopify:', error);
        return {
            status: 500,
            error: 'Error receiving data from Shopify',
        };
    }
}

export async function POST(request) {
    try {
        const { ids } = await request.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json(
                { error: "Invalid Request", message: "IDs array is required" },
                { status: 400 }
            );
        }

        const { body, status } = await shopifyFetch({
            query: `
        query getProducts($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              id
              title
              handle
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      `,
            variables: { ids },
        });

        if (status !== 200 || body.errors) {
            return NextResponse.json(
                { error: "Shopify API Error", details: body.errors || body },
                { status: status === 200 ? 500 : status }
            );
        }

        const products = body?.data?.nodes.filter(node => node !== null) || [];

        return NextResponse.json({
            success: true,
            products
        });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", message: error.message },
            { status: 500 }
        );
    }
}

// import ProductDetails from "../../../components/ProductDetails";

// export default async function ProductPage({ params }) {
//     // Await params to get the handle in Next.js 15+ App Router
//     const { handle } = await params;

//     return (
//         <main className="min-h-screen bg-white">
//             <ProductDetails handle={handle} />
//         </main>
//     );
// }

// app/products/[handle]/page.jsx

import ProductDetails from "../../../components/ProductDetails";

export default async function ProductPage({ params }) {
    const { handle } = await params;

    return (
        <main className="min-h-screen bg-white">
            <ProductDetails
                key={handle}
                handle={handle}
            />
        </main>
    );
}
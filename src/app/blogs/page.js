import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// import CategorySetter from '@/components/CategorySetter';

export const metadata = {
    title: 'Blogs | Nilkanth Store',
    description: 'Read our latest stories, recipes, and spiritual insights.',
};

export const revalidate = 0;

export default async function BlogsPage({ searchParams }) {
    let articles = [];
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams?.page || '1', 10);
    const limit = 12;

    try {
        const url = `${process.env.SHOPFRONT_API_URL}/api/shop/cms/blogs/news?limit=100`;
        const res = await fetch(url, {
            headers: {
                'X-Shopfront-Token': process.env.SHOPFRONT_TOKEN,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 0 }
        });
        const data = await res.json();
        if (data && data.success) {
            articles = data.data?.posts || [];
        }
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }

    const totalPages = Math.ceil(articles.length / limit);
    const paginatedArticles = articles.slice((page - 1) * limit, page * limit);

    return (
        <div className="bg-[#fffcf7] min-h-screen pt-4 md:pt-6 md:pb-16 pb-0">
            {/* <CategorySetter label="Blogs" href="/blogs" /> */}
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-nunito font-bold text-[#700b10] mb-4">
                        Our Spiritual Library
                    </h1>
                    {/* <div className="h-1 w-24 bg-yellow-400 mx-auto rounded-full"></div> */}
                    <p className="text-gray-600 md:mt-6 mt-4 max-w-2xl mx-auto font-nunito md:text-lg text-base">
                        Deepen your connection with our collection of spiritual insights,
                        traditional recipes, and the story of Nilkanth Store.
                    </p>
                </div>

                {/* Blog Grid */}
                {paginatedArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {paginatedArticles.map((article, index) => (
                            <Link
                                key={article.id || index}
                                href={`/blogs/${article.handle}`}
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-yellow-100 flex flex-col h-full"
                            >
                                <div className="relative aspect-[16/16] overflow-hidden">
                                    {article.image_url ? (
                                        <Image
                                            src={article.image_url}
                                            alt={article.title}
                                            fill
                                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                            <span className="text-gray-400">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[#700b10] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {article.blog_title || 'News'}
                                        </span>
                                    </div>
                                </div>
                                <div className="md:p-8 p-4 flex flex-col flex-grow">
                                    <div className="text-xs text-gray-400 mb-3 flex items-center gap-2">
                                        <span>{new Date(article.published_at || Date.now()).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                    <h2 className="md:text-2xl text-lg font-bold text-[#700b10] mb-4 group-hover:text-yellow-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-600 font-nunito text-xs md:text-base line-clamp-3 md:mb-6 mb-4 flex-grow">
                                        {article.excerpt || 'Read more about this article and dive deep into the spiritual essence of Nilkanth Store.'}
                                    </p>
                                    <div className="flex items-center text-[#700b10] font-bold text-sm group-hover:gap-2 transition-all">
                                        Read More
                                        <svg
                                            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-nunito text-xl">Our spiritual library is currently being curated. Check back soon!</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12">
                        {page > 1 ? (
                            <Link
                                href={`/blogs?page=${page - 1}`}
                                className="px-6 py-2 border border-[#700b10] text-[#700b10] rounded-full hover:bg-[#700b10] hover:text-white transition-colors font-nunito font-semibold"
                            >
                                Previous
                            </Link>
                        ) : (
                            <div className="px-6 py-2 border border-gray-300 text-gray-400 rounded-full cursor-not-allowed font-nunito font-semibold">
                                Previous
                            </div>
                        )}
                        <span className="text-gray-600 font-nunito font-semibold">
                            Page {page} of {totalPages}
                        </span>
                        {page < totalPages ? (
                            <Link
                                href={`/blogs?page=${page + 1}`}
                                className="px-6 py-2 border border-[#700b10] text-[#700b10] rounded-full hover:bg-[#700b10] hover:text-white transition-colors font-nunito font-semibold"
                            >
                                Next
                            </Link>
                        ) : (
                            <div className="px-6 py-2 border border-gray-300 text-gray-400 rounded-full cursor-not-allowed font-nunito font-semibold">
                                Next
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

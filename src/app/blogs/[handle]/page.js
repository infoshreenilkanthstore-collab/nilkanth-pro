import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// import CategorySetter from '@/components/CategorySetter';

export const revalidate = 0;

export async function generateMetadata({ params }) {
    const { handle } = await params;
    let article = null;
    try {
        const url = `${process.env.SHOPFRONT_API_URL}/api/shop/cms/blogs/news?limit=50`;
        const res = await fetch(url, {
            headers: {
                'X-Shopfront-Token': process.env.SHOPFRONT_TOKEN,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 0 }
        });
        const data = await res.json();
        if (data && data.success) {
            article = (data.data?.posts || []).find(a => a.handle === handle);
        }
    } catch (e) {}

    if (!article) return { title: 'Article Not Found' };

    return {
        title: `${article.title} | Nilkanth Store`,
        description: article.seo?.description || article.excerpt,
        alternates: {
            canonical: `/blogs/${handle}`,
        },
        openGraph: {
            title: `${article.title} | Nilkanth Store`,
            description: article.seo?.description || article.excerpt,
            url: `/blogs/${handle}`,
        },
    };
}

export default async function ArticlePage({ params }) {
    const { handle } = await params;
    let article = null;
    try {
        const url = `${process.env.SHOPFRONT_API_URL}/api/shop/cms/blogs/news?limit=50`;
        const res = await fetch(url, {
            headers: {
                'X-Shopfront-Token': process.env.SHOPFRONT_TOKEN,
                'Content-Type': 'application/json'
            },
            next: { revalidate: 0 }
        });
        const data = await res.json();
        if (data && data.success) {
            article = (data.data?.posts || []).find(a => a.handle === handle);
        }
    } catch (e) {}

    if (!article) {
        notFound();
    }

    return (
        <article className="bg-[#fffcf7] min-h-screen pt-4 md:pt-8 pb-10">
            {/* <CategorySetter label="Blogs" href="/blogs" /> */}

            <div className="max-w-4xl mx-auto px-4 md:px-6">
                {/* Article Header */}
                <header className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-4xl font-nunito font-bold text-[#700b10] leading-tight mb-4">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-4 border-y border-yellow-100 py-3 md:py-4">
                        <div className="flex-grow">
                            <p className="text-sm font-bold text-[#700b10] uppercase tracking-wider mb-1">
                                Written by Admin
                            </p>
                            <p className="text-sm text-gray-500">
                                {new Date(article.published_at || Date.now()).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </header>



                {/* Content */}
                <div
                    className="prose max-w-none font-nunito text-gray-800 leading-relaxed
                        prose-headings:font-nunito prose-headings:text-[#700b10] prose-headings:font-bold
                        prose-a:text-[#700b10] prose-a:underline hover:prose-a:text-yellow-600
                        prose-strong:text-[#700b10] prose-img:rounded-2xl prose-img:shadow-sm prose-img:my-4
                        prose-blockquote:border-[#700b10] prose-blockquote:bg-yellow-50/50 prose-blockquote:py-1 prose-blockquote:px-6
                        prose-p:my-2 prose-headings:my-3"
                    dangerouslySetInnerHTML={{ __html: article.content || article.excerpt }}
                />

                {/* Footer Section */}
                <footer className="mt-10 pt-8 border-t border-yellow-100">
                    <div className="bg-white p-5 md:p-6 rounded-2xl border border-yellow-100 shadow-sm text-center">
                        <h2 className="text-xl md:text-2xl font-nunito font-bold text-[#700b10] mb-3">Share the Wisdom</h2>
                        <p className="text-sm md:text-base text-gray-600 mb-5">If this article touched your heart, share it with your loved ones.</p>
                        <div className="flex justify-center gap-4">
                            {/* <button
                                className="px-6 py-2 bg-[#700b10] text-white rounded-full font-bold hover:bg-[#8b0d14] transition-colors"
                            >
                                Copy Link
                            </button> */}
                            <Link
                                href="/blogs"
                                className="px-6 py-2 border-2 border-[#700b10] text-[#700b10] rounded-full font-bold hover:bg-yellow-50 transition-colors"
                            >
                                Back to All Blogs
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </article>
    );
}

// src\app\sitemap.js


export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://store.nilkanthdham.in';
  let dynamicUrls = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_SHOPFRONT_API_URL || 'https://megaecomm.megascale.co.in/backend';
    const token = process.env.NEXT_PUBLIC_SHOPFRONT_TOKEN || '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d3690e704f526300';

    const response = await fetch(`${apiUrl}/api/shop/sitemap.xml`, {
      headers: {
        'X-Shopfront-Token': token,
        'Content-Type': 'application/json',
      },
      // Revalidate every hour, or adjust as needed
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const xmlString = await response.text();
      const urlBlocks = [...xmlString.matchAll(/<url>[\s\S]*?<\/url>/g)].map((m) => m[0]);

      dynamicUrls = urlBlocks.map((block) => {
        const locMatch = block.match(/<loc>(.*?)<\/loc>/);
        const lastmodMatch = block.match(/<lastmod>(.*?)<\/lastmod>/);
        const changefreqMatch = block.match(/<changefreq>(.*?)<\/changefreq>/);
        const priorityMatch = block.match(/<priority>(.*?)<\/priority>/);

        let url = locMatch ? locMatch[1].trim() : '';
        // Escape XML special characters to prevent xmlParseEntityRef errors
        url = url.replace(/&(?!amp;|lt;|gt;|apos;|quot;)/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/'/g, '&apos;')
          .replace(/"/g, '&quot;');

        return {
          url,
          lastModified: lastmodMatch ? new Date(lastmodMatch[1].trim()) : new Date(),
          changeFrequency: changefreqMatch ? changefreqMatch[1].trim() : 'weekly',
          priority: priorityMatch ? parseFloat(priorityMatch[1].trim()) : 0.8,
        };
      }).filter((item) => item.url !== '');
    } else {
      console.error('Failed to fetch sitemap from backend:', response.status);
    }
  } catch (error) {
    console.error('Error fetching sitemap:', error);
  }

  const staticPages = [
    '/',
    '/about',
    '/blogs',
    '/bulk-order',
    '/collections',
    // '/contact',
    '/faq',
    '/privacy-policy',
    '/return-policy',
    '/shipping-policy',
    '/terms-conditions',
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: page === '/' ? 1.0 : 0.8,
  }));

  // Filter out static URLs if they are already present in the dynamic URLs
  // to prevent duplicates
  const dynamicUrlsSet = new Set(dynamicUrls.map((item) => item.url));
  const uniqueStaticUrls = staticUrls.filter((item) => !dynamicUrlsSet.has(item.url));

  return [...uniqueStaticUrls, ...dynamicUrls];
}

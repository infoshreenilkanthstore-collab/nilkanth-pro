export const revalidate = 3600; // Revalidate every hour

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://store.nilkanthdham.in";

  const apiUrl =
    process.env.SHOPFRONT_API_URL ||
    process.env.NEXT_PUBLIC_SHOPFRONT_API_URL ||
    "https://megaecomm.megascale.co.in/backend";

  const token =
    process.env.SHOPFRONT_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPFRONT_TOKEN ||
    "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d3690e704f526300";

  let dynamicUrls = [];

  try {
    const response = await fetch(`${apiUrl}/api/shop/sitemap.xml`, {
      headers: {
        "X-Shopfront-Token": token,
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (response.ok) {
      const xml = await response.text();

      // Extract all <url>...</url> blocks
      const urlBlocks = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)];

      dynamicUrls = urlBlocks
        .map((block) => {
          const content = block[1];
          const locMatch = content.match(/<loc>([\s\S]*?)<\/loc>/i);
          const lastmodMatch = content.match(/<lastmod>([\s\S]*?)<\/lastmod>/i);
          const changefreqMatch = content.match(/<changefreq>([\s\S]*?)<\/changefreq>/i);
          const priorityMatch = content.match(/<priority>([\s\S]*?)<\/priority>/i);

          const url = locMatch ? locMatch[1].trim() : "";
          if (!url) return null;

          const lastmodStr = lastmodMatch ? lastmodMatch[1].trim() : null;
          const lastModified = lastmodStr && !isNaN(new Date(lastmodStr).getTime())
            ? new Date(lastmodStr)
            : new Date();

          const changeFrequency = changefreqMatch
            ? changefreqMatch[1].trim()
            : "weekly";

          const priorityVal = priorityMatch ? parseFloat(priorityMatch[1].trim()) : 0.8;
          const priority = !isNaN(priorityVal) ? priorityVal : 0.8;

          return {
            url,
            lastModified,
            changeFrequency,
            priority,
          };
        })
        .filter(Boolean);
    } else {
      console.error(`Sitemap API returned status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching dynamic sitemap:", error);
  }

  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blogs", priority: 0.85, changeFrequency: "weekly" },
    { path: "/bulk-order", priority: 0.8, changeFrequency: "monthly" },
    { path: "/collections", priority: 0.95, changeFrequency: "daily" },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/return-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/shipping-policy", priority: 0.3, changeFrequency: "yearly" },
    { path: "/terms-conditions", priority: 0.3, changeFrequency: "yearly" },
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl.replace(/\/$/, "")}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // Normalize URLs to avoid duplicate matches (e.g. trailing slashes)
  const normalize = (u) => (u ? u.trim().replace(/\/+$/, "") : "");

  const dynamicSet = new Set(dynamicUrls.map((item) => normalize(item.url)));

  const uniqueStatic = staticUrls.filter(
    (item) => !dynamicSet.has(normalize(item.url))
  );

  return [...uniqueStatic, ...dynamicUrls];
}

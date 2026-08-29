'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MarketingScriptInjector() {
  const pathname = usePathname();
  const [scripts, setScripts] = useState([]);

  useEffect(() => {
    async function fetchScripts() {
      if (!pathname) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_SHOPFRONT_API_URL || 'https://megaecomm.megascale.co.in/backend';
        const token = process.env.NEXT_PUBLIC_SHOPFRONT_TOKEN || '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d3690e704f526300';

        // Fetch scripts for the specific current route
        const routePromise = fetch(`${apiUrl}/api/shop/marketing-scripts?route=${encodeURIComponent(pathname)}`, {
          headers: {
            'X-Shopfront-Token': token,
            'Content-Type': 'application/json'
          }
        });

        // Fetch scripts intended for all pages
        const allPromise = fetch(`${apiUrl}/api/shop/marketing-scripts?route=${encodeURIComponent('/all')}`, {
          headers: {
            'X-Shopfront-Token': token,
            'Content-Type': 'application/json'
          }
        });

        const [routeRes, allRes] = await Promise.all([routePromise, allPromise]);
        const routeJson = await routeRes.json();
        const allJson = await allRes.json();

        let combinedScripts = [];

        // Add global /all scripts first
        if (allJson.success && allJson.data) {
          combinedScripts = [...combinedScripts, ...allJson.data];
        }

        // Add route-specific scripts (avoiding duplicates if pathname is literally '/all')
        if (routeJson.success && routeJson.data && pathname !== '/all') {
          combinedScripts = [...combinedScripts, ...routeJson.data];
        }

        setScripts(combinedScripts);
      } catch (error) {
        console.error('[MarketingScript] Failed to fetch marketing scripts', error);
      }
    }
    fetchScripts();
  }, [pathname]);

  useEffect(() => {
    if (!scripts || scripts.length === 0) return;

    const addedNodes = [];

    scripts.forEach(item => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.script_content;

      const parsedScripts = Array.from(tempDiv.querySelectorAll('script'));

      parsedScripts.forEach(parsedScript => {
        const newScript = document.createElement('script');
        Array.from(parsedScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });

        if (parsedScript.textContent) {
          newScript.textContent = parsedScript.textContent;
        }

        if (item.placement === 'head') {
          document.head.appendChild(newScript);
          addedNodes.push(newScript);
        } else {
          document.body.appendChild(newScript);
          addedNodes.push(newScript);
        }
      });

      Array.from(tempDiv.children).forEach(node => {
        if (node.tagName.toLowerCase() !== 'script') {
          const clone = node.cloneNode(true);
          if (item.placement === 'head') {
            document.head.appendChild(clone);
            addedNodes.push(clone);
          } else {
            document.body.appendChild(clone);
            addedNodes.push(clone);
          }
        }
      });
    });

    // Cleanup injected nodes on unmount or route change
    return () => {
      addedNodes.forEach(node => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
    };
  }, [scripts]);

  return null;
}

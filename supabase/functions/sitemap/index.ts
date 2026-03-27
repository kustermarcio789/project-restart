import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE = "https://decolandoemviagens.com";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/cotacao", priority: "0.9", changefreq: "monthly" },
    { loc: "/blog", priority: "0.8", changefreq: "daily" },
  ];

  // Dynamic: destinations
  const { data: destinations } = await supabase
    .from("destinations")
    .select("slug, updated_at")
    .eq("status", "published");

  // Dynamic: services
  const { data: services } = await supabase
    .from("services")
    .select("slug, updated_at")
    .eq("status", "published");

  // Dynamic: blog posts
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("status", "published");

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  for (const p of staticPages) {
    xml += `  <url>
    <loc>${SITE}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>
`;
  }

  for (const d of destinations || []) {
    xml += `  <url>
    <loc>${SITE}/destino/${d.slug}</loc>
    <lastmod>${(d.updated_at || now).split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  for (const s of services || []) {
    xml += `  <url>
    <loc>${SITE}/servico/${s.slug}</loc>
    <lastmod>${(s.updated_at || now).split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  for (const p of posts || []) {
    xml += `  <url>
    <loc>${SITE}/blog/${p.slug}</loc>
    <lastmod>${(p.published_at || now).split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
});

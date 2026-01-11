
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Define simpler types for the script to avoid importing full project types
interface Wine {
    id: string;
    updated_at: string;
}

interface BlogArticle {
    slug: string;
    updated_at: string;
}

// Manually load .env file
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"]|['"]$/g, ""); // Remove quotes
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    });
}

async function generateSitemap() {
    console.log("Generating sitemap...");

    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase credentials in environment variables.");
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Fetch wines
        const { data: wines, error: winesError } = await supabase
            .from("wines")
            .select("id, updated_at");

        if (winesError) {
            throw winesError;
        }

        // Fetch published blog articles
        const { data: articles, error: articlesError } = await supabase
            .from("blog_articles")
            .select("slug, updated_at")
            .eq("status", "published");

        if (articlesError) {
            console.warn("Warning: Could not fetch blog articles:", articlesError.message);
        }

        const baseUrl = "https://selection.com.vn";
        const today = new Date().toISOString().split('T')[0];

        const staticPages = [
            { path: "", priority: "1.0", changefreq: "daily" },
            { path: "/collection", priority: "0.9", changefreq: "daily" },
            { path: "/about", priority: "0.8", changefreq: "monthly" },
            { path: "/contact", priority: "0.8", changefreq: "monthly" },
            { path: "/gifts", priority: "0.9", changefreq: "weekly" },
            { path: "/tu-van-ca-nhan", priority: "0.7", changefreq: "monthly" },
            { path: "/tuyen-dung", priority: "0.6", changefreq: "monthly" },
            { path: "/blog", priority: "0.9", changefreq: "daily" },
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  ${staticPages
                .map((page) => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
                .join("")}

  <!-- Wine Products -->
  ${wines
                ?.map((wine: Wine) => `
  <url>
    <loc>${baseUrl}/collection/${wine.id}</loc>
    <lastmod>${new Date(wine.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`)
                .join("") || ""}

  <!-- Blog Articles -->
  ${articles
                ?.map((article: BlogArticle) => `
  <url>
    <loc>${baseUrl}/blog/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`)
                .join("") || ""}
</urlset>`;

        const publicDir = path.resolve(process.cwd(), "public");
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
        console.log("Sitemap generated successfully at public/sitemap.xml");
        console.log(`  - ${staticPages.length} static pages`);
        console.log(`  - ${wines?.length || 0} wine products`);
        console.log(`  - ${articles?.length || 0} blog articles`);
    } catch (err) {
        console.error("Error generating sitemap:", err);
        process.exit(1);
    }
}

generateSitemap();


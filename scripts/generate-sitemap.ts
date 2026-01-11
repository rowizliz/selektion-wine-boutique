
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Define simpler types for the script to avoid importing full project types
interface Wine {
    id: string;
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
        const { data: wines, error } = await supabase
            .from("wines")
            .select("id, updated_at");

        if (error) {
            throw error;
        }

        const baseUrl = "https://selection.com.vn";
        const pages = [
            "",
            "/collection",
            "/about",
            "/contact",
            "/gifts",
            "/tu-van-ca-nhan",
            "/tuyen-dung",
            "/blog",
        ];

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
                .map((page) => {
                    return `
  <url>
    <loc>${baseUrl}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>`;
                })
                .join("")}
  ${wines
                ?.map((wine: Wine) => {
                    return `
  <url>
    <loc>${baseUrl}/collection/${wine.id}</loc>
    <lastmod>${new Date(wine.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
                })
                .join("")}
</urlset>`;

        const publicDir = path.resolve(process.cwd(), "public");
        if (!fs.existsSync(publicDir)) {
            fs.mkdirSync(publicDir);
        }

        fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
        console.log("Sitemap generated successfully at public/sitemap.xml");
    } catch (err) {
        console.error("Error generating sitemap:", err);
        process.exit(1);
    }
}

generateSitemap();

import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article" | "product";
    schema?: Record<string, any> | null;
    keywords?: string[];
    author?: string;
}

const SEO = ({
    title,
    description = "Khám phá bộ sưu tập rượu vang cao cấp từ Pháp và Ý. Sélection - Nơi hội tụ những chai vang tuyệt hảo và quà tặng sang trọng tại TP. Hồ Chí Minh.",
    image = "https://selection.com.vn/og-thumbnail.jpg",
    url,
    type = "website",
    schema,
    keywords = [
        "rượu vang", "selection wine", "rượu vang selection", "vang pháp", "vang ý",
        "rượu vang thủ đức", "rượu vang hồ chí minh", "quà tặng rượu vang",
        "quà tặng doanh nghiệp", "rượu vang tuyển lựa", "vang chát", "vang ngọt"
    ],
    author = "Sélection",
}: SEOProps) => {
    const siteUrl = "https://selection.com.vn";
    const currentUrl = url || (typeof window !== "undefined" ? window.location.href : siteUrl);
    // Ensure image is absolute
    const absoluteImage = image?.startsWith("http") ? image : `${siteUrl}${image.startsWith("/") ? "" : "/"}${image}`;

    return (
        <Helmet>
            {/* Basic Internal SEO */}
            <title>{title} | SÉLECTION</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(", ")} />
            <meta name="author" content={author} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={absoluteImage} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={currentUrl} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={absoluteImage} />

            {/* Structured Data (JSON-LD) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;

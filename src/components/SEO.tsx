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
    description = "Showroom rượu vang cao cấp tại Thủ Đức, TP.HCM. Rượu vang tuyển chọn từ Pháp, Ý nhập khẩu chính hãng. Giao hàng nhanh Thủ Đức, Bình Dương, Biên Hòa. Quà tặng doanh nghiệp sang trọng.",
    image = "https://selection.com.vn/og-thumbnail.jpg",
    url,
    type = "website",
    schema,
    keywords = [
        // Brand keywords
        "selection wine", "shop selection wine", "rượu vang selection", "sélection wine", "selection wine vietnam",
        // Địa phương - ưu tiên cao
        "rượu vang thủ đức", "rượu vang bình dương", "rượu vang biên hòa",
        "rượu vang hồ chí minh", "showroom rượu vang thủ đức", "cửa hàng rượu vang thủ đức",
        "mua rượu vang thủ đức", "đại lý rượu vang bình dương", "rượu vang quận thủ đức",
        // Loại sản phẩm
        "rượu vang cao cấp", "rượu vang tuyển chọn", "rượu vang tuyển lựa",
        "vang pháp", "vang ý", "vang chile", "vang đỏ", "vang trắng", "vang sủi bọt",
        "vang chát", "vang ngọt", "rượu vang nhập khẩu", "rượu vang chính hãng", "rượu vang ngon",
        // Dịch vụ
        "quà tặng rượu vang", "quà tặng doanh nghiệp", "quà tặng sếp",
        "quà tặng đối tác", "quà tết rượu vang", "hộp quà rượu vang"
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

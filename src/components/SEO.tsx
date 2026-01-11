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
        // Brand keywords với địa phương
        "selection wine", "shop selection wine", "rượu vang selection", "sélection wine", "selection wine vietnam",
        "selection thủ đức", "selection thu duc", "selection bình dương", "selection binh duong",
        "selection wine thủ đức", "selection wine bình dương", "selection wine biên hòa",

        // Địa phương - ưu tiên cao
        "rượu vang thủ đức", "rượu vang thu duc", "rượu vang bình dương", "rượu vang binh duong", "rượu vang biên hòa",
        "rượu vang hồ chí minh", "rượu vang tp hcm", "rượu vang sài gòn",
        "showroom rượu vang thủ đức", "showroom rượu vang bình dương", "showroom rượu vang biên hòa",
        "cửa hàng rượu vang thủ đức", "cửa hàng rượu vang bình dương", "cửa hàng rượu vang biên hòa",
        "mua rượu vang thủ đức", "mua rượu vang bình dương", "mua rượu vang biên hòa",
        "đại lý rượu vang thủ đức", "đại lý rượu vang bình dương", "đại lý rượu vang biên hòa",
        "rượu vang quận thủ đức", "rượu vang tp thủ đức", "rượu vang dĩ an", "rượu vang thủ dầu một",
        "giao rượu vang thủ đức", "giao rượu vang bình dương", "ship rượu vang thủ đức",

        // Loại sản phẩm
        "rượu vang cao cấp", "rượu vang sang trọng", "rượu vang hảo hạng", "rượu vang đắt",
        "rượu vang tuyển chọn", "rượu vang tuyển lựa", "rượu vang chọn lọc",
        "vang pháp", "vang ý", "vang chile", "vang úc", "vang mỹ", "vang tây ban nha",
        "vang đỏ", "vang trắng", "vang sủi bọt", "vang hồng",
        "vang chát", "vang ngọt", "vang khô",
        "rượu vang nhập khẩu", "rượu vang chính hãng", "rượu vang ngon", "rượu vang ngon nhất",
        "rượu vang pháp", "wine", "red wine", "white wine", "champagne",
        "rượu champagne", "rượu pháp", "rượu ý", "bordeaux", "burgundy",

        // Quà tặng sếp - keywords quan trọng
        "quà tặng sếp", "quà tặng sếp nam", "quà tặng sếp nữ",
        "rượu vang tặng sếp", "rượu tặng sếp", "rượu biếu sếp",
        "rượu vang tặng sếp nước ngoài", "quà tặng sếp nước ngoài", "quà biếu sếp ngoại quốc",
        "rượu vang tặng sếp nhật", "quà tặng sếp nhật", "quà tặng sếp hàn quốc",
        "rượu vang tặng sếp mỹ", "rượu vang tặng sếp pháp", "rượu vang tặng sếp châu âu",
        "quà tặng sếp sang trọng", "quà tặng sếp cao cấp", "quà tặng sếp ý nghĩa",
        "quà tặng giám đốc", "quà tặng tổng giám đốc", "quà tặng cấp trên",
        "quà tặng lãnh đạo", "quà biếu lãnh đạo", "rượu vang tặng lãnh đạo",

        // Quà tặng doanh nghiệp
        "quà tặng doanh nghiệp", "quà tặng công ty", "quà tặng đối tác",
        "quà tặng khách hàng", "quà tặng đối tác nước ngoài",
        "giỏ quà doanh nghiệp", "giỏ quà tết doanh nghiệp", "giỏ quà cao cấp",
        "hộp quà rượu vang", "set quà rượu vang", "bộ quà rượu vang",
        "quà tặng doanh nghiệp cao cấp", "quà tặng doanh nghiệp sang trọng",
        "quà tặng tri ân", "quà tri ân khách hàng", "quà tri ân đối tác",

        // Dịp quà tặng
        "quà tết", "quà tết cao cấp", "quà tết sang trọng", "quà tết rượu vang",
        "quà giáng sinh", "quà noel", "quà sinh nhật sếp", "quà khai trương",
        "quà tặng ý nghĩa", "quà tặng thành công", "quà tặng thăng chức",
        "quà tặng 20/10", "quà tặng 8/3", "quà tặng nam giới", "quà tặng nữ giới",

        // Từ khóa thương hiệu và uy tín
        "cửa hàng rượu", "shop rượu", "đại lý rượu uy tín",
        "mua rượu vang ở đâu", "mua rượu vang chính hãng", "rượu vang giá tốt",
        "rượu vang giao tận nơi", "rượu vang ship nhanh", "rượu vang giao hàng nhanh"
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

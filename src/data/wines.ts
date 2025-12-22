// Wine images - using -fixed.jpg versions (original PDF extracts)
import terresRaresImg from "@/assets/wines/terres-rares-fixed.jpg";
import vigneLouracImg from "@/assets/wines/vigne-lourac-fixed.jpg";
import beauMaraisImg from "@/assets/wines/beau-marais-fixed.jpg";
import robertoRigaImg from "@/assets/wines/roberto-riga-fixed.jpg";
import berviniBrutImg from "@/assets/wines/bervini-brut-fixed.jpg";
import chateauHautBazignanImg from "@/assets/wines/chateau-haut-bazignan-fixed.jpg";
import chateauLeBordieuImg from "@/assets/wines/chateau-le-bordieu-fixed.jpg";
import massoAnticoImg from "@/assets/wines/masso-antico-fixed.jpg";
import chateauCivracLagrangeImg from "@/assets/wines/chateau-civrac-lagrange-fixed.jpg";
import tempoAngelusImg from "@/assets/wines/tempo-angelus-fixed.jpg";
import closLunellesImg from "@/assets/wines/clos-lunelles-fixed.jpg";
import chateauFrancPipeauImg from "@/assets/wines/chateau-franc-pipeau-fixed.jpg";
import eremoSanQuiricoImg from "@/assets/wines/eremo-san-quirico-fixed.jpg";
import anniversaryImg from "@/assets/wines/anniversary-fixed.jpg";
import eremoSanQuiricoGoldImg from "@/assets/wines/eremo-san-quirico-gold-fixed.jpg";
import bicento53Img from "@/assets/wines/bicento-53-fixed.jpg";
import spanellaRossoImg from "@/assets/wines/spanella-rosso-fixed.jpg";
import bubblesMoscatoImg from "@/assets/wines/bubbles-moscato-fixed.jpg";
import auraDelSolImg from "@/assets/wines/aura-del-sol-fixed.jpg";
import armadorSauvignonBlancImg from "@/assets/wines/armador-sauvignon-blanc-fixed.jpg";
import odfjellOrzadaImg from "@/assets/wines/odfjell-orzada-fixed.jpg";
import odfjellAliaraImg from "@/assets/wines/odfjell-aliara-fixed.jpg";
import santeroAstiImg from "@/assets/wines/santero-asti-fixed.jpg";
import confidentChardonnayImg from "@/assets/wines/confident-chardonnay-fixed.jpg";
import confidentZinfandelImg from "@/assets/wines/confident-zinfandel-fixed.jpg";

export interface WineCharacteristics {
  sweetness: number; // 0-10 Độ Ngọt / Dryness
  body: number; // 0-10 Độ Đậm / Body  
  tannin: number; // 0-10 Độ Chát / Tannin
  acidity: number; // 0-10 Độ Chua / Acidity
  fizzy?: number; // 0-10 Độ Sủi / Fizzy (for sparkling)
}

export interface Wine {
  id: string;
  name: string;
  origin: string;
  grapes: string;
  price: string;
  description: string;
  story?: string; // Câu chuyện chi tiết về chai rượu
  image: string;
  category: "red" | "white" | "sparkling";
  temperature?: string;
  alcohol?: string;
  pairing?: string;
  tastingNotes?: string;
  flavorNotes?: string[]; // Nốt hương (e.g. ["cherry", "plum", "vanilla"])
  characteristics?: WineCharacteristics;
  vintage?: string; // Năm sản xuất
  region?: string; // Vùng chi tiết hơn
}

export const wines: Wine[] = [
  {
    id: "1",
    name: "Terres Rares 2022",
    vintage: "2022",
    origin: "Côtes du Tarn, France",
    region: "Tây Nam nước Pháp",
    grapes: "Gamay, Braucol",
    price: "780,000₫",
    description: "Rượu vang Pháp Terres Rares Braucol Gamay là chai vang đỏ ngon của nhà sản xuất Vignobles Gayrel, được nhập khẩu trực tiếp nguyên chai từ tiểu vùng Cotes du Tarn, Tây Nam nước Pháp.",
    story: `Vùng đất đa dạng của miền Nam Tarn, với đặc tính thổ nhưỡng đất sét-đá vôi, mang đến chiều sâu và khoáng chất tuyệt vời, làm tăng thêm phẩm chất của nho. Những loại rượu vang đỏ quý hiếm này thường được sản xuất với số lượng hạn chế, khiến chúng đặc biệt được những người yêu rượu vang tìm kiếm sự chân thực và khám phá đánh giá cao.

Braucol, còn được gọi là Fer Servadou, là một giống nho biểu tượng của Tây Nam nước Pháp, đặc biệt là ở vùng Tarn. Giống nho này thường được sử dụng trong các loại rượu vang pha trộn, nhưng một số nhà sản xuất rượu vang lại nhấn mạnh độc tính đặc đáo của nó trong các loại rượu vang đơn giống.

Gợi ý kết hợp ẩm thực: Hương vị trái cây và tannin tan chảy hoàn hảo để khai vị với bạn bè hoặc một pizza, thỏ nướng, bí ngô và thịt xông khói hầm.`,
    image: terresRaresImg,
    category: "red",
    temperature: "14-16°C",
    alcohol: "13%",
    pairing: "Pizza, thỏ nướng, bí ngô và thịt xông khói hầm",
    tastingNotes: "Trái cây đỏ chín, mận, anh đào, khoáng chất nhẹ",
    flavorNotes: ["cherry", "plum", "berry", "mineral"],
    characteristics: {
      sweetness: 2,
      body: 5,
      tannin: 4,
      acidity: 5,
    },
  },
  {
    id: "2",
    name: "Vigné-Lourac Merlot Prestige",
    origin: "Gaillac, France",
    region: "Tây Nam nước Pháp",
    grapes: "Merlot",
    price: "780,000₫",
    description: "Ra đời từ vùng Gaillac – một trong những vùng sản xuất rượu vang cổ xưa nhất nước Pháp, Vigné-Lourac Merlot Prestige mang trong mình hơi thở của lịch sử hơn 2.000 năm. Chai vang đỏ cao cấp này được làm từ 100% giống nho Merlot trồng trên những sườn đồi đất sét-đá vôi, nơi khí hậu ôn hòa và ánh nắng Địa Trung Hải tạo nên điều kiện hoàn hảo cho nho chín đều. Rượu khoác lên mình sắc đỏ ruby sâu thẳm với ánh tím quyến rũ, hương thơm mê hoặc toả ra từ những trái cây đen và đỏ chín mọng như mận, mâm xôi, cassis, xen lẫn gợi ý của vani và gia vị từ quá trình ủ gỗ sồi Pháp.",
    story: `Vigné-Lourac là điền trang lâu đời tại vùng Gaillac, nơi nghệ thuật làm rượu được truyền từ thế hệ này sang thế hệ khác. Rượu khoác lên mình sắc đỏ ruby sâu thẳm, hương thơm mê hoặc với trái cây đen và đỏ chín như mận, mâm xôi, cassis. Vị rượu đậm đà, tanin mềm mại như nhung, kết thúc bằng dư vị dài của gia vị và cam thảo.

Vùng Gaillac nằm ở Tây Nam nước Pháp, là một trong những vùng trồng nho lâu đời nhất châu Âu với lịch sử hơn 2.000 năm – thậm chí có trước cả vùng Bordeaux nổi tiếng. Khí hậu ôn hòa với ảnh hưởng từ cả Đại Tây Dương và Địa Trung Hải, cùng với đất đai màu mỡ giàu khoáng chất, tạo điều kiện lý tưởng cho giống Merlot phát triển và cho ra những quả nho có độ chín hoàn hảo.

Merlot từ vùng Gaillac mang đặc trưng riêng biệt: mềm mại hơn, thanh lịch hơn so với Merlot từ các vùng khác, với hương vị trái cây chín mọng tự nhiên và tanin tròn trịa. Đây là sự lựa chọn hoàn hảo cho những ai yêu thích vang đỏ Pháp đậm đà nhưng dễ uống.`,
    image: vigneLouracImg,
    category: "red",
    temperature: "15-18°C",
    alcohol: "14%",
    pairing: "Thịt đỏ, thịt gà và nhiều loại phô mai lâu năm, thịt Bò hầm rau củ",
    tastingNotes: "Mận, mâm xôi, cassis, gia vị nhẹ, cam thảo",
    flavorNotes: ["plum", "raspberry", "blackberry", "spice", "licorice"],
    characteristics: {
      sweetness: 2,
      body: 6,
      tannin: 5,
      acidity: 4,
    },
  },
  {
    id: "3",
    name: "Beau Marais Reserve Selection",
    origin: "Costières de Nîmes, France",
    region: "Miền Nam nước Pháp",
    grapes: "Blend",
    price: "450,000₫",
    description: "Beau Marais Reserve Selection Prestige là chai vang đỏ phân khúc phổ thông đến từ vùng Costières de Nîmes, miền Nam nước Pháp.",
    story: `Rượu có màu đỏ ruby đậm, hương thơm rõ ràng của trái cây đen chín như Acai Berry, anh đào, mật ong. Vị rượu cân bằng với tanin mềm mại và độ chua vừa phải.

Costières de Nîmes là vùng sản xuất rượu vang nằm ở phía Nam của thung lũng Rhône, được biết đến với khí hậu Địa Trung Hải và đất đá cuội độc đáo.`,
    image: beauMaraisImg,
    category: "red",
    temperature: "14-16°C",
    alcohol: "14%",
    pairing: "Pizza Hải sản, Phô mai mềm: Brie, Camembert, Mozzarella",
    tastingNotes: "Acai Berry, anh đào, mật ong, gia vị nhẹ",
    flavorNotes: ["cherry", "berry", "honey", "spice"],
    characteristics: {
      sweetness: 3,
      body: 5,
      tannin: 4,
      acidity: 4,
    },
  },
  {
    id: "4",
    name: "Roberto Riga Rosso",
    origin: "Sardegna, Italy",
    region: "Đảo Sardegna, Ý",
    grapes: "Cannonau",
    price: "520,000₫",
    description: "Rượu vang Roberto Riga Rosso là sản phẩm tiêu biểu đến từ vùng Sardegna, một hòn đảo lớn nằm ở phía Tây nước Ý.",
    story: `Rượu có màu đỏ ruby đậm, hương thơm nổi bật của trái cây chín đỏ, anh đào, xen lẫn hương hoa - gia vị khô và thảo mộc.

Cannonau là giống nho bản địa của Sardegna, được cho là có nguồn gốc từ hơn 3.000 năm trước. Giống nho này tạo ra những chai vang đỏ đậm đà với hàm lượng antioxidant cao.`,
    image: robertoRigaImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "13%",
    pairing: "Thịt đỏ, thịt nướng, mì Ý, pizza và các món ăn Địa Trung Hải",
    tastingNotes: "Trái cây đỏ chín, anh đào, hoa, gia vị khô, thảo mộc",
    flavorNotes: ["cherry", "berry", "floral", "herb", "spice"],
    characteristics: {
      sweetness: 2,
      body: 5,
      tannin: 5,
      acidity: 5,
    },
  },
  {
    id: "5",
    name: "Bervini Brut",
    origin: "Friuli-Venezia Giulia, Italy",
    region: "Đông Bắc nước Ý",
    grapes: "Glera",
    price: "680,000₫",
    description: "Bervini Brut là vang sủi được sản xuất từ giống nho Glera kết hợp cùng một số giống nho trắng địa phương.",
    story: `Rượu mang phong cách tươi mới, thanh lịch và dễ thưởng thức, màu sắc sáng trong, bọt mịn và đều. Hương thơm tinh tế của táo xanh, lê và hoa trắng.

Friuli-Venezia Giulia là vùng sản xuất vang trắng hàng đầu của Ý, nổi tiếng với các loại vang có độ tinh khiết và sự thanh lịch đặc trưng.`,
    image: berviniBrutImg,
    category: "sparkling",
    temperature: "5-8°C",
    alcohol: "11%",
    pairing: "Vang khai vị, các món ăn nhẹ, hải sản, cá",
    tastingNotes: "Táo xanh, lê, hoa trắng, citrus, bọt mịn",
    flavorNotes: ["apple", "pear", "floral", "citrus"],
    characteristics: {
      sweetness: 2,
      body: 3,
      tannin: 1,
      acidity: 6,
      fizzy: 7,
    },
  },
  {
    id: "6",
    name: "Château Haut Bazignan 2020",
    origin: "Bordeaux, France",
    grapes: "Cabernet Sauvignon, Merlot",
    price: "650,000₫",
    description: "Château Haut Bazignan là chai vang đỏ đến từ vùng Bordeaux danh tiếng nước Pháp. Rượu có màu đỏ ruby đậm với ánh tím nhẹ, hương thơm nổi bật bởi trái cây đỏ chín mọng như anh đào Đen, Mâm Sôi đen, hòa quyện cùng xạ hương.",
    image: chateauHautBazignanImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14.5%",
    pairing: "Thịt nai, bê, cừu, thịt hầm rau củ, phô mai trưởng thành",
    tastingNotes: "Anh đào đen, mâm xôi đen, xạ hương, vani, gia vị",
  },
  {
    id: "7",
    name: "Château Le Bordieu 2020",
    origin: "Bordeaux Supérieur, France",
    grapes: "Merlot, Cabernet Sauvignon",
    price: "650,000₫",
    description: "Château Le Bordieu là điền trang rượu vang lâu đời tại vùng Médoc, được xây dựng khoảng năm 1830. Rượu lên men theo phương pháp truyền thống Médoc, sau đó ủ 12 tháng trong thùng gỗ sồi Pháp.",
    image: chateauLeBordieuImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "15%",
    pairing: "Thịt đỏ, thịt nướng, món hầm, phô mai cứng",
    tastingNotes: "Trái cây đen, gỗ sồi, vani, tanin mềm mại",
  },
  {
    id: "8",
    name: "Masso Antico Primitivo",
    origin: "Puglia, Italy",
    grapes: "Primitivo",
    price: "650,000₫",
    description: "Chai vang đỏ tiêu biểu đến từ vùng Puglia, miền Nam nước Ý. Rượu được làm từ 100% nho Primitivo, trồng theo phương pháp Alberello truyền thống, phơi khô tự nhiên theo phương pháp Appassimento.",
    image: massoAnticoImg,
    category: "red",
    temperature: "14-16°C",
    alcohol: "14%",
    pairing: "Các món pasta, thịt nướng, món hầm và phô mai",
    tastingNotes: "Mận khô, nho khô, chocolate, vani, gia vị ngọt",
  },
  {
    id: "9",
    name: "Château Civrac-Lagrange 2018",
    origin: "Pessac-Léognan, France",
    grapes: "Merlot, Cabernet Sauvignon, Petit Verdot",
    price: "1,550,000₫",
    description: "Chai vang đỏ đến từ Pessac-Léognan, khu vực danh tiếng thuộc vùng Graves của Bordeaux. Niên vụ 2018 thể hiện rõ cá tính của vùng Graves với màu tím đậm, hương thơm nổi bật của trái cây đen chín.",
    image: chateauCivracLagrangeImg,
    category: "red",
    temperature: "16°C",
    alcohol: "14%",
    pairing: "Thịt đỏ, thịt nướng, món hầm hoặc phô mai",
    tastingNotes: "Trái cây đen chín, gỗ sồi, tanin mịn, dư vị dài",
  },
  {
    id: "10",
    name: "Tempo d'Angélus 2020",
    origin: "Bordeaux, France",
    grapes: "Cabernet Franc, Merlot",
    price: "1,550,000₫",
    description: "Chai vang đỏ được tạo nên bởi Château Angélus, điền trang danh tiếng của vùng Saint-Émilion. Trong ly thể hiện màu đỏ sẫm sâu, hương thơm của anh đào, mận chín, hòa quyện cùng vani, chocolate, gia vị cay.",
    image: tempoAngelusImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14%",
    pairing: "Thịt nướng, thịt thú rừng và pho mát lâu năm",
    tastingNotes: "Anh đào, mận chín, vani, chocolate, gia vị cay",
  },
  {
    id: "11",
    name: "Clos Lunelles 2012",
    origin: "Castillon, Bordeaux, France",
    grapes: "Merlot, Cabernet Franc, Cabernet Sauvignon",
    price: "1,550,000₫",
    description: "Chai vang đỏ đến từ vùng Castillon–Côtes de Bordeaux. Rượu thể hiện màu đen tím đậm, hương thơm phức hợp của trái cây đen chín, gia vị mạnh, hòa quyện cùng cam thảo, sô cô la và khói.",
    image: closLunellesImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14%",
    pairing: "Thịt đỏ đậm đà và phô mai trưởng thành",
    tastingNotes: "Trái cây đen chín, cam thảo, sô cô la, khói, gia vị mạnh",
  },
  {
    id: "12",
    name: "Château Franc Pipeau Descombes",
    origin: "Saint-Émilion Grand Cru, France",
    grapes: "Merlot, Cabernet Franc",
    price: "1,520,000₫",
    description: "Chai vang đỏ đến từ bờ phải Bordeaux, vùng Saint-Émilion, với lịch sử điền trang bắt đầu từ năm 1680. Rượu có màu đỏ ruby đậm, hương thơm phức hợp của mận chín, dâu tây, lá nguyệt quế.",
    image: chateauFrancPipeauImg,
    category: "red",
    temperature: "15-18°C",
    alcohol: "14%",
    pairing: "Thịt đỏ, bít tết và phô mai lâu năm",
    tastingNotes: "Mận chín, dâu tây, lá nguyệt quế, tanin mịn",
  },
  {
    id: "13",
    name: "Eremo San Quirico DOC",
    origin: "Irpinia, Campania, Italy",
    grapes: "Aglianico",
    price: "2,650,000₫",
    description: "Chai vang đỏ tiêu biểu đến từ vùng Irpinia, Campania, miền Nam nước Ý. Rượu có nồng độ cồn 15%, màu đỏ ruby đậm ánh tím. Hương thơm nổi bật của mứt mâm xôi và anh đào. Magnum 1.5L.",
    image: eremoSanQuiricoImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "15%",
    pairing: "Ẩm thực Địa Trung Hải, các món sốt thịt, thịt quay, thịt thú rừng",
    tastingNotes: "Mứt mâm xôi, anh đào, chocolate đen, gia vị, da thuộc",
  },
  {
    id: "14",
    name: "Anniversary Limited Edition",
    origin: "Irpinia, Campania, Italy",
    grapes: "Aglianico",
    price: "1,150,000₫",
    description: "Anniversary là chai vang được nhà Nativ tạo ra dành cho những dịp kỷ niệm đặc biệt. Rượu có màu đỏ ruby sáng với ánh tím, hương thơm mở ra mận chín và trái cây đỏ, tiếp nối trên vòm miệng là những nốt chocolate và anh đào ngọt.",
    image: anniversaryImg,
    category: "red",
    temperature: "15-18°C",
    alcohol: "14.5%",
    pairing: "Các món thịt nướng như bò, heo, cừu, phô mai lâu năm",
    tastingNotes: "Mận chín, trái cây đỏ, chocolate, anh đào ngọt",
  },
  {
    id: "15",
    name: "Eremo San Quirico Gold",
    origin: "Irpinia, Campania, Italy",
    grapes: "Aglianico",
    price: "1,750,000₫",
    description: "Dòng vang đỏ cao cấp và giới hạn của nhà Nativ, được làm từ 100% nho Aglianico. Rượu có màu đỏ ruby đậm ánh tím. Hương thơm nổi bật của mứt anh đào, cherry đen. Đạt 99/100 điểm Luca Maroni.",
    image: eremoSanQuiricoGoldImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14%",
    pairing: "Ẩm thực Địa Trung Hải, các món sốt thịt, thịt nướng, thịt thú rừng",
    tastingNotes: "Mứt anh đào, cherry đen, chocolate, vani, gia vị",
  },
  {
    id: "16",
    name: "Bicento 53",
    origin: "Irpinia, Campania, Italy",
    grapes: "Aglianico",
    price: "1,820,000₫",
    description: "Dòng vang đỏ đặc biệt của nhà Nativ, được tạo nên từ những cây nho Aglianico cổ thụ trồng trên đất núi lửa vùng đồi Taurasi. Tên gọi Bicento nghĩa là gấp đôi 100, gợi nhắc đến nguồn gốc của những vườn nho có tuổi đời trên 200 năm.",
    image: bicento53Img,
    category: "red",
    temperature: "14-16°C",
    alcohol: "15%",
    pairing: "Các món ăn truyền thống Địa Trung Hải, thịt quay, thịt thú rừng",
    tastingNotes: "Trái cây đen đậm đặc, đất ẩm, da thuộc, gia vị phức hợp",
  },
  {
    id: "17",
    name: "Spanella Rosso",
    origin: "Puglia, Italy",
    grapes: "Primitivo, Negroamaro",
    price: "497,000₫",
    description: "Chai vang đỏ khô đậm đà đến từ vùng Puglia, được sản xuất bởi Cevico Gruppo – tập đoàn rượu vang lớn nhất nước Ý. Rượu đạt nồng độ 15%, màu đỏ tím sẫm, hương thơm nồng nàn của dâu đen, nho đen, anh đào.",
    image: spanellaRossoImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "15%",
    pairing: "Thịt đỏ, thịt thú rừng và các loại phô mai đậm vị",
    tastingNotes: "Dâu đen, nho đen, anh đào, gia vị nồng, tanin đậm",
  },
  {
    id: "18",
    name: "Bubbles Moscato d'Asti DOCG",
    origin: "Piemonte, Italy",
    grapes: "Moscato",
    price: "630,000₫",
    description: "Hiện thân thanh lịch của dòng vang ngọt sủi nhẹ trứ danh vùng Piemonte, được tạo tác bởi Bosio Family Estates. Trong ly tỏa sáng với màu vàng rơm nhạt, điểm xuyết những chuỗi bọt mịn tinh tế.",
    image: bubblesMoscatoImg,
    category: "sparkling",
    temperature: "5-8°C",
    alcohol: "5.5%",
    pairing: "Vang khai vị, trái cây tươi, bánh ngọt, hạt rang, phô mai lâu năm",
    tastingNotes: "Hoa cơm cháy, đào trắng, mật ong, xoài, bọt mịn",
  },
  {
    id: "19",
    name: "Aura Del Sol Icon 2011",
    origin: "Maule Valley, Chile",
    grapes: "Cabernet Sauvignon",
    price: "1,570,000₫",
    description: "Chai vang đỏ cao cấp đến từ Chile, được tuyển chọn từ vườn nho đơn lẻ 50 năm tuổi. Rượu có màu đỏ đậm mạnh mẽ, hương thơm phức hợp của anh đào đen hòa quyện cùng cam thảo, hoa hồng khô. Ủ 18 tháng trong thùng gỗ sồi Pháp.",
    image: auraDelSolImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14.5%",
    pairing: "Thịt đỏ, bò bít tết, mì ống, phi lê thịt lợn hoặc sô cô la đen",
    tastingNotes: "Anh đào đen, cam thảo, hoa hồng khô, gỗ sồi, tanin mịn",
  },
  {
    id: "20",
    name: "Armador Sauvignon Blanc",
    origin: "Casablanca Valley, Chile",
    grapes: "Sauvignon Blanc",
    price: "625,000₫",
    description: "Hiện thân của phong cách vang trắng Chile cao cấp: tinh khiết, sống động và đầy chiều sâu. Được làm từ 100% nho Sauvignon Blanc trồng theo phương pháp sinh học động tại thung lũng San Antonio.",
    image: armadorSauvignonBlancImg,
    category: "white",
    temperature: "12°C",
    alcohol: "13%",
    pairing: "Salad rau xanh, hải sản, cá tươi và các món nhẹ",
    tastingNotes: "Bưởi, chanh, cỏ tươi, khoáng chất, độ chua sống động",
  },
  {
    id: "21",
    name: "Odfjell Orzada Carménère",
    origin: "Maule Valley, Chile",
    grapes: "Carménère",
    price: "825,000₫",
    description: "Chai vang mang đậm tinh thần tiên phong của nhà Odfjell Vineyards – một trong những nhà sản xuất rượu vang hữu cơ hàng đầu Chile. Rượu có màu đỏ sẫm sâu, hương thơm mãnh liệt và phức hợp của anh đào chín, mâm xôi đen.",
    image: odfjellOrzadaImg,
    category: "red",
    temperature: "16°C",
    alcohol: "14%",
    pairing: "Thịt nướng, BBQ, rau củ nướng và các món ăn đậm vị",
    tastingNotes: "Anh đào chín, mâm xôi đen, ớt xanh, thảo mộc, gia vị",
  },
  {
    id: "22",
    name: "Odfjell Aliara",
    origin: "Chile",
    grapes: "Carignan, Syrah, Malbec",
    price: "2,500,000₫",
    description: "Chai vang đỏ biểu tượng của Odfjell Vineyards. Niên vụ 2018 khẳng định vị thế xuất sắc với 93 điểm James Suckling, 94 điểm Vinous, 95 điểm Descorchados. Ủ 18 tháng trong thùng gỗ sồi Pháp mới 100%.",
    image: odfjellAliaraImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14.5%",
    pairing: "Thịt đỏ, món hầm hoặc phô mai lâu năm",
    tastingNotes: "Trái cây đen phức hợp, gỗ sồi Pháp, gia vị, tanin thanh lịch",
  },
  {
    id: "23",
    name: "958 Santero Asti",
    origin: "Piemonte, Italy",
    grapes: "Moscato",
    price: "600,000₫",
    description: "Chai vang sủi ngọt thanh lịch đến từ 958 Santero, nhà sản xuất danh tiếng được sáng lập năm 1958 tại vùng Piedmont. Trong ly, rượu khoác lên mình màu vàng rơm ánh xanh, điểm xuyết những chuỗi bọt mịn sống động.",
    image: santeroAstiImg,
    category: "sparkling",
    temperature: "4-6°C",
    alcohol: "7%",
    pairing: "Vang khai vị, thịt trắng, hải sản, cá và các món ăn nhẹ",
    tastingNotes: "Hoa cơm cháy, đào, nho Moscato, mật ong, bọt mịn sống động",
  },
  {
    id: "24",
    name: "Confident Chardonnay Lodi",
    origin: "California, USA",
    grapes: "Chardonnay",
    price: "750,000₫",
    description: "Chai vang trắng Mỹ mang phong cách hiện đại và tinh tế, được sản xuất bởi Tập đoàn Grands Chais de France. Rượu có màu vàng rơm sáng, hương thơm hài hòa của trái cây chín như táo vàng, lê, đào trắng. Huy chương Bạc IWC.",
    image: confidentChardonnayImg,
    category: "white",
    temperature: "7-10°C",
    alcohol: "13.5%",
    pairing: "Thịt trắng, cá, hải sản, phô mai hoặc các món ăn nhẹ",
    tastingNotes: "Táo vàng, lê, đào trắng, vani nhẹ, bơ, khoáng chất",
  },
  {
    id: "25",
    name: "Confident Zinfandel Lodi",
    origin: "California, USA",
    grapes: "Zinfandel",
    price: "750,000₫",
    description: "Dòng vang Mỹ tiêu biểu được làm từ giống nho Zinfandel trồng tại Lodi – thủ phủ Zinfandel của thế giới. Rượu có màu đỏ ruby đậm, hương thơm phong phú của nho đen, nam việt quất, anh đào chín. Huy chương bạc IWC 2022.",
    image: confidentZinfandelImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14.5%",
    pairing: "Các món nướng, thịt BBQ, pizza, burger, phô mai lâu năm",
    tastingNotes: "Nho đen, nam việt quất, anh đào chín, tiêu đen, vani",
  },
];

export const getWineById = (id: string): Wine | undefined => {
  return wines.find(wine => wine.id === id);
};

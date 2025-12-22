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
import miles770Img from "@/assets/wines/770-miles-zinfandel-fixed.jpg";

export interface WineCharacteristics {
  sweetness: number; // 0-9 Độ Ngọt / Dryness
  body: number; // 0-9 Độ Đậm / Body  
  tannin: number; // 0-9 Độ Chát / Tannin
  acidity: number; // 0-9 Độ Chua / Acidity
  fizzy?: number; // 0-9 Độ Sủi / Fizzy (for sparkling)
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
    story: `Vùng đất đa dạng của miền Nam Tarn, với đặc tính thổ nhưỡng đất sét-đá vôi, mang đến chiều sâu và khoáng chất tuyệt vời, làm tăng thêm phẩm chất của nho. Những loại rượu vang đỏ quý hiếm này thường được sản xuất với số lượng hạn chế, khiến chúng đặc biệt được những người yêu rượu vang tìm kiếm sự chân thực và khám phá đánh giá cao. Mỗi loại đều mang phong cách và đặc trưng riêng, cũng như các nguyên tố đất hiếm đã được các thế hệ nhà sản xuất rượu vang kế tiếp nhau trong khu vực khám phá qua nhiều thế kỷ.

Braucol, còn được gọi là Fer Servadou, là một giống nho biểu tượng của Tây Nam nước Pháp, đặc biệt là ở vùng Tarn. Giống nho này thường được sử dụng trong các loại rượu vang pha trộn, nhưng một số nhà sản xuất rượu vang lại nhấn mạnh đặc tính độc đáo của nó trong các loại rượu vang đơn giống. Về phần Gamay mang đến sự tươi mát dễ chịu và hương thơm trái cây. Hai giống nho này kết hợp với nhau để tạo ra những loại rượu vang đỏ thanh lịch đan xen sự phức tạp trong kết cấu.`,
    image: terresRaresImg,
    category: "red",
    temperature: "14-16°C",
    alcohol: "13%",
    pairing: "Pizza, thỏ nướng, bí ngô và thịt xông khói hầm",
    tastingNotes: "Hương vị trái cây và tannin tan chảy hoàn hảo để khai vị với bạn bè",
    flavorNotes: ["strawberry", "cherry", "banana", "raspberry"],
    characteristics: {
      sweetness: 2,
      body: 5,
      tannin: 4,
      acidity: 4.5,
    },
  },
  {
    id: "2",
    name: "Vigné-Lourac Merlot Prestige",
    origin: "Gaillac, France",
    region: "Tây Nam nước Pháp",
    grapes: "Merlot",
    price: "780,000₫",
    description: "Ra đời từ vùng Gaillac – một trong những vùng sản xuất rượu vang cổ xưa nhất nước Pháp, Vigné-Lourac Merlot Prestige mang trong mình hơi thở của lịch sử hơn 2.000 năm. Ngay từ thời La Mã cổ đại, Gaillac đã được biết đến như cái nôi của nghệ thuật làm vang, nơi những thửa nho bám rễ sâu vào lớp đất giàu khoáng chất bên dòng sông Tarn hiền hòa.",
    story: `Vigné-Lourac kế thừa truyền thống ấy, kết hợp kỹ thuật làm vang hiện đại để tạo nên chai Merlot Prestige 100% Merlot – giống nho biểu tượng của sự mềm mại, quyến rũ và cân bằng. Những trái nho được thu hoạch khi đạt độ chín tối ưu, phản ánh trọn vẹn đặc trưng thổ nhưỡng và khí hậu ôn hòa của miền Tây Nam nước Pháp.

Rượu khoác lên mình sắc đỏ ruby sâu thẳm, gợi nhớ những hầm rượu đá cổ kính nơi thời gian lắng đọng. Hương thơm mở ra đầy mê hoặc với trái cây đen và đỏ chín như mận, mâm xôi, cassis, hòa quyện tinh tế cùng cam thảo và gia vị nhẹ, tạo chiều sâu và cá tính rõ rệt. Trên vòm miệng, Vigné-Lourac Merlot Prestige thể hiện phong cách êm mượt, tròn đầy và hài hòa. Cấu trúc tannin mềm mại, hậu vị kéo dài, để lại cảm giác ấm áp và tinh tế – như một câu chuyện lịch sử được kể chậm rãi qua từng ngụm vang.`,
    image: vigneLouracImg,
    category: "red",
    temperature: "15-18°C",
    alcohol: "14%",
    pairing: "Thịt đỏ, thịt gà và nhiều loại phô mai lâu năm, thịt Bò hầm rau củ, thịt bê non với nấm morel",
    tastingNotes: "Mận, mâm xôi, cassis, cam thảo, gia vị nhẹ, cấu trúc tannin mềm mại",
    flavorNotes: ["strawberry", "raspberry", "plum", "cocoa"],
    characteristics: {
      sweetness: 2,
      body: 6,
      tannin: 5,
      acidity: 4.5,
    },
  },
  {
    id: "3",
    name: "Beau Marais Reserve Selection",
    origin: "Costières de Nîmes, France",
    region: "Miền Nam nước Pháp",
    grapes: "Blend",
    price: "450,000₫",
    description: "Beau Marais Reserve Selection Prestige là chai vang đỏ phân khúc phổ thông đến từ vùng Costières de Nîmes, miền Nam nước Pháp, được sản xuất theo quy trình nghiêm ngặt nhất bởi SDGB Winery. Đây là khu vực hội tụ khí hậu Địa Trung Hải lý tưởng và thổ nhưỡng giàu sỏi đá.",
    story: `Vùng đất này mang đến chất lượng nho vượt trội, giúp nho chín đều và tạo nên phong cách vang đậm vị trái cây, dễ uống, phù hợp nhiều đối tượng.

Rượu được làm theo phương pháp truyền thống, lên men và ủ trong điều kiện kiểm soát, nhằm giữ lại sự tươi mới và ổn định hương vị. Rượu có màu đỏ ruby đậm, hương thơm rõ ràng của trái cây đen chín như Acai Berry, anh đào, mật ong, điểm thêm rất nhẹ hương gỗ sồi, vani và thảo mộc.

Khi thưởng thức, Beau Marais Reserve cho cảm giác tròn vị, tannin vừa phải, axit cân bằng, không quá gắt, không quá chát, rất dễ uống với người mới làm quen rượu vang. Hậu vị ở mức trung bình, gọn gàng và dễ chịu.

Chai vang này đặc biệt phù hợp dùng trong bữa ăn hằng ngày, tiệc gia đình, liên hoan, nhà hàng phổ thông hoặc làm table wine.`,
    image: beauMaraisImg,
    category: "red",
    temperature: "14-16°C",
    alcohol: "14%",
    pairing: "Pizza Hải sản, Phô mai mềm: Brie, Camembert, Mozzarella",
    tastingNotes: "Acai Berry, anh đào, mật ong, gỗ sồi nhẹ, vani và thảo mộc",
    flavorNotes: ["honey", "cherry", "berry", "earthy"],
    characteristics: {
      sweetness: 2.5,
      body: 5,
      tannin: 4.5,
      acidity: 4,
    },
  },
  {
    id: "4",
    name: "Roberto Riga Rosso",
    origin: "Veneto, Italy",
    region: "Veneto, Miền Bắc nước Ý",
    grapes: "Corvina, Corvinone, Sangiovese",
    price: "450,000₫",
    description: "Rượu vang Roberto Riga Rosso là sản phẩm tiêu biểu đến từ vùng Veneto, một trong những vùng sản xuất rượu vang nổi tiếng nhất của miền Bắc nước Ý. Veneto từ lâu đã được biết đến với những chai vang đỏ phong phú và giàu cá tính.",
    story: `Veneto có điều kiện tự nhiên lý tưởng cho việc sản xuất rượu vang: khí hậu ôn hòa, đất đai màu mỡ và truyền thống làm rượu lâu đời. Roberto Riga Rosso được phối trộn từ ba giống nho đặc trưng: Corvina mang đến hương trái cây anh đào và độ tươi mát, Corvinone góp phần tạo độ đậm đà và cấu trúc, còn Sangiovese bổ sung độ axit thanh lịch và hương thảo mộc tinh tế.

Rượu có màu đỏ ruby đậm, hương thơm nổi bật của trái cây chín đỏ, anh đào, xen lẫn hương hoa - gia vị khô và thảo mộc. Trên vòm miệng, rượu thể hiện cấu trúc tròn vị, đậm đà vừa phải, tannin chắc nhưng dễ chịu, hậu vị gọn gàng và hài hòa.

Nhờ sự kết hợp hoàn hảo giữa Corvina, Corvinone và Sangiovese, Roberto Riga Rosso mang phong cách vang Ý truyền thống, mạnh mẽ nhưng dễ tiếp cận, phù hợp dùng hằng ngày hoặc trong các bữa tiệc thân mật.`,
    image: robertoRigaImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "13%",
    pairing: "Thịt đỏ, thịt nướng, mì Ý, pizza và các món ăn Địa Trung Hải",
    tastingNotes: "Trái cây đỏ chín, anh đào, hoa, gia vị khô, thảo mộc",
    flavorNotes: ["grapefruit", "raspberry", "cherry", "floral", "herb", "tobacco"],
    characteristics: {
      sweetness: 1.5,
      body: 5.5,
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
    price: "450,000₫",
    description: "Bervini Brut là vang sủi (sparkling wine) được sản xuất từ giống nho Glera kết hợp cùng một số giống nho trắng địa phương, trồng tại vùng Friuli Venezia Giulia, miền Đông Bắc nước Ý. Rượu mang phong cách tươi mới, thanh lịch và dễ thưởng thức, đúng tinh thần của dòng Nature Line.",
    story: `Rượu được làm theo phương pháp Martinotti – Charmat, lên men lần hai trong bồn thép kín (autoclave), giúp giữ trọn độ tươi, hương trái cây tự nhiên và tạo nên bọt sủi mịn, nhẹ nhàng. Bervini Brut có màu sắc sáng trong, bọt mịn và đều, mang lại cảm giác tinh tế ngay từ ánh nhìn đầu tiên.

Trên mũi, rượu thể hiện hương trái cây tươi sạch, nhẹ nhàng và rõ ràng. Khi thưởng thức, vị rượu tươi mát, trái cây nổi bật, độ axit dễ chịu, mang đến cảm giác sảng khoái và cân bằng, không quá ngọt, không nặng.

Bervini là kết tinh của ba thế hệ gia đình Bergamo – Antonio, Giuseppe và Paolo – cùng chung niềm đam mê dành cho rượu vang chất lượng. Từ năm 1955, Bervini đã gắn bó với nghề trồng nho và sản xuất những chai vang thanh lịch, hài hòa và giàu cảm xúc. Đến thập niên 1990, các vườn nho của Bervini được canh tác theo phương pháp hữu cơ.`,
    image: berviniBrutImg,
    category: "sparkling",
    temperature: "5-8°C",
    alcohol: "11%",
    pairing: "Vang khai vị, các món ăn nhẹ, hải sản, cá",
    tastingNotes: "Hương trái cây tươi sạch, nhẹ nhàng và rõ ràng, vị tươi mát, độ axit dễ chịu",
    flavorNotes: ["citrus", "honey", "orange", "peach", "apple"],
    characteristics: {
      sweetness: 2.5,
      body: 3,
      tannin: 0,
      acidity: 6,
      fizzy: 6,
    },
  },
  {
    id: "6",
    name: "Château Haut Bazignan 2020",
    vintage: "2020",
    origin: "Bordeaux, France",
    region: "Bordeaux, Pháp",
    grapes: "Cabernet Sauvignon, Merlot",
    price: "450,000₫",
    description: "Château Haut Bazignan là chai vang đỏ đến từ vùng Bordeaux danh tiếng nước Pháp, một trong những vùng sản xuất rượu vang lớn và lâu đời nhất thế giới. Đây là chai vang tiêu biểu cho phong cách Bordeaux truyền thống: đậm đà, cân bằng, dễ uống trong tầm giá và phù hợp với nhiều đối tượng yêu vang.",
    story: `Château Haut Bazignan có màu đỏ ruby đậm với ánh tím nhẹ, biểu thị độ chín ổn của nho. Trên mũi và vị, rượu nổi bật bởi hương trái cây đỏ chín mọng như anh đào Đen, Mâm Sôi đen, hòa quyện cùng tầng hương phụ của xạ hương.

Tuy không phải là chai vang cao cấp nhưng là một lựa chọn Bordeaux rất đáng giá trong tầm giá phổ thông. Rượu thể hiện phong cách Bordeaux cổ điển dễ tiếp cận, phù hợp với cả người mới uống và những ai muốn một chai vang đỏ tròn vị, ấm và đầy nhưng không nặng nề hay quá phức tạp.`,
    image: chateauHautBazignanImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14.5%",
    pairing: "Thịt nai, bê, cừu, thịt hầm rau củ, các món sốt đậm, phô mai trưởng thành",
    tastingNotes: "Anh đào đen, mâm xôi đen, xạ hương, vani, gia vị",
    flavorNotes: ["grapefruit", "raspberry", "cherry", "blackberry", "musk"],
    characteristics: {
      sweetness: 2,
      body: 6.5,
      tannin: 5.5,
      acidity: 4.5,
    },
  },
  {
    id: "7",
    name: "Château Le Bordieu 2020",
    vintage: "2020",
    origin: "Bordeaux Supérieur, France",
    region: "Médoc, Bordeaux, Pháp",
    grapes: "Merlot, Cabernet Sauvignon",
    price: "650,000₫",
    description: "Château Le Bordieu là điền trang rượu vang lâu đời tại vùng Médoc, được xây dựng khoảng năm 1830 bởi Philippe Delacourt, Lãnh chúa Bourdieu. Lâu đài mang kiến trúc đặc trưng thế kỷ 19 và từng được ghi nhận trong Féret 1878.",
    story: `Đồng thời xuất hiện trong bảng phân loại Crus Bourgeois năm 1932, khẳng định vị thế lịch sử trong vùng Bordeaux. Tên gọi "Le Bordieu" đã xuất hiện từ thế kỷ 18, và đến nay chuồng chim bồ câu bằng đá cổ vẫn còn hiện diện giữa các vườn nho như một dấu ấn của quá khứ.

Vườn nho tọa lạc gần làng Valeyrac, trên các dải đất cao croupes gồm sỏi, cát và đất sét, lại gần cửa sông Gironde nên khí hậu ôn hòa, ổn định quanh năm. Tổng diện tích vườn nho 46 ha, trồng hai giống nho truyền thống của Médoc là Cabernet Sauvignon và Merlot. Sản lượng trung bình khoảng 260.000 chai/năm.

Nho được thu hoạch bằng máy, kết hợp phân loại cơ học và thủ công. Rượu lên men theo phương pháp truyền thống Médoc trong bể thép không gỉ và bê tông có kiểm soát nhiệt độ, ngâm vỏ kéo dài, sau đó ủ 12 tháng trong thùng gỗ sồi Pháp để đạt cấu trúc hài hòa và tròn vị.`,
    image: chateauLeBordieuImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "15%",
    pairing: "Thịt đỏ, thịt nướng, món hầm, phô mai cứng",
    tastingNotes: "Trái cây đen, gỗ sồi, vani, tanin mềm mại, cấu trúc hài hòa và tròn vị",
    flavorNotes: ["plum", "cedar", "butter", "tobacco", "cherry"],
    characteristics: {
      sweetness: 2,
      body: 6.5,
      tannin: 5.5,
      acidity: 4.5,
    },
  },
  {
    id: "8",
    name: "Masso Antico Primitivo",
    origin: "Puglia, Italy",
    region: "Puglia, Miền Nam nước Ý",
    grapes: "Primitivo",
    price: "650,000₫",
    description: "Chai vang đỏ tiêu biểu đến từ vùng Puglia, miền Nam nước Ý. Rượu được làm từ 100% nho Primitivo, trồng theo phương pháp Alberello truyền thống, phơi khô tự nhiên theo phương pháp Appassimento để tạo độ cô đọng và phức hợp.",
    story: `Puglia là vùng sản xuất rượu vang lớn nhất nước Ý, nằm ở "gót giày" của bán đảo Ý. Khí hậu Địa Trung Hải ấm áp và đất đỏ giàu khoáng chất tạo điều kiện lý tưởng cho giống nho Primitivo phát triển.

Rượu có màu đỏ ruby đậm sâu, hương thơm phong phú của mận khô, nho khô, chocolate, vani và gia vị ngọt. Trên vòm miệng, rượu thể hiện cấu trúc đậm đà, mềm mại, tannin mượt như nhung, hậu vị dài và ấm áp.

Phương pháp Appassimento giúp cô đọng hương vị và tạo nên độ ngọt tự nhiên nhẹ nhàng, làm cho chai vang trở nên đặc biệt hấp dẫn.`,
    image: massoAnticoImg,
    category: "red",
    temperature: "14-16°C",
    alcohol: "14%",
    pairing: "Các món pasta, thịt nướng, món hầm và phô mai",
    tastingNotes: "Mận khô, nho khô, chocolate, vani, gia vị ngọt, tannin mượt như nhung",
    flavorNotes: ["plum", "raisin", "chocolate", "vanilla", "spice"],
    characteristics: {
      sweetness: 2.5,
      body: 7,
      tannin: 5.5,
      acidity: 4,
    },
  },
  {
    id: "9",
    name: "Château Civrac-Lagrange 2018",
    vintage: "2018",
    origin: "Pessac-Léognan, France",
    region: "Graves, Bordeaux, Pháp",
    grapes: "50% Cabernet Sauvignon, 42% Merlot, 8% Petit Verdot",
    price: "1,550,000₫",
    description: "Château Civrac-Lagrange 2018 là chai vang đỏ đến từ Pessac-Léognan, khu vực danh tiếng thuộc vùng Graves của Bordeaux. Nơi đây nổi tiếng với thổ nhưỡng sỏi sâu pha cát và đất sét, có khả năng thoát nước rất tốt.",
    story: `Thổ nhưỡng đặc biệt buộc rễ nho phải ăn sâu vào lòng đất để hấp thụ khoáng chất, từ đó tạo nên phong cách vang thanh lịch, phức hợp và cân bằng. Khí hậu ôn đới đại dương với mùa hè ôn hòa và mùa thu kéo dài giúp nho chín chậm, đạt độ chín hoàn hảo mà vẫn giữ được độ tươi tự nhiên.

Rượu được phối trộn theo phong cách truyền thống của Pessac-Léognan, chủ yếu từ Merlot và Cabernet Sauvignon, có thể bổ sung một phần nhỏ Cabernet Franc. Niên vụ 2018 thể hiện rõ cá tính của vùng Graves với màu tím đậm, hương thơm nổi bật của trái cây đen chín như mận và mâm xôi đen, hòa quyện cùng nốt cafe nhẹ và sắc thái khoáng đặc trưng của đất sỏi.

Quy trình sản xuất theo phương pháp truyền thống Bordeaux, với thời gian ngâm ủ kéo dài và ủ trong thùng gỗ sồi, giúp rượu đạt được sự cân bằng hài hòa giữa cấu trúc tannin chắc chắn và độ tươi mát, đồng thời mang lại chiều sâu và tiềm năng phát triển tốt theo thời gian.`,
    image: chateauCivracLagrangeImg,
    category: "red",
    temperature: "16°C",
    alcohol: "14%",
    pairing: "Thịt đỏ, thịt nướng, món hầm hoặc phô mai",
    tastingNotes: "Trái cây đen chín, mận, mâm xôi đen, cafe nhẹ, khoáng chất, tanin mịn, dư vị dài",
    flavorNotes: ["raspberry", "plum", "mocha", "blackberry", "violet"],
    characteristics: {
      sweetness: 2,
      body: 6.5,
      tannin: 6,
      acidity: 5,
    },
  },
  {
    id: "10",
    name: "Tempo d'Angélus 2020",
    vintage: "2020",
    origin: "Bordeaux, France",
    region: "Saint-Émilion, Bordeaux, Pháp",
    grapes: "Cabernet Franc, Merlot",
    price: "1,550,000₫",
    description: "Tempo d'Angélus Bordeaux 2020 là chai vang đỏ được tạo nên bởi Château Angélus, điền trang danh tiếng của vùng Saint-Émilion, Bordeaux, thuộc sở hữu gia đình Boüard de Laforest từ năm 1910.",
    story: `Dưới sự dẫn dắt của Hubert de Boüard, Château Angélus đã trở thành biểu tượng của rượu vang Bordeaux hiện đại, từng đạt hạng Premier Grand Cru Classé A trước khi chủ động rút khỏi hệ thống phân hạng Saint-Émilion vào năm 2022 để giữ định hướng độc lập về chất lượng.

Được giới thiệu từ năm 2019 bởi Stéphanie de Boüard-Rivoal, với mục tiêu mang tinh thần và tay nghề của một Grand Cru đến gần hơn với người yêu vang. Đây là dòng rượu được sản xuất dưới tên gọi Bordeaux, theo phong cách tinh giản, dễ tiếp cận hơn so với Angelus, Carillon d'Angélus hay N°3 d'Angélus, nhưng vẫn giữ được chiều sâu, cấu trúc và sự tinh tế đặc trưng của nhà làm vang.

Niên vụ 2020 hưởng lợi từ mùa hè ấm áp, giúp nho chín đều và trọn vẹn. Rượu chủ yếu phối trộn từ Merlot và Cabernet Franc, lên men trong bể thép và ủ trong thùng gỗ sồi Pháp, tạo nên sự cân bằng hài hòa giữa trái cây chín, độ tươi và tannin mịn. Niên vụ này được đánh giá cao bởi James Suckling, Jeb Dunnuck, Wine Advocate và Decanter.`,
    image: tempoAngelusImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14%",
    pairing: "Thịt nướng, thịt thú rừng và pho mát lâu năm. Nên decant 1–2 giờ trước khi thưởng thức",
    tastingNotes: "Anh đào, mận chín, vani, chocolate, gia vị cay, khói và da thuộc. Cấu trúc rượu rõ, tannin mượt, hậu vị dài và cân bằng",
    flavorNotes: ["vanilla", "chocolate", "mocha", "cedar", "plum", "blackberry", "raspberry"],
    characteristics: {
      sweetness: 2,
      body: 7,
      tannin: 6.5,
      acidity: 5,
    },
  },
  {
    id: "11",
    name: "Clos Lunelles 2012",
    vintage: "2012",
    origin: "Castillon, Bordeaux, France",
    region: "Castillon–Côtes de Bordeaux, Pháp",
    grapes: "80% Merlot, 10% Cabernet Franc, 10% Cabernet Sauvignon",
    price: "1,550,000₫",
    description: "Clos Lunelles 2012 là chai vang đỏ đến từ vùng Castillon–Côtes de Bordeaux, từng bị lãng quên cho đến khi được Chantal và Gérard Perse – chủ sở hữu của Château Pavie, Pavie Decesse, Montbousquet và Bellevue-Mondotte – hồi sinh vào năm 2001.",
    story: `Nhờ tầm nhìn chiến lược và sự cầu toàn trong sản xuất, Clos Lunelles nhanh chóng trở thành một trong những điền trang tiêu biểu của Castillon, khẳng định giá trị thổ nhưỡng vốn bị bỏ qua trong nhiều năm.

Vườn nho rộng khoảng 8,5 ha, nằm tại Saint-Magne de Castillon trên cao nguyên Sainte-Colombe, phần mở rộng của cao nguyên đá vôi Saint-Émilion. Thổ nhưỡng đất sét pha đá vôi cùng những cây nho có tuổi đời trung bình hơn 40 năm, trồng chủ yếu Merlot kết hợp Cabernet Franc và Cabernet Sauvignon, mang lại cho rượu độ cô đọng, chiều sâu và cấu trúc bền vững.

Nho được thu hoạch hoàn toàn thủ công, lên men trong thùng thép không gỉ có kiểm soát nhiệt độ, ngâm vỏ kéo dài, sau đó lên men malolactic và ủ 24 tháng trong thùng gỗ sồi, trong đó 60% là thùng mới. Rượu được đóng chai không qua lọc, nhằm giữ trọn cá tính tự nhiên của terroir.

Niên vụ 2012 được đánh giá cao với 90 điểm Robert Parker và 16.5/20 từ Jancis Robinson, cho thấy tiềm năng phát triển tốt theo thời gian.`,
    image: closLunellesImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14%",
    pairing: "Thịt đỏ đậm đà và phô mai trưởng thành. Nên decant ít nhất 1 giờ trước khi thưởng thức",
    tastingNotes: "Trái cây đen chín, cam thảo, sô cô la, khói, gia vị mạnh. Vị rượu tròn đầy, tannin mịn, hậu vị dài và ấm",
    flavorNotes: ["vanilla", "plum", "cherry", "violet"],
    characteristics: {
      sweetness: 1.5,
      body: 7.5,
      tannin: 7,
      acidity: 5,
    },
  },
  {
    id: "12",
    name: "Château Franc Pipeau Descombes",
    origin: "Saint-Émilion Grand Cru, France",
    region: "Saint-Émilion, Bordeaux, Pháp",
    grapes: "75% Merlot, 25% Cabernet Franc",
    price: "1,520,000₫",
    description: "Château Franc Pipeau Descombes Saint-Émilion Grand Cru là chai vang đỏ đến từ bờ phải Bordeaux, vùng Saint-Émilion, với lịch sử điền trang bắt đầu từ năm 1680. Gia đình Bertrand đã gắn bó với vườn nho này qua năm thế hệ.",
    story: `Hiện do Jacques Bertrand và các con tiếp tục quản lý, kết hợp hài hòa giữa truyền thống lâu đời và kỹ thuật canh tác hiện đại.

Vườn nho được kiểm soát năng suất nghiêm ngặt thông qua thu hoạch xanh và tỉa lá, toàn bộ nho thu hoạch thủ công và phân loại kỹ trước khi lên men. Rượu được phối trộn theo phong cách cổ điển Saint-Émilion, với Merlot giữ vai trò chủ đạo, bổ sung Cabernet Franc và Cabernet Sauvignon, thu hoạch từ những thửa đất được xếp hạng Grand Cru. Sau khi lên men, rượu được ủ khoảng 15 tháng trong thùng gỗ sồi, giúp tăng chiều sâu và độ hài hòa.

Rượu có màu đỏ ruby đậm, hương thơm phức hợp của mận chín, dâu tây, lá nguyệt quế, trái cây tươi và ghi chú bánh mì nướng nhẹ. Trên vòm miệng, rượu thể hiện cấu trúc chắc chắn nhưng cân bằng, tannin mịn, vị trái cây tròn đầy, điểm thêm sắc thái mứt mận, anh đào, tiêu xanh và khoáng chất tinh tế.

Nhờ cấu trúc vững và quá trình ủ sồi dài, rượu cũng phù hợp lưu trữ trong hầm để tiếp tục phát triển hương vị theo thời gian.`,
    image: chateauFrancPipeauImg,
    category: "red",
    temperature: "15-18°C",
    alcohol: "14%",
    pairing: "Thịt đỏ, bít tết và phô mai lâu năm",
    tastingNotes: "Mận chín, dâu tây, lá nguyệt quế, bánh mì nướng nhẹ, tanin mịn, vị trái cây tròn đầy",
    flavorNotes: ["plum", "cherry", "currant", "strawberry"],
    characteristics: {
      sweetness: 1.5,
      body: 7,
      tannin: 6.5,
      acidity: 5,
    },
  },
  {
    id: "13",
    name: "Eremo San Quirico DOC",
    origin: "Irpinia, Campania, Italy",
    region: "Irpinia, Campania, Miền Nam nước Ý",
    grapes: "Aglianico",
    price: "2,650,000₫",
    description: "Eremo San Quirico – Aglianico Campi Taurasini DOC là chai vang đỏ tiêu biểu đến từ vùng Irpinia, Campania, miền Nam nước Ý, nơi nổi tiếng với những đồi núi lửa quanh Taurasi. Đây là chai Magnum 1.5L.",
    story: `Tên gọi của rượu gắn liền với vùng đất cổ từng có ngựa hoang sinh sống và dấu tích của tu viện San Quirico, tạo nên chiều sâu lịch sử và bản sắc riêng. Giá trị biểu tượng này được thể hiện qua nhãn chai, trang trí bằng tác phẩm của họa sĩ đương đại Moreno Bondi.

Rượu được làm từ 100% nho Aglianico, trồng trên địa hình đồi núi lửa pha đất sét – đá vôi, mang lại cấu trúc mạnh mẽ và sắc thái khoáng rõ nét. Các vườn nho được canh tác theo hệ thống Guyot, kết hợp với những cây nho lâu năm kiểu Avellino, giúp nho đạt độ cân bằng cảm quan cao. Nho được thu hoạch thủ công vào tháng Mười, khi đạt độ chín tối ưu.

Quá trình sản xuất được kiểm soát chặt chẽ: nho được ép và ngâm vỏ khoảng ba tuần trong bể thép, sau đó rượu được ủ trong thùng gỗ sồi Pháp mới, tiếp tục nghỉ một năm trong chai để đạt sự hài hòa.

Trong ly, Eremo San Quirico thể hiện màu đỏ ruby đậm ánh tím. Hương thơm nổi bật của mứt mâm xôi và anh đào, tiếp nối là gia vị nồng, sô cô la đen, cùng các nốt da thuộc, thuốc lá và anh đào morello. Vị rượu đậm, cấu trúc tannin rõ nhưng mượt, hậu vị dài và sâu.`,
    image: eremoSanQuiricoImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "15%",
    pairing: "Ẩm thực Địa Trung Hải, các món sốt thịt, thịt quay, thịt thú rừng và phô mai ủ lâu năm. Nên decant 30–60 phút trước khi thưởng thức",
    tastingNotes: "Mứt mâm xôi, anh đào, gia vị nồng, sô cô la đen, da thuộc, thuốc lá, anh đào morello",
    flavorNotes: ["cherry", "currant", "strawberry", "cream"],
    characteristics: {
      sweetness: 2,
      body: 8,
      tannin: 7.5,
      acidity: 4.5,
    },
  },
  {
    id: "14",
    name: "Anniversary Limited Edition",
    origin: "Irpinia, Campania, Italy",
    region: "Irpinia, Campania, Miền Nam nước Ý",
    grapes: "Aglianico",
    price: "1,150,000₫",
    description: "Anniversary là chai vang được nhà Nativ tạo ra dành cho những dịp kỷ niệm đặc biệt. Rượu có màu đỏ ruby sáng với ánh tím, hương thơm mở ra mận chín và trái cây đỏ, tiếp nối trên vòm miệng là những nốt chocolate và anh đào ngọt.",
    story: `Anniversary Limited Edition là sự kết hợp hoàn hảo giữa truyền thống làm rượu vang hàng thế kỷ của vùng Irpinia và kỹ thuật hiện đại. Được làm từ 100% nho Aglianico, giống nho quý hiếm có nguồn gốc từ thời Hy Lạp cổ đại.

Rượu được ủ trong thùng gỗ sồi Pháp trong thời gian dài, tạo nên sự hòa quyện tinh tế giữa trái cây chín, vani và gia vị. Cấu trúc tannin chắc chắn nhưng mềm mại, thể hiện tiềm năng phát triển theo thời gian.

Đây là lựa chọn hoàn hảo cho những dịp đặc biệt: kỷ niệm, sinh nhật, hay những buổi gặp mặt quan trọng.`,
    image: anniversaryImg,
    category: "red",
    temperature: "15-18°C",
    alcohol: "14.5%",
    pairing: "Các món thịt nướng như bò, heo, cừu, phô mai lâu năm",
    tastingNotes: "Mận chín, trái cây đỏ, chocolate, anh đào ngọt, vani, gia vị",
    flavorNotes: ["vanilla", "chocolate", "strawberry", "blackberry", "violet", "cocoa", "cherry"],
    characteristics: {
      sweetness: 2,
      body: 6.5,
      tannin: 6,
      acidity: 5,
    },
  },
  {
    id: "15",
    name: "Eremo San Quirico Gold",
    origin: "Irpinia, Campania, Italy",
    region: "Irpinia Campi Taurasini, Campania, Miền Nam nước Ý",
    grapes: "Aglianico",
    price: "1,750,000₫",
    description: "Dòng vang đỏ cao cấp và giới hạn của nhà Nativ, được làm từ 100% nho Aglianico. Rượu có màu đỏ ruby đậm ánh tím. Hương thơm nổi bật của mứt anh đào, cherry đen. Đạt 99/100 điểm Luca Maroni.",
    story: `Eremo San Quirico Gold là phiên bản cao cấp nhất trong dòng Eremo San Quirico, được tuyển chọn từ những lô nho tốt nhất và ủ lâu hơn trong thùng gỗ sồi Pháp mới 100%.

Với 99/100 điểm từ Luca Maroni – một trong những nhà phê bình rượu vang uy tín nhất của Ý, chai vang này khẳng định vị thế đỉnh cao của nghệ thuật làm rượu vùng Campania.

Rượu thể hiện sự cô đọng và phức hợp tuyệt vời, với lớp hương vị sâu của mứt anh đào, cherry đen, chocolate đen, vani và gia vị nồng. Cấu trúc tannin chắc chắn nhưng mượt mà, hậu vị kéo dài và đầy ấn tượng.`,
    image: eremoSanQuiricoGoldImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14%",
    pairing: "Ẩm thực Địa Trung Hải, các món sốt thịt, thịt nướng, thịt thú rừng",
    tastingNotes: "Mứt anh đào, cherry đen, chocolate đen, vani, gia vị nồng, cấu trúc mạnh mẽ, hậu vị dài",
    flavorNotes: ["cherry", "blackberry", "chocolate", "vanilla", "spice"],
    characteristics: {
      sweetness: 2,
      body: 7.5,
      tannin: 7,
      acidity: 4.5,
    },
  },
  {
    id: "16",
    name: "Bicento 53",
    origin: "Irpinia, Campania, Italy",
    region: "Irpinia Campi Taurasini, Campania, Miền Nam nước Ý",
    grapes: "Aglianico",
    price: "1,820,000₫",
    description: "Dòng vang đỏ đặc biệt của nhà Nativ, được tạo nên từ những cây nho Aglianico cổ thụ trồng trên đất núi lửa vùng đồi Taurasi. Tên gọi Bicento nghĩa là gấp đôi 100, gợi nhắc đến nguồn gốc của những vườn nho có tuổi đời trên 200 năm.",
    story: `Bicento 53 là biểu tượng của sự kiên trì và đam mê của nhà Nativ trong việc bảo tồn và phát huy giá trị của giống nho Aglianico cổ thụ. Những cây nho già cỗi, bám rễ sâu vào lớp đất núi lửa giàu khoáng chất, cho ra những quả nho cô đọng và phức hợp.

Rượu được ủ trong thùng gỗ sồi Pháp mới trong thời gian dài, sau đó tiếp tục nghỉ trong chai để đạt sự hài hòa tối ưu. Trong ly, rượu thể hiện màu đỏ đen sâu thẳm, hương thơm mãnh liệt của trái cây đen đậm đặc, đất ẩm, da thuộc, gia vị phức hợp.

Đây là lựa chọn dành cho những người sưu tầm và yêu thích những chai vang có cá tính mạnh mẽ và tiềm năng phát triển lâu dài.`,
    image: bicento53Img,
    category: "red",
    temperature: "14-16°C",
    alcohol: "15%",
    pairing: "Các món ăn truyền thống Địa Trung Hải, thịt quay, thịt thú rừng",
    tastingNotes: "Trái cây đen đậm đặc, đất ẩm, da thuộc, gia vị phức hợp, cấu trúc mạnh mẽ",
    flavorNotes: ["blackberry", "leather", "earth", "spice", "mineral"],
    characteristics: {
      sweetness: 2,
      body: 7.5,
      tannin: 7,
      acidity: 4.5,
    },
  },
  {
    id: "17",
    name: "Spanella Rosso",
    origin: "Puglia, Italy",
    region: "Puglia, Miền Nam nước Ý",
    grapes: "Primitivo, Negroamaro",
    price: "497,000₫",
    description: "Spanella Rosso là chai vang đỏ khô đậm đà đến từ vùng Puglia, được sản xuất bởi Cevico Gruppo – tập đoàn rượu vang lớn nhất nước Ý. Rượu được phối trộn từ hai giống nho đặc trưng của miền Nam Ý là Primitivo và Negroamaro.",
    story: `Nho sau khi thu hoạch được xử lý bằng kỹ thuật đông lạnh và lên men trong điều kiện kiểm soát nhiệt độ nghiêm ngặt, không có oxy, nhằm bảo toàn tối đa hương thơm tự nhiên. Sau quá trình lên men, khoảng 30% rượu được ủ trong thùng gỗ sồi để gia tăng chiều sâu và độ phức hợp. Rượu đạt nồng độ 15%, thể hiện rõ nét phong cách vang Nam Ý đậm đà.

Trong ly, Spanella Rosso có màu đỏ tím sẫm. Hương thơm nồng nàn của dâu đen, nho đen, anh đào hòa quyện cùng quế và gia vị cay. Trên vòm miệng, rượu mang vị trái cây chín đỏ mãnh liệt, cấu trúc mượt mà, tannin mềm tròn và hậu vị kéo dài, sâu lắng.`,
    image: spanellaRossoImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "15%",
    pairing: "Thịt đỏ, thịt thú rừng và các loại phô mai đậm vị",
    tastingNotes: "Dâu đen, nho đen, anh đào, quế, gia vị cay, tannin mềm tròn, hậu vị kéo dài",
    flavorNotes: ["blackberry", "raspberry", "strawberry", "licorice", "currant"],
    characteristics: {
      sweetness: 2,
      body: 7,
      tannin: 5,
      acidity: 4,
    },
  },
  {
    id: "18",
    name: "Bubbles Moscato d'Asti DOCG",
    origin: "Piemonte, Italy",
    region: "Asti, Piemonte, Miền Bắc nước Ý",
    grapes: "Moscato Bianco",
    price: "630,000₫",
    description: "Bubbles Moscato d'Asti DOCG là hiện thân thanh lịch của dòng vang ngọt sủi nhẹ trứ danh vùng Piemonte, được tạo tác bởi Bosio Family Estates – nhà làm vang gia đình danh tiếng với truyền thống từ năm 1967, tọa lạc giữa những triền đồi Moscato danh giá của Asti.",
    story: `Với triết lý tôn trọng tự nhiên và gìn giữ bản sắc terroir, Bosio đã góp phần đưa Moscato d'Asti trở thành một trong những biểu tượng tinh tế nhất của vang Ý. Rượu được làm hoàn toàn từ 100% Moscato Bianco, giống nho quý đặc trưng của vùng DOCG Asti. Nho được thu hoạch thủ công vào đầu mùa thu, sau đó trải qua quá trình ép nhẹ và lên men ở nhiệt độ thấp trong bể thép không gỉ. Quá trình lên men được chủ động dừng lại ở mức cồn thấp khoảng 5,5%, nhằm bảo tồn trọn vẹn độ ngọt tự nhiên, hương hoa tinh khiết và cấu trúc mềm mại đặc trưng.

Trong ly, Bubbles Moscato d'Asti tỏa sáng với màu vàng rơm nhạt, điểm xuyết những chuỗi bọt mịn tinh tế. Hương thơm thanh nhã mở ra với hoa trắng, nho tươi, táo chín và thoảng hương trái cây nhiệt đới. Trên vòm miệng, rượu mang đến cảm giác ngọt dịu, cân bằng và mượt mà, vị trái cây tươi sáng hòa quyện cùng độ chua nhẹ, kết thúc bằng hậu vị tươi mát, thanh thoát và đầy quyến rũ.`,
    image: bubblesMoscatoImg,
    category: "sparkling",
    temperature: "5-8°C",
    alcohol: "5.5%",
    pairing: "Vang khai vị, trái cây tươi, bánh ngọt thanh, hạt rang cao cấp, phô mai lâu năm",
    tastingNotes: "Hoa trắng, nho tươi, táo chín, trái cây nhiệt đới, ngọt dịu, cân bằng, bọt mịn tinh tế",
    flavorNotes: ["citrus", "honey", "orange", "peach", "apple", "pineapple", "pear", "ginger"],
    characteristics: {
      sweetness: 6.5,
      body: 3,
      tannin: 0,
      acidity: 5,
      fizzy: 6.5,
    },
  },
  {
    id: "19",
    name: "Aura Del Sol Icon 2011",
    vintage: "2011",
    origin: "Maule Valley, Chile",
    region: "Maule Valley, Chile",
    grapes: "Cabernet Sauvignon",
    price: "1,570,000₫",
    description: "Aura Del Sol Icon Cabernet Sauvignon là chai vang đỏ cao cấp đến từ Chile, mang trong mình ý nghĩa sâu sắc của biểu tượng \"Del Sol\" – Mặt Trời. Trong văn hóa Mapuche, mặt trời đại diện cho ánh sáng thiêng liêng, nguồn năng lượng sưởi ấm và nuôi dưỡng sự sống trên trái đất.",
    story: `Được tạo nên qua nhiều năm chăm sóc và hoàn thiện, tuyển chọn từ vườn nho đơn lẻ 50 năm tuổi, Aura Del Sol Icon là sự kết hợp hài hòa giữa độ phức tạp và nét sang trọng, phản ánh trọn vẹn tinh thần của một dòng vang biểu tượng.

Rượu có màu đỏ đậm mạnh mẽ, cho thấy hàm lượng pigment cao và cấu trúc đậm đà. Hương thơm phức hợp của anh đào đen hòa quyện cùng cam thảo, hoa hồng khô và khoáng chất. Trên vòm miệng, rượu thể hiện cảm giác đầy đặn, tannin hài hòa nhưng chắc chắn, nổi bật vị trái cây chín, điểm xuyết nốt anh đào và kẹo bạc hà tinh tế. Hậu vị dài, sâu lắng và giàu dư vị.

Aura Del Sol Icon được ủ 18 tháng trong thùng gỗ sồi Pháp mới. Nên decant từ 1 đến 2 giờ trước khi thưởng thức để cảm nhận trọn vẹn chiều sâu và sự sang trọng của dòng vang biểu tượng này.`,
    image: auraDelSolImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14.5%",
    pairing: "Thịt đỏ, bò bít tết, mì ống, phi lê thịt lợn hoặc sô cô la đen",
    tastingNotes: "Anh đào đen, cam thảo, hoa hồng khô, khoáng chất, kẹo bạc hà, tanin mịn, hậu vị dài",
    flavorNotes: ["cherry", "potpourri", "licorice"],
    characteristics: {
      sweetness: 2,
      body: 7.5,
      tannin: 7,
      acidity: 4.5,
    },
  },
  {
    id: "20",
    name: "Armador Sauvignon Blanc",
    origin: "Casablanca Valley, Chile",
    region: "San Antonio Valley, Chile",
    grapes: "Sauvignon Blanc",
    price: "625,000₫",
    description: "Đây là hiện thân của phong cách vang trắng Chile cao cấp: tinh khiết, sống động và đầy chiều sâu. \"Armador\" – tên gọi dành cho chủ sở hữu con tàu – không chỉ đánh dấu dòng rượu đầu tiên của Odfjell ra mắt từ năm 1999, mà còn tượng trưng cho tinh thần tiên phong.",
    story: `Được làm từ 100% nho Sauvignon Blanc trồng theo phương pháp sinh học động tại thung lũng San Antonio mát lạnh, chỉ cách Thái Bình Dương khoảng 15 km, chai vang này hưởng trọn ảnh hưởng của gió biển, sương mù và nền đất giàu khoáng chất. Điều kiện tự nhiên lý tưởng giúp nho giữ được độ acid sắc nét và hương thơm thuần khiết. Nho được thu hoạch thủ công, lên men ở nhiệt độ thấp trong thùng thép không gỉ và ủ ngắn trên bã mịn, nhằm bảo toàn tối đa sự tươi mới và tinh tế.

Rượu có màu vàng rơm nhạt thanh thoát, mở ra hương thơm thanh khiết của cam, chanh, lý gai và hoa nhài trắng, hòa quyện cùng nét khoáng mát lạnh đặc trưng vùng biển. Trên vòm miệng, Armador Sauvignon Blanc thể hiện cấu trúc cân bằng, tròn đầy, độ acid sống động và dư vị kéo dài, để lại cảm giác sảng khoái và tinh tế.`,
    image: armadorSauvignonBlancImg,
    category: "white",
    temperature: "12°C",
    alcohol: "13%",
    pairing: "Salad rau xanh, hải sản, cá tươi và các món nhẹ",
    tastingNotes: "Cam, chanh, lý gai, hoa nhài trắng, khoáng chất, độ acid sống động, dư vị kéo dài",
    flavorNotes: ["tangerine", "citrus", "peach", "apple", "pear", "pineapple", "jasmine", "bell pepper"],
    characteristics: {
      sweetness: 1.5,
      body: 4,
      tannin: 0,
      acidity: 7.5,
    },
  },
  {
    id: "21",
    name: "Odfjell Orzada Carménère",
    origin: "Maule Valley, Chile",
    region: "Cauquenes, Maule Valley, Chile",
    grapes: "Carménère",
    price: "825,000₫",
    description: "Odfjell Orzada Carménère mang đậm tinh thần tiên phong của nhà Odfjell Vineyards – một trong những nhà sản xuất rượu vang hữu cơ và sinh học hàng đầu Chile. Tên gọi \"Orzada\", trong thuật ngữ hàng hải, mang ý nghĩa \"đi ngược chiều gió\".",
    story: `Tên gọi tượng trưng cho khát vọng đổi mới, dám khác biệt và hành trình theo đuổi chất lượng bền vững của Odfjell. Hình ảnh dòng xoáy trên nhãn chai gợi nhắc đến năng lượng tự nhiên và triết lý sinh học động học được áp dụng trong suốt quá trình canh tác.

Chai vang này được làm từ nho Carménère trồng tại vùng Maule, cụ thể là khu vực Cauquenes, nơi Odfjell có mối gắn kết sâu sắc với đất đai, con người và truyền thống lâu đời. Vườn nho nằm ở độ cao khoảng 170 mét so với mực nước biển, hưởng khí hậu ôn hòa, khô ráo, với những cơn gió mát từ Thái Bình Dương giúp điều tiết nhiệt độ trong suốt quá trình chín. Đất cát pha sét xen lẫn đá granit mang đến cho rượu chiều sâu khoáng chất và cấu trúc rõ nét. Nho được thu hoạch thủ công sớm hơn thông lệ để giữ độ tươi + cá tính riêng biệt của giống nho.

Rượu có màu đỏ sẫm sâu, mở ra hương thơm mãnh liệt và phức hợp của anh đào chín, mâm xôi đen, hòa quyện cùng gia vị cay tinh tế. Carménère thể hiện cấu trúc đầy đặn, mọng nước và mạnh mẽ, tannin rõ nét nhưng mượt mà, độ axit tươi cân bằng, để lại hậu vị dài, cay nhẹ sâu lắng.`,
    image: odfjellOrzadaImg,
    category: "red",
    temperature: "16°C",
    alcohol: "14%",
    pairing: "Thịt nướng, BBQ, rau củ nướng và các món ăn đậm vị",
    tastingNotes: "Anh đào chín, mâm xôi đen, gia vị cay, ớt xanh, thảo mộc, tannin mượt mà",
    flavorNotes: ["vanilla", "tobacco", "leather", "cherry", "blackberry", "bell pepper"],
    characteristics: {
      sweetness: 2,
      body: 7.5,
      tannin: 6,
      acidity: 5,
    },
  },
  {
    id: "22",
    name: "Odfjell Aliara",
    vintage: "2018",
    origin: "Chile",
    region: "Cauquenes, Lontué, Maipo Valley, Chile",
    grapes: "28.5% Syrah, 24.5% Carignan, 16% Malbec, 10% Carménère, 8.5% Cabernet Sauvignon, 7% Tempranillo, 5.5% Tannat",
    price: "3,850,000₫",
    description: "Odfjell Aliara là chai vang đỏ biểu tượng của Odfjell Vineyards, đại diện cho đỉnh cao sáng tạo và triết lý làm vang hữu cơ cao cấp của Chile. Niên vụ 2018 khẳng định vị thế xuất sắc với 93 điểm James Suckling, 94 điểm Vinous, 95 điểm Descorchados.",
    story: `Aliara còn đạt Huy chương Bạc tại Global Organic & Vegan Wine Masters 2023, minh chứng cho cam kết bền vững và chất lượng vượt trội của Odfjell.

Rượu được phối trộn tinh tế từ bảy giống nho: Syrah (28.5%) mang đến cấu trúc và gia vị, Carignan (24.5%) từ những cây nho cổ thụ trên 80 tuổi, Malbec (16%) góp phần tạo độ sâu và mềm mại, Carménère (10%) thêm nét phức hợp, Cabernet Sauvignon (8.5%) cho độ chắc khỏe, Tempranillo (7%) và Tannat (5.5%) hoàn thiện bản giao hưởng. Tất cả được canh tác theo phương pháp sinh học động học, không sử dụng hóa chất.

Sau khi lên men, rượu được ủ 18 tháng trong thùng gỗ sồi Pháp mới 100%, tạo nên sự hòa quyện hoàn hảo giữa trái cây, gỗ sồi và gia vị. Trong ly, Aliara thể hiện màu đỏ đen sâu thẳm, hương thơm phức hợp của trái cây đen chín, gỗ sồi Pháp, gia vị và khoáng chất. Cấu trúc tannin thanh lịch, hậu vị dài và đầy ấn tượng.

Đây là chai vang dành cho những người sưu tầm và những dịp đặc biệt nhất.`,
    image: odfjellAliaraImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14.5%",
    pairing: "Thịt đỏ, món hầm hoặc phô mai lâu năm",
    tastingNotes: "Trái cây đen phức hợp, gỗ sồi Pháp, gia vị, khoáng chất, tanin thanh lịch, hậu vị dài",
    flavorNotes: ["blackberry", "oak", "spice", "mineral", "leather"],
    characteristics: {
      sweetness: 2,
      body: 8,
      tannin: 7,
      acidity: 4.5,
    },
  },
  {
    id: "23",
    name: "958 Santero Asti",
    origin: "Piemonte, Italy",
    region: "Asti, Piemonte, Miền Bắc nước Ý",
    grapes: "Moscato",
    price: "600,000₫",
    description: "Chai vang sủi ngọt thanh lịch đến từ 958 Santero, nhà sản xuất danh tiếng được sáng lập năm 1958 tại vùng Piedmont. Trong ly, rượu khoác lên mình màu vàng rơm ánh xanh, điểm xuyết những chuỗi bọt mịn sống động.",
    story: `958 Santero là một trong những nhà sản xuất vang sủi lớn nhất và được yêu thích nhất của Ý, nổi tiếng với các dòng Asti và Prosecco chất lượng cao.

Rượu được làm từ 100% nho Moscato, thu hoạch thủ công từ những vườn nho trên triền đồi Asti. Quá trình lên men được kiểm soát cẩn thận ở nhiệt độ thấp để bảo tồn hương thơm tinh tế và độ ngọt tự nhiên của nho.

Trong ly, 958 Santero Asti thể hiện màu vàng rơm ánh xanh tươi sáng, bọt mịn sống động. Hương thơm thanh nhã của hoa cơm cháy, đào, nho Moscato tươi và mật ong. Trên vòm miệng, rượu ngọt dịu, tươi mát, cân bằng hoàn hảo giữa độ ngọt và độ chua.`,
    image: santeroAstiImg,
    category: "sparkling",
    temperature: "4-6°C",
    alcohol: "7%",
    pairing: "Vang khai vị, thịt trắng, hải sản, cá và các món ăn nhẹ",
    tastingNotes: "Hoa cơm cháy, đào, nho Moscato, mật ong, bọt mịn sống động, ngọt dịu, tươi mát",
    flavorNotes: ["sage", "orange peel", "peach", "plum", "ginger"],
    characteristics: {
      sweetness: 5,
      body: 4,
      tannin: 0,
      acidity: 4,
      fizzy: 6.5,
    },
  },
  {
    id: "24",
    name: "Confident Chardonnay Lodi",
    origin: "California, USA",
    region: "Lodi, California, Mỹ",
    grapes: "Chardonnay",
    price: "750,000₫",
    description: "Chai vang trắng Mỹ mang phong cách hiện đại và tinh tế, được sản xuất bởi Tập đoàn Grands Chais de France. Rượu có màu vàng rơm sáng, hương thơm hài hòa của trái cây chín như táo vàng, lê, đào trắng. Huy chương Bạc IWC.",
    story: `Lodi là một trong những vùng trồng nho quan trọng nhất của California, được biết đến với khí hậu Địa Trung Hải lý tưởng và đất phù sa màu mỡ. Vùng này đặc biệt nổi tiếng với các giống nho như Zinfandel và Chardonnay.

Confident Chardonnay thể hiện phong cách vang trắng California hiện đại: tươi mát, trái cây và dễ uống. Rượu được lên men và ủ trong thùng thép không gỉ để giữ trọn độ tươi và hương thơm tự nhiên.

Trong ly, rượu có màu vàng rơm sáng với ánh xanh nhẹ. Hương thơm hài hòa của táo vàng, lê, đào trắng, vani nhẹ và bơ. Trên vòm miệng, rượu tròn đầy, mềm mại, với độ chua cân bằng và hậu vị sạch sẽ.`,
    image: confidentChardonnayImg,
    category: "white",
    temperature: "7-10°C",
    alcohol: "13.5%",
    pairing: "Thịt trắng, cá, hải sản, phô mai hoặc các món ăn nhẹ",
    tastingNotes: "Táo vàng, lê, đào trắng, vani nhẹ, bơ, khoáng chất, tròn đầy, mềm mại",
    flavorNotes: ["apple", "pear", "peach", "vanilla", "butter"],
    characteristics: {
      sweetness: 2.5,
      body: 4.5,
      tannin: 0,
      acidity: 5.5,
    },
  },
  {
    id: "25",
    name: "Confident Zinfandel Lodi",
    origin: "California, USA",
    region: "Lodi, California, Mỹ",
    grapes: "Zinfandel",
    price: "750,000₫",
    description: "Dòng vang Mỹ tiêu biểu được làm từ giống nho Zinfandel trồng tại Lodi – thủ phủ Zinfandel của thế giới. Rượu có màu đỏ ruby đậm, hương thơm phong phú của nho đen, nam việt quất, anh đào chín. Huy chương bạc IWC 2022.",
    story: `Lodi được mệnh danh là "Thủ phủ Zinfandel của thế giới", với những vườn nho cổ thụ hàng chục năm tuổi cho ra những quả nho cô đọng và phức hợp. Khí hậu Địa Trung Hải với ngày nóng và đêm mát lạnh tạo điều kiện lý tưởng cho giống Zinfandel phát triển.

Confident Zinfandel thể hiện phong cách Zinfandel California điển hình: đậm đà, trái cây mọng, gia vị nồng nàn. Rượu có màu đỏ ruby đậm với ánh tím, hương thơm phong phú của nho đen, nam việt quất, anh đào chín, tiêu đen và vani từ quá trình ủ gỗ sồi.

Trên vòm miệng, rượu đậm đà, mềm mại, tannin mượt như nhung, với hậu vị dài và ấm áp. Huy chương Bạc tại International Wine Challenge 2022 khẳng định chất lượng vượt trội của chai vang này.`,
    image: confidentZinfandelImg,
    category: "red",
    temperature: "16-18°C",
    alcohol: "14.5%",
    pairing: "Các món nướng, thịt BBQ, pizza, burger, phô mai lâu năm",
    tastingNotes: "Nho đen, nam việt quất, anh đào chín, tiêu đen, vani, đậm đà, mềm mại",
    flavorNotes: ["grape", "cranberry", "cherry", "pepper", "vanilla"],
    characteristics: {
      sweetness: 2.5,
      body: 6.5,
      tannin: 5.5,
      acidity: 4.5,
    },
  },
  {
    id: "26",
    name: "770 Miles Zinfandel",
    vintage: "2019",
    origin: "California, USA",
    region: "California, Mỹ",
    grapes: "Zinfandel",
    price: "570,000₫",
    description: "770 Miles Zinfandel là chai vang đỏ California mang phong cách trẻ trung và dễ tiếp cận. Tên gọi 770 Miles gợi nhắc đến chiều dài bờ biển California, nơi những vườn nho Zinfandel trải dài từ Bắc tới Nam.",
    story: `California là quê hương của giống nho Zinfandel, với lịch sử trồng trọt hơn 150 năm. Khí hậu Địa Trung Hải đa dạng của California, từ vùng ven biển mát mẻ đến thung lũng nội địa ấm áp, tạo ra nhiều phong cách Zinfandel khác nhau.

770 Miles Zinfandel thể hiện phong cách Zinfandel California thân thiện và dễ uống: trái cây chín mọng, gia vị nhẹ, tannin mềm mại. Rượu có màu đỏ ruby đậm với ánh tím, hương thơm hấp dẫn của dâu đen, mâm xôi, anh đào và một chút gia vị.

Trên vòm miệng, rượu tròn vị, mềm mại, với độ chua cân bằng và hậu vị trung bình. Đây là lựa chọn hoàn hảo cho những bữa tiệc thân mật, BBQ ngoài trời hoặc thưởng thức hằng ngày.`,
    image: miles770Img,
    category: "red",
    temperature: "16-18°C",
    alcohol: "13.5%",
    pairing: "Thịt nướng, BBQ, burger, pizza, các món Mỹ-Latin",
    tastingNotes: "Dâu đen, mâm xôi, anh đào, gia vị nhẹ, tannin mềm mại, dễ uống",
    flavorNotes: ["blackberry", "raspberry", "cherry", "spice"],
    characteristics: {
      sweetness: 2.5,
      body: 6,
      tannin: 5,
      acidity: 4.5,
    },
  },
];

export const getWineById = (id: string): Wine | undefined => {
  return wines.find(wine => wine.id === id);
};

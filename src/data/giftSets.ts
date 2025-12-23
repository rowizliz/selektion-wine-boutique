export interface GiftSet {
  id: string;
  name: string;
  price: number;
  items: string[];
  wine: string;
  image: string;
  category: "standard" | "premium" | "luxury";
}

export const giftSets: GiftSet[] = [
  {
    id: "rw16",
    name: "Sắc Xuân RW 16",
    price: 2600000,
    items: [
      "Yến sào nguyên chất 20G",
      "Trà xanh Itoen 40G",
      "Bánh Uncle Joe's 90g",
      "Kẹo hắc sâm không đường 350ML",
      "Sô cô la Mieszko 220g",
    ],
    wine: "Anniversary",
    image: "/gifts/rw16.jpg",
    category: "premium",
  },
  {
    id: "rw17",
    name: "Sắc Xuân RW 17",
    price: 790000,
    items: [
      "Golden Chocolate",
      "Bánh quy bơ",
      "Rượu vang",
    ],
    wine: "Vang đỏ",
    image: "/gifts/rw17.jpg",
    category: "standard",
  },
  {
    id: "rw18",
    name: "Sắc Xuân RW 18",
    price: 1250000,
    items: [
      "Beryl's Chocolate",
      "Trà cao cấp",
      "Bánh quy bơ",
      "Rượu vang",
    ],
    wine: "Vang đỏ",
    image: "/gifts/rw18.jpg",
    category: "standard",
  },
  {
    id: "rw19",
    name: "Sắc Xuân RW 19",
    price: 1250000,
    items: [
      "Mixed Fruit Drops",
      "Sô cô la Golden",
      "Rượu vang Moscato D'Asti",
    ],
    wine: "Moscato D'Asti",
    image: "/gifts/rw19.jpg",
    category: "standard",
  },
  {
    id: "rw20",
    name: "Sắc Xuân RW 20",
    price: 1400000,
    items: [
      "Assorted Toffees",
      "White Toffee",
      "Rượu vang",
    ],
    wine: "Sua Maesta",
    image: "/gifts/rw20.jpg",
    category: "standard",
  },
  {
    id: "rw21",
    name: "Sắc Xuân RW 21",
    price: 1450000,
    items: [
      "Chivas Regal",
      "St Michel Galettes au bon beurre",
      "Rượu vang",
    ],
    wine: "Paris Regal",
    image: "/gifts/rw21.jpg",
    category: "premium",
  },
  {
    id: "rw22",
    name: "Sắc Xuân RW 22",
    price: 1550000,
    items: [
      "Não đen ô đen",
      "Golden Chocolate",
      "Rượu vang",
    ],
    wine: "Vang đỏ",
    image: "/gifts/rw22.jpg",
    category: "premium",
  },
  {
    id: "rw23",
    name: "Sắc Xuân RW 23",
    price: 1650000,
    items: [
      "Jimba Galettes",
      "Bánh quy cao cấp",
      "Rượu vang",
    ],
    wine: "Vang đỏ",
    image: "/gifts/rw23.jpg",
    category: "premium",
  },
  {
    id: "rw24",
    name: "Sắc Xuân RW 24",
    price: 1750000,
    items: [
      "Sua Maesta",
      "Đặc sản cao cấp",
      "Rượu vang",
    ],
    wine: "Vang đỏ",
    image: "/gifts/rw24.jpg",
    category: "premium",
  },
  {
    id: "khang-xuan-an",
    name: "Khang Xuân An",
    price: 950000,
    items: [
      "Hạt điều rang muối 160G",
      "Hạt macca 160G",
      "Hạt hạnh nhân 160G",
      "Rượu vang Pháp Beau Marais",
    ],
    wine: "Beau Marais",
    image: "/gifts/khang-xuan-an.jpg",
    category: "standard",
  },
  {
    id: "rw27",
    name: "Xuân An Khang RW 27",
    price: 2250000,
    items: [
      "Hạt điều rang muối 160G",
      "Hạt macca 160G",
      "Yến sào nguyên chất 20G",
      "RVD Chateau Le Bordieu",
    ],
    wine: "Chateau Le Bordieu",
    image: "/gifts/rw27.jpg",
    category: "premium",
  },
  {
    id: "rw28",
    name: "Xuân An Khang RW 28",
    price: 3500000,
    items: [
      "Hạt điều rang muối 160G",
      "Hạt điều 160G",
      "Hộp yến 50g",
      "Rượu vang Eremo San Quirico Gold",
    ],
    wine: "Eremo San Quirico Gold",
    image: "/gifts/rw28.jpg",
    category: "luxury",
  },
  {
    id: "rw29",
    name: "Xuân An Khang RW 29",
    price: 4500000,
    items: [
      "Set quà đùi heo muối cao cấp Pháp",
      "Rượu vang CLOS LUNELLES",
      "Picos Uttreranos",
      "Jamon Curado",
    ],
    wine: "CLOS LUNELLES",
    image: "/gifts/rw29.jpg",
    category: "luxury",
  },
];

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
};

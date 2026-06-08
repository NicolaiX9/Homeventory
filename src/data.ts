import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sofá Modular Nord',
    sku: 'SOF-NOR-01',
    category: 'Living',
    material: 'Tela',
    price: 890000,
    stock: 15,
    description: 'Sofá de alta densidad con acabados en madera de roble. Diseñado bajo los principios del minimalismo nórdico, ofreciendo una estética limpia y una comodidad excepcional para el hogar moderno.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm0gbinlBzEaPNxXNoSAV4y4WlZKDJT_fIqMklkR2CcpoFKRzo-_Boiog-to6IHg-3inXAAtOMxBBzaPfknmGva4-RmmIHFLsWbNxfg7MGi35_FvFhr0fesaVtEV1wU0-m7YWa5Oh2rqK9dVtozl51YvPEOBV-SkG-vD1U-2npymEl3vGLmkYqMTRcj-ZFRpcDJqnrotpktx4nqD6kq2yKsJSXDBI5u6CVGWAu6il5PGWVyQG8GZcp7CIm0lan5sJFBwzs4lrKproW',
    dimensions: { largo: '220 cm', ancho: '95 cm', alto: '85 cm' }
  },
  {
    id: '2',
    name: 'Mesa Comedor Alba',
    sku: 'MES-ALB-02',
    category: 'Comedor',
    material: 'Madera',
    price: 450000,
    stock: 8,
    description: 'Mesa de comedor de madera de fresno maciza con diseño escandinavo. Sus patas en ángulo y sus bordes redondeados brindan calidez y elegancia a cualquier espacio residencial gastrónomo.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2exjb7vWYjjOTNN3HZ0e7dX0NOtTie0KLOC2VdnWh7lwc_nam1k1dXdtHOgz9uItcUuQ_8AxjbHHfzpIv23FAOY6AHBrZznT_34KxuBY0XvliHeILe451EAKj8reRw7YC5PzyNWy9CniTYzxXogQ0dTVNu7tDnxax6vR7Q5I12qQ8LgZXy9jOev54v5xGYLtAIUwoCH1aev7Hdav8bhOZQMCGQyEKKTbNO8AvTOdGAHvySCmkLSP5PnBe64ApHiBOky56bscOwjlv',
    dimensions: { largo: '180 cm', ancho: '90 cm', alto: '75 cm' }
  },
  {
    id: '3',
    name: 'Cama King Zen',
    sku: 'CAM-ZEN-03',
    category: 'Dormitorio',
    material: 'Madera',
    price: 620000,
    stock: 5,
    description: 'Estructura baja de estilo japonés construida con madera sólida. El marco extendido de la plataforma le confiere una sensación flotante, ideal para crear un oasis de descanso y tranquilidad.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQu2euO9xw2elS-jh57rUm6wemDWyaEavXrMEwjunRSvz6P5fHxuiy-ynrSrwBUS1x0WPEwCcQPt6kfyJQYG_FaCaD1GNmAK1n5N252HIzFkNerL70e4A-LlWSxpPsof1LAoHoAb7w1u1sc0HblfZd6r7KoelzobfAMgFFmSgGJZX24Mg8ioKqWzisJ0sezarJ7wCpLwqPlQcED3lfKGet4pnN5xBuAgHnytCkMefwdxqDpK7UeBVTBLPthrapecYAG4f0Q01DfD5u',
    dimensions: { largo: '210 cm', ancho: '220 cm', alto: '30 cm' }
  },
  {
    id: '4',
    name: 'Sillón Velvet',
    sku: 'SIL-VEL-04',
    category: 'Living',
    material: 'Tela',
    price: 310000,
    stock: 12,
    description: 'Terciopelo verde oscuro de alta resistencia y patas de metal esbelto en color cobre. Relleno de espuma de memoria para proporcionar la máxima comodidad residencial.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTf8T3EWCvN8pZ2IbaTzOI_ox8v9f3HZXDZBFFwwOzHv9D2cRPoyl0dus6ZaCUSmlrjO7UxGMf0CiirHl_mUTPbvtTy0WNcU1RWZscGW6WxJ3b5z5BDF7is7XWpvPJmAGm5PVpOJcJxnhpVtvgb8sorA5rBumSifQT1vvGtJcEg7BeDtlF-3xjRkyPNYLmQhrTsbDfZPG_08BWJZYyTVC78I1xQoZaaOW8X12Aa9eCB20N5vM76F3QzTEiyTPCMbcoWni84JYnVkUI',
    dimensions: { largo: '85 cm', ancho: '80 cm', alto: '90 cm' }
  },
  {
    id: '5',
    name: 'Silla Eames Blanca',
    sku: 'SIL-105-BL',
    category: 'Comedor',
    material: 'Metal',
    price: 650000,
    stock: 2,
    description: 'Icónica silla con carcasa texturizada de molde blanco, patas de madera de haya de resistencia superior conectadas por una estructura metálica negra de estilo torre Eiffel.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9-be5nisGLvSUgyRItKvUBZTJea0G1bo_kL1JIjb6oi9lzXlV4PJlqDoStI4NsofeEOSzC5uJA4o78DbklVFl957n6EZ-9Ci97FrX76MrSwZLQT_Jh15GbCUhR_lclPJvQi81hSPQs0LLh4nYpA7O23RqH7qASrfZF5eryHWcHoBgUFomHB1l24E1HiImEQDrmWUZZDQOwl3cpKkIg3oiXF3cD5uXOJHszQiCkd3HHezygm4zCzcHzbBP2yFOTvFiyrjFkbDsmMaZ',
    dimensions: { largo: '46 cm', ancho: '52 cm', alto: '81 cm' }
  },
  {
    id: '6',
    name: 'Mesa de Centro Roble',
    sku: 'MES-ROB-06',
    category: 'Living',
    material: 'Madera',
    price: 120000,
    stock: 18,
    description: 'Mesa de centro baja de madera rústica de roble con vetas naturales. Perfecta para complementar el living con un toque de calidez y comodidad natural.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOurVhm3G1jRxeHxnlOMH3MshY5MeSNf_mXGLXxP0HTByxtFC924pw_tjV8TstAUoJ6NJJ91P3Zcny9KzhU_icQx-HPNZnd0oaIF_DKvEg9hH5Y_toMrM1ILtgTYHRYmeQ7LhoIsQc7lHX_AUocQtCzEoe4LtRqle1cgpnhfCabvtHjP47I3GFSc6U4w2CGWNc36iGA8J9E2bgnbC7-JOwgosKu6_HUrOBLWnAB_eJOevrcG0iXjWmrvdJwRreAABnMRpKuAwb2499',
    dimensions: { largo: '110 cm', ancho: '60 cm', alto: '40 cm' }
  },
  {
    id: '7',
    name: 'Lámpara de Pie Oslo',
    sku: 'LAM-OSL-07',
    category: 'Living',
    material: 'Metal',
    price: 850000,
    stock: 15,
    description: 'Lámpara de pie de metal esbelto con acabados mate en color negro de alta sofisticación y una tulipa de lino blanco de iluminación suave.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvIWzB0C9n1-mJ-HDtl52pHbhtNkW3unEPtzNCDTZVyWhydmAzThOk7gsvYot1W-ueWQGijboJEnbEiql03AXyNWhYq1Tu_OgADDEmZQrFUs-7XQoJqHC1ipklCjZV-JcPHtYwCpTIQK_wR43--_mT0eh-HyWkiCAJpRZxtXuBDaqrjxb4bh5i_JgMc-NpHqYG1mPL6pJiBa-nBVHXNvkQYgsMn7IjAIFeF7smDreTSAqFv3E7T4UGfUp_oULPi7-Hovy4H4M1CKXs',
    dimensions: { largo: '35 cm', ancho: '35 cm', alto: '155 cm' }
  },
  {
    id: '8',
    name: 'Set Cojines Terciopelo',
    sku: 'COJ-VEL-08',
    category: 'Living',
    material: 'Tela',
    price: 35000,
    stock: 24,
    description: 'Set de dos fundas de cojín fabricados con terciopelo ultrasuave en color verde bosque. Incluye rellenos de plumas sintéticas hipoalergénicas durables.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQz0BhbH_ubIZd_uzaOOafeElpA7Bkk0OZEEnu3PF-3Z1yVMaTeGWSHguvlzNKFfEtCu3XDjDP4zF5DYdgnFU9FNbt1uF3hC9bYgJqMJl0qXlg5u58ArPLJkyhkC5Q-NhCuR4HtmA1e3Y1vGEkIx2UNO3HsrsHq9jV3ZpIEPwPh9ehtFcVlc93ejCWqGnocxSqIWOlQ0GlGjQO0zec0UFiC-orQvu6Bd7vJKiCA-Cy5aikF9qCAibLxnzht04ygMTG2UGs5E7G8XFi',
    dimensions: { largo: '45 cm', ancho: '45 cm', alto: '15 cm' }
  },
  {
    id: '9',
    name: 'Jarrón de Cerámica Nórdica',
    sku: 'JAR-CER-09',
    category: 'Comedor',
    material: 'Tela',
    price: 24990,
    stock: 35,
    description: 'Jarrón minimalista texturizado hecho de arcilla con acabado en color crema mate. El complemento de diseño perfecto para flores secas en cualquier mesa.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOVlwjjXgrC78GsHRctLrhR0yazYEsKYR1spo3zXgptqTnT9tfpf7TdzvTJelPJhSfj4cK_1_EFy90u4bGEZ5JDQj8KQu6DWSg9SVnaYv9BxseUFvVMJaFZyW2xYFhR9iPgWxtYp8Gle_AKNYGxMfDMo39TqUdREP0FYbMYTjGZLLECYowgVxUHUmS_Dcq88eDvlzAb5H-R8gl0LqRROdxHZbq07u2vK3Ym9_QH1Y3meHtn1C1Fy_ua7j9_mpyNTqLQJ7s84nw9AGE',
    dimensions: { largo: '15 cm', ancho: '15 cm', alto: '30 cm' }
  },
  {
    id: '10',
    name: 'Mesa de Jardín Teka',
    sku: 'MES-TEK-11',
    category: 'Jardín',
    material: 'Madera',
    price: 199900,
    stock: 7,
    description: 'Mesa plegable para terraza de madera de teka resistente a la intemperie. Otorga un look natural y elegante a tu balcón, patio o jardín de forma instantánea.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2exjb7vWYjjOTNN3HZ0e7dX0NOtTie0KLOC2VdnWh7lwc_nam1k1dXdtHOgz9uItcUuQ_8AxjbHHfzpIv23FAOY6AHBrZznT_34KxuBY0XvliHeILe451EAKj8reRw7YC5PzyNWy9CniTYzxXogQ0dTVNu7tDnxax6vR7Q5I12qQ8LgZXy9jOev54v5xGYLtAIUwoCH1aev7Hdav8bhOZQMCGQyEKKTbNO8AvTOdGAHvySCmkLSP5PnBe64ApHiBOky56bscOwjlv',
    dimensions: { largo: '120 cm', ancho: '70 cm', alto: '75 cm' }
  },
  {
    id: '11',
    name: 'Silla de Terraza Metal',
    sku: 'SIL-TER-12',
    category: 'Jardín',
    material: 'Metal',
    price: 39990,
    stock: 3,
    description: 'Silla de terraza de acero galvanizado pintado al horno en color verde oliva. Es apilable, ligera y altamente resistente a los rayos UV atmosféricos.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9-be5nisGLvSUgyRItKvUBZTJea0G1bo_kL1JIjb6oi9lzXlV4PJlqDoStI4NsofeEOSzC5uJA4o78DbklVFl957n6EZ-9Ci97FrX76MrSwZLQT_Jh15GbCUhR_lclPJvQi81hSPQs0LLh4nYpA7O23RqH7qASrfZF5eryHWcHoBgUFomHB1l24E1HiImEQDrmWUZZDQOwl3cpKkIg3oiXF3cD5uXOJHszQiCkd3HHezygm4zCzcHzbBP2yFOTvFiyrjFkbDsmMaZ',
    dimensions: { largo: '45 cm', ancho: '50 cm', alto: '85 cm' }
  }
];

export function getStoredProducts(): Product[] {
  const stored = localStorage.getItem('homeventory_products');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing stored products', e);
    }
  }
  localStorage.setItem('homeventory_products', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem('homeventory_products', JSON.stringify(products));
}

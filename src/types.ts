export type Category = 'Living' | 'Comedor' | 'Dormitorio' | 'Jardín';
export type Material = 'Madera' | 'Metal' | 'Tela';

export interface Dimensions {
  largo: string;
  ancho: string;
  alto: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  material: Material;
  price: number;
  stock: number;
  description: string;
  image: string;
  dimensions: Dimensions;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface User {
  username: string;
  email: string;
  role: 'Vendedor' | 'Administrador' | 'Cliente';
  isAuthenticated: boolean;
}

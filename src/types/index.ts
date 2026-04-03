// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  created_at: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Pokemon' | 'OnePiece' | 'Lorcana' | 'Other';
  price: number;
  original_price?: number;
  image_url: string;
  emoji?: string;
  in_stock: boolean;
  stock_quantity: number;
  rating: number;
  reviews_count: number;
  badge?: 'new' | 'sale' | 'hot';
  created_at: string;
  updated_at: string;
}

// Cart Types
export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  stripe_payment_id?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
  updated_at: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Checkout Types
export interface CheckoutFormData {
  email: string;
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

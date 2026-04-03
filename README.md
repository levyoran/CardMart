# 🎴 CardMart - TCG Trading Card Shop

A modern, production-ready e-commerce platform for Pokémon and One Piece Trading Card Games.

## ✨ Features

### 🛒 Customer Features
- **User Authentication**: Secure sign-up and login with Supabase Auth
- **Product Browsing**: Filter TCG cards by category (Pokémon, One Piece, Lorcana)
- **Shopping Cart**: Persistent cart with real-time updates
- **Checkout Flow**: Multi-step checkout with shipping and billing info
- **Stripe Payments**: Secure payment processing with Stripe integration
- **Order History**: View past orders and order status
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### 👨‍💼 Admin Features
- **Product Management**: Add, edit, delete products
- **Inventory Control**: 
  - Toggle stock status
  - Update stock quantities with visual indicators
  - Real-time stock level monitoring
- **Pricing Management**: Instant price updates across the platform
- **Product Analytics**: View product performance and ratings
- **Badge Management**: Mark products as New, Sale, or Hot

### 🔒 Security
- **Row-Level Security (RLS)**: Database security at the row level
- **Admin-Only Operations**: Sensitive actions protected by role-based access
- **Secure Authentication**: Industry-standard Supabase Auth
- **Payment Security**: PCI-compliant Stripe integration

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **Routing** | React Router v6 |
| **State** | Zustand + localStorage |
| **Backend** | Supabase (PostgreSQL + Auth) |
| **Payments** | Stripe API |
| **Build** | Vite |
| **Icons** | Lucide React |

## 📋 Getting Started

### Prerequisites
- Node.js 16+
- Supabase account (free)
- Stripe account (test mode)

### Quick Start

```bash
# 1. Clone & Install
git clone <repo>
cd CardMart
npm install

# 2. Set up Supabase (see SETUP.md)
# 3. Create .env.local with credentials
# 4. Start dev server
npm run dev
```

See **[SETUP.md](./SETUP.md)** for complete setup instructions.

## 🎯 Core Functionality

### 1. User Authentication Flow
```
Signup/Login → Email Verification → Dashboard/Profile
```

### 2. Shopping Flow
```
Browse Products → Filter by Category → Add to Cart → 
View Cart → Checkout → Payment → Order Confirmation
```

### 3. Admin Management
```
Admin Login → Dashboard → Product Management → 
Inventory Control → Real-time Updates
```

## 📁 Project Structure

```
src/
├── components/
│   └── Header.tsx              # Navigation header
│   └── ProductCard.tsx         # Product display card
├── pages/
│   ├── Home.tsx               # Product listing
│   ├── Cart.tsx               # Shopping cart
│   ├── Checkout.tsx           # Checkout form & payment
│   ├── Login.tsx              # User login
│   ├── Signup.tsx             # User registration
│   └── AdminDashboard.tsx     # Admin panel
├── services/
│   ├── supabase.ts            # Supabase API client
│   └── stripe.ts              # Stripe payment client
├── store/
│   ├── authStore.ts           # Auth state management
│   └── cartStore.ts           # Cart state management
├── types/
│   └── index.ts               # TypeScript interfaces
└── App.tsx                     # Main app component
```

## 🗄️ Database Schema

### Products Table
```typescript
{
  id: UUID;
  name: string;
  description: string;
  category: 'Pokemon' | 'OnePiece' | 'Lorcana' | 'Other';
  price: number;
  original_price?: number;
  emoji: string;
  in_stock: boolean;
  stock_quantity: number;
  rating: number;
  reviews_count: number;
  badge?: 'new' | 'sale' | 'hot';
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Orders Table
```typescript
{
  id: UUID;
  user_id: UUID;
  items: CartItem[];
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  stripe_payment_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: timestamp;
}
```

### User Profiles Table
```typescript
{
  id: UUID;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  created_at: timestamp;
  updated_at: timestamp;
}
```

## 🧪 Testing

### Test Stripe Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Exp**: Any future date
- **CVV**: Any 3 digits

### Demo Admin Account
After setup, create user with role='admin':
```
Email: admin@cardmart.com
Password: SecurePassword123
```

## 🛠️ Key Features Implementation

### 1. Cart Management (Zustand)
```typescript
// Persistent cart with localStorage
const cart = useCartStore();
cart.addItem(product, quantity);
cart.getTotal();
cart.clearCart();
```

### 2. Authentication (Supabase)
```typescript
// Sign up
await auth.signUp(email, password, fullName);

// Sign in
await auth.signIn(email, password);

// Get current user
const user = await auth.getCurrentUser();
```

### 3. Payment Processing (Stripe)
```typescript
// Create payment intent
const clientSecret = await createPaymentIntent(amount, orderId);

// Process payment
const result = await processPayment(amount, orderId);
```

### 4. Admin Operations
```typescript
// Add product (admin only)
await products.create(productData);

// Update inventory
await products.update(productId, { in_stock: false });

// Reprice instantly
await products.update(productId, { price: newPrice });
```

## 🔐 Security Features

✅ **Row-Level Security**: Database enforces access control
✅ **Admin Verification**: Every admin action verified server-side
✅ **Secure Auth**: OAuth-ready with Supabase
✅ **Payment Security**: Stripe handles sensitive card data
✅ **CORS Protected**: Backend CORS configured
✅ **Input Validation**: All forms validated before submission
✅ **Error Handling**: User-friendly error messages

## 📊 Performance Optimizations

- **Lazy Loading**: Images loaded on demand
- **Persistent Cart**: No data loss on refresh
- **Optimized Queries**: Indexed database queries
- **Code Splitting**: Route-based code splitting with Vite
- **Tree Shaking**: Unused code eliminated in build

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Optional - For Stripe payments)
```bash
# Deploy to Heroku/AWS/Railway
npm start
```

### Database (Supabase)
- Scales automatically
- Automatic backups
- Real-time capabilities

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All layouts tested and optimized for each breakpoint.

## 🎨 Design System

### Colors
- **Primary**: Orange (#f5a623)
- **Secondary**: Navy (#1a2744)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Heebo (Hebrew-friendly)
- **Weights**: 300, 400, 500, 700, 900
- **Scale**: Responsive font sizes

## 🚀 Roadmap

- [ ] Product image uploads (Supabase Storage)
- [ ] Email notifications (SendGrid)
- [ ] Order tracking
- [ ] Customer reviews & ratings
- [ ] Wishlist functionality
- [ ] Advanced search & filters
- [ ] Push notifications
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Inventory alerts

## 🐛 Troubleshooting

### Products not loading?
1. Check Supabase connection in `.env.local`
2. Verify RLS policies are correct
3. Seed sample products

### Payment not working?
1. Use test card numbers
2. Check Stripe keys in `.env.local`
3. Verify backend is running (if applicable)

### Admin panel not accessible?
1. Ensure user role is 'admin' in database
2. Log out and back in
3. Check browser console for errors

## 📞 Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **React Docs**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com

## 📄 License

MIT License - Feel free to use for your project!

## 🎉 Credits

Built with ❤️ for TCG enthusiasts worldwide.

---

**Ready to launch?** See [SETUP.md](./SETUP.md) for detailed setup instructions.

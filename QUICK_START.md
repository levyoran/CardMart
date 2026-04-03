# 🚀 CardMart Quick Start (5 Minutes)

## 1️⃣ Setup (2 minutes)

```bash
# Clone repo and install
cd CardMart
npm install

# Create .env.local with your keys:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

## 2️⃣ Get Keys (1 minute)

### Supabase
1. Go to https://supabase.com
2. Create project
3. Copy URL & Anon Key from Settings > API

### Stripe  
1. Go to https://stripe.com/docs/testing
2. Copy test Publishable Key

## 3️⃣ Database Setup (1 minute)

Go to Supabase > SQL Editor and paste this:

```sql
-- Users
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  emoji VARCHAR(10),
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(3, 1) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  badge VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

-- Seed Data
INSERT INTO products (name, category, price, emoji, in_stock, stock_quantity, rating, reviews_count, badge) VALUES
('Pokémon Scarlet Booster', 'Pokemon', 99.99, '🎴', true, 50, 4.8, 245, 'sale'),
('One Piece Starter Deck', 'OnePiece', 29.99, '⛵', true, 100, 4.5, 89, 'new');
```

## 4️⃣ Start App (30 seconds)

```bash
npm run dev
# Opens at http://localhost:3000
```

## ✅ Quick Test

1. **Browse**: See products on home page
2. **Shop**: Add item to cart
3. **Cart**: View cart (click cart icon)
4. **Sign up**: Create account at /signup
5. **Checkout**: Go to /checkout (use test card: 4242 4242 4242 4242)
6. **Admin**: Set role='admin' in Supabase, access /admin

## 🧪 Test Credentials

**Test Cards**:
- Success: `4242 4242 4242 4242`
- Any expiry & CVC

**Create Admin**:
1. Sign up normally
2. Go to Supabase > user_profiles
3. Change role to 'admin'
4. Logout & login
5. Click "Admin" in header

## 🗺️ Project Files

| File | Purpose |
|------|---------|
| `src/` | React components & logic |
| `src/pages/` | Page components (Home, Cart, etc) |
| `src/services/` | Supabase & Stripe API calls |
| `src/store/` | Zustand state management |
| `index.html` | HTML template |
| `vite.config.ts` | Build config |
| `SETUP.md` | Detailed setup guide |
| `ADMIN_GUIDE.md` | Admin dashboard guide |

## 📋 What's Working

✅ User signup/login
✅ Product browsing & filtering  
✅ Shopping cart (persistent)
✅ Checkout flow
✅ Stripe test payments
✅ Admin dashboard
✅ Product CRUD
✅ Inventory management
✅ Real-time price updates

## 🚨 If Something Breaks

1. **Products not showing**: Check Supabase RLS policies
2. **Login fails**: Verify email auth is enabled in Supabase
3. **Payment fails**: Use test card 4242...
4. **Admin access denied**: Verify role='admin' in Supabase

## 📖 Full Guides

- **Setup Details**: See SETUP.md
- **Admin Features**: See ADMIN_GUIDE.md  
- **Implementation Status**: See IMPLEMENTATION_CHECKLIST.md
- **Project Overview**: See README.md

## 🎯 Next Steps

1. Deploy to Vercel (Frontend)
2. Set up Stripe webhooks
3. Add product images
4. Set up email notifications
5. Configure custom domain

---

**That's it!** You now have a fully functional TCG e-commerce platform. 🎉

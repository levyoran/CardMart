# CardMart - Complete Setup Guide

## 🚀 Project Overview

CardMart is a full-stack e-commerce platform for Pokémon and One Piece Trading Card Games built with:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Firebase Alternative)
- **Payments**: Stripe
- **State Management**: Zustand
- **Routing**: React Router v6

## 📋 Prerequisites

- Node.js 16+ and npm
- A Supabase account (free at https://supabase.com)
- A Stripe account (test mode) at https://stripe.com
- Git

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd CardMart
npm install
```

### 2. Supabase Setup

#### Create a Supabase Project:
1. Go to https://supabase.com and sign up/login
2. Click "New Project" and create a project
3. Wait for it to initialize
4. Go to **Settings > API** to find:
   - `VITE_SUPABASE_URL` (Project URL)
   - `VITE_SUPABASE_ANON_KEY` (Anon Key)

#### Create Database Tables:

Go to **SQL Editor** in Supabase and run these SQL commands:

```sql
-- Users Profile Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  image_url VARCHAR(500),
  emoji VARCHAR(10),
  in_stock BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  rating DECIMAL(3, 1) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  badge VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  stripe_payment_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can read products
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

-- Only admins can modify products
CREATE POLICY "Enable insert for authenticated users with admin role" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Enable update for admins" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Enable delete for admins" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Users can read their own orders
CREATE POLICY "Enable users to read their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Users can create orders
CREATE POLICY "Enable authenticated users to create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders
CREATE POLICY "Enable users to update their own orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id);
```

#### Enable Authentication:

1. Go to **Authentication > Providers**
2. Enable "Email" provider (it's on by default)
3. Go to **Settings > Auth** and enable "Confirm email" if needed (for demo, you can keep it off)

### 3. Stripe Setup

1. Go to https://stripe.com/docs/testing and get test card numbers
2. Get your keys from Dashboard > API keys
3. Copy **Publishable Key** to `VITE_STRIPE_PUBLISHABLE_KEY`
4. Keep Secret Key for backend (we'll use it in the API)

### 4. Environment Variables

Create `.env.local`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
VITE_API_URL=http://localhost:3000
```

### 5. Backend API (Node.js/Express) - Optional Setup

If you want real Stripe payment processing, create a backend:

```bash
mkdir cardmart-backend
cd cardmart-backend
npm init -y
npm install express cors stripe supabase-js dotenv
```

Create `server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'ils',
      metadata: { orderId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Process Payment
app.post('/api/process-payment', async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'ils',
      metadata: { orderId },
    });

    // In test mode, automatically confirm the payment
    const confirmedIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      { payment_method: 'pm_card_visa' } // Test card
    );

    // Update order in Supabase
    if (confirmedIntent.status === 'succeeded') {
      await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          stripe_payment_id: confirmedIntent.id,
        })
        .eq('id', orderId);

      res.json({
        success: true,
        paymentId: confirmedIntent.id,
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment failed',
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Create `.env` for backend:

```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
PORT=5000
```

Run backend:

```bash
node server.js
```

### 6. Start Development Server

```bash
npm run dev
```

The app will open at http://localhost:3000

## 📦 Seed Sample Products

Go to Supabase SQL Editor and run:

```sql
INSERT INTO products (name, description, category, price, original_price, emoji, in_stock, stock_quantity, rating, reviews_count, badge) VALUES
('Pokémon Scarlet & Violet Booster', 'Official Pokémon TCG booster box', 'Pokemon', 99.99, 149.99, '🎴', true, 50, 4.8, 245, 'sale'),
('One Piece Card Game Starter Deck', 'Perfect for beginners', 'OnePiece', 29.99, NULL, '⛵', true, 100, 4.5, 89, 'new'),
('Lorcana Illumineer''s Quest', 'Disney trading card game', 'Lorcana', 119.99, NULL, '🏰', true, 30, 4.7, 156, 'hot'),
('Pokémon VMAX Climax Collection', 'Premium collection box', 'Pokemon', 179.99, 220, '🎴', true, 25, 4.6, 189, 'sale');
```

## 🔐 Making Users Admin

Go to Supabase > SQL Editor:

```sql
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@cardmart.com';
```

Or via the dashboard:
1. Create a user with email: admin@cardmart.com
2. Go to **Data Editor > user_profiles**
3. Update their role to "admin"

## 🧪 Testing

### Test Stripe Cards (in Test Mode):
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002

### Demo Account:
- Email: demo@cardmart.com
- Password: DemoPassword123

## 📱 Features Implemented

✅ User Registration & Login (Supabase Auth)
✅ Product Listing & Filtering
✅ Shopping Cart (Persistent with localStorage)
✅ Order Management
✅ Stripe Payment Integration
✅ Admin Dashboard
  - Add/Edit/Delete Products
  - Inventory Management
  - Real-time Price Updates
  - Stock Status Toggle
✅ Order History
✅ Responsive Mobile Design
✅ TCG-themed UI with Orange & Navy colors

## 🚨 Common Issues & Solutions

### Issue: Products not showing up
**Solution**: Make sure you've seeded products in Supabase and RLS policies are correct.

### Issue: Login not working
**Solution**: Check that Email provider is enabled in Supabase > Authentication > Providers

### Issue: Payment failing
**Solution**: 
- Use test card numbers (4242...)
- Check STRIPE_PUBLISHABLE_KEY is set correctly
- Make sure backend is running (if using real processing)

### Issue: Admin dashboard not accessible
**Solution**: Ensure your user has role = 'admin' in user_profiles table

## 📚 Project Structure

```
cardmart/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services (Supabase, Stripe)
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS config
├── postcss.config.js     # PostCSS config
├── package.json          # Dependencies
└── .env.example          # Environment variables template
```

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Enable RLS** - Row Level Security on Supabase (already configured)
3. **Validate input** - All form inputs are validated
4. **HTTPS only** - Always use HTTPS in production
5. **Secure tokens** - Store auth tokens in secure HTTP-only cookies in production
6. **Admin verification** - Admin operations check user role before execution

## 📈 Scaling for Production

1. **Database**: Supabase scales automatically
2. **CDN**: Add Vercel/Netlify for frontend hosting
3. **Storage**: Use Supabase Storage for product images
4. **Payments**: Keep Stripe (production mode)
5. **Monitoring**: Add Sentry for error tracking
6. **Analytics**: Add Plausible Analytics

## 💡 Next Steps

1. ✅ Replace emoji with actual product images (store in Supabase Storage)
2. ✅ Add email notifications for orders
3. ✅ Implement order tracking
4. ✅ Add product reviews & ratings
5. ✅ Implement wish list
6. ✅ Add search & advanced filters
7. ✅ Set up automated backups
8. ✅ Add analytics dashboard

## 📞 Support

For issues:
1. Check Supabase dashboard for database errors
2. Check browser console for frontend errors
3. Check server logs for backend errors
4. Review Stripe webhook logs for payment issues

---

**Last Updated**: 2024
**Version**: 1.0.0

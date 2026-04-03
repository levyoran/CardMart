# CardMart Admin Dashboard Guide

## 🔐 Accessing the Admin Dashboard

### Step 1: Create an Admin User
1. Sign up normally via `/signup`
2. Go to Supabase dashboard
3. Navigate to **Data Editor > user_profiles**
4. Find your user by email
5. Change the `role` field from `customer` to `admin`
6. Save changes

### Step 2: Login as Admin
1. Log in with your email and password
2. You'll see "Admin" link in the header
3. Click it to access the dashboard

## 📊 Admin Dashboard Features

### 🏠 Dashboard Overview
- View all products at a glance
- See product count and revenue
- Quick access to inventory status

### 📦 Products Tab

#### View Products
- Table showing all products in your store
- Columns: Product name, Category, Price, Stock status, Actions
- Sort by category or search by name

#### Add New Product
1. Click the **"Add Product"** tab
2. Fill in product details:
   - **Product Name**: e.g., "Pokémon EX Collection Box"
   - **Description**: Brief product description
   - **Category**: Select from Pokemon, OnePiece, Lorcana, or Other
   - **Price**: Current selling price (₪)
   - **Original Price**: Original price (for showing discounts)
   - **Emoji**: Representative emoji (e.g., 🎴, ⛵, 🏰)
   - **Stock Quantity**: How many units available
   - **Rating**: Star rating (0-5)
   - **Reviews Count**: Number of customer reviews
   - **Badge**: Mark as New, Sale, or Hot
3. Click **"Add Product"** button
4. Product instantly appears in your store

#### Edit Product
1. Find the product in the Products tab
2. Click the **Edit** icon (pencil)
3. Edit details inline
4. Changes are saved immediately

#### Delete Product
1. Click the **Delete** icon (trash)
2. Confirm deletion
3. Product is removed from store

#### Update Prices (Reprice)
1. Click the **Dollar** icon next to the price
2. Enter the new price
3. Click **Save**
4. Price updates instantly across the platform
5. Click **Cancel** if you change your mind

### 📊 Inventory Tab

#### Monitor Stock Levels
- Visual progress bars show stock health:
  - **Green** (>20 units): Healthy stock
  - **Yellow** (5-20 units): Low stock warning
  - **Red** (<5 units): Critical stock

#### Stock Information
- Product name
- Current quantity
- In-stock/Out-of-stock status
- Quick toggle button

#### Toggle Stock Status
1. Click **"Toggle Status"** button
2. Instantly marks product as in-stock or out-of-stock
3. Affects whether customers can purchase
4. Customers see "In Stock" or "Out of Stock" badges

#### Stock Level Actions
| Quantity | Action | Notes |
|----------|--------|-------|
| > 20 | Keep stocked | Healthy inventory |
| 5-20 | Plan reorder | Getting low |
| < 5 | Urgent reorder | Critical |
| 0 | Take offline | Toggle out-of-stock |

### 🔍 Search & Filter

#### Search Products
- Use the search bar at the top of Products tab
- Search by product name or category
- Results update in real-time
- Case-insensitive search

#### Filter by Category
In the Home page (when viewing as customer):
- Filter by category: All, Pokemon, OnePiece, Lorcana, Other
- Each category shows filtered products

## 💡 Common Admin Tasks

### Task 1: Add New Product Line
```
1. Go to "Add Product" tab
2. Fill in all fields
3. Set appropriate badge (new/sale/hot)
4. Click "Add Product"
5. Verify it appears in Products list
```

### Task 2: Run a Sale
```
1. Go to Products tab
2. Find product to discount
3. Click price update button
4. Enter sale price
5. Optionally edit original_price (for comparison)
6. Add "sale" badge for visibility
```

### Task 3: Launch New Product
```
1. Add product via "Add Product" tab
2. Set badge to "new"
3. Price appropriately
4. Set stock quantity
5. Add rating and reviews for credibility
```

### Task 4: Manage Low Stock
```
1. Go to Inventory tab
2. Check for yellow/red indicators
3. Plan reordering
4. Toggle out-of-stock if unavailable
5. Update quantity when stock arrives
```

### Task 5: Respond to Demand
```
1. Monitor which products sell well
2. Reprice high-demand items (increase)
3. Discount slow-moving items
4. Adjust "hot" badges accordingly
5. Update stock quantities as needed
```

## 🎨 Best Practices

### Product Information
✅ **DO:**
- Use clear, descriptive product names
- Include product series/edition info
- Be honest about condition
- Set realistic ratings

❌ **DON'T:**
- Use misleading descriptions
- Fake reviews or ratings
- Overstock without demand forecast
- Price inconsistently

### Stock Management
✅ **DO:**
- Monitor inventory weekly
- Set alerts for low stock
- Update quantities in real-time
- Plan for seasonal demand

❌ **DON'T:**
- Let stock fall below 5 without notice
- Forget to toggle out-of-stock status
- Oversell (inventory mismatch)
- Ignore stock warnings

### Pricing Strategy
✅ **DO:**
- Offer discounts strategically
- Use "sale" badge for discounts
- Monitor competitor pricing
- Adjust for demand and stock levels

❌ **DON'T:**
- Randomly change prices
- Use misleading original prices
- Price significantly lower than acquisition cost
- Forget to update original_price for discounts

## 📈 Analytics & Insights

### Monitor These Metrics
1. **Product Sell-Through Rate**: Best & worst sellers
2. **Average Rating**: Product quality indicator
3. **Stock Turnover**: How fast items sell
4. **Price Changes**: Discount effectiveness
5. **New vs Returning**: Product freshness

### Use Data to Make Decisions
- If product has 4+ rating: Keep in stock & promote
- If not selling: Add to sale, adjust price, or remove
- If rating drops: Investigate quality issues
- If stock moving fast: Increase quantity

## 🔒 Security Notes

### Admin-Only Actions
The following are protected and only admin users can do:
- ✅ Add products
- ✅ Edit products
- ✅ Delete products
- ✅ Update prices
- ✅ Control stock status
- ✅ Access admin dashboard

### Audit Trail
While not visible in this interface, Supabase logs:
- Who made changes
- When changes were made
- What was changed
- IP address of admin

## 🆘 Troubleshooting

### "Access Denied" Error
**Problem**: You can't access the admin dashboard
**Solution**:
1. Verify your user role is 'admin' in Supabase
2. Log out and log back in
3. Refresh the page
4. Check browser console for errors

### Changes Not Appearing
**Problem**: Product changes don't show up immediately
**Solution**:
1. Refresh the browser
2. Check that no RLS policies are blocking updates
3. Verify you're logged in as admin
4. Check Supabase dashboard for errors

### Can't Add Product
**Problem**: Form won't submit
**Solution**:
1. Ensure all required fields (*) are filled
2. Check that price is a valid number
3. Verify emoji is only 1-2 characters
4. Check browser console for validation errors

### Stock Updates Not Working
**Problem**: Stock quantity or status won't update
**Solution**:
1. Ensure product exists in database
2. Check that stock_quantity is a valid number
3. Verify your admin role is active
4. Refresh page and try again

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Review Supabase dashboard for database status
3. Verify RLS policies are correct
4. Ensure admin role is set properly
5. Check SETUP.md for environment setup

## 🚀 Advanced Features

### Bulk Operations (Future Development)
- Import products via CSV
- Bulk price updates
- Bulk inventory updates
- Batch delete products

### Analytics Dashboard (Future)
- Sales trends
- Product performance
- Revenue tracking
- Inventory forecasting

### Automation (Future)
- Auto-adjust prices based on demand
- Stock-out alerts via email
- Seasonal product rotation
- Low-stock notifications

---

**Need more features?** See IMPLEMENTATION_CHECKLIST.md for roadmap!

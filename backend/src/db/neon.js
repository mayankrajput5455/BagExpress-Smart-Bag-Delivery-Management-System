const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

let pool = null;

const initialProducts = [
  {
    name: 'Classic Brown Kraft Shopping Bag',
    slug: 'classic-brown-kraft-shopping-bag',
    category: 'Retail & Shopping',
    description: 'Timeless, heavy-duty natural brown kraft carrier with reinforced twisted paper handles. Crafted from 100% recycled virgin wood pulp, bio-degradable and compostable. Ideal for retail stores, clothing boutiques, and organic markets.',
    price: 18.50,
    discount_price: 14.80,
    discount_percent: 20,
    gsm: 120,
    handle_type: 'Twisted Paper Cord',
    material: '100% Recycled Virgin Kraft',
    dimensions: '32cm x 24cm x 11cm',
    load_capacity: '8 - 10 kg',
    moq: 50,
    stock: 14500,
    ratings: 4.9,
    num_reviews: 142,
    is_featured: true,
    is_bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Eco-Friendly', 'Recyclable', 'Bestseller', 'Retail', 'FSC Certified'],
    bulk_pricing: [
      { minQty: 50, pricePerUnit: 14.80 },
      { minQty: 250, pricePerUnit: 12.50 },
      { minQty: 1000, pricePerUnit: 9.90 },
      { minQty: 5000, pricePerUnit: 7.80 }
    ]
  },
  {
    name: 'Luxury Matte Charcoal Boutique Bag',
    slug: 'luxury-matte-charcoal-boutique-bag',
    category: 'Luxury & Boutique',
    description: 'Exquisite deep charcoal matte laminated paper bag featuring heavy 250 GSM artboard, turn-top reinforced base, and 25mm soft grosgrain ribbon handles. Designed for high-end luxury fashion houses, fine jewelers, and perfume houses.',
    price: 45.00,
    discount_price: 38.00,
    discount_percent: 15,
    gsm: 250,
    handle_type: 'Grosgrain Ribbon Handle',
    material: 'Heavy Coated Art Card + Matte Velvet Finish',
    dimensions: '36cm x 28cm x 12cm',
    load_capacity: '12 kg',
    moq: 25,
    stock: 6200,
    ratings: 5.0,
    num_reviews: 89,
    is_featured: true,
    is_bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Luxury', 'Premium', 'Ribbon Handle', 'Boutique', 'Matte Finish'],
    bulk_pricing: [
      { minQty: 25, pricePerUnit: 38.00 },
      { minQty: 100, pricePerUnit: 32.00 },
      { minQty: 500, pricePerUnit: 26.50 },
      { minQty: 2000, pricePerUnit: 21.00 }
    ]
  },
  {
    name: 'Rustic Pinch-Bottom Bakery & Pastry Bag',
    slug: 'rustic-pinch-bottom-bakery-bag',
    category: 'Food & Bakery',
    description: 'Natural greaseproof unbleached kraft paper bags with pinch-bottom seal. Specially treated to resist butter and oil seepage while maintaining fresh crisp crusts for sourdough loaves, croissants, and artisan pastries. 100% FDA food safe.',
    price: 8.00,
    discount_price: 6.20,
    discount_percent: 22,
    gsm: 65,
    handle_type: 'Self-Fold Pinch Bottom (No Handle)',
    material: 'Greaseproof Virgin Kraft Paper',
    dimensions: '28cm x 15cm x 7cm',
    load_capacity: '2.5 kg',
    moq: 100,
    stock: 35000,
    ratings: 4.8,
    num_reviews: 210,
    is_featured: false,
    is_bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Bakery', 'Greaseproof', 'Food Grade', 'Compostable', 'Cafe'],
    bulk_pricing: [
      { minQty: 100, pricePerUnit: 6.20 },
      { minQty: 500, pricePerUnit: 4.90 },
      { minQty: 2000, pricePerUnit: 3.80 },
      { minQty: 10000, pricePerUnit: 2.70 }
    ]
  },
  {
    name: 'Bleached White Kraft Retail Bag with Flat Handles',
    slug: 'bleached-white-kraft-retail-bag',
    category: 'Retail & Shopping',
    description: 'Clean, crisp white kraft shopper made from sustainably managed Nordic softwood pulp. Fitted with internal glued flat fold tape handles for comfortable grip. Provides brilliant color contrast for corporate logo printing.',
    price: 16.00,
    discount_price: 13.50,
    discount_percent: 15,
    gsm: 100,
    handle_type: 'Internal Folded Flat Paper Tape',
    material: 'Sustainably Bleached Pure Kraft',
    dimensions: '30cm x 22cm x 10cm',
    load_capacity: '7 kg',
    moq: 50,
    stock: 18000,
    ratings: 4.7,
    num_reviews: 76,
    is_featured: false,
    is_bestseller: false,
    images: [
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Retail', 'White Kraft', 'Modern', 'Cosmetics', 'Clean Look'],
    bulk_pricing: [
      { minQty: 50, pricePerUnit: 13.50 },
      { minQty: 200, pricePerUnit: 11.20 },
      { minQty: 1000, pricePerUnit: 8.90 },
      { minQty: 5000, pricePerUnit: 7.10 }
    ]
  },
  {
    name: 'Heavy-Duty 3-Ply Industrial Kraft Sack',
    slug: 'heavy-duty-3ply-industrial-kraft-sack',
    category: 'Industrial & Bulk',
    description: 'Ultra-tough extensible 3-ply heavy kraft sack with stitched and crepe-taped bottom. Engineered for heavy agricultural seed, whole grains, dry mortar, charcoal, and bulk organic fertilizers without tearing or moisture damage.',
    price: 55.00,
    discount_price: 48.00,
    discount_percent: 12,
    gsm: 180,
    handle_type: 'Stitched Reinforced Top Gusset',
    material: '3-Ply Semi-Extensible Clupak Kraft',
    dimensions: '65cm x 40cm x 15cm',
    load_capacity: '25 kg',
    moq: 20,
    stock: 4500,
    ratings: 4.9,
    num_reviews: 58,
    is_featured: true,
    is_bestseller: false,
    images: [
      'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Industrial', 'Heavy Duty', '25kg Load', '3-Ply', 'Agricultural'],
    bulk_pricing: [
      { minQty: 20, pricePerUnit: 48.00 },
      { minQty: 100, pricePerUnit: 41.00 },
      { minQty: 500, pricePerUnit: 34.50 },
      { minQty: 2500, pricePerUnit: 28.00 }
    ]
  },
  {
    name: 'Pastel Rose Die-Cut Punch Handle Bag',
    slug: 'pastel-rose-die-cut-punch-bag',
    category: 'Fashion & Events',
    description: 'Trendy die-cut oval handle carrier in soft blush rose matte finish. Features internally reinforced handle patch for high tear resistance. Ideal for beauty brands, fashion pop-ups, lifestyle conventions, and bridal shower favors.',
    price: 22.00,
    discount_price: 18.00,
    discount_percent: 18,
    gsm: 140,
    handle_type: 'Reinforced Oval Die-Cut Handle',
    material: 'Dyed Uncoated Pastel Art Kraft',
    dimensions: '26cm x 20cm x 8cm',
    load_capacity: '5 kg',
    moq: 50,
    stock: 9800,
    ratings: 4.9,
    num_reviews: 114,
    is_featured: true,
    is_bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Die-Cut', 'Pastel', 'Events', 'Fashion', 'Cosmetics'],
    bulk_pricing: [
      { minQty: 50, pricePerUnit: 18.00 },
      { minQty: 200, pricePerUnit: 15.00 },
      { minQty: 1000, pricePerUnit: 12.00 },
      { minQty: 5000, pricePerUnit: 9.50 }
    ]
  },
  {
    name: 'Dual Wine Bottle Kraft Carrier with Window & Rope',
    slug: 'dual-wine-bottle-kraft-carrier',
    category: 'Beverage & Gifts',
    description: 'Double wine and spirits carrier with reinforced inner partition divider to prevent bottle clinking. Features crystal clear display viewing windows and heavy braided cotton rope handles with metal aglets. Perfect for wineries and holiday gifting.',
    price: 36.00,
    discount_price: 29.50,
    discount_percent: 18,
    gsm: 220,
    handle_type: 'Braided Cotton Rope with Metal Aglets',
    material: 'Rigid Ribbed Kraft Board + Clear PLA Window',
    dimensions: '38cm x 18cm x 9cm',
    load_capacity: '6 kg (2 Wine Bottles)',
    moq: 25,
    stock: 5400,
    ratings: 5.0,
    num_reviews: 95,
    is_featured: true,
    is_bestseller: false,
    images: [
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Wine Bag', 'Window Carrier', 'Rope Handle', 'Gifts', 'Beverage'],
    bulk_pricing: [
      { minQty: 25, pricePerUnit: 29.50 },
      { minQty: 100, pricePerUnit: 24.00 },
      { minQty: 500, pricePerUnit: 19.80 },
      { minQty: 2000, pricePerUnit: 15.50 }
    ]
  },
  {
    name: 'Artisan Coffee Bean Pouch with Degassing Valve & Tin-Tie',
    slug: 'artisan-coffee-bean-valve-pouch',
    category: 'Food & Bakery',
    description: 'Specialty coffee pouch built with natural kraft exterior, plant-based moisture barrier, one-way CO2 aroma degassing valve, and built-in peel-and-stick tin-tie for repeatedly resealing freshness. Keeps roasted whole beans fresh for months.',
    price: 28.00,
    discount_price: 23.00,
    discount_percent: 18,
    gsm: 130,
    handle_type: 'Resealable Tin-Tie Top',
    material: 'Natural Kraft + Compostable Bio-Barrier Layer',
    dimensions: '24cm x 12cm x 7.5cm (Holds 250g / 500g)',
    load_capacity: '1 kg',
    moq: 50,
    stock: 12000,
    ratings: 4.9,
    num_reviews: 167,
    is_featured: false,
    is_bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Coffee', 'Degassing Valve', 'Tin-Tie', 'Aroma Barrier', 'Specialty'],
    bulk_pricing: [
      { minQty: 50, pricePerUnit: 23.00 },
      { minQty: 200, pricePerUnit: 19.50 },
      { minQty: 1000, pricePerUnit: 15.80 },
      { minQty: 5000, pricePerUnit: 12.20 }
    ]
  },
  {
    name: 'Foil-Stamped Emerald Green Luxury Shopper',
    slug: 'foil-stamped-emerald-green-luxury-shopper',
    category: 'Luxury & Boutique',
    description: 'High-substance 280 GSM rigid art card bag dipped in deep British emerald green with metallic warm gold foil geometric border. Fitted with 30mm double-faced satin ribbon handles. The pinnacle of holiday and haute couture packaging.',
    price: 49.00,
    discount_price: 42.00,
    discount_percent: 14,
    gsm: 280,
    handle_type: 'Double-Faced Satin Ribbon Handle',
    material: '280 GSM Solid Bleached Sulfate (SBS) Board',
    dimensions: '35cm x 26cm x 13cm',
    load_capacity: '14 kg',
    moq: 25,
    stock: 3200,
    ratings: 5.0,
    num_reviews: 62,
    is_featured: true,
    is_bestseller: false,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Foil Stamp', 'Emerald Green', 'Satin Ribbon', 'Luxury', 'Prestige'],
    bulk_pricing: [
      { minQty: 25, pricePerUnit: 42.00 },
      { minQty: 100, pricePerUnit: 36.00 },
      { minQty: 500, pricePerUnit: 29.50 },
      { minQty: 2000, pricePerUnit: 23.50 }
    ]
  },
  {
    name: 'Block-Bottom SOS Food Delivery Takeout Carrier',
    slug: 'block-bottom-sos-food-takeout-carrier',
    category: 'Food & Bakery',
    description: 'Square-bottom self-opening sack (SOS) with broad rectangular base designed specifically to keep takeaway food containers, bento boxes, and beverage trays completely flat and stable without tipping during transit.',
    price: 14.00,
    discount_price: 11.50,
    discount_percent: 18,
    gsm: 90,
    handle_type: 'Reinforced Flat External Paper Handle',
    material: '100% Virgin High-Wet-Strength Kraft',
    dimensions: '30cm x 28cm x 18cm (Extra Wide Gusset)',
    load_capacity: '9 kg',
    moq: 100,
    stock: 28000,
    ratings: 4.8,
    num_reviews: 310,
    is_featured: false,
    is_bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Takeout', 'Food Delivery', 'Wide Bottom', 'Spill-Proof', 'Restaurant'],
    bulk_pricing: [
      { minQty: 100, pricePerUnit: 11.50 },
      { minQty: 500, pricePerUnit: 9.20 },
      { minQty: 2500, pricePerUnit: 7.40 },
      { minQty: 10000, pricePerUnit: 5.60 }
    ]
  },
  {
    name: 'Vintage Chevron Stripe Confectionery Paper Bag',
    slug: 'vintage-chevron-stripe-confectionery-bag',
    category: 'Fashion & Events',
    description: 'Charming retro zig-zag chevron printed flat bag with classic serrated zigzag top trim. Printed with odorless, water-based food-safe soy inks. Ideal for artisan chocolates, cookies, wedding favors, and boutique greeting card packaging.',
    price: 9.50,
    discount_price: 7.60,
    discount_percent: 20,
    gsm: 70,
    handle_type: 'Flat Pinch Bottom (No Handle)',
    material: 'Bleached Kraft + Soy-Based Inks',
    dimensions: '18cm x 13cm',
    load_capacity: '1.5 kg',
    moq: 100,
    stock: 22000,
    ratings: 4.7,
    num_reviews: 84,
    is_featured: false,
    is_bestseller: false,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Vintage', 'Chevron', 'Sweets & Candy', 'Gifts', 'Soy Ink'],
    bulk_pricing: [
      { minQty: 100, pricePerUnit: 7.60 },
      { minQty: 500, pricePerUnit: 5.80 },
      { minQty: 2000, pricePerUnit: 4.50 },
      { minQty: 10000, pricePerUnit: 3.20 }
    ]
  },
  {
    name: 'Scandinavian Raw-Edge Tote with Braided Jute Handle',
    slug: 'scandinavian-raw-edge-jute-handle-tote',
    category: 'Retail & Shopping',
    description: 'Minimalist Nordic aesthetic shopper with unbleached natural raw-cut top hem and sturdy 8mm thick braided golden jute twine handles. Provides an organic, earthy tactile experience that resonates with eco-conscious lifestyle shoppers.',
    price: 32.00,
    discount_price: 26.50,
    discount_percent: 17,
    gsm: 240,
    handle_type: '8mm Braided Golden Jute Twine',
    material: 'Heavy Unbleached Swedish Kraft Paper',
    dimensions: '34cm x 26cm x 12cm',
    load_capacity: '12 kg',
    moq: 25,
    stock: 7500,
    ratings: 4.9,
    num_reviews: 128,
    is_featured: true,
    is_bestseller: true,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80'
    ],
    tags: ['Nordic', 'Jute Handle', 'Raw Edge', 'Organic', 'Sustainable'],
    bulk_pricing: [
      { minQty: 25, pricePerUnit: 26.50 },
      { minQty: 100, pricePerUnit: 22.00 },
      { minQty: 500, pricePerUnit: 18.00 },
      { minQty: 2000, pricePerUnit: 14.50 }
    ]
  }
];

// Fallback in-memory store if Neon connection isn't configured yet
const inMemoryStore = {
  users: [],
  products: [...initialProducts.map((p, idx) => ({ ...p, id: idx + 1 }))],
  orders: [
    {
      id: 101,
      order_number: 'BE-2026-9812',
      customer_name: 'Sophia Laurent',
      customer_email: 'sophia@example.com',
      customer_phone: '+91 98765 43210',
      items: [
        { id: 1, name: 'Classic Brown Kraft Shopping Bag', quantity: 200, price: 12.50, image: initialProducts[0].images[0] },
        { id: 2, name: 'Luxury Matte Charcoal Boutique Bag', quantity: 50, price: 38.00, image: initialProducts[1].images[0] }
      ],
      shipping_address: {
        fullName: 'Sophia Laurent',
        phone: '+91 98765 43210',
        addressLine1: '42 Bloom Street, Boutique Row',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India'
      },
      subtotal: 4400,
      tax: 792,
      shipping_fee: 0,
      total_amount: 5192,
      payment_method: 'Online Card Payment',
      payment_status: 'Paid',
      order_status: 'Shipped',
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    },
    {
      id: 102,
      order_number: 'BE-2026-9815',
      customer_name: 'Artisan Bakery Co.',
      customer_email: 'orders@artisanbakery.com',
      customer_phone: '+91 91234 56789',
      items: [
        { id: 3, name: 'Rustic Pinch-Bottom Bakery & Pastry Bag', quantity: 1000, price: 4.90, image: initialProducts[2].images[0] }
      ],
      shipping_address: {
        fullName: 'Chef Marco',
        phone: '+91 91234 56789',
        addressLine1: '18 Sourdough Lane, French Quarter',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        country: 'India'
      },
      subtotal: 4900,
      tax: 882,
      shipping_fee: 0,
      total_amount: 5782,
      payment_method: 'UPI / Direct Transfer',
      payment_status: 'Paid',
      order_status: 'Processing',
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
    }
  ],
  quotes: []
};

// Initialize Admin & Demo users in memory
(async () => {
  const adminHash = await bcrypt.hash('admin123', 10);
  const userHash = await bcrypt.hash('demo123', 10);
  inMemoryStore.users.push(
    {
      id: 1,
      name: 'Store Administrator',
      email: 'admin@bagexpress.com',
      password: adminHash,
      role: 'admin',
      phone: '+91 99999 00000',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Mayank Rajput',
      email: 'demo@bagexpress.com',
      password: userHash,
      role: 'user',
      phone: '+91 98765 12345',
      created_at: new Date().toISOString()
    }
  );
})();

const connectNeon = async () => {
  const dbUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!dbUrl) {
    console.log('ℹ️  No DATABASE_URL found in .env. Running on fast in-memory PostgreSQL emulator with full seed.');
    return null;
  }

  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: {
        rejectUnauthorized: false
      }
    });

    const client = await pool.connect();
    console.log('✅ Connected to Neon Serverless PostgreSQL database successfully!');

    // Create Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        phone VARCHAR(30),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        price NUMERIC(10, 2) NOT NULL,
        discount_price NUMERIC(10, 2),
        discount_percent INT DEFAULT 0,
        gsm INT DEFAULT 120,
        handle_type VARCHAR(100),
        material VARCHAR(100),
        dimensions VARCHAR(100),
        load_capacity VARCHAR(100),
        moq INT DEFAULT 50,
        stock INT DEFAULT 1000,
        ratings NUMERIC(3, 1) DEFAULT 4.8,
        num_reviews INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT false,
        is_bestseller BOOLEAN DEFAULT false,
        images JSONB,
        tags JSONB,
        bulk_pricing JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        customer_name VARCHAR(100) NOT NULL,
        customer_email VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(30),
        items JSONB NOT NULL,
        shipping_address JSONB NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        subtotal NUMERIC(10, 2) NOT NULL,
        tax NUMERIC(10, 2) NOT NULL,
        shipping_fee NUMERIC(10, 2) DEFAULT 0,
        payment_method VARCHAR(50) DEFAULT 'cod',
        payment_status VARCHAR(50) DEFAULT 'paid',
        order_status VARCHAR(50) DEFAULT 'Processing',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS quotes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50),
        bag_type VARCHAR(100),
        quantity INT,
        print_colors VARCHAR(50),
        notes TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default admin and products if empty
    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) === 0) {
      const adminHash = await bcrypt.hash('admin123', 10);
      const userHash = await bcrypt.hash('demo123', 10);
      await client.query(`
        INSERT INTO users (name, email, password, role, phone) VALUES
        ('Store Administrator', 'admin@bagexpress.com', $1, 'admin', '+91 99999 00000'),
        ('Mayank Rajput', 'demo@bagexpress.com', $2, 'user', '+91 98765 12345')
      `, [adminHash, userHash]);
      console.log('🌱 Seeded default admin and demo user into Neon Postgres.');
    }

    const prodCheck = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(prodCheck.rows[0].count) === 0) {
      for (const p of initialProducts) {
        await client.query(`
          INSERT INTO products (
            name, slug, category, description, price, discount_price, discount_percent,
            gsm, handle_type, material, dimensions, load_capacity, moq, stock,
            ratings, num_reviews, is_featured, is_bestseller, images, tags, bulk_pricing
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        `, [
          p.name, p.slug, p.category, p.description, p.price, p.discount_price, p.discount_percent,
          p.gsm, p.handle_type, p.material, p.dimensions, p.load_capacity, p.moq, p.stock,
          p.ratings, p.num_reviews, p.is_featured, p.is_bestseller,
          JSON.stringify(p.images), JSON.stringify(p.tags), JSON.stringify(p.bulk_pricing)
        ]);
      }
      console.log('🌱 Seeded 12 rich paper bag products into Neon Postgres.');
    }

    client.release();
    return pool;
  } catch (err) {
    console.error('⚠️  Failed to connect to Neon PostgreSQL:', err.message);
    console.log('ℹ️  Falling back to high-fidelity in-memory persistence.');
    return null;
  }
};

module.exports = {
  connectNeon,
  getPool: () => pool,
  inMemoryStore,
  initialProducts
};

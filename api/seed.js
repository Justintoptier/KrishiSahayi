const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

// ── Models ──────────────────────────────────────────────
const User = require("./models/UserModel");
const Category = require("./models/CategoryModel");
const FarmerProfile = require("./models/FarmerProfileModel");
const Product = require("./models/ProductModel");
const Order = require("./models/OrderModel");
const Message = require("./models/MessageModel");

// ── Connect ──────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected for seeding"))
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });

// ── Seed Data ────────────────────────────────────────────
const seed = async () => {
  try {
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany();
    await Category.deleteMany();
    await FarmerProfile.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Message.deleteMany();

    // ── 1. Categories ──
    console.log("🌿 Seeding categories...");
    const categories = await Category.insertMany([
      { name: "Vegetables",  description: "Fresh farm vegetables",     icon: "🥦" },
      { name: "Fruits",      description: "Seasonal fresh fruits",      icon: "🍎" },
      { name: "Grains",      description: "Rice, wheat, pulses",        icon: "🌾" },
      { name: "Dairy",       description: "Milk, ghee, eggs",           icon: "🥛" },
      { name: "Herbs",       description: "Fresh herbs and spices",     icon: "🌿" },
      { name: "Honey",       description: "Raw and organic honey",      icon: "🍯" },
    ]);

    // ── 2. Users ──
    console.log("👤 Seeding users...");
    const hashedPassword = await bcrypt.hash("password123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@kisanbazar.com",
      password: hashedPassword,
      role: "admin",
      phone: "9000000000",
      address: { street: "1 Admin Lane", city: "Mumbai", state: "Maharashtra", zipCode: "400001" },
    });

    const farmer1 = await User.create({
      name: "Kumaravel",
      email: "Kumaravel@gmail.com",
      password: hashedPassword,
      role: "farmer",
      phone: "9111111111",
      address: { street: "Kovilpathagai", city: "Chennai", state: "TamilNadu", zipCode: "600054" },
    });

    const farmer2 = await User.create({
      name: "Manikandan",
      email: "manikandan@gmail.com",
      password: hashedPassword,
      role: "farmer",
      phone: "9222222222",
      address: { street: "Kovilpathagai", city: "Chennai", state: "TamilNadu", zipCode: "600054" },
    });

    const farmer3 = await User.create({
      name: "Kavita Nair",
      email: "kavita@kisanbazar.com",
      password: hashedPassword,
      role: "farmer",
      phone: "9333333333",
      address: { street: "Avadi", city: "Chennai", state: "TamilNadu", zipCode: "600054" },
    });

    const consumer1 = await User.create({
      name: "Priya Menon",
      email: "priya@example.com",
      password: hashedPassword,
      role: "consumer",
      phone: "9444444444",
      address: { street: "Avadi", city: "Chennai", state: "TamilNadu", zipCode: "600054" },
    });

    const consumer2 = await User.create({
      name: "Arjun Sharma",
      email: "arjun@example.com",
      password: hashedPassword,
      role: "consumer",
      phone: "9555555555",
      address: { street: "Kovilpathagai", city: "Chennai", state: "TamilNadu", zipCode: "600054" },
    });

    // ── 3. Farmer Profiles ──
    console.log("🚜 Seeding farmer profiles...");
    await FarmerProfile.insertMany([
      {
        user: farmer1._id,
        farmName: "Kumaravel Organic Farms",
        description: "Three-generation family farm specialising in heirloom tomatoes and exotic vegetables grown on rich volcanic soil in Chennai.",
        farmingPractices: ["Organic", "Pesticide-Free", "Drip Irrigation"],
        establishedYear: 1998,
        socialMedia: { instagram: "@patelorganicfarms" },
        businessHours: {
          monday:    { open: "07:00", close: "18:00" },
          tuesday:   { open: "07:00", close: "18:00" },
          wednesday: { open: "07:00", close: "18:00" },
          thursday:  { open: "07:00", close: "18:00" },
          friday:    { open: "07:00", close: "18:00" },
          saturday:  { open: "07:00", close: "14:00" },
          sunday:    { open: "closed", close: "closed" },
        },
        acceptsPickup: true, acceptsDelivery: true, deliveryRadius: 50, isVerified: true,
      },
      {
        user: farmer2._id,
        farmName: "Manikandan Golden Grains",
        description: "Premium basmati rice and organic pulses grown in the fertile fields of Punjab using traditional methods passed down for generations.",
        farmingPractices: ["Traditional", "Low Pesticide", "Crop Rotation"],
        establishedYear: 2003,
        socialMedia: { facebook: "SinghGoldenGrains" },
        businessHours: {
          monday:    { open: "06:00", close: "17:00" },
          tuesday:   { open: "06:00", close: "17:00" },
          wednesday: { open: "06:00", close: "17:00" },
          thursday:  { open: "06:00", close: "17:00" },
          friday:    { open: "06:00", close: "17:00" },
          saturday:  { open: "06:00", close: "12:00" },
          sunday:    { open: "closed", close: "closed" },
        },
        acceptsPickup: true, acceptsDelivery: false, deliveryRadius: 0, isVerified: true,
      },
      {
        user: farmer3._id,
        farmName: "Nair Forest Farm",
        description: "Deep in the Western Ghats, we harvest wild honey and grow potent moringa, herbs, and spices sustainably with tribal communities.",
        farmingPractices: ["Wild Harvest", "Organic", "Tribal Partnership"],
        establishedYear: 2012,
        socialMedia: { instagram: "@nairforestfarm" },
        businessHours: {
          monday:    { open: "08:00", close: "17:00" },
          tuesday:   { open: "08:00", close: "17:00" },
          wednesday: { open: "08:00", close: "17:00" },
          thursday:  { open: "08:00", close: "17:00" },
          friday:    { open: "08:00", close: "17:00" },
          saturday:  { open: "08:00", close: "17:00" },
          sunday:    { open: "closed", close: "closed" },
        },
        acceptsPickup: false, acceptsDelivery: true, deliveryRadius: 100, isVerified: false,
      },
    ]);

    // ── 4. Products (with images!) ──
    console.log("🛒 Seeding products...");
    const products = await Product.insertMany([
      {
        farmer: farmer1._id,
        name: "Heirloom Tomatoes",
        description: "Sun-ripened heirloom tomatoes bursting with flavour. Grown without pesticides on volcanic soil.",
        category: categories[0]._id,
        price: 80, unit: "kg", quantityAvailable: 200,
        images: ["https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80"],
        isOrganic: true, isFeatured: true, isActive: true,
        harvestDate: new Date("2024-11-01"),
        availableUntil: new Date("2025-12-31"),
      },
      {
        farmer: farmer1._id,
        name: "Purple Broccoli",
        description: "Nutrient-dense purple broccoli grown in cool conditions. Rich colour, exceptional taste.",
        category: categories[0]._id,
        price: 60, unit: "bunch", quantityAvailable: 80,
        images: ["https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80"],
        isOrganic: true, isFeatured: false, isActive: true,
      },
      {
        farmer: farmer1._id,
        name: "Dragon Fruit",
        description: "Vibrant pink dragon fruit fresh from our trellised farms in Chennai.",
        category: categories[1]._id,
        price: 120, unit: "piece", quantityAvailable: 150,
        images: ["https://images.unsplash.com/photo-1527325678964-54921661f888?w=400&q=80"],
        isOrganic: false, isFeatured: true, isActive: true,
      },
      {
        farmer: farmer2._id,
        name: "Basmati Rice",
        description: "Long-grain aromatic basmati with rich fragrance and fluffy texture. Aged for 1 year.",
        category: categories[2]._id,
        price: 120, unit: "kg", quantityAvailable: 500,
        images: ["https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&q=80"],
        isOrganic: false, isFeatured: true, isActive: true,
      },
      {
        farmer: farmer2._id,
        name: "Toor Dal",
        description: "Unpolished, naturally grown split pigeon peas with earthy aroma. High protein.",
        category: categories[2]._id,
        price: 95, unit: "kg", quantityAvailable: 300,
        images: ["https://images.unsplash.com/photo-1612257416648-59a48e20a5f5?w=400&q=80"],
        isOrganic: true, isFeatured: false, isActive: true,
      },
      {
        farmer: farmer3._id,
        name: "Raw Forest Honey",
        description: "Unprocessed wild forest honey harvested by tribal communities in the Western Ghats.",
        category: categories[5]._id,
        price: 290, unit: "500g", quantityAvailable: 60,
        images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80"],
        isOrganic: true, isFeatured: true, isActive: true,
      },
      {
        farmer: farmer3._id,
        name: "Moringa Powder",
        description: "Sun-dried and stone-ground moringa leaves. Pure superfood, no additives.",
        category: categories[4]._id,
        price: 95, unit: "100g", quantityAvailable: 120,
        images: ["https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=400&q=80"],
        isOrganic: true, isFeatured: false, isActive: true,
      },
      {
        farmer: farmer3._id,
        name: "Kashmiri Saffron",
        description: "Authentic Mongra saffron with deep aroma. GI tagged, hand-picked at dawn.",
        category: categories[4]._id,
        price: 450, unit: "1g", quantityAvailable: 40,
        images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"],
        isOrganic: true, isFeatured: true, isActive: true,
      },
    ]);

    // ── 5. Orders ──
    console.log("📦 Seeding orders...");
    const order1 = await Order.create({
      consumer: consumer1._id, farmer: farmer1._id,
      items: [
        { product: products[0]._id, quantity: 2, price: 80 },
        { product: products[2]._id, quantity: 3, price: 120 },
      ],
      totalAmount: 520, status: "completed", paymentMethod: "cash",
      deliveryDetails: {
        address: { street: "12 MG Road", city: "Bangalore", state: "Karnataka", zipCode: "560001" },
        date: new Date("2024-11-10"), time: "10:00 AM",
      },
      notes: "Please pack carefully.",
    });

    const order2 = await Order.create({
      consumer: consumer2._id, farmer: farmer2._id,
      items: [{ product: products[3]._id, quantity: 5, price: 120 }],
      totalAmount: 600, status: "pending", paymentMethod: "bank_transfer",
      pickupDetails: {
        date: new Date("2024-11-15"), time: "09:00 AM",
        location: "Singh Golden Grains Farm, Amritsar",
      },
    });

    // ── 6. Messages ──
    console.log("💬 Seeding messages...");
    await Message.insertMany([
      {
        sender: consumer1._id, receiver: farmer1._id,
        content: "Hi Ramesh, are the heirloom tomatoes available this week?",
        relatedOrder: order1._id, isRead: true,
      },
      {
        sender: farmer1._id, receiver: consumer1._id,
        content: "Yes! Freshly harvested yesterday. I can deliver by Thursday.",
        relatedOrder: order1._id, isRead: true,
      },
      {
        sender: consumer2._id, receiver: farmer2._id,
        content: "Can I get 10kg of basmati rice? Do you offer bulk discounts?",
        relatedOrder: order2._id, isRead: false,
      },
    ]);

    console.log("");
    console.log("✅ Database seeded successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔑 Test Login Credentials (all passwords: password123)");
    console.log("   Admin    → admin@kisanbazar.com");
    console.log("   Farmer 1 → ramesh@kisanbazar.com");
    console.log("   Farmer 2 → gurpreet@kisanbazar.com");
    console.log("   Farmer 3 → kavita@kisanbazar.com");
    console.log("   Consumer → priya@example.com");
    console.log("   Consumer → arjun@example.com");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();

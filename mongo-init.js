// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the nanuk database
db = db.getSiblingDB('nanuk');

// Create collections
db.createCollection('inquiries');
db.createCollection('products');
db.createCollection('users');

// Insert sample data for products (optional)
db.products.insertMany([
  {
    _id: ObjectId(),
    name: 'Waterproof Case WL-001',
    category: 'Waterproof Cases',
    description: 'Professional waterproof case with IP67 rating',
    features: ['Waterproof', 'Dustproof', 'Impact Resistant'],
    specifications: {
      dimensions: '400 x 300 x 150 mm',
      weight: '2.5 kg',
      material: 'High-impact ABS plastic',
      protection: 'IP67'
    },
    images: ['/images/products/wl-001-1.jpg'],
    price: 89.99,
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Tool Case WL-002',
    category: 'Tool Cases',
    description: 'Heavy-duty tool case for professional use',
    features: ['Shock Resistant', 'Customizable Foam', 'Secure Latches'],
    specifications: {
      dimensions: '500 x 350 x 200 mm',
      weight: '3.2 kg',
      material: 'Reinforced polypropylene',
      protection: 'IP65'
    },
    images: ['/images/products/wl-002-1.jpg'],
    price: 129.99,
    inStock: true,
    featured: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: ObjectId(),
    name: 'Equipment Case WL-003',
    category: 'Equipment Cases',
    description: 'Large equipment case for sensitive instruments',
    features: ['Climate Control', 'Anti-Static', 'Pressure Relief'],
    specifications: {
      dimensions: '600 x 400 x 250 mm',
      weight: '4.1 kg',
      material: 'Military-grade polymer',
      protection: 'IP68'
    },
    images: ['/images/products/wl-003-1.jpg'],
    price: 199.99,
    inStock: true,
    featured: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create indexes for better performance
db.inquiries.createIndex({ "email": 1 });
db.inquiries.createIndex({ "createdAt": -1 });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "featured": 1 });
db.products.createIndex({ "name": "text", "description": "text" });

// Create a user for the application (optional)
db.createUser({
  user: 'nanuk_app',
  pwd: 'nanuk_password',
  roles: [
    {
      role: 'readWrite',
      db: 'nanuk'
    }
  ]
});

print('Database initialization completed successfully!');
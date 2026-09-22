import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import Users, { User } from '../src/models/User';
import Products, { Product } from '../src/models/Product';

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  const opts = { bufferCommands: false };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  if (conn.connection.db === undefined) {
    throw new Error('Could not connect');
  }

  // 1. Limpiamos la base de datos
  await conn.connection.db.dropDatabase();

  // 2. Insertamos productos de prueba
  const products: Product[] = [
    {
      name: 'Earthen Bottle',
      price: 39.95,
      img: '/img/ecommerce-images/image-card-01.jpg',
      description: 'What a bottle!',
    },
    {
      name: 'Nomad Tumbler',
      price: 39.95,
      img: '/img/ecommerce-images/image-card-02.jpg',
      description: 'Yet another item',
    },
  ];
  
  const insertedProducts = await Products.insertMany(products);

  // 3. Insertamos un usuario con productos en su carrito
  const user: User = {
    email: 'johndoe@example.com',
    password: '1234',
    name: 'John',
    surname: 'Doe',
    address: '123 Main St, 12345 New York, United States',
    birthdate: new Date('1970-01-01'),
    cartItems: [
      {
        product: insertedProducts[0]._id as Types.ObjectId,
        qty: 2,
      },
      {
        product: insertedProducts[1]._id as Types.ObjectId,
        qty: 5,
      },
    ],
    orders: [],
  };

  const res = await Users.create(user);
  console.log(JSON.stringify(res, null, 2));

  await conn.disconnect();
}

seed().catch(console.error);
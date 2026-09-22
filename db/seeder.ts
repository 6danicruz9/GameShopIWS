import dotenv from 'dotenv';
import mongoose from 'mongoose';
// Importaremos los modelos más adelante

dotenv.config({ path: `.env.local`, override: true });
const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  const opts = { bufferCommands: false };
  const conn = await mongoose.connect(MONGODB_URI, opts);

  if (conn.connection.db === undefined) {
    throw new Error('Could not connect');
  }

  await conn.connection.db.dropDatabase();
  
  // Aquí insertaremos los usuarios y productos en el siguiente paso

  await conn.disconnect();
}

seed().catch(console.error);
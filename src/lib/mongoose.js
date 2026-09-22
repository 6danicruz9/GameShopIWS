import mongoose from 'mongoose';

async function connect() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // Si ya hay una conexión abierta, la reutilizamos
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  
  // Como ya hemos comprobado que MONGODB_URI existe arriba, TypeScript ya no da error aquí
  return mongoose.connect(MONGODB_URI);
}

export default connect;
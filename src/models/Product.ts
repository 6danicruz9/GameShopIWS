import mongoose, { Schema } from 'mongoose';

// Definición de la interfaz
export interface Product {
  name: string;
  description: string;
  img: string;
  price: number;
}

// Definición del esquema
const ProductSchema = new Schema<Product>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true, // Asumimos que es obligatorio para la tienda
  },
  img: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Exportación del modelo
export default mongoose.models.Product as mongoose.Model<Product> || mongoose.model<Product>('Product', ProductSchema);
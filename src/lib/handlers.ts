import Products, { Product } from '@/models/Product';
import Users, { User } from '@/models/User';
import connect from '@/lib/mongoose';
import { Types } from 'mongoose';

export interface GetProductsResponse {
  products: (Product & { _id: Types.ObjectId })[];
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface CreateUserResponse {
  _id: Types.ObjectId;
}

export interface GetUserResponse extends Pick<User, 'email' | 'name' | 'surname' | 'address' | 'birthdate'> {
  _id: Types.ObjectId;
}

// Handler para obtener productos
export async function getProducts(): Promise<GetProductsResponse> {
  await connect();
  const productsProjection = { __v: false };
  const products = await Products.find({}, productsProjection);
  
  return {
    // Usamos 'as any' o una aserción para cuadrar los tipos de Mongoose con la interfaz
    products: products as unknown as (Product & { _id: Types.ObjectId })[],
  };
}

// Handler para crear usuario
export async function createUser(user: {
  email: string;
  password: string;
  name: string;
  surname: string;
  address: string;
  birthdate: Date;
}): Promise<CreateUserResponse | null> {
  await connect();
  const prevUser = await Users.find({ email: user.email });
  
  if (prevUser.length !== 0) {
    return null; // El usuario ya existe
  }

  const doc: User = {
    ...user,
    birthdate: new Date(user.birthdate),
    cartItems: [],
    orders: [],
  };

  const newUser = await Users.create(doc);
  return {
    _id: newUser._id as Types.ObjectId,
  };
}

// Handler para obtener un usuario por ID
export async function getUser(userId: Types.ObjectId | string): Promise<GetUserResponse | null> {
  await connect();
  
  const userProjection = {
    email: true,
    name: true,
    surname: true,
    address: true,
    birthdate: true,
  };

  const user = await Users.findById(userId, userProjection);
  return user as GetUserResponse | null;
}
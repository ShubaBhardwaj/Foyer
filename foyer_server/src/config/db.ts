import mongoose from "mongoose";
import { env } from "./env";

const DBConnect = async () => {
  await mongoose.connect(env.MONGO_DB_URI);
  console.log(`MongoDB connected`);
};

export default DBConnect;

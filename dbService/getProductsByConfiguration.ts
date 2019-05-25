import { Product } from "./types";
import fakeProducts from "./fakeProducts";

type GetProductsByConfiguration = {
  name: string | null;
  // ... other configuration
};
const getProductsByConfiguration = async (args: GetProductsByConfiguration) => {
  return fakeProducts as Product[];
};

export default getProductsByConfiguration;

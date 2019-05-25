import { Product } from "./types";
import getProducts from "./getProducts";
import getConsultantById from "./getConsultantById";

async function differentProductsByConsultant(consultantId: string) {
  const consultant = getConsultantById(consultantId);
  const products = await getProducts();
  return products as Product[];
}

export default differentProductsByConsultant;

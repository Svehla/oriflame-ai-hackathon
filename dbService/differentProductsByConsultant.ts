import fakeProducts from "./fakeProducts";
import { Product } from "./types";

type DifferentProductsByConsultant = {
  consultantId: string
}
const differentProductsByConsultant = async (args: DifferentProductsByConsultant) => {
  return fakeProducts as Product[]
}


export default differentProductsByConsultant
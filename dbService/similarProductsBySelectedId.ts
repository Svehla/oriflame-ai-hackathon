import { Product } from './types'
import fakeProducts from './fakeProducts'

type SimilarProductsBySelectedId = {
  productIds: string[]
}
const similarProductsBySelectedId = async (args: SimilarProductsBySelectedId) => {
  // TODO: some magic code here 🤔
  return fakeProducts as Product[]
}


export default similarProductsBySelectedId
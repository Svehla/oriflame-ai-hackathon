import fakeProducts from './fakeProducts';
import { Product } from './types';
export { default as verifyUser } from './verifyUser'
export { default as differentProductsByConsultant } from './differentProductsByConsultant'
export { default as getProductsByConfiguration } from './getProductsByConfiguration'
export { default as similarProductsBySelectedId } from './similarProductsBySelectedId'


export const getProductsByIds = async (args: string[]) => {
  return fakeProducts as Product[]
}


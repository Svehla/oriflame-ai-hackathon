import { Product } from './types'
import fakeProducts from './fakeProducts'
import * as sql from "mssql"
import config from "config"

type SimilarProductsBySelectedId = {
  productIds: string[]
}
const similarProductsBySelectedId = async (args: SimilarProductsBySelectedId): Promise<Product[]> => {
  // TODO: some magic code here 🤔
  const pool = await sql.connect(config.get("DATABASE"));

  const productsByIdsResult = await pool.request().query(`
    SELECT
      TOP(100) *
      FROM PRODUCTS
    WHERE prod_cd IN (${args.productIds.map(productId => `'${productId}'`).join(',')})
  `);

  const productsByIds = productsByIdsResult.recordset

  const similarProducts = await pool.request().query(`
    SELECT
      TOP(5) *
      FROM PRODUCTS
    WHERE category_descr IN (${productsByIds.map(({ category_descr }) => `'${ category_descr}'`).join(',')})
    `
  );
  
  sql.close();

  return similarProducts.recordset.map(product => ({
    id: product.prod_cd,
    name: product.prod_descr,
    thumbnailUrl: product.thumbnail_url,
    imageUrl: product.image_url,
  }))
}


export default similarProductsBySelectedId
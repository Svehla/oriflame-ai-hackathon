import { Product } from "./types"
import * as sql from "mssql"
import config from "config"
import * as R from 'ramda'

export const getProductsByIds = async (productIds: string[]): Promise<Product[]> => {
  
  const pool = await sql.connect(config.get("DATABASE"));

  const productsByIdsResult = await pool.request().query(`
    SELECT
      TOP(100) *
      FROM PRODUCTS
    WHERE prod_cd IN (${productIds.map(productId => `'${productId}'`).join(',')})
  `);
  
  sql.close();

  return productsByIdsResult.recordset.map(product => ({
    id: product.prod_cd,
    name: product.prod_descr,
    thumbnailUrl: product.thumbnail_url,
    imageUrl: product.image_url,
  }))
}

export default getProductsByIds

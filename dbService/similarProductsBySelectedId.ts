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

  const sqlQuery = `
  SELECT
    TOP(5) *
    FROM PRODUCTS
  WHERE
    category_descr IN (${ productsByIds.map(({ category_descr }) => `'${ category_descr}'`).join(',')})
    
    AND thumbnail_url <> ''
    AND image_url <> ''
  ORDER BY newid()
  `
  

  // AND price_segment_desc IN (${ productsByIds.map(({ price_segment_desc }) => `'${price_segment_desc}'`).join(',')})

  const similarProducts = await pool.request().query(sqlQuery);
  
  sql.close();

  return similarProducts.recordset.map(product => ({
    id: product.prod_cd,
    name: product.prod_descr,
    thumbnailUrl: product.thumbnail_url,
    imageUrl: product.image_url,
  }))
}


export default similarProductsBySelectedId
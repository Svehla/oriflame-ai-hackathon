import { Product } from "./types"
import fakeProducts from "./fakeProducts"
import * as sql from "mssql"
import config from "config"
import * as R from 'ramda'

type GetProductsByConfiguration = {
  color: string | null
  category: string | null
  product_name: string | null
  sector: string | null
  segment: string | null
  brand: string | null
  subbrand: string | null
  type: string | null
  team_category: string | null
  price_segment: string | null
};

const getProductsByConfiguration = async (args: GetProductsByConfiguration) => {
  // return fakeProducts as Product[];


  const pool = await sql.connect(config.get("DATABASE"));
  
  const differentProducts = await pool.request().query(`
    SELECT
      TOP(5) *
      FROM PRODUCTS
    WHERE thumbnail_url <> ''
      AND image_url <> ''
      ${!R.isNil(args.color) ? `AND color = '${args.color}'` : ''}
      ${!R.isNil(args.category) ? `AND category_desc = '${args.category}'` : ''}
      ${!R.isNil(args.product_name) ? `AND prod_descr = '${args.product_name}'` : ''}
      ${!R.isNil(args.sector) ? `AND sector_descr = '${args.sector}'` : ''}
      ${!R.isNil(args.segment) ? `AND segment_descr = '${args.segment}'` : ''}
      ${!R.isNil(args.brand) ? `AND brand_descr = '${args.brand}'` : ''}
      ${!R.isNil(args.subbrand) ? `AND subbrand_descr = '${args.subbrand}'` : ''}
      ${!R.isNil(args.type) ? `AND type_descr = '${args.type}'` : ''}
      ${!R.isNil(args.price_segment) ? `AND price_segment_desc = '${args.price_segment}'` : ''}
    ORDER BY RAND()
  `);

  sql.close();


  return differentProducts.recordset.map(product => ({
    id: product.prod_cd,
    name: product.prod_descr,
    thumbnailUrl: product.thumbnail_url,
    imageUrl: product.image_url,
  }))

};

export default getProductsByConfiguration;

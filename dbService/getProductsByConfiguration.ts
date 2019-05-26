import { Product } from "./types"
import fakeProducts from "./fakeProducts"
import * as sql from "mssql"
import config from "config"

type GetProductsByConfiguration = {
  name: string | null
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
      -- WHERE name
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

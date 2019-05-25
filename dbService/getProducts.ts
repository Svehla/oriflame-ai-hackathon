import config from "config";
import { Product } from "./types";
const sql = require("mssql");

const createProductFromServerModel = (serverModel: any) => {
  const product: Product = {
    id: serverModel.prod_cd,
    name: serverModel.prod_descr,
    thumbnailUrl: serverModel.thumbnail_url,
    imageUrl: serverModel.image_url
  };

  return product;
};

async function getProducts() {
  try {
    const pool = await sql.connect(config.get("DATABASE"));
    const result = await pool
      .request()
      .query(`SELECT * FROM [dbo].PRODUCTS WHERE image_url != ''`);

    sql.close();

    return result.recordsets[0].map(createProductFromServerModel);
  } catch (e) {
    sql.close();
    console.log(e);
  }
}

export default getProducts;

import config from "config";
const sql = require("mssql");

async function getProducts() {
  try {
    const pool = await sql.connect(config.get("DATABASE"));
    const result = await pool
      .request()
      .query(`SELECT * FROM [dbo].PRODUCTS WHERE image_url != ''`);

    sql.close();

    return result.
  } catch (e) {
    sql.close();
    console.log(e);
  }
}

export default getProducts;

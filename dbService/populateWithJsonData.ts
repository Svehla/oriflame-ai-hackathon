import config from "config";

const fs = require("fs");
const sql = require("mssql");

(async function populate() {
  console.log("Starting script.");

  const jsonFileName = "/products.json";
  const productsRaw = fs.readFileSync(__dirname + jsonFileName);
  const products = JSON.parse(productsRaw);

  for (const product of products.ProductsCollection) {
    const { ThumbnailUrl, ImageUrl, ProductCode } = product;

    if (!ThumbnailUrl || !ImageUrl || !ProductCode) {
      continue;
    }

    try {
      console.log(`Processing product with code: ${ProductCode}`);

      const pool = await sql.connect(config.get("DATABASE"));
      const result = await pool
        .request()
        .query(
          `UPDATE [dbo].PRODUCTS SET thumbnail_url='${ThumbnailUrl}', image_url='${ImageUrl}' WHERE prod_cd='${ProductCode}'`
        );

      sql.close();
    } catch (e) {
      sql.close();
      console.log(e);
    }
  }
})();

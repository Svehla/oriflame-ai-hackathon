import { Product } from "./types";
import getProducts from "./getProducts";
import getConsultantById from "./getConsultantById"
import config from "config"
import * as sql from "mssql"


// ===========================================================
// ===========================================================
// ===========================================================
type Consultant = {
  consultantId: string
  alreadySelectedItems: string[]
  // gender: "F"|"M"
  // city: string
  // birthDate: string
  // recruitDate: string
};

const createConsultantFromServerModel = (serverModel: any) => {
  const consultant: Consultant = {
    gender: serverModel.GENDER,
    city: serverModel.city,
    birthDate: serverModel.BIRTH_DATE,
    recruitDate: serverModel.RECRUIT_DATE
  };

  return consultant;
};

type findSimilarConsultantsArgs = {
  constulantId: string
}
async function findSimilarConsultants(currentConsultant: findSimilarConsultantsArgs) {
  const { gender, city, recruitDate, birthDate } = currentConsultant;
  // PRVNICH 5 konzultantu
  // s nejblizsim birth date

  let recruitDateTresholdInDays = 30;

  try {
    const pool = await sql.connect(config.get("DATABASE"));
    const result = await pool.request().query(`
        SELECT TOP(5) * FROM CUSTOMERS
        WHERE city=${city}
        AND GENDER=${gender}
        AND convert(datetime, ${recruitDate}) < DATEADD(day, -${recruitDateTresholdInDays}, getdate()))
      `);

    if (result.recordsets[0].length === 5) {
      sql.close();
      return result.recordsets[0];
    }

    recruitDateTresholdInDays = 60;
    const resultWithIncreasedThreshold = await pool.request()
      .query(`
        SELECT TOP(5) * FROM CUSTOMERS
          WHERE city=${city}
          AND GENDER=${gender}
          AND convert(datetime, ${recruitDate}) < DATEADD(day, -${recruitDateTresholdInDays}, getdate()))
      `);

    return resultWithIncreasedThreshold.recordsets[0];
  } catch (e) {
    sql.close();
    console.log(e);
  }
}

// ===========================================================
// ===========================================================
// ===========================================================

type DifferentProductsByConsultantArgs = {
  consultantId: string
  alreadySelectedItems: string[]
}
const differentProductsByConsultant = async (args: DifferentProductsByConsultantArgs): Promise<Product[]> => {
  const consultant = await getConsultantById(args.consultantId)

  const categories = [
    'Accessories',
    'Wellness',
    'Skin Care',
    'Personal Care',
    'Other Category',
    'Colour Cosmetics',
    'Fragrances',
    'Hair Care',
  ]
  const pool = await sql.connect(config.get("DATABASE"));
  
  const differentProducts = await pool.request().query(`
    SELECT
      TOP(5) *
      FROM PRODUCTS
      WHERE category_descr = '${categories[0]}'
      AND thumbnail_url IS NOT NULL
      AND image_url IS NOT NULL
  `);

  sql.close();


  return differentProducts.recordset.map(product => ({
    id: product.prod_cd,
    name: product.prod_descr,
    thumbnailUrl: product.thumbnail_url,
    imageUrl: product.image_url,
  }))
}

export default differentProductsByConsultant;

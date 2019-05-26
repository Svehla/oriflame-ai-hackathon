import { Product } from "./types";
import getProducts from "./getProducts";
import getConsultantById from "./getConsultantById";

import config from "config";
const sql = require("mssql");

type Consultant = {
  gender: "F"|"M";
  city: string;
  birthDate: string;
  recruitDate: string;
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

async function findSimilarConsultants(currentConsultant: Consultant) {
  const { gender, city, recruitDate, birthDate } = currentConsultant;
  // PRVNICH 5 konzultantu
  // s nejblizsim birth date

  let recruitDateTresholdInDays = 30;

  try {
    const pool = await sql.connect(config.get("DATABASE"));
    const result = await pool.request().query(`SELECT TOP(5) * FROM CUSTOMERS
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
      .query(`SELECT TOP(5) * FROM CUSTOMERS
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

async function differentProductsByConsultant(consultantId: string) {
  const consultant = createConsultantFromServerModel(
    getConsultantById(consultantId)
  );

  const products = await getProducts();
  return products as Product[];
}

export default differentProductsByConsultant;

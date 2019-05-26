import config from "config"
import * as sql from "mssql"

async function getConsultantById(consultantId: string) {
  try {
    const pool = await sql.connect(config.get("DATABASE"));
    const result = await pool
      .request()
      .query(
        `SELECT * FROM [dbo].CUSTOMERS WHERE CONSULTANT_NUMBER_S = '${consultantId}'`
      );

    sql.close();

    return result.recordsets[0];
  } catch (e) {
    sql.close();
    console.log(e);
  }
}

export default getConsultantById;

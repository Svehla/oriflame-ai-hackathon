import config from "config";
const sql = require("mssql");

const verifyUser = async (consultantId: string): Promise<boolean> => {
  try {
    const pool = await sql.connect(config.get("DATABASE"));
    const result = await pool
      .request()
      .query(
        `SELECT * FROM [dbo].CUSTOMERS WHERE CONSULTANT_NUMBER_S='${consultantId}'`
      );

    sql.close();

    console.log(result)
    if (result.recordsets[0].length > 0) {
      return true;
    }
    return false;
  } catch (e) {
    sql.close();
    return false;
  }
};


export default verifyUser;

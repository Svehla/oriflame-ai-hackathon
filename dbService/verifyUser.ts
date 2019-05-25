import config from "config";
const sql = require("mssql");

const verifyUser = async (consultantId: string): Promise<boolean> => {
  try {
    const pool = await sql.connect(config.get("DATABASE"));
    const result = await pool
      .request()
      .query(
        `SELECT * FROM [dbo].CUSTOMERS WHERE CUSTOMER_ID_S='${consultantId}'`
      );

    sql.close();

    if (result.recordsets.length > 0) {
      return true;
    }
    return false;
  } catch (e) {
    sql.close();
    return false;
  }
};

export default verifyUser;

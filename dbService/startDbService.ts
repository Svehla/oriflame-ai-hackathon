
import * as sql from "mssql"
import sqlConfig from "../dbConfig"

const startDbService = () => {
  sql.connect(sqlConfig, error => {
    if (error) {
      // response.send(error);
    }

    const request = new sql.Request();

    request.query("SELECT TOP(10) * FROM [dbo].CUSTOMERS", function(
      error,
      data
    ) {
      console.log(data.recordset[0])
      // if (error) response.send(error);
      // response.send(data);
    });
  });
}

startDbService()
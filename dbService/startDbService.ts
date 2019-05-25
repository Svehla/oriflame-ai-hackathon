import config from "config";
import { Request, ConnectionPool, default as sql } from "mssql";

declare module "mssql" {
  export const connect: any;
}

const startDbService = () => {
  sql.connect(config.get("DATABASE"), (error: Error) => {
    if (error) {
      // response.send(error);
    }

    const request = new Request();

    request.query("SELECT TOP(10) * FROM [dbo].CUSTOMERS", function(
      error,
      data
    ) {
      if (!data) {
        return;
      }

      console.log(data.recordset[0]);
      // if (error) response.send(error);
      // response.send(data);
    });
  });
};

startDbService();

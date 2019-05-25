const express = require("express");
const app = express();

app.get("/", (_, response) => {
  const sql = require("mssql");
  const sqlConfig = require("./dbconfig");

  sql.connect(sqlConfig, error => {
    if (error) {
      response.send(error);
    }

    const request = new sql.Request();

    request.query("SELECT TOP(1000) * FROM [dbo].CUSTOMERS", function(
      error,
      data
    ) {
      if (error) response.send(error);
      response.send(data);
    });
  });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});

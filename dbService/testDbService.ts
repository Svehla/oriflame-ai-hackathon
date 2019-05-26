/*
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
*/
import { processTextMessage } from '../aiEngine/watson';


import {
  verifyUser,
  differentProductsByConsultant,
  getProductsByConfiguration,
  similarProductsBySelectedId,
} from './index'
const main = async () => {
  try {

    // const isUserVerified = await verifyUser('9D8671FCE')
    // console.log(lol)

    // const differentProducts = await differentProductsByConsultant({
    //   consultantId: '9D8671FCE',
    //   alreadySelectedItems: [],
    // })
    // console.log('______')
    // console.log(differentProducts)


    // const similarProducts = await similarProductsBySelectedId({
    //   productIds: ['33313', '33520', '33727']
    // })
    // console.log('______')
    // console.log(similarProducts)

    const processMessageResponse = await processTextMessage('lipstick')
    const similarProducts = await getProductsByConfiguration(processMessageResponse)
      // {
      //   name: null,
      //   color: null,
      //   category: null,
      //   product_name: null,
      //   sector: null,
      //   segment: null,
      //   brand: null,
      //   subbrand: null,
      //   type: null,
      //   team_category: null,
      //   price_segment: null,
      // }
    // )

    console.log('_________________')
    console.log(similarProducts)

  } catch(e) {
    console.log(e)
  }
}
main()
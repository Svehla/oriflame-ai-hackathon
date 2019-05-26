import { processTextMessage } from '../aiEngine/watson';

import {
  verifyUser,
  differentProductsByConsultant,
  getProductsByConfiguration,
  similarProductsBySelectedId,
  getProductsByIds,
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

    // const processMessageResponse = await processTextMessage('lipstick')
    // const similarProducts = await getProductsByConfiguration(processMessageResponse)
    // console.log('_________________')
    // console.log(similarProducts)

    // const productsByIds = await getProductsByIds(['33313', '33488'])
    // console.log('_________________')
    // console.log('productsByIds:')
    // console.log(productsByIds)

  } catch(e) {
    console.log(e)
  }
}
main()
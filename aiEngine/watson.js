const axios = require('axios');
const config = require('config');

const { API_URL, API_KEY, API_PASS, ASSISTANT_ENDPNT, WORKSPACE, API_VERSION } = config.get("AI_ENGINE")
const url = `${API_URL}/${ASSISTANT_ENDPNT}/workspaces/${WORKSPACE}/message?version=${API_VERSION}`
const auth = {
    username: API_KEY,
    password: API_PASS
}

async function sendMessage(text) {
    try {
        const response = await axios.post(url, { "input": { "text": text } }, { auth: auth })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

async function processTextMessage(text, confidenceThreshold = 0.7) {
    const resultObj = {
        "color": null,
        "category": null,
        "product_name": null,
        "sector": null,
        "segment": null,
        "brand": null,
        "subbrand": null,
        "type": null,
        "team_category": null,
        "price_segment": null,
    }
    const engineRes = await sendMessage(text)
    console.log(engineRes)
    if (engineRes.intents.length === 0 || engineRes.intents.some(intent => intent.intent !== 'recommend_products' || intent.confidence < confidenceThreshold)) {
        console.log('No intent recognized successfully.') // DEBUG
        return {}
    }
    if (engineRes.entities.length > 0) {
        console.log('Entities found.') // DEBUG
        for (const entity of engineRes.entities) {
            if (entity.confidence > confidenceThreshold) {
                resultObj[entity.entity] = entity.value
            }
        }
    }
    console.log(resultObj) // DEBUG
    return resultObj

}

// processTextMessage(" show me black lipsticks")
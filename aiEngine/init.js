const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs')
const config = require('config');

const productsJSON = require('./data/products.json');


const { API_URL, API_KEY, API_PASS, ASSISTANT_ENDPNT, WORKSPACE, API_VERSION } = config.get("AI_ENGINE")
const url = `${API_URL}/${ASSISTANT_ENDPNT}/workspaces/${WORKSPACE}/entities?version=${API_VERSION}`
const auth = {
    username: API_KEY,
    password: API_PASS
}

async function getEntities() {
    try {
        const response = await axios.get(url, { auth: auth },
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

async function postEntity(entity) {
    try {
        const response = await axios.post(url, entity, { auth: auth },
        )
        return response.data
    } catch (error) {
        console.log(error)
    }
}

function addEntity(currEntities, newEntities, entityName, entityFileName, entityData) {
    if (!currEntities.entities.some(createdEntity => createdEntity.entity === entityName) && entityData[entityFileName]) {
        const entityIndex = newEntities.findIndex(newEntity => newEntity.entity === entityName)
        const newValue = entityData[entityFileName].toLowerCase()
        if (entityIndex > -1 && !newEntities[entityIndex].values.some(entityVal => entityVal.value === newValue)) {
            newEntities[entityIndex].values.push({
                "value": newValue
            })
        } else if (entityIndex === -1) {
            newEntities.push({
                "entity": entityName,
                "values": [{
                    "value": newValue
                }]
            })
        }
    }
}

async function initEntities() {
    const entities = await getEntities();

    // Add entities from JSON file containing products
    const entityNamesJSON = {
        "colors": "Color",
    }
    const entitiesFromJSON = []
    for (const [entityName, csvName] of Object.entries(entityNamesJSON)) {
        for (const item of productsJSON.ProductsCollection) {
            addEntity(entities, entitiesFromJSON, entityName, csvName, item)
        }
    }
    for (const entity of entitiesFromJSON) {
        const response = await postEntity(entity)
        console.log(`Entity created: ${response.entity}`)
    }

    // Add entities from CSV file containing products
    const entityNamesCSV = {
        "category": "category_descr",
        "product_name": "prod_descr",
        "sector": "sector_descr",
        "segment": "segment_descr",
        "brand": "brand_descr",
        "subbrand": "subbrand_descr",
        "type": "type_descr",
        "team_category": "team_category_descr",
        "price_segment": "price_segment_desc"
    }

    try {
        const entitiesFromCSV = [];
        fs.createReadStream('aiEngine/data/products.csv')
            .pipe(csv())
            .on('data', (data) => {
                for (const [entityName, csvName] of Object.entries(entityNamesCSV)) {
                    addEntity(entities, entitiesFromCSV, entityName, csvName, data)
                }
            }).on('end', async () => {
                for (const entity of entitiesFromCSV) {
                    const response = await postEntity(entity)
                    console.log(`Entity created: ${response.entity}`)
                }
            });
    } catch (error) {
        console.log(error);
    }
}

initEntities();
import express from 'express';
import config = require("config");
import bodyParser = require('body-parser');
import {installRoutes} from "./routes";

const app = express().use(bodyParser.json());

installRoutes(app);

app.listen(config.get('PORT'), () => console.info('webhook is listening'));
import express from 'express';
import config = require("config");
import bodyParser = require('body-parser');
import {installRoutes} from "./routes";
import cors from "cors";

const app = express().use(bodyParser.json());

app.use(cors());
installRoutes(app);

app.listen(config.get('PORT'), () => console.info('webhook is listening'));
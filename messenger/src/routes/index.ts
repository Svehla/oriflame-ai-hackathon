import {Express} from "express";
import {verify} from "./verify";
import {webhookRoot} from "./webhookRoot";

export function installRoutes(app: Express) {
    app.get('/webhook', verify);
    app.post('/webhook', webhookRoot);
}
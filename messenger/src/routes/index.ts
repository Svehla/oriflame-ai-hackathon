import {Express} from "express";
import {verify} from "./verify";
import {webhookRoot} from "./webhookRoot";
import {carousel} from "./carousel";
import {refine} from "./refine";

export function installRoutes(app: Express) {
    app.get('/webhook', verify);
    app.post('/webhook', webhookRoot);

    app.get('/carousel', carousel);
    app.post('/refine', refine);
}
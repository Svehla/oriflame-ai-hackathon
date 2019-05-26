import {Express} from "express";
import {verify} from "./verify";
import {webhookRoot} from "./webhookRoot";
import {browse} from "./browse";
import {refine} from "./browse/refine";
import {update} from "./cart/update";
import {webViewTransition} from "./webViewTransition";
import {cart} from './cart';

export function installRoutes(app: Express) {
    app.get('/webhook', verify);
    app.post('/webhook', webhookRoot);

    app.post('/browse/refine', refine);
    app.get('/browse', browse);

    app.post('/cart/update', update);
    app.get('/cart', cart)

    app.post('/transition-state', webViewTransition)
}
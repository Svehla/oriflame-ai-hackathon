import {RequestHandler} from "express";
import fs from "fs";
import { getProductsByIds } from "../../../../dbService";

const template = fs.readFileSync(__dirname+'/cart.html').toString();

export const cart: RequestHandler = async (req, res) => {
    try {
        const cartItems = await getProductsByIds(JSON.parse(req.query.cart || '[]'));

        res.contentType('html');
        res.send(template.replace("<% CARTITEMS %>", JSON.stringify(cartItems)));

    } catch (e) {
        res.status(500);
        res.send(e.toString());
    }
};

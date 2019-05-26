import {RequestHandler} from "express";
import {state} from "../../UserState";

interface UpdateCartBody {
    id: string,
    cart: string[]
}

export const update: RequestHandler = async (req, res) => {
    try {
        const body: UpdateCartBody = req.body;
        const userState = state[body.id];

        userState.cart = body.cart;

        res.send({
            cart: userState.cart
        })
    } catch (e) {
        res.status(500);
        res.send(e.toString());
    }
};
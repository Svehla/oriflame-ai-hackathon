import {RequestHandler} from "express";
import {state} from "../UserState";
import {similarProductsBySelectedId} from "../../../dbService";

interface RefineBody {
    id: string,
    cart: string[],
    selection: string[],
}

export const refine: RequestHandler = async (req, res) => {
    const body: RefineBody = req.body;
    const userState = state[body.id];

    userState.selection = body.selection;
    userState.cart = body.cart;

    const nextItems = await similarProductsBySelectedId({productIds: userState.selection});

    res.send({
        items: nextItems,
        cart: userState.cart,
        selection: userState.selection
    })
};
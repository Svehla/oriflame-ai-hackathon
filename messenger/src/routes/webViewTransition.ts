import {RequestHandler} from "express";
import {state, WebViewTransitionEvent} from "../UserState";
import {similarProductsBySelectedId} from "../../../dbService";

interface TransitionBody {
    id: string,
    newState: "BROWSING" | "ORDER_BRIEF"
}

export const webViewTransition: RequestHandler = async (req, res) => {
    try {
        const body: TransitionBody = req.body;
        console.log(body);
        const userState = state[body.id];

        await userState.transition({sender: {id: body.id}, transition: {newState: body.newState}});

        res.send({})
    } catch (e) {
        res.status(500);
        res.send(e.toString());
    }
};
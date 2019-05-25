import {RequestHandler} from "express";
import {messenger, parser} from "../messaging";
import {UserState} from "../UserState";

const state: {[userId: string]: UserState} = {};

export const webhookRoot: RequestHandler = async (req, res) => {
    const body = req.body;

    // Checks this is an event from a page subscription
    if (body.object !== 'page') {
        res.sendStatus(404);
        return;
    }

    try {
        const incomingMessages = parser.parsePayload(body);

        // Iterates over each entry - there may be multiple if batched
        for (const entry of incomingMessages) {
            const senderId = entry.sender.id;

            const userState = state[senderId] || (state[senderId] = new UserState(senderId));

            await userState.transition(entry);
        }

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } catch (e) {
        res.status(500).send(JSON.stringify(e))
    }
};
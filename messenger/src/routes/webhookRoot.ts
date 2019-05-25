import {RequestHandler} from "express";
import {messenger, parser} from "../messaging";

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
            if (entry.message) {
                const text= entry.message.text;
                console.info("MESSAGE:", entry.message.text);

                await messenger.markSeen(entry.sender.id);

                await messenger.sendTextMessage(entry.sender.id, `Na ${text} ti seru, kup si radši rtěnku`);
            }
        }

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } catch (e) {
        res.status(500).send(JSON.stringify(e))
    }
}
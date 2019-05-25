import {
    BUTTON_TYPE,
    FacebookMessagePayloadMessagingEntry as Event,
    IPostbackButton,
    IURLButton
} from "fb-messenger-bot-api";
import {UserMessages} from "./messaging";
import {verifyUser} from "../../dbService";

type State = "VALIDATING" | "BROWSING" | "ORDER_BRIEF" | "DONE" ;

export class UserState {
    constructor(private userId: string) {
    }

    private messenger = new UserMessages(this.userId);

    public state: State = "VALIDATING";

    async transition(event: Event) {
        await this.messenger.markSeen();
        const transitionFunction = transitions[this.state];

        if (!transitionFunction) {
            return;
        }

        const newState = await transitionFunction(event, this.messenger);

        this.state = newState || this.state;
    }
}

const transitions: { [key: string]: (event: Event, messenger: UserMessages) => Promise<State | undefined> } = {
    "VALIDATING": async (event: Event, messenger: UserMessages) => {
        const isIntro =
            event.postback
            || (event.message && event.message.text && ["hello", "hi"].includes(event.message.text.trim().toLowerCase()));

        if (isIntro) {
            await messenger.toggleTyping(true);
            await messenger.sendTextMessage("Hello, and welcome to Oriflame. Please type in your Consultant Number to get started");
        } else if (event.message) {
            const text = event.message.text;
            if (!text) {
                return;
            }

            console.info('VERIFYING USER');
            await messenger.toggleTyping(true);
            const userId = text.trim();

            const isVerified = await verifyUser(userId).catch(_ => false);
            if (isVerified) {
                console.info('SHOW BASE PRODUCTS');
                debugger;
                await messenger.sendButtonsMessage(
                    "To help you get started, we've gathered products you're most likely to want in your first order",
                    [
                        {
                            type: "web_url",
                            url: "https://example.com",
                            title: "Begin",
                            webview_height_ratio: "compact",
                            messenger_extensions: "true",
                            fallback_url: "https://example.com/"
                        } as any,
                        {
                            type: BUTTON_TYPE.POSTBACK,
                            title: "I know what I want",
                            payload: "user-search"
                        } as IPostbackButton,
                    ]
                );
                return "BROWSING";
            } else {
                console.info('COULDN\'T VERIFY');
                await messenger.sendTextMessage(`We can't seem to find ${userId} in our list of Oriflame Consultants. Please make sure your number was correct and try entering it again`);
            }
        }
    }
};
import {FacebookMessagePayloadMessagingEntry as Event,} from "fb-messenger-bot-api";
import {UserMessages} from "./messaging";
import {differentProductsByConsultant, getProductsByConfiguration, verifyUser} from "../../dbService";
import config from "config";
import {URL} from "url";

const HOST: string = config.get("HOST");

type State = "VALIDATING" | "BROWSING" | "ORDER_BRIEF" | "DONE" ;

export class UserState {
    constructor(private userId: string) {
    }

    private messenger = new UserMessages(this.userId);

    public state: State = "VALIDATING";

    public cart: string[] = [];

    public selection: string[] = [];

    public consultantNumber: string|undefined;

    async transition(event: Event) {
        await this.messenger.markSeen();
        const transitionFunction = transitions[this.state];

        if (!transitionFunction) {
            return;
        }

        const newState = await transitionFunction(event, this.messenger, this);

        this.state = newState || this.state;
    }
}

const transitions: { [key: string]: (event: Event, messenger: UserMessages, state: UserState) => Promise<State | undefined> } = {
    "VALIDATING": async (event: Event, messenger: UserMessages, state) => {
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
            const consultantNumber = text.trim();

            const isVerified = await verifyUser(consultantNumber).catch(_ => false);
            if (isVerified) {
                state.consultantNumber = consultantNumber;

                console.info('SHOW BASE PRODUCTS');

                const url = new URL(HOST);
                url.pathname = 'carousel';
                url.searchParams.set('items', JSON.stringify(await differentProductsByConsultant({consultantId:consultantNumber})));
                url.searchParams.set('cart', '[]');
                url.searchParams.set('selection', '[]');
                url.searchParams.set('id', event.sender.id);

                await messenger.sendButtonsMessage(
                    "To help you get started, we've gathered products you're most likely to want in your first order",
                    [
                        {
                            type: "web_url",
                            url: url.href,
                            title: "Start browsing",
                            webview_height_ratio: "compact",
                            messenger_extensions: "true"
                        } as any
                    ]
                );

                setTimeout(async () => {
                    messenger.toggleTyping(true);
                    await (new Promise(r => setTimeout(r, 2000)));
                    messenger.sendTextMessage("...or type your search terms if you already know what you want")
                }, 3000);
                return "BROWSING";
            } else {
                console.info('COULDN\'T VERIFY');
                await messenger.sendTextMessage(`We can't seem to find ${consultantNumber} in our list of Oriflame Consultants. Please make sure your number was correct and try entering it again`);
            }
        }
    }
};

export const state: { [userId: string]: UserState } = {};
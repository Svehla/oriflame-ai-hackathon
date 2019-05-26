import { FacebookMessagePayloadMessagingEntry } from "fb-messenger-bot-api";
import { UserMessages } from "./messaging";
import { differentProductsByConsultant, verifyUser, getProductsByConfiguration } from "../../dbService";
import config from "config";
import { URL } from "url";
import { processTextMessage } from '../../aiEngine/watson';

const HOST: string = config.get("HOST");

type State = "VALIDATING" | "BROWSING" | "ORDER_BRIEF" | "DONE";

export interface WebViewTransitionEvent {
    sender: {
        id: string
    },
    transition: {
        newState: State
    }
}

type Event = FacebookMessagePayloadMessagingEntry & WebViewTransitionEvent;

export class UserState {
    constructor(private userId: string) {
    }

    private messenger = new UserMessages(this.userId);

    public state: State = "VALIDATING";

    public cart: string[] = [];

    public selection: string[] = [];

    public consultantNumber: string | undefined;

    async transition(event: Event) {
        await this.messenger.markSeen();
        const transitionFunction = transitions[this.state];

        if (!transitionFunction) {
            return;
        }

        try {
            const newState = await transitionFunction(event, this.messenger, this);
            this.state = newState || this.state;
        } catch (e) {
            console.error(e);
        }

    }
}

function getRandomIdx(intervalLen: number) {
    const max = Math.floor(intervalLen - 1);
    return Math.floor(Math.random() * (max - 1)); //The maximum is inclusive
}

const transitions: { [key: string]: (event: Event, messenger: UserMessages, state: UserState) => Promise<State | undefined> } = {
    "VALIDATING": async (event: Event, messenger: UserMessages, state) => {
        const welcomeMsgs = [
            "Hello, and welcome to Oriflame 👋. Please type in your Consultant Number, so I can recommend you some products.",
            "Hello! 🙋 Welcome to Oriflame. Before I show you the products, message me your Consultant Number, please."
        ]

        const isIntro =
            event.postback
            || (event.message && event.message.text && ["hello", "hi"].includes(event.message.text.trim().toLowerCase()));

        if (isIntro) {
            await messenger.toggleTyping(true);
            await messenger.sendTextMessage(welcomeMsgs[getRandomIdx(welcomeMsgs.length)]);
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
                url.pathname = 'browse';
                url.searchParams.set('items', JSON.stringify(await differentProductsByConsultant({ consultantId: consultantNumber, alreadySelectedItems: [] })));
                url.searchParams.set('cart', '[]');
                url.searchParams.set('selection', '[]');
                url.searchParams.set('id', event.sender.id);

                const startBrowsingTexts = [
                    "To help you get started, I've gathered products you could probably have in your first order 😁.",
                    "To help you with the first order, I've gathered some products that may be suitable for you and your customers 😇."
                ]

                await messenger.sendButtonsMessage(
                    startBrowsingTexts[getRandomIdx(startBrowsingTexts.length)],
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

                const textMeTexts = [
                    "...or text me what you would like me to recommend you 😉.",
                    "...or message me with what you would like me to recommend you 😉."
                ]
                setTimeout(async () => {
                    messenger.toggleTyping(true);
                    await (new Promise(r => setTimeout(r, 2000)));
                    messenger.sendTextMessage(textMeTexts[getRandomIdx(textMeTexts.length)])
                }, 3000);
                return "BROWSING";
            } else {
                console.info('COULDN\'T VERIFY');
                const notVerifiedTexts = [
                    `I couldn't find any consultant with the number ${consultantNumber} in our list 😕. Please make sure you've sent me the right number and try it again.`,
                    `I'm not able to find your number ${consultantNumber} in our list of Oriflame Consultants 😕. Please make sure you've sent me the right number and try it again.`
                ]
                await messenger.sendTextMessage(notVerifiedTexts[getRandomIdx(notVerifiedTexts.length)]);
            }
        }
    },
    "BROWSING": async (event: Event, messenger: UserMessages, state) => {
        if (event.message) {
            const message = event.message.text;
            console.info("WILL SEARCH:", message)

            const intents = await processTextMessage(message);

            if (!state.consultantNumber) {
                console.error("Invalid state: BROWSING, while consultant number not set");
                return "BROWSING";
            }

            if (Object.values(intents).every(intent => intent === null)) {
                const url = new URL(HOST);
                url.pathname = 'browse';
                url.searchParams.set('items', JSON.stringify(await differentProductsByConsultant({ consultantId: state.consultantNumber, alreadySelectedItems: state.selection })));
                url.searchParams.set('cart', JSON.stringify(state.cart));
                url.searchParams.set('selection', JSON.stringify(state.selection));
                url.searchParams.set('id', event.sender.id);

                const nothingFoundTexts = [
                    "I couldn't find what you were looking for 😔. But you can try it again and I believe I'll be more successfull this time 😉.",
                    "I wasn't able to find what you were looking for 😔. But I believe I'll be more successfull next time 😉."
                ]
                await messenger.sendButtonsMessage(
                    nothingFoundTexts[getRandomIdx(nothingFoundTexts.length)],
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
                return;
            }

            const items = await getProductsByConfiguration(intents);
            state.selection = [];

            const url = new URL(HOST);
            url.pathname = 'browse';
            url.searchParams.set('items', JSON.stringify(items));
            url.searchParams.set('cart', JSON.stringify(state.cart));
            url.searchParams.set('selection', JSON.stringify(state.selection));
            url.searchParams.set('id', event.sender.id);

            const browsingTexts = [
                "I've found some products I bet you will like 😉.",
                "Here're some products you may like 😁."
            ]
            await messenger.sendButtonsMessage(
                browsingTexts[getRandomIdx(browsingTexts.length)],
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
            return;
        }
    }
};




export const state: { [userId: string]: UserState } = {};
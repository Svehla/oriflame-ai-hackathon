import {FacebookMessagingAPIClient, FacebookMessageParser} from 'fb-messenger-bot-api';
import config = require('config');

export const parser = FacebookMessageParser;
export const messenger = new FacebookMessagingAPIClient(config.get('PAGE_ACCESS_TOKEN'));
import {
    FacebookMessagingAPIClient,
    FacebookMessageParser,
    IButton,
    IMessageTemplate,
    IQuickReply, AttachmentPayload
} from 'fb-messenger-bot-api';
import config = require('config');

export const parser = FacebookMessageParser;
export const messenger = new FacebookMessagingAPIClient(config.get('PAGE_ACCESS_TOKEN'));

export class UserMessages {
    constructor(private id: string) {
    }

    markSeen() {
        return messenger.markSeen(this.id);
    }

    toggleTyping(toggle: boolean | Function) {
        return messenger.toggleTyping(this.id, toggle);
    }

    sendTextMessage(text: string) {
        return messenger.sendTextMessage(this.id, text);
    }

    sendImageMessage(imageUrlOrId: string) {
        return messenger.sendImageMessage(this.id, imageUrlOrId);
    }

    sendAudioMessage(audioUrlOrId: string) {
        return messenger.sendAudioMessage(this.id, audioUrlOrId);
    }

    sendVideoMessage(videoUrlOrId: string) {
        return messenger.sendVideoMessage(this.id, videoUrlOrId);
    }

    sendFileMessage(fileUrlOrId: string) {
        return messenger.sendFileMessage(this.id, fileUrlOrId);
    }

    sendButtonsMessage(text: string, buttons: IButton[]) {
        return messenger.sendButtonsMessage(this.id, text, buttons);
    }

    sendTemplateMessage(templatePayload: IMessageTemplate) {
        return messenger.sendTemplateMessage(this.id, templatePayload);
    }

    sendQuickReplyMessage(textOrAttachment: string | AttachmentPayload, quickReplies: IQuickReply[]) {
        return messenger.sendQuickReplyMessage(this.id, textOrAttachment, quickReplies);
    }

}
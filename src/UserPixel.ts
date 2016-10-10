import SlackPixel from "./SlackPixel";
import {SlackEntityType} from "./SlackPixel";

export default class UserPixel extends SlackPixel {
    directChannelId: string;
    isOnline: boolean;
    isDnd: boolean;
    isWriting: boolean;

    constructor(pixelNumber: number, user: Slack.User, directChannel: Slack.Im) {
        super(pixelNumber, user.id, user.name, SlackEntityType.User);
        this.directChannelId = directChannel.id;

        this.isOnline = user.presence === "active";
        this.hasUnreadMessages = directChannel.unread_count_display > 0;
        //TODO
        //this.isDnd =
    }

    get color(): string | number[] {
        if (this.isWriting) {
            return [255,0,255];
        }

        if (this.hasUnreadMessages) {
            return [80,0,0];
        }

        if (this.isOnline && !this.isDnd) {
            return [0,15,0];
        }

        if (this.isOnline && this.isDnd) {
            return [20,13,0]
        }

        return [5, 5, 5];
    }

    get isBinking(): boolean {
        return this.isWriting;
    }
}
import SlackPixel from "./SlackPixel";
import {SlackEntityType} from "./SlackPixel";

export default class ChannelPixel extends SlackPixel {
    constructor(pixelNumber: number, channel: Slack.Channel) {
        super(pixelNumber, channel.id, channel.name, SlackEntityType.Channel);

        this.hasUnreadMessages = channel.unread_count_display > 0;
    }

    get color(): string | number[] {
        if (this.hasUnreadMention) {
            return [127, 0, 0];
        }

        if (this.hasUnreadMessages) {
             return [0,0,20];
        }

        return [3, 3, 3];
    }
}
import SlackPixel from "./SlackPixel";
import {SlackEntityType} from "./SlackPixel";

export default class GroupPixel extends SlackPixel {
    constructor(pixelNumber: number, group: Slack.Group) {
        super(pixelNumber, group.id, group.name, SlackEntityType.Group);

        this.hasUnreadMessages = group.unread_count_display > 0;
    }

    get color(): string | number[] {
        if (this.hasUnreadMention) {
            return [127, 0, 0];
        }

        if (this.hasUnreadMessages) {
            return [0, 0, 20];
        }

        return [3, 3, 3];
    }
}
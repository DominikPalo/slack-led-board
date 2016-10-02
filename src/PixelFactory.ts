import {getPixelNumber} from "./Helpers";
import UserPixel from "./UserPixel";
import ChannelPixel from "./ChannelPixel";
import GroupPixel from "./GroupPixel";
import {Pixels} from "./PixelsController";

export default class PixelFactory {
    constructor(private slackData: Slack.Data, private pixels: Pixels) {

    }

    init() {
        const pixelsConfig: string[][] = require("../config/pixels.json");

        for (let i = 0; i < pixelsConfig.length; i++) {
            for (let j = 0; j < pixelsConfig[i].length; j++) {
                const identifier = pixelsConfig[i][j];
                if (identifier) {
                    this.create(i, j, identifier);
                }
            }
        }
    }

    private create(column: number, row: number, identifier: string) {
        const pixelNumber = getPixelNumber(column, row);
        const name = identifier.substring(1);

        switch (identifier[0]) {
            case "@":
                const user = this.slackData.users.find(user => user.name === name);
                if (!user) {
                    //todo message
                    return;
                }
                const im = this.slackData.ims.find(im => im.user === user.id);
                if (!im) {
                    //todo message
                    return;
                }
                this.pixels.users.push(new UserPixel(pixelNumber, user, im));
                break;

            case "#":
                const channel = this.slackData.channels.find(channel => channel.name === name);
                this.pixels.channels.push(new ChannelPixel(pixelNumber, channel));
                break;

            case "*":
                const group = this.slackData.groups.find(group => group.name === name);
                this.pixels.groups.push(new GroupPixel(pixelNumber, group));
                break;

            default:
                throw new Error(`Unknown slack entity "${identifier}"`);
        }
    }
}
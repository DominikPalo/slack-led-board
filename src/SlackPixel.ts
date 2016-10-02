import {getPixelNumber} from "./Helpers";
import {EventEmitter} from "events";

abstract class SlackPixel extends EventEmitter {
    hasUnreadMessages: boolean;
    hasUnreadMention: boolean;

    constructor(public pixelNumber: number, public id: string, public name: string, public kind: SlackEntityType) {
        super();
        console.log(`${SlackEntityType[kind]} ${name} has ID ${id}`);
    }

    abstract get color(): any;
}

export default SlackPixel;

export enum SlackEntityType {
    User,
    Channel,
    Group
}

//Named colors: "red", "green", "blue", "yellow", "cyan", "magenta", "white"

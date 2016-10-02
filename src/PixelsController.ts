import SlackUserPixel from "./UserPixel";
import SlackChannelPixel from "./ChannelPixel";
import SlackGroupPixel from "./GroupPixel";
import PixelFactory from "./PixelFactory";
import SlackPixel from "./SlackPixel";
import Effects from "./Effects";

const RTM_EVENTS = require('@slack/client').RTM_EVENTS;

export default class PixelsController {

    private myId: string;
    private myDirectChannelId: string;

    private effectsController: Effects;

    private pixels: Pixels = {
        users: [],
        channels: [],
        groups: []
    };


    constructor(slackData: Slack.Data, rtmClient: any, private strip: any) {
        this.effectsController = new Effects(strip);

        this.myId = slackData.self.id;
        const myDirectChannel = slackData.ims.find(directChannel => directChannel.user === this.myId);
        if (myDirectChannel) {
            this.myDirectChannelId = myDirectChannel.id;
        }

        const factory = new PixelFactory(slackData, this.pixels);
        factory.init();

        this.initPixels();
        this.registerRTM(rtmClient);
    }

    private initPixels(onlySetColors = false) {
        for (let pixel of <SlackPixel[]>[].concat(this.pixels.users, this.pixels.channels, this.pixels.groups)) {
            if (!onlySetColors) {
                //pixel.on("colorChange", this.handlePixelColorChanged);
            }
            this.strip.pixel(pixel.pixelNumber).color(pixel.color);
        }

        this.strip.show();
    }

    private registerRTM(rtmClient: any) {

        rtmClient.on(RTM_EVENTS.MESSAGE,(event: RTMEvents.Message) => {
            console.log("A message was sent to a channel", event);

            const userPixel = this.pixels.users.find(pixel => pixel.directChannelId === event.channel);
            if (userPixel) {
                userPixel.hasUnreadMessages = true;
                this.handlePixelColorChanged(userPixel); //TODO: use emitter
                return;
            }

            const channelPixel = this.pixels.channels.find(pixel => pixel.id === event.channel);
            if (channelPixel) {
                channelPixel.hasUnreadMessages = true;
                this.handlePixelColorChanged(channelPixel); //TODO: use emitter
                return;
            }

            const groupPixel = this.pixels.groups.find(pixel => pixel.id === event.channel);
            if (channelPixel) {
                channelPixel.hasUnreadMessages = true;
                this.handlePixelColorChanged(channelPixel); //TODO: use emitter
                return;
            }

            if (event.user == this.myId && event.channel === this.myDirectChannelId) {
                switch (event.text) {
                    case ".nahanacka":
                        this.effectsController.nahanacka();
                        break;
                    case ".stop":
                        this.effectsController.stop(() => {
                            this.initPixels(true);
                        });
                }
            }
        });

        rtmClient.on(RTM_EVENTS.USER_TYPING,(message) => {
            console.log("UserIM typing", message);


        });

        rtmClient.on(RTM_EVENTS.CHANNEL_MARKED,(event) => {
            console.log("Your channel read marker was updated", event);
        });

        rtmClient.on(RTM_EVENTS.IM_MARKED, (event) => {
           console.log("A direct message read marker was updated", event);
        });

        rtmClient.on(RTM_EVENTS.PRESENCE_CHANGE, (change: RTMEvents.PresenceChange) => {
            console.log("Presence change", change);

            const userPixel = this.pixels.users.find(pixel => pixel.id === change.user);
            if (userPixel) {
                userPixel.isOnline = change.presence === "active";
                this.handlePixelColorChanged(userPixel); //TODO: use emitter
            }
        });
    }

    private handlePixelColorChanged(pixel: SlackPixel) {
        this.strip.pixel(pixel.pixelNumber).color(pixel.color);
        this.strip.show();
    }
}

export interface Pixels {
    users: SlackUserPixel[],
    channels: SlackChannelPixel[],
    groups: SlackGroupPixel[]
}
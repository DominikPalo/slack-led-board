import SlackUserPixel from "./UserPixel";
import SlackChannelPixel from "./ChannelPixel";
import SlackGroupPixel from "./GroupPixel";
import PixelFactory from "./PixelFactory";
import SlackPixel from "./SlackPixel";
import Effects from "./Effects";
import UserPixel from "./UserPixel";
import GroupPixel from "./GroupPixel";
import ChannelPixel from "./ChannelPixel";

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
        this.effectsController = new Effects(strip, () => this.initPixels(true));

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
            
            if (event.user == this.myId) {
                return;
            }

            const userPixel = this.findUserPixelByChannel(event.channel);
            if (userPixel) {
                userPixel.hasUnreadMessages = true;
                this.handlePixelColorChanged(userPixel); //TODO: use emitter
                return;
            }

            const channelPixel = this.findChannelPixel(event.channel);
            if (channelPixel) {
                channelPixel.hasUnreadMessages = true;
                this.handlePixelColorChanged(channelPixel); //TODO: use emitter
                return;
            }

            const groupPixel = this.findGroupPixel(event.channel);
            if (groupPixel) {
                groupPixel.hasUnreadMessages = true;
                this.handlePixelColorChanged(groupPixel); //TODO: use emitter
                return;
            }

            if (event.user == this.myId
                && event.channel === this.myDirectChannelId
                && event.text.startsWith(".")
            ) {
                this.effectsController.execute(event.text.substring(1));
            }
        });

        rtmClient.on(RTM_EVENTS.USER_TYPING,(event) => {
            console.log("A channel member is typing a message", event);


        });

        rtmClient.on(RTM_EVENTS.CHANNEL_MARKED,(event: RTMEvents.ChannelMarked) => {
            console.log("Your channel read marker was updated", event);

            const channelPixel = this.findChannelPixel(event.channel);
            if (channelPixel) {
                channelPixel.hasUnreadMessages = event.unread_count_display > 0;
                channelPixel.hasUnreadMention = event.mention_count_display > 0;
                this.handlePixelColorChanged(channelPixel); //TODO: use emitter
                return;
            }
        });

        rtmClient.on(RTM_EVENTS.GROUP_MARKED,(event: RTMEvents.GroupMarked) => {
            console.log("A private channel read marker was updated", event);

            const groupPixel = this.findGroupPixel(event.channel);
            if (groupPixel) {
                groupPixel.hasUnreadMessages = event.unread_count_display > 0;
                groupPixel.hasUnreadMention = event.mention_count_display > 0;
                this.handlePixelColorChanged(groupPixel); //TODO: use emitter
                return;
            }
        });

        rtmClient.on(RTM_EVENTS.IM_MARKED, (event: RTMEvents.ImMarked) => {
           console.log("A direct message read marker was updated", event);

            const userPixel = this.findUserPixelByChannel(event.channel);
            if (userPixel) {
                userPixel.hasUnreadMessages = event.unread_count_display > 0;
                userPixel.hasUnreadMention = event.mention_count_display > 0;
                this.handlePixelColorChanged(userPixel); //TODO: use emitter
                return;
            }
        });

        rtmClient.on(RTM_EVENTS.PRESENCE_CHANGE, (event: RTMEvents.PresenceChange) => {
            console.log("A team member's presence changed", event);

            const userPixel = this.findUserPixel(event.user);
            if (userPixel) {
                userPixel.isOnline = event.presence === "active";
                this.handlePixelColorChanged(userPixel); //TODO: use emitter
            }
        });

        rtmClient.on(RTM_EVENTS.DND_UPDATED_USER, (event: RTMEvents.DndUpdatedUser) => {
            console.log("Do not Disturb settings changed for a team member", event);

            const userPixel = this.findUserPixel(event.user);
            if (userPixel) {
                userPixel.isDnd = event.dnd_status.dnd_enabled;
                this.handlePixelColorChanged(userPixel); //TODO: use emitter
            }

        });
    }

    private handlePixelColorChanged(pixel: SlackPixel) {
        this.strip.pixel(pixel.pixelNumber).color(pixel.color);
        this.strip.show();
    }

    private findUserPixel(id: string): UserPixel {
        return this.pixels.users.find(pixel => pixel.id === id);
    }

    private findUserPixelByChannel(id: string): UserPixel {
        return this.pixels.users.find(pixel => pixel.directChannelId === id);
    }

    private findChannelPixel(id: string): ChannelPixel {
        return this.pixels.channels.find(pixel => pixel.id === id);
    }

    private findGroupPixel(id: string): GroupPixel {
        return this.pixels.groups.find(pixel => pixel.id === id);
    }
}

export interface Pixels {
    users: SlackUserPixel[],
    channels: SlackChannelPixel[],
    groups: SlackGroupPixel[]
}
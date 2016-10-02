const WebClient = require("@slack/client").WebClient;
const config = require("../config/config.json");

export default class SlackApi {
    webClient: any;

    constructor() {
        this.webClient = new WebClient(config.slackApiToken);
    }

    listChannels(raw: boolean = false) {
        this.webClient.channels.list((err, res) => {
            if (raw) {
                console.log(res.channels);
                return;
            }

            console.log(`CHANNELS (${res.channels.length}):`);
            for (let channel of res.channels) {
                console.log(channel.name, channel.id);
            }
        });
    }

    listUsers(raw: boolean = false) {
        this.webClient.users.list((err, res) => {
            if (raw) {
                console.log(res.channels);
                return;
            }

            console.log(`USERS (${res.members.length}):`);

            for (let user of res.members) {
                console.log(user.profile.real_name, user.name, user.id);
            }
        });
    }
}
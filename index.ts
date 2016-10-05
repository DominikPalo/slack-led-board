import PixelsController from "./src/PixelsController";

const config = require("./config/config.json");
const pixel = require("node-pixel");
const firmata = require("firmata");

const RtmClient = require("@slack/client").RtmClient;
const CLIENT_EVENTS = require("@slack/client").CLIENT_EVENTS;

let slackData: Slack.Data = null;
let pixelsController: PixelsController;
let strip = null;

const board = new firmata.Board(config.board.port, initStrip);
const rtmClient = new RtmClient(config.slack.apiToken, {logLevel: 'error'});

function initStrip() {
    strip = new pixel.Strip({
        pin: config.board.pin,
        length: config.board.rows * config.board.columns,
        firmata: board,
        controller: "FIRMATA",
    });

    strip.on("ready", () => {
        console.log("Strip is ready, starting RTM client");
        rtmClient.start();
    });
}

rtmClient.on(CLIENT_EVENTS.RTM.AUTHENTICATED,rtmStartData => {
    slackData = rtmStartData;
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`)
});

rtmClient.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED,() => {
    console.log("Opened");

    pixelsController = new PixelsController(slackData, rtmClient, strip);
});
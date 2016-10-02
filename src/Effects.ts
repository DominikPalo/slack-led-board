const pixel = require("node-pixel");

export default class Effects {
    private timer: NodeJS.Timer;

    constructor(private strip: any) {

    }

    stop(done: Function) {
        clearInterval(this.timer);
        this.strip.color([0, 0, 0]);
        this.strip.show();

        setTimeout(done, 300); //Wait 300ms
    }

    chase() {
        this.strip.color([0, 0, 0]);
        this.strip.pixel(0).color("red");
        this.strip.pixel(20).color("green");
        this.strip.pixel(40).color("blue");

        this.timer = setInterval(() => {
            this.strip.shift(1, pixel.FORWARD, true);
            this.strip.show()
        }, 16);
    }

    strobo() {
        this.strip.color([0, 0, 0]);

        let color = "red";

        this.timer = setInterval(() => {
            this.strip.color(color);
            this.strip.show();

            if (color === "red") {
                color = "green"
            }
            else if (color === "green") {
                color = "blue"
            }
            else {
                color = "red";
            }
        }, 50);
    }

    dynamicRainbow(delay: number) {
        var showColor;
        var cwi = 0; // colour wheel index (current position on colour wheel)
        this.timer = setInterval(() => {
            if (++cwi > 255) {
                cwi = 0;
            }

            for (var i = 0; i < this.strip.stripLength(); i++) {
                showColor = this.colorWheel(( cwi + i ) & 255);
                this.strip.pixel(i).color(showColor);
            }
            this.strip.show();
        }, delay);
    }

    // Input a value 0 to 255 to get a color value.
    // The colors are a transition r - g - b - back to r.
    private colorWheel(WheelPos): number[] {
        var r, g, b;
        WheelPos = 255 - WheelPos;

        if (WheelPos < 85) {
            r = 255 - WheelPos * 3;
            g = 0;
            b = WheelPos * 3;
        } else if (WheelPos < 170) {
            WheelPos -= 85;
            r = 0;
            g = WheelPos * 3;
            b = 255 - WheelPos * 3;
        } else {
            WheelPos -= 170;
            r = WheelPos * 3;
            g = 255 - WheelPos * 3;
            b = 0;
        }
        // returns a string with the rgb value to be used as the parameter
        return [r,g,b];
    }
}
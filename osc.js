var context = new AudioContext();
var oscKnobs = document.getElementById("oscKnobs");
var oscArray = []

class Osc {
	constructor() {
		this.osc = context.createOscillator()
		this.osc.frequency.value = 262;
		this.oscKnob = pureknob.createKnob(300, 300);
		this.oscKnob.setProperty("valMax", 4186);
		this.oscKnob.setProperty("valMin", 28);
		this.oscKnob.setValue(262);
		this.knobListener = function(knob, value) {
			console.log(value);
			this.osc.frequency.value = value;
		}
		this.oscKnob.addListener(this.knobListener);
		this.oscNode = this.oscKnob.node();
		this.oscElement = document.createElement("div");
		this.oscElement.appendChild(this.oscNode);
		oscKnobs.appendChild(this.oscElement);
	}
	playOsc() {
		this.osc.connect(context.destination);
		this.osc.type = "sine";
		this.osc.started = false;
		this.osc.frequency.value = thisoscKnob.getValue();
		if (this.osc.started === false) {
			this.osc.start();
			this.osc.started = true;
		}
	}
	stopOsc() {
			this.osc.disconnect(context.destination);
  }
}

function createOsc() {
	oscArray.push(new Osc);
}

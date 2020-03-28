var context = new AudioContext();
var oscKnobs = document.getElementById("oscKnobs");
var oscs = []


class Osc {
	constructor() {
		this.osc = context.createOscillator()
		this.oscKnob = pureknob.createKnob(300, 300);
		this.oscKnob.setProperty("valMax", 4186);
		this.oscKnob.setProperty("valMin", 28);
		this.oscKnob.setValue(262);
		this.oscNode = this.oscKnob.node();
		this.oscElement = document.createElement("div");
		this.oscElement.appendChild(this.oscNode)
		oscKnobs.appendChild(this.oscElement)
		this.oscElement.appendChild(this.oscNode);
		this.oscKnob.addListener(knobListener);
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
	stopthisOsc() {
			this.osc.disconnect(context.destination);
  }
	knobListener(knob, value) {
		console.log(value);
		this.osc.frequency.value = value;
	}
}

function createOsc() {
	oscs.push(new Osc);
}

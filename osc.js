var context = new AudioContext();
var oscKnobs = document.getElementById("oscKnobs");
var oscs = []


class osc {
	constructor() {
		this.Osc = context.createOscillator()
		this.OscKnob = pureknob.createKnob(300, 300);
		this.OscKnob.setProperty("valMax", 4186);
		this.OscKnob.setProperty("valMin", 28);
		this.OscKnob.setValue(262);
		this.OscNode = this.OscKnob.node();
		this.OscElement = document.createElement(this.OscNode);
		oscKnobs.appendChild(this.OscElement)
		this.OscElement.appendChild(thisOscNode);
		this.OscKnob.addListener(knobListener);
	}
	playOsc() {
		this.Osc.connect(context.destination);
		this.Osc.type = "sine";
		this.Osc.started = false;
		this.Osc.frequency.value = thisOscKnob.getValue();
		if (this.Osc.started === false) {
			this.Osc.start();
			this.Osc.started = true;
		}
	}
	stopthisOsc() {
			this.Osc.disconnect(context.destination);
  }
	knobListener(knob, value) {
		console.log(value);
		thisOsc.frequency.value = value;
	}
}

function createOsc() {
	oscs.push(new osc)
}

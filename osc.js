var context = new AudioContext();

class osc {
	constructor() {
		this.Osc = context.createOscillator()
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

function playthisOsc() {
	thisOsc.connect(context.destination);
	thisOsc.type = "sine";
	thisOsc.started = false;
	thisOsc.frequency.value = thisOscKnob.getValue();
	if (thisOsc.started === false) {
		thisOsc.start();
		thisOsc.started = true;
	}
}

function stopthisOsc() {
	thisOsc.disconnect(context.destination);
}

var thisOscKnob = pureknob.createKnob(300, 300);
thisOscKnob.setProperty("valMax", 4186);
thisOscKnob.setProperty("valMin", 28);
thisOscKnob.setValue(262);
var thisOscNode = thisOscKnob.node();
var thisOscElement = document.getElementById("thisOscKnobElement");
thisOscElement.appendChild(thisOscNode);

var knobListener = function(knob, value) {
	console.log(value);
	thisOsc.frequency.value = value;
}

thisOscKnob.addListener(knobListener);

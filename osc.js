var context = new AudioContext();
var oscA = context.createOscillator()

oscA.type = "sine";
oscA.frequency.value = 262
oscA.started = false

function playOscA() {
	oscA.connect(context.destination);
	//oscA.frequency.value = parseFloat(document.getElementById("freq").value);
	oscA.frequency.value = oscAKnob.getValue();
	if (oscA.started === false) {
		oscA.start();
		oscA.started = true;
	}
}

function stopOscA() {
	oscA.disconnect(context.destination);
}

var oscAKnob = pureknob.createKnob(300, 300);
oscAKnob.setProperty("valMax", 4186);
oscAKnob.setProperty("valMin", 28);
oscAKnob.setValue(262);
var oscANode = oscAKnob.node();
var oscAElement = document.getElementById("oscAKnobElement");
oscAElement.appendChild(oscANode);

var knobListener = function(knob, value) {
	console.log(value);
	oscA.frequency.value = value;
}

oscAKnob.addListener(knobListener);

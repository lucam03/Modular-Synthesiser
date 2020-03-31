var context = new AudioContext();
var oscSliders = document.getElementById("oscSliders");
var oscArray = [];

class Osc {
	constructor() {
		Osc.numInstances = (Osc.numInstances + 1 || 0)
		this.osc = context.createOscillator();
		this.osc.hasBeenStarted = false;
		this.osc.connected = false;
		this.osc.frequency.value = 262;

		this.oscSlider = document.createElement("input");
		this.oscSlider.id = `slider${Osc.numInstances}`
		this.oscSlider.type = "range";
		this.oscSlider.min = 28;
		this.oscSlider.max = 4186;
		this.oscSlider.value = 262;
		oscSliders.appendChild(this.oscSlider);

		this.playButton = document.createElement("button");
		this.playButton.innerHTML = "PLAY"
		this.playButton.id = `play${Osc.numInstances}`
		oscSliders.appendChild(this.playButton);

		this.stopButton = document.createElement("button");
		this.stopButton.innerHTML = "STOP"
		this.stopButton.id = `stop${Osc.numInstances}`
		oscSliders.appendChild(this.stopButton);
	}
	playOsc() {
		this.osc.connected = true;
		this.osc.connect(context.destination);
		this.osc.type = "sine";
		this.osc.frequency.value = this.oscSlider.value;
		if (!this.osc.hasBeenStarted) {
			this.osc.start();
			this.osc.hasBeenStarted = true;
		}
		console.log("Started");
	}
	stopOsc() {
		if (this.osc.connected) {
			this.osc.disconnect(context.destination);
			this.osc.connected = false;
			console.log("Stopped");
		}
  }
	updateFrequency() {
		this.osc.frequency.value = this.oscSlider.value;
		this.playButton.innerHTML = this.oscSlider.value;
	}
}

function createOsc() {
	oscArray.push(new Osc);
	var newPlayButton = document.getElementById(`play${Osc.numInstances}`);
	var newStopButton = document.getElementById(`stop${Osc.numInstances}`);
	var newSlider = document.getElementById(`slider${Osc.numInstances}`);
	newSlider.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateFrequency()})`);
	newPlayButton.onclick = eval(`(function() {oscArray[${Osc.numInstances}].playOsc()})`);
	newStopButton.onclick = eval(`(function() {oscArray[${Osc.numInstances}].stopOsc()})`);
}

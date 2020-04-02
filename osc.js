var context = new AudioContext();
var oscs = document.getElementById("oscs");
var oscArray = [];



class Osc {
	constructor() {
		Osc.numInstances = (Osc.numInstances + 1 || 0);
		//Initialise oscillator
		this.osc = context.createOscillator();
		this.osc.hasBeenStarted = false;
		this.osc.connected = false;
		this.osc.frequency.value = 262;
		this.osc.type = "sine";
		//Initialise gain
		this.oscGain = context.createGain();
		this.oscGain.connect(context.destination);
		//Create base div for osc
		this.oscDiv = document.createElement("div")
		this.oscDiv.style.width = "50%";
		this.oscDiv.id = `osc${Osc.numInstances}`;
		this.oscDiv.class = "Osc" 
		//Create osc title
		this.oscTitle = document.createElement("h4");
		this.oscTitle.innerHTML = `Oscillator ${Osc.numInstances + 1}`;
		this.oscTitle.id = `Title${Osc.numInstances}`;
		this.oscTitle.style.width = "25%";
		this.oscDiv.appendChild(this.oscTitle);
		//Create osc frequency slider
		this.oscFrequency = document.createElement("input");
		this.oscFrequency.id = `frequency${Osc.numInstances}`;
		this.oscFrequency.type = "range";
		this.oscFrequency.min = 28;
		this.oscFrequency.max = 4186;
		this.oscFrequency.value = 262;
		this.oscFrequency.style.width = "33%";
		this.oscFrequency.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateFrequency("S")})`);
		this.oscDiv.appendChild(this.oscFrequency);
		//Create min and max frequency boxes
		this.maxFreqValue = document.createElement("input");
		this.minFreqValue = document.createElement("input");
		this.maxFreqValue.id = `maxF${Osc.numInstances}`;
		this.minFreqValue.id = `minF${Osc.numInstances}`;
		this.maxFreqValue.value = 4186;
		this.minFreqValue.value = 28;
		this.maxFreqValue.style.width = "10%";
		this.minFreqValue.style.width = "10%";
		this.maxFreqValue.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`);
		this.minFreqValue.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`);
		this.oscDiv.appendChild(this.minFreqValue);
		this.oscDiv.appendChild(this.maxFreqValue);
		//Create current frequency box
		this.oscFreqVal = document.createElement("input");
		this.oscFreqVal.id = `freqValue${Osc.numInstances}`;
		this.oscFreqVal.value = 262;
		this.oscFreqVal.style.width = "10%";
		this.oscFreqVal.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateFrequency("B")})`);
		this.oscDiv.appendChild(this.oscFreqVal);
		//Create play button
		this.playButton = document.createElement("button");
		this.playButton.innerHTML = "PLAY";
		this.playButton.id = `play${Osc.numInstances}`
		this.playButton.style.width = "8%";
		this.playButton.onclick = eval(`(function() {oscArray[${Osc.numInstances}].playOsc()})`);
		this.oscDiv.appendChild(this.playButton);
		//Create stop button
		this.stopButton = document.createElement("button");
		this.stopButton.innerHTML = "STOP"
		this.stopButton.id = `stop${Osc.numInstances}`
		this.stopButton.style.width = "8%";
		this.stopButton.onclick = eval(`(function() {oscArray[${Osc.numInstances}].stopOsc()})`);
		this.oscDiv.appendChild(this.stopButton);
		//Create amplitude slider
		this.oscAmplitude = document.createElement("input");
		this.oscAmplitude.id = `amplitude${Osc.numInstances}`;
		this.oscAmplitude.type = "range";
		this.oscAmplitude.min = 0;
		this.oscAmplitude.max = 11;
		this.oscAmplitude.value = 1;
		this.oscAmplitude.step = 0.01;
		this.oscAmplitude.style.width = "33%";
		this.oscAmplitude.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateAmplitude("S")})`);
		this.oscDiv.appendChild(this.oscAmplitude);
		//Create min and max amplitude boxes
		this.maxAmpValue = document.createElement("input");
		this.minAmpValue = document.createElement("input");
		this.maxAmpValue.id = `maxA${Osc.numInstances}`;
		this.minAmpValue.id = `minA${Osc.numInstances}`;
		this.maxAmpValue.value = 11;
		this.minAmpValue.value = 0;
		this.maxAmpValue.style.width = "10%";
		this.minAmpValue.style.width = "10%";
		this.maxAmpValue.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`);
		this.minAmpValue.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`);
		this.oscDiv.appendChild(this.minAmpValue);
		this.oscDiv.appendChild(this.maxAmpValue);
		//Create current amplitude box
		this.oscAmpVal = document.createElement("input");
		this.oscAmpVal.id = `ampValue${Osc.numInstances}`;
		this.oscAmpVal.value = 1;
		this.oscAmpVal.style.width = "10%";
		this.oscAmpVal.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateAmplitude("B")})`);
		this.oscDiv.appendChild(this.oscAmpVal);
		//Define waveshapes
		this.sineWave = document.createElement("option");
		this.sineWave.value = "sine";
		this.sineWave.innerHTML = "Sine";
		this.squareWave = document.createElement("option");
		this.squareWave.value = "square";
		this.squareWave.innerHTML = "Square";
		this.sawWave = document.createElement("option");
		this.sawWave.value = "sawtooth";
		this.sawWave.innerHTML = "Sawtooth";
		this.triangleWave = document.createElement("option");
		this.triangleWave.value = "triangle";
		this.triangleWave.innerHTML = "Triangle";
		//Create waveshape dropdown
		this.oscShape = document.createElement("select");
		this.oscShape.id = `shape${Osc.numInstances}`;
		this.oscShape.style.width = "16%";
		this.oscShape.onchange = eval(`(function() {oscArray[${Osc.numInstances}].updateWaveShape()})`);
		this.oscShape.appendChild(this.sineWave);
		this.oscShape.appendChild(this.squareWave);
		this.oscShape.appendChild(this.sawWave);
		this.oscShape.appendChild(this.triangleWave);
		this.oscDiv.appendChild(this.oscShape);
		//Add osc div to main div
		oscs.appendChild(this.oscDiv);
		console.log("Osc created");
		console.log(this.oscDiv);
	}
	playOsc() {
		this.osc.connected = true;
		this.osc.connect(this.oscGain);
		this.osc.frequency.value = this.oscFrequency.value;
		if (!this.osc.hasBeenStarted) {
			this.osc.start();
			this.osc.hasBeenStarted = true;
		}
		console.log("Started");
	}
	stopOsc() {
		if (this.osc.connected) {
			this.osc.disconnect(this.oscGain);
			this.osc.connected = false;
			console.log("Stopped");
		}
  }
	updateFrequency(updateType) {
		if (updateType ==="S") {
			this.osc.frequency.value = this.oscFrequency.value;
			this.oscFreqVal.value = this.oscFrequency.value;
		} else {
			this.osc.frequency.value = this.oscFreqVal.value;
			this.oscFrequency.value = this.oscFreqVal.value;
		}
	}
	updateAmplitude(updateType) {
		if (updateType === "S") {
			this.oscGain.gain.value = this.oscAmplitude.value;
			this.oscAmpVal.value = this.oscAmplitude.value;
		} else {
			this.oscGain.gain.value = this.oscAmpVal.value;
			this.oscAmplitude.value = this.oscAmpVal.value;
		}
	}
	updateMinMax() {
		this.oscFrequency.max = this.maxFreqValue.value;
		this.oscFrequency.min = this.minFreqValue.value;
		this.oscAmplitude.max = this.maxAmpValue.value;
		this.oscAmplitude.min = this.minAmpValue.value;
	}
	updateWaveShape() {
		this.osc.type = this.oscShape.value;
	}
}

function createOsc() {
	oscArray.push(new Osc);
}

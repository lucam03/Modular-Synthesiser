var context = new AudioContext();
var analyser = context.createAnalyser();
analyser.connect(context.destination);
var oscs = document.getElementById("oscs");
var oscArray = [];
var oscParams = [];
//creating analyser node, defining its properties for visualiser
var analyser = context.createAnalyser();
analyser.fftSize = 2048;
//creating array for frequency and waveform
var bufferLength = analyser.frequencyBinCount;
console.log(bufferLength)
var dataArray = new Uint8Array(bufferLength)

class Osc {
	constructor() {
		Osc.numInstances = (Osc.numInstances + 1 || 0);
		this.num = Osc.numInstances;
		//Initialise oscillator
		this.osc = context.createOscillator();
		this.osc.connect(analyser)
		this.osc.hasBeenStarted = false;
		this.osc.connected = false;
		this.osc.frequency.value = 262;
		this.osc.type = "sine";
		this.destination = analyser;
		//Initialise destinations
		this.mainDestination = document.createElement("option");
		this.mainDestination.value = `analyser`;
		this.mainDestination.innerHTML = "Audio OUT";
		this.oscDestinations = [this.mainDestination];
		//Create control div
		this.control = document.createElement("div")
		//Create destination dropdown
		this.oscDests = document.createElement("select");
		this.oscDests.id = `destination${Osc.numInstances}`;
		this.oscDests.onchange = eval(`(function() {oscArray[${Osc.numInstances}].updateDestination()})`);
		this.control.appendChild(this.oscDests);
		this.updateThisDestinationList();
		//Initialise gain
		this.oscGain = context.createGain();
		this.oscGain.connect(this.destination);
		//Create base div for osc
		this.oscDiv = document.createElement("div")
		this.oscDiv.id = `osc${Osc.numInstances}`;
		this.oscDiv.className = "Osc"
		//Create osc title
		this.oscTitle = document.createElement("h4");
		this.oscTitle.innerHTML = `Oscillator ${Osc.numInstances + 1}`;
		this.oscTitle.id = `Title${Osc.numInstances}`;
		this.oscTitle.style.width = "100%";
		this.oscDiv.appendChild(this.oscTitle);
		//Create osc frequency slider
		this.oscFrequency = document.createElement("input");
		this.oscFrequency.id = `frequency${Osc.numInstances}`;
		this.oscFrequency.type = "range";
		this.oscFrequency.min = 0;
		this.oscFrequency.max = 440;
		this.oscFrequency.value = 262;
		this.oscFrequency.step = 0.1
		this.oscFrequency.style.width = "33%";
		this.oscFrequency.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateFrequency("S")})`);
		this.oscDiv.appendChild(this.oscFrequency);
		//Create min and max frequency boxes
		this.manFreqInput = document.createElement("P")
		this.maxFreqValue = document.createElement("input");
		this.minFreqValue = document.createElement("input");
		this.maxFreqValue.id = `maxF${Osc.numInstances}`;
		this.minFreqValue.id = `minF${Osc.numInstances}`;
		this.maxFreqValue.value = 440;
		this.minFreqValue.value = 0;
		this.maxFreqValue.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`);
		this.minFreqValue.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`);
		this.manFreqInput.appendChild(this.minFreqValue);
		this.manFreqInput.appendChild(this.maxFreqValue);
		//Create current frequency box
		this.oscFreqVal = document.createElement("input");
		this.oscFreqVal.id = `freqValue${Osc.numInstances}`;
		this.oscFreqVal.value = 262;
		this.oscFreqVal.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateFrequency("B")})`);
		this.manFreqInput.appendChild(this.oscFreqVal);
		this.oscDiv.appendChild(this.manFreqInput);
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
		this.manAmpInput = document.createElement("P")
		this.maxAmpValue = document.createElement("input");
		this.minAmpValue = document.createElement("input");
		this.maxAmpValue.id = `maxA${Osc.numInstances}`;
		this.minAmpValue.id = `minA${Osc.numInstances}`;
		this.maxAmpValue.value = 11;
		this.minAmpValue.value = 0;
		this.maxAmpValue.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`);
		this.minAmpValue.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`);
		this.manAmpInput.appendChild(this.minAmpValue);
		this.manAmpInput.appendChild(this.maxAmpValue);
		//Create current amplitude box
		this.oscAmpVal = document.createElement("input");
		this.oscAmpVal.id = `ampValue${Osc.numInstances}`;
		this.oscAmpVal.value = 1;
		this.oscAmpVal.oninput = eval(`(function() {oscArray[${Osc.numInstances}].updateAmplitude("B")})`);
		this.manAmpInput.appendChild(this.oscAmpVal);
		this.oscDiv.appendChild(this.manAmpInput);
		//Create play button
		this.playButton = document.createElement("button");
		this.playButton.innerHTML = "PLAY";
		this.playButton.id = `play${Osc.numInstances}`;
		this.playButton.onclick = eval(`(function() {oscArray[${Osc.numInstances}].playOsc()})`);
		this.playButton.onclick = eval(`(function() {oscArray[${Osc.numInstances}].playWaveform()})`);
		this.control.appendChild(this.playButton);
		//Create stop button
		this.stopButton = document.createElement("button");
		this.stopButton.innerHTML = "STOP";
		this.stopButton.id = `stop${Osc.numInstances}`;
		this.stopButton.onclick = eval(`(function() {oscArray[${Osc.numInstances}].stopOsc()})`);
		this.control.appendChild(this.stopButton);
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
		this.oscShape.onchange = eval(`(function() {oscArray[${Osc.numInstances}].updateWaveShape()})`);
		this.oscShape.appendChild(this.sineWave);
		this.oscShape.appendChild(this.squareWave);
		this.oscShape.appendChild(this.sawWave);
		this.oscShape.appendChild(this.triangleWave);
		this.control.appendChild(this.oscShape);
		//creates canvas
		this.canvas = document.createElement("canvas")
		this.canvas.id = 'canvas'
		this.canvas.
		//Add osc div to main div
		this.oscDiv.appendChild(this.control)
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
	playWaveform() {
		//clears canvas
		canvasCtx.clearRect( 0, 0, WIDTH, HEIGHT);
		function draw() {
			// variable to enable looping of draw function
			var drawVisual = requestAnimationFrame(draw);
			//time domain data
			analyser.getByteTimeDomainData(dataArray);
			//canvas settings
			canvasCtx.fillStyle = 'rgb(200,200,200)';
			canvasCtx.fillRect( 0, 0, WIDTH, HEIGHT);
			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = 'rgb(0,0,0)';
			canvasCtx.beginPath();
			//width of each segment of the line to be drawn by dividing canvas
			var sliceWidth = WIDTH * 1.0 / bufferLength;
			var x = 0;
			//looping to get define position of wave at each poitn in buffer
			for(var i = 0; i < bufferLength; i++){
				var v = dataArray[i] / 128.0;
				var y = v * HEIGHT/2;

				if (i === 0) {
					canvasCtx.moveTo(x,y);
				} else {
					canvasCtx.lineTo(x,y);
				}

				x += sliceWidth;
			}
			canvasCtx.lineTo(canvas.width, canvas.height/2);
			canvasCtx.stroke();
			};
			draw();
	}
	stopOsc() {
		if (this.osc.connected) {
			this.osc.disconnect(this.oscGain);
			this.osc.connected = false;
			console.log("Stopped");
		}
  }
	updateFrequency(updateType) {
		if (updateType === "S") {
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
	updateDestination() {
		this.oscGain.disconnect();
		console.log(this.oscDests.value);
		this.destination = eval(this.oscDests.value);
		this.oscGain.connect(this.destination);
	}
	updateThisDestinationList() {
		this.oscDestinations = [this.mainDestination];
		for (var param = 0; param < oscParams.length; param++) {
			let p = document.createElement("option")
			p.value = oscParams[param]
			p.innerHTML = param % 2 == 0 ? `Osc ${Math.ceil((param + 1) / 2)} Frequency` : `Osc ${Math.ceil((param + 1) / 2)} Gain`
			this.oscDestinations.push(p)
		}
		this.oscDests.innerHTML = "";
		for (var param = 0; param < this.oscDestinations.length; param++) {
			this.oscDests.appendChild(this.oscDestinations[param]);
		}
	}
}

function createOsc() {
	oscArray.push(new Osc);
	updateDestinationList()
}

function updateDestinationList() {
	oscParams = [];
	for (var oscItem = 0; oscItem < oscArray.length; oscItem++) {
		let f = `oscArray[${oscItem}].osc.frequency`;
		let g = `oscArray[${oscItem}].oscGain.gain`;
		oscParams.push(f);
		oscParams.push(g);
	}
	for (var oscItem = 0; oscItem < oscArray.length; oscItem++) {
		oscArray[oscItem].updateThisDestinationList();
	}
}

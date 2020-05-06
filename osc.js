//Defining audio context
var context = new AudioContext();
var mainVolume = context.createGain();
mainVolume.connect(context.destination);
var oscs = document.getElementById("oscs");
var oscArray = [];
var oscParams = [];
//Creating analyser node, defining its properties for visualiser
var analyser = context.createAnalyser();
analyser.connect(mainVolume);
//Create highpass+lowpass filters
var lowPass = context.createBiquadFilter();
lowPass.type = "lowpass";
lowPass.frequency.value = 22050;
lowPass.connect(analyser);
var highPass = context.createBiquadFilter();
highPass.type = "highpass";
highPass.frequency.value = 0;
highPass.connect(lowPass);
//Creating canvas variables
var canvas = document.getElementById('canvas');
var canvasCtx = canvas.getContext('2d');
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);
//Canvas dimensions
var WIDTH = 300;
var HEIGHT = 150;
// canvas.width = `${WIDTH}`;
// canvas.height = `${HEIGHT}`;
visualiseMode = 0
playWaveform();

class Osc {
	constructor() {
		Osc.numInstances = (Osc.numInstances + 1 || 0);
		this.num = Osc.numInstances;
		//Initialise oscillator
		this.osc = context.createOscillator();
		this.osc.hasBeenStarted = false;
		this.osc.connected = false;
		this.osc.frequency.value = 262;
		this.osc.type = "sine";
		this.destination = highPass;
		//Initialise destinations
		this.mainDestination = document.createElement("option");
		setAttributes(this.mainDestination, {"value":`oscArray[${Osc.numInstances}].panNode`, "innerHTML":"Audio OUT"});
		this.lowPassDest = document.createElement("option");
		setAttributes(this.lowPassDest, {"value":"lowPass.frequency", "innerHTML":"Low Pass"});
		this.highPassDest = document.createElement("option");
		setAttributes(this.highPassDest, {"value":"highPass.frequency", "innerHTML":"High Pass"});
		//Create control div
		this.control = document.createElement("div")
		//Create destination dropdown
		this.oscDests = document.createElement("select");
		setAttributes(this.oscDests, {"id":`destination${Osc.numInstances}`, "onchange":eval(`(function() {oscArray[${Osc.numInstances}].updateDestination()})`)});
		this.control.appendChild(this.oscDests);
		this.initialiseThisDestinationList();
		//Initialise panning
		this.panNode = context.createStereoPanner();
		this.panNode.connect(this.destination);
		//Initialise gain
		this.oscGain = context.createGain();
		this.osc.connect(this.oscGain);
		this.oscGain.connect(this.panNode);
		//Create base div for osc
		this.oscDiv = document.createElement("div")
		setAttributes(this.oscDiv, {"id":`osc${Osc.numInstances}`, "className":"Osc oscOff"});
		//Create osc title
		this.oscTitle = document.createElement("h4");
		setAttributes(this.oscTitle, {"innerHTML":`Oscillator ${Osc.numInstances + 1}`, "id":`Title${Osc.numInstances}`, "style":"width: 100%"});
		this.oscDiv.appendChild(this.oscTitle);
		//create div for frequency slider
		this.freqDiv = document.createElement("div");
		this.freqDiv.className = 'sliderdiv';
		//text for user
		this.freqText = document.createElement("p");
		setAttributes(this.freqText, {"innerHTML": "Frequency", "className": "slidertext"});
		this.freqDiv.appendChild(this.freqText);
		//Create osc frequency slider
		this.oscFrequency = document.createElement("input");
		setAttributes(this.oscFrequency, {"id":`frequency${Osc.numInstances}`, "className":"oscSlider", "type":"range", "min":0, "max":440, "value":262, "step":0.1, "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updateFrequency("S")})`)});
		this.freqDiv.appendChild(this.oscFrequency);
		this.oscDiv.appendChild(this.freqDiv);
		//Create min and max frequency boxes
		this.manFreqInput = document.createElement("div");
		this.maxFreqValue = document.createElement("input");
		this.minFreqValue = document.createElement("input");
		setAttributes(this.minFreqValue, {"id":`minF${Osc.numInstances}`, "value":0, "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`)});
		setAttributes(this.maxFreqValue, {"id":`maxF${Osc.numInstances}`, "value":"440", "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`)});
		//Create current frequency box
		this.oscFreqVal = document.createElement("input");
		setAttributes(this.oscFreqVal, {"id":`freqValue${Osc.numInstances}`, "value":262, "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updateFrequency("B")})`)});
		this.manFreqInput.appendChild(document.createTextNode("Min"));
		//Append inputs to osc
		this.manFreqInput.appendChild(this.minFreqValue);
		this.manFreqInput.appendChild(this.oscFreqVal);
		this.manFreqInput.appendChild(this.maxFreqValue);
		this.manFreqInput.appendChild(document.createTextNode("Max"));
		this.oscDiv.appendChild(this.manFreqInput);
		//create div for amplitude slider
		this.ampDiv = document.createElement("div");
		this.ampDiv.className = 'sliderdiv';
		//Text
		this.ampText = document.createElement("p");
		setAttributes(this.ampText, {"innerHTML": "Amplitude", "className": "slidertext"});
		this.ampDiv.appendChild(this.ampText);
		//Create amplitude slider
		this.oscAmplitude = document.createElement("input");
		setAttributes(this.oscAmplitude, {"id":`amplitude${Osc.numInstances}`, "className":"oscSlider", "type":"range", "min":0, "max":11, "value":1, "step":0.01, "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updateAmplitude("S")})`)});
		this.ampDiv.appendChild(this.oscAmplitude)
		this.oscDiv.appendChild(this.ampDiv);
		//Create min and max amplitude boxes
		this.manAmpInput = document.createElement("div")
		this.maxAmpValue = document.createElement("input");
		this.minAmpValue = document.createElement("input");
		setAttributes(this.minAmpValue, {"id":`minA${Osc.numInstances}`, "value":0, "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`)});
		setAttributes(this.maxAmpValue, {"id":`maxA${Osc.numInstances}`, "value":11, "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updateMinMax()})`)});
		//Create current amplitude box
		this.oscAmpVal = document.createElement("input");
		setAttributes(this.oscAmpVal, {"id":`ampValue${Osc.numInstances}`, "value":1, "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updateAmplitude("B")})`)});
		//Append inputs to osc
		this.manAmpInput.appendChild(document.createTextNode("Min"));
		this.manAmpInput.appendChild(this.minAmpValue);
		this.manAmpInput.appendChild(this.oscAmpVal);
		this.manAmpInput.appendChild(this.maxAmpValue);
		this.manAmpInput.appendChild(document.createTextNode("Max"));
		this.oscDiv.appendChild(this.manAmpInput);
		//pan slider div
		this.panDiv = document.createElement('div');
		this.panDiv.className = 'sliderdiv';
		//pan text
		this.panText = document.createElement("p");
		setAttributes(this.panText, {"innerHTML": "Panning", "className": "slidertext"});
		this.panDiv.appendChild(this.panText);
		//Create panning slider
		this.panSlider = document.createElement("input");
		setAttributes(this.panSlider, {"id":`panSlider${Osc.numInstances}`, "className":"oscSlider", "type":"range", "min":-1, "max":1, "value":0, "step":0.01, "oninput":eval(`(function() {oscArray[${Osc.numInstances}].updatePan()})`)});
		this.panDiv.appendChild(this.panSlider);
		this.oscDiv.appendChild(this.panDiv);
		//Create start/stop button
		this.ssButton = document.createElement("button");
		setAttributes(this.ssButton, {"innerHTML":"START", "id":`ssButton${Osc.numInstances}`, "className":"ssButton", "onclick":eval(`(function() {oscArray[${Osc.numInstances}].toggleOsc()})`)});
		this.control.appendChild(this.ssButton);
		//Define waveshapes
		this.sineWave = document.createElement("option");
		this.squareWave = document.createElement("option");
		this.sawWave = document.createElement("option");
		this.triangleWave = document.createElement("option");
		setAttributes(this.sineWave, {"value":"sine", "innerHTML":"Sine"});
		setAttributes(this.squareWave, {"value":"square", "innerHTML":"Square"});
		setAttributes(this.sawWave, {"value":"sawtooth", "innerHTML":"Sawtooth"});
		setAttributes(this.triangleWave, {"value":"triangle", "innerHTML":"Triangle"});
		//Create waveshape dropdown
		this.oscShape = document.createElement("select");
		setAttributes(this.oscShape, {"id":`shape${Osc.numInstances}`, "onchange":eval(`(function() {oscArray[${Osc.numInstances}].updateWaveShape()})`)});
		this.oscShape.appendChild(this.sineWave);
		this.oscShape.appendChild(this.squareWave);
		this.oscShape.appendChild(this.sawWave);
		this.oscShape.appendChild(this.triangleWave);
		this.control.appendChild(this.oscShape);
		//Add osc div to main div
		this.oscDiv.appendChild(this.control)
		oscs.appendChild(this.oscDiv);
		console.log("Osc created");
		console.log(this.oscDiv);
	}
	toggleOsc() {
		if (this.osc.connected) {
			this.osc.connected = false;
			this.osc.disconnect(this.oscGain);
			this.oscDiv.className = "Osc oscOff";
			document.getElementById(`ssButton${this.num}`).innerHTML = "START";
		} else {
			this.osc.connected = true;
			this.osc.connect(this.oscGain);
			this.oscDiv.className = "Osc oscOn";
			if (!this.osc.hasBeenStarted) {
				this.osc.start();
				this.osc.hasBeenStarted = true;
			}
			document.getElementById(`ssButton${this.num}`).innerHTML = "STOP";
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
	updatePan() {
		this.panNode.pan.value = this.panSlider.value;
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
		this.destination = eval(this.oscDests.value);
		this.oscGain.connect(this.destination);
	}
	initialiseThisDestinationList() {
		this.oscDestinations = [this.mainDestination, this.lowPassDest, this.highPassDest];
		for (var param = 0; param < oscParams.length; param++) {
			let p = document.createElement("option");
			p.value = oscParams[param];
			p.id = `destinationOption${param}`;
			if (param % 3 == 0) {
				p.innerHTML = `Osc ${Math.ceil((param + 1) / 3)} Frequency`
			} else if (param % 3 == 1) {
				p.innerHTML = `Osc ${Math.ceil((param + 1) / 3)} Gain`;
			} else {
				p.innerHTML = `Osc ${Math.ceil((param + 1) / 3)} Panning`;
			}
			this.oscDestinations.push(p);
		}
		this.oscDests.innerHTML = "";
		for (var param = 0; param < this.oscDestinations.length; param++) {
			this.oscDests.appendChild(this.oscDestinations[param]);
		}
	}
	updateThisDestinationList() {
		for (var param = this.oscDestinations.length; param < oscParams.length; param++) {
			let p = document.createElement("option");
			p.value = oscParams[param];
			p.id = `destinationOption${param}`;
			if (param % 3 == 0) {
				p.innerHTML = `Osc ${Math.ceil((param + 1) / 3)} Frequency`
			} else if (param % 3 == 1) {
				p.innerHTML = `Osc ${Math.ceil((param + 1) / 3)} Gain`;
			} else {
				p.innerHTML = `Osc ${Math.ceil((param + 1) / 3)} Panning`;
			}
			this.oscDestinations.push(p);
		}
		for (var param = 3; param < this.oscDestinations.length; param++) {
			if (!this.oscDests.contains(this.oscDestinations[param])) {
				this.oscDests.appendChild(this.oscDestinations[param]);
			}
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
		let p = `oscArray[${oscItem}].panNode.pan`;
		oscParams.push(f);
		oscParams.push(g);
		oscParams.push(p);
	}
	for (var oscItem = 0; oscItem < oscArray.length; oscItem++) {
		oscArray[oscItem].updateThisDestinationList();
	}
}

function updateMainVolume() {
	mainVolume.gain.value = document.getElementById("mainVolumeSlider").value;
}

function setAttributes(object, attrs) {
		for (var attr in attrs) {
			object[attr] = attrs[attr];
		}
}

function updateFilters(type) {
	if (type=="S") {
		lowPass.frequency.value = document.getElementById("lowPass").value;
		highPass.frequency.value = document.getElementById("highPass").value;
		document.getElementById("valueLowPass").value = document.getElementById("lowPass").value;
		document.getElementById("valueHighPass").value = document.getElementById("highPass").value;
	} else {
		lowPass.frequency.value = document.getElementById("valueLowPass").value;
		highPass.frequency.value = document.getElementById("valueHighPass").value;
		document.getElementById("lowPass").value = document.getElementById("valueLowPass").value;
		document.getElementById("highPass").value = document.getElementById("valueHighPass").value;
	}
}

function updateFiltersMinMax() {
	document.getElementById("lowPass").min = document.getElementById("minLowPass").value;
	document.getElementById("lowPass").max = document.getElementById("maxLowPass").value;
	document.getElementById("highPass").min = document.getElementById("minHighPass").value;
	document.getElementById("highPass").max = document.getElementById("maxHighPass").value;
}

function createPresetJSON() {
	var dlButton = document.getElementById("presetDownloader");
	var preset = {}
	preset["mainVolume"] = mainVolume.gain.value;
	preset["lowPass"] = lowPass.frequency.value;
	preset["lowPassMin"] = document.getElementById("lowPass").min;
	preset["lowPassMax"] = document.getElementById("lowPass").max;
	preset["highPass"] = highPass.frequency.value;
	preset["highPassMin"] = document.getElementById("highPass").min;
	preset["highPassMax"] = document.getElementById("highPass").max;
	preset["numOscs"] = 0;
	preset["oscArray"] = [];
	for (let index = 0; index < oscArray.length; index++) {
		preset["numOscs"] ++;
		preset["oscArray"].push(new Object());
		preset["oscArray"][index]["frequency"] = oscArray[index].osc.frequency.value;
		preset["oscArray"][index]["frequencyMin"] = oscArray[index].oscFrequency.min;
		preset["oscArray"][index]["frequencyMax"] = oscArray[index].oscFrequency.max;
		preset["oscArray"][index]["gain"] = oscArray[index].oscGain.gain.value;
		preset["oscArray"][index]["gainMin"] = oscArray[index].oscAmplitude.min;
		preset["oscArray"][index]["gainMax"] = oscArray[index].oscAmplitude.max;
		preset["oscArray"][index]["pan"] = oscArray[index].panNode.pan.value;
		preset["oscArray"][index]["destination"] = oscArray[index].oscDests.value;
		preset["oscArray"][index]["type"] = oscArray[index].osc.type;
	}
	//Set download button link and make visible
	presetJSON = "data:text/json;charset=utf-8,"+ encodeURIComponent(JSON.stringify(preset));
	dlButton.href = presetJSON;
	dlButton.style.visibility = "visible";
}

async function loadPreset() {
	//Access file
	var preset = document.getElementById("presetUploader").files[0];
	var reader = new FileReader()
	reader.readAsText(preset);
	//Clear current loaded oscs
	for (i = 0; i < oscArray.length; i++) {
		oscArray[i].osc.disconnect();
		delete oscArray[i];
	}
	oscArray = [];
	oscParams = [];
	delete Osc.numInstances;
	document.getElementById("oscs").innerHTML = "";
	//Doesn't work without this (I think it tries to read the result before it's finished reading)
	await new Promise(r => setTimeout(r, 1000));
	preset = JSON.parse(reader.result);
	//Load data for non-osc elements
	document.getElementById("mainVolumeSlider").value = preset["mainVolume"];
	updateMainVolume();

	document.getElementById("minLowPass").value = preset["lowPassMin"];
	document.getElementById("maxLowPass").value = preset["lowPassMax"];
	document.getElementById("minHighPass").value = preset["highPassMin"];
	document.getElementById("maxHighPass").value = preset["highPassMax"];
	updateFiltersMinMax();

	document.getElementById("lowPass").value = preset["lowPass"];;
	document.getElementById("highPass").value = preset["highPass"];
	updateFilters("S");

	for (let i = 0; i < preset["numOscs"]; i++) {
		createOsc()
		//Load data into oscs from file
		oscArray[i].maxFreqValue.value = preset["oscArray"][i]["frequencyMax"];
		oscArray[i].minFreqValue.value = preset["oscArray"][i]["frequencyMin"];
		oscArray[i].maxAmpValue.value = preset["oscArray"][i]["gainMax"];
		oscArray[i].minAmpValue.value = preset["oscArray"][i]["gainMin"];
		oscArray[i].updateMinMax();

		oscArray[i].oscFreqVal.value = preset["oscArray"][i]["frequency"];
		oscArray[i].updateFrequency("B");

		oscArray[i].oscAmpVal.value = preset["oscArray"][i]["gain"];
		oscArray[i].updateAmplitude("B");

		oscArray[i].panSlider.value = preset["oscArray"][i]["pan"];
		oscArray[i].updatePan();

		oscArray[i].osc.type = preset["oscArray"][i]["type"];
	}
	for (let i = 0; i < preset["numOscs"]; i++) {
		//Set destinations after oscs have been created
		oscArray[i].oscDests.value = preset["oscArray"][i]["destination"];
		oscArray[i].updateDestination();
	}
	document.getElementById("presetUploader").value = null;
}

function hideDownloadButton() {
	document.getElementById("presetDownloader").style.visibility = "hidden";
}

function switchVisualiser() {
	visualiseMode = 1 - visualiseMode;
}

function playWaveform() {
	//clears canvas
	canvasCtx.clearRect( 0, 0, WIDTH, HEIGHT);
	analyser.fftSize = 2048;
	bufferLength = analyser.frequencyBinCount;
	dataArray = new Uint8Array(bufferLength);
	function draw() {
		if (visualiseMode == 0) {
			// variable to enable looping of draw function
			var drawVisual = requestAnimationFrame(draw);
			//time domain data
			analyser.getByteTimeDomainData(dataArray);
			//canvas settings
			canvasCtx.fillStyle = '#7B8291';
			canvasCtx.fillRect( 0, 0, WIDTH, HEIGHT);
			canvasCtx.lineWidth = 2;
			canvasCtx.strokeStyle = '#3B4251';
			canvasCtx.beginPath();
			//width of each segment of the line to be drawn by dividing canvas
			var sliceWidth = WIDTH * 1.0 / bufferLength;
			var x = 0;
			const ampCoefficient = 1;
			//looping to get define position of wave at each point in buffer
			for (var i = 0; i < bufferLength; i++){
				var v = ampCoefficient * dataArray[i] / 128;
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

		} else {
			var drawVisual = requestAnimationFrame(draw);

    	analyser.getByteFrequencyData(dataArray);

    	canvasCtx.fillStyle = '#7B8291';
    	canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			var barWidth = (WIDTH / bufferLength) * 5;
			var barHeight;
			var x = 0;

			for (var i = 0; i < bufferLength; i++) {
      	barHeight = dataArray[i];

      	canvasCtx.fillStyle = '#3B4251';
      	canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight);

      	x += barWidth + 1;
			}
		}
	}
	draw();
}

let flock = [];

const DEFAULT_BOIDS = 250;
let boidsS, boidsP, boidsN = DEFAULT_BOIDS;

let cont;
let hideB;
let menuOn = true;
let hiddenButtonC;

let pauseC, directionC, desiredC, hueC, vision1C, vision2C, neighborsC;
let alignS, alignP,
	cohesionS, cohesionP,
	separationS, separationP;
let trailS, trailP;

let bounceC;
let visionS, visionP;
let maxForceS, maxForceP, maxSpeedS, maxSpeedP;
let noiseS, noiseP;
let mouseForce;
let sqVis;

let mouseIsOver = true;

let explode = 0;
let explodePos = Vec2.create();

let shareB, copiedText = 0;

let debugC;
let fpsP, fpsA = [];
let indexC;

let nextB;
let nextFrame = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	colorMode(HSB, 255);
	
	cont = select('#container');

	cont.mouseOver(() => mouseIsOver = false);
	cont.mouseOut(() => mouseIsOver = true);

	createElement("h3", "boids").parent(cont);
	createP(`left and right click to move the boids, or just watch their flocking patterns!
		<br>double click to make an explosion
		<br>middle click or click in the top right to toggle this menu`).parent(cont);

	pauseC = createCheckbox(" ", false).parent(cont);
	pauseC.id("pauser");

	nextB = createButton("next frame").parent(pauseC);
	nextB.class("nexter");
	nextB.mousePressed(() => nextFrame = true);

	// shareB = createButton("share your settings!").parent(cont);
	resetB = createButton("reset simulation").parent(cont);
	resetB.mousePressed(() => {
		updatePageURL(window.location.href.split('?')[0]);
		location.reload();
	})

	// shareB.mousePressed(e => {
	// 	copiedText = 1;
	// 	shareB.html("copied link!");
	// 	shareB.class("copied");
	// 	const el = document.createElement('textarea');
	// 	el.value = SURL();
	// 	document.body.appendChild(el);
	// 	el.select();
	// 	document.execCommand('copy');
	// 	document.body.removeChild(el);
	// });

	boidsP = createP("number of boids: " + DEFAULT_BOIDS).parent(cont);
	boidsS = createSlider(5, 1000, DEFAULT_BOIDS, 5).parent(cont);
	boidsS.elt.value = parseInt(param("bds")) || boidsS.elt.value;

	createElement("h4", "visual settings").parent(cont);
	let exists;
	let hiddenButtonD; exists = param("hid") !== null;
	if (exists) hiddenButtonD = param("hid") === "true";
	else hiddenButtonD = false;
	hiddenButtonC = createCheckbox(" hide top right square (it still works)", hiddenButtonD).parent(cont);

	let directionD; exists = param("dir") !== null;
	if (exists) directionD = param("dir") === "true";
	else directionD = true;
	directionC = createCheckbox(" show boid directions", directionD).parent(cont);
	
	let desiredD; exists = param("des") !== null;
	if (exists) desiredD = param("des") === "true";
	else desiredD = false;
	desiredC = createCheckbox(" show boid desired directions", desiredD).parent(cont);
	
	let hueD; exists = param("hue") !== null;
	if (exists) hueD = param("hue") === "true";
	else hueD = true;
	hueC = createCheckbox(" change hues to indicate speed", hueD).parent(cont);
	
	let vision1D; exists = param("vs1") !== null;
	if (exists) vision1D = param("vs1") === "true";
	else vision1D = false;
	vision1C = createCheckbox(" show vision areas", vision1D).parent(cont);
	
	let vision2D; exists = param("vs2") !== null;
	if (exists) vision2D = param("vs2") === "true";
	else vision2D = false;
	vision2C = createCheckbox(" show vision outlines", vision2D).parent(cont);
	
	let neighborsD; exists = param("nei") !== null;
	if (exists) neighborsD = param("nei") === "true";
	else neighborsD = false;
	neighborsC = createCheckbox(" show visible neighbors", neighborsD).parent(cont);
	
	trailP = createP("trail opacity: 50").parent(cont);
	trailS = createSlider(0, 120, 50, 5).parent(cont);
	trailS.elt.value = parseInt(param("trl")) || trailS.elt.value;
	
	createElement("h4", "boid movement").parent(cont);
	let bounceD; exists = param("bnc") !== null;
	if (exists) bounceD = param("bnc") === "true";
	else bounceD = false;
	bounceC = createCheckbox(" bounce off of edges", bounceD).parent(cont);
	
	visionP = createP("boid vision: 75").parent(cont);
	visionS = createSlider(0, 500, 75, 5).parent(cont);
	visionS.elt.value = parseInt(param("vis")) || visionS.elt.value;
	
	alignP = createP("alignment force: 1").parent(cont);
	alignS = createSlider(0, 4, 1, 0.1).parent(cont);
	alignS.elt.value = parseFloat(param("aln")) || alignS.elt.value;
	cohesionP = createP("cohesion force: 1").parent(cont);
	cohesionS = createSlider(0, 4, 1, 0.1).parent(cont);
	cohesionS.elt.value = parseFloat(param("csn")) || cohesionS.elt.value;
	separationP = createP("separation force: 1").parent(cont);
	separationS = createSlider(0, 4, 1, 0.1).parent(cont);
	separationS.elt.value = parseFloat(param("sep")) || separationS.elt.value;
	
	maxForceP = createP("steering force: 0.2").parent(cont);
	maxForceS = createSlider(0, 1, 0.2, 0.05).parent(cont);
	maxForceS.elt.value = parseFloat(param("mxf")) || maxForceS.elt.value;
	
	maxSpeedP = createP("max speed: 8").parent(cont);
	maxSpeedS = createSlider(0.5, 16, 8, 0.5).parent(cont);
	maxSpeedS.elt.value = parseFloat(param("mxs")) || maxSpeedS.elt.value;
	
	noiseP = createP("movement randomness: 0").parent(cont);
	noiseS = createSlider(0, 10, 0, 0.5).parent(cont);
	noiseS.elt.value = parseFloat(param("noi")) || noiseS.elt.value;

	createElement("h4", "debug info").parent(cont);
	debugC = createCheckbox(" show debug info", false).parent(cont);
	debugC.elt.onclick = toggleDebug;
	let debugDiv = createDiv().parent(cont);
	debugDiv.class("hidden-o");
	fpsP = createP("fps").parent(debugDiv);
	indexC = createCheckbox(" show boid indices").parent(debugDiv);

	function toggleDebug() {	
		if (debugC.checked()) debugDiv.removeClass("hidden-o");
		else {
			debugDiv.class("hidden-o");
			mouseIsOver = true;
		}
	}

	background(31);
	for (let i = 0; i < DEFAULT_BOIDS; i++) {
		flock.push(new Boid(i));
	}

	document.addEventListener("contextmenu", e => e.preventDefault());

	boidsS.changed(updatePageURL);
	hiddenButtonC.changed(updatePageURL);
	directionC.changed(updatePageURL);
	desiredC.changed(updatePageURL);
	hueC.changed(updatePageURL);
	vision1C.changed(updatePageURL);
	vision2C.changed(updatePageURL);
	neighborsC.changed(updatePageURL);
	trailS.changed(updatePageURL);
	bounceC.changed(updatePageURL);
	visionS.changed(updatePageURL);
	alignS.changed(updatePageURL);
	cohesionS.changed(updatePageURL);
	separationS.changed(updatePageURL);
	maxForceS.changed(updatePageURL);
	maxSpeedS.changed(updatePageURL);
	noiseS.changed(updatePageURL);

	updatePageURL();
}

function param(name, url = window.location.href) {
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function SURL() {
	let b = window.location.href.split('?')[0] + "?";
	function ap(str, p, value) {
		return `${ str }&${ p }=${ value }`;
	}

	b += `&bds=${ boidsN }`;
	b = ap(b, "hid", hiddenButtonC.checked());
	b = ap(b, "dir", directionC.checked());
	b = ap(b, "des", desiredC.checked());
	b = ap(b, "hue", hueC.checked());
	b = ap(b, "vs1", vision1C.checked());
	b = ap(b, "vs2", vision2C.checked());
	b = ap(b, "nei", neighborsC.checked());
	b = ap(b, "trl", trailS.value());
	b = ap(b, "bnc", bounceC.checked());
	b = ap(b, "vis", visionS.value());
	b = ap(b, "aln", alignS.value());
	b = ap(b, "csn", cohesionS.value());
	b = ap(b, "sep", separationS.value());
	b = ap(b, "mxf", maxForceS.value());
	b = ap(b, "mxs", maxSpeedS.value());
	b = ap(b, "noi", noiseS.value());

	return b;
}

function updatePageURL(val) {
	window.history.replaceState({}, document.title, typeof val === "string" ? val : SURL());
}

function draw() {
	if (!pauseC.checked()) {
		background(31, 31, 31, 255 - trailS.value());

		mouseForce = maxSpeedS.value() *
			maxForceS.value() *
			(alignS.value() + cohesionS.value() + separationS.value() + 1) / 12;
		sqVis = visionS.value() * visionS.value();
	
		for (const boid of flock) {
			boid.flock(flock);
		}
		for (const boid of flock) {
			boid.update();
			boid.showData();
		}
		for (const boid of flock) {
			boid.showSelf();
		}
	} else {
		background(31, 31, 31, 255);

		if (nextFrame) {
			mouseForce = maxSpeedS.value() * maxForceS.value() *
				(alignS.value() + cohesionS.value() + separationS.value() + 1) / 12;
			sqVis = visionS.value() * visionS.value();
			
			for (const boid of flock) {
				boid.flock(flock);
			}
			for (const boid of flock) {
				boid.update();
			}
			nextFrame = false;
		}
	
		for (const boid of flock) {
			boid.showData();
		}
		for (const boid of flock) {
			boid.showSelf();
		}
	}

	if (boidsN !== boidsS.value()) {
		let n = boidsS.value();
		if (boidsN > n) {
			flock = flock.slice(0, n);
		} else {
			for (let i = boidsN; i < n; i++) {
				flock.push(new Boid(i));
			}
		}
		boidsN = n;
	}

	if (explode > 0.001) {
		const dia = sqrt(explode) * 150;
		fill(0, dia);
		strokeWeight(0.5);
		stroke(255, dia);

		ellipse(explodePos[0], explodePos[1], dia, dia);
		explode *= 0.9;
	}

	if (copiedText > 0.001) {
		copiedText *= 0.9;
		if (copiedText <= 0.001) {
			shareB.html("share your settings!");
			shareB.removeClass("copied");
		}
	}

	boidsP.html("number of boids: " + boidsS.value());
	trailP.html("trail opacity: " + trailS.value());
	noiseP.html("movement randomness: " + noiseS.value());
	visionP.html("boid vision: " + visionS.value());
	alignP.html("alignment force: " + alignS.value());
	cohesionP.html("cohesion force: " + cohesionS.value());
	separationP.html("separation force: " + separationS.value());
	maxForceP.html("steering force: " + maxForceS.value());
	maxSpeedP.html("max speed: " + maxSpeedS.value());

	if (!hiddenButtonC.checked()) {
		noStroke();
		fill(0);
		rect(width - 40, 0, 40, 40);
	}

	if (debugC.checked()) {
		fpsA.push(1000 / deltaTime);
		let fps = fpsA.reduce((a, v) => a + v, 0) / fpsA.length;
		if (fpsA.length > fps) fpsA.shift();
		fpsP.html("fps: " + fps.toFixed(1));
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function toggleMenu() {
	menuOn = !menuOn;

	if (menuOn) cont.removeClass("hidden");
	else {
		cont.class("hidden");
		mouseIsOver = true;
	}
}

function mousePressed(e) {
	if (e.button === 0 && mouseX >= width - 40 && mouseY <= 40) {
		toggleMenu();
		e.preventDefault();
	}

	if (e && e.button === 1) {
		toggleMenu();
		e.preventDefault();
	}
}

new Hammer(document).on("doubletap", function() {
	if (mouseIsOver) {
		explode = 1;
		Vec2.set(explodePos, mouseX, mouseY);
	}
});
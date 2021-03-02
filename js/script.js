let flock;

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
let vis, sqVis, dbVis;

let mouseIsOver = true;

let explode = 0;
let explodePos = V.create();

let shareB, copiedText = 0;

let debugC;
let fpsP, fpsA = [];
let hideBoidC;
let indexC;
let qtC;

let nextB;
let nextFrame = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	colorMode(HSB, 255);

	initSettings();

	background(31);

	flock = new Flock(DEFAULT_BOIDS);
}

function draw() {
	if (!pauseC.checked()) {
		background(31, 31, 31, 255 - trailS.value());

		mouseForce = maxSpeedS.value() *
			maxForceS.value() *
			(alignS.value() + cohesionS.value() + separationS.value() + 1) / 12;
		vis = visionS.value();
		sqVis = vis * vis;
		dbVis = vis * 2;
	
		flock.update();
		flock.draw();
	} else {
		background(31, 31, 31, 255);

		if (nextFrame) {
			mouseForce = maxSpeedS.value() * maxForceS.value() *
				(alignS.value() + cohesionS.value() + separationS.value() + 1) / 12;
			sqVis = visionS.value() * visionS.value();
			dbVis = visionS.value() * 2;
			
			flock.update();
			nextFrame = false;
		}
	
		flock.draw();
	}

	if (boidsN !== boidsS.value()) {
		flock.resize(boidsS.value());
		boidsN = boidsS.value();
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
		V.set(explodePos, mouseX, mouseY);
	}
});
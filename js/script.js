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
let explodePos = V.create();

let shareB, copiedText = 0;

let debugC;
let fpsP, fpsA = [];
let indexC;

let nextB;
let nextFrame = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	
	colorMode(HSB, 255);

	initSettings();

	background(31);
	for (let i = 0; i < DEFAULT_BOIDS; i++) {
		flock.push(new Boid(i));
	}
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
		V.set(explodePos, mouseX, mouseY);
	}
});
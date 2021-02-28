let flock = [];

let boidsS, boidsP, boidsN = 150;

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

let mouseIsOver = true;

function setup() {
	// createCanvas(800, 600);
	const cnv = createCanvas(windowWidth, windowHeight);
	
	colorMode(HSB, 255);
	
	cont = select('#container');

	cont.mouseOver(() => mouseIsOver = false);
	cont.mouseOut(() => mouseIsOver = true);

	createElement("h3", "boids").parent(cont);
	let infoP = createP(`left and right click to move the boids, or just watch their flocking patterns!
		<br>middle click or click in the top left to toggle this menu`).parent(cont);
	// hideB = createButton("toggle menu").parent(infoP);
	// hideB.mousePressed(toggleMenu);
	
	pauseC = createCheckbox(" paused", false).parent(cont);

	boidsP = createP("number of boids: 150").parent(cont);
	boidsS = createSlider(5, 250, 150, 5).parent(cont);

	createElement("h4", "visual settings").parent(cont);
	hiddenButtonC = createCheckbox(" hide top left rectangle (it still works)", false).parent(cont);
	directionC = createCheckbox(" show boid directions", true).parent(cont);
	desiredC = createCheckbox(" show boid desired directions", false).parent(cont);
	hueC = createCheckbox(" change hues to indicate speed", true).parent(cont);
	vision1C = createCheckbox(" show vision areas", false).parent(cont);
	vision2C = createCheckbox(" show vision outlines", false).parent(cont);
	neighborsC = createCheckbox(" show visible neighbors", false).parent(cont);
	trailP = createP("trail opacity: 50").parent(cont);
	trailS = createSlider(0, 120, 50, 5).parent(cont);

	createElement("h4", "boid movement").parent(cont);
	bounceC = createCheckbox(" bounce off of edges", false).parent(cont);

	visionP = createP("boid vision: 100").parent(cont);
	visionS = createSlider(0, 500, 100, 5).parent(cont);

	alignP = createP("alignment force: 1").parent(cont);
	alignS = createSlider(0, 4, 1, 0.1).parent(cont);
	cohesionP = createP("cohesion force: 1").parent(cont);
	cohesionS = createSlider(0, 4, 1, 0.1).parent(cont);
	separationP = createP("separation force: 1").parent(cont);
	separationS = createSlider(0, 4, 1, 0.1).parent(cont);

	maxForceP = createP("steering force: 0.2").parent(cont);
	maxForceS = createSlider(0, 1, 0.2, 0.05).parent(cont);

	maxSpeedP = createP("max speed: 8").parent(cont);
	maxSpeedS = createSlider(0, 16, 8, 0.5).parent(cont);

	noiseP = createP("movement randomness: 0").parent(cont);
	noiseS = createSlider(0, 10, 0, 0.5).parent(cont);

	background(31);
	for (let i = 0; i < 150; i++) {
		flock.push(new Boid(i));
	}

	document.addEventListener("contextmenu", e => e.preventDefault());
}

function draw() {
	if (!pauseC.checked()) {
		background(31, 31, 31, 255 - trailS.value());
	
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
		rect(0, 0, 20, 20);
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
	if (e.button === 0 && mouseX < 20 && mouseY < 20) {
		toggleMenu();
		e.preventDefault();
	}

	if (e && e.button === 1) {
		toggleMenu();
		e.preventDefault();
	}
}
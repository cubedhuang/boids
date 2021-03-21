const bg = 23;

let flock;

let mouseForce;
let vis, sqVis, dbVis;

let cont;
let mouseIsOver = true;

let explode = 0;
let explodePos = V.create();

let fps = 0, fpsA = [];
let nextFrame = false;

function setup() {
	cont = select('#container');

	cont.mouseOver(() => mouseIsOver = false);
	cont.mouseOut(() => mouseIsOver = true);

	document.addEventListener("contextmenu", e => e.preventDefault());

	createCanvas(windowWidth, windowHeight,);
	
	colorMode(HSB, 255);

	background(bg);

	flock = new Flock(opt.boids);

	flock.update();
}

function draw() {
	mouseForce = opt.maxSpeed *
		opt.maxForce *
		(opt.alignment + opt.cohesion + opt.separation + 1) / 12;
	vis = opt.vision;
	sqVis = vis * vis;
	dbVis = vis * 2;

	if (!opt.paused) {
		background(bg, bg, bg, 255 - opt.trail);

		flock.update();
	} else {
		background(bg, bg, bg, 255);

		if (nextFrame) {
			flock.update();
			nextFrame = false;
		}
	}

	flock.draw();

	if (flock.boids.length !== opt.boids) {
		flock.resize(opt.boids);
	}

	if (explode > 0.001) {
		const dia = sqrt(explode) * 150;
		fill(0, dia);
		strokeWeight(0.5);
		stroke(255, dia);

		ellipse(explodePos[0], explodePos[1], dia, dia);
		explode *= 0.9;
	}

	if (!opt.toggle) {
		stroke(255, 63);
		strokeWeight(6);
		let sx = width - (opt.menu ? 40 : 35);
		let ex = width - (opt.menu ? 15 : 10);
		line(sx, 10, ex, 10);
		line(sx, 20, ex, 20);
		line(sx, 30, ex, 30);
	}

	if (opt.debug) {
		opt.special.fpsA.push(frameRate());
		opt.special.fps = opt.special.fpsA.reduce((a, v) => a + v, 0) / opt.special.fpsA.length;
		if (opt.special.fpsA.length > opt.special.fps) opt.special.fpsA.shift();
		opt.special.rerender++;
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	background(bg, bg, bg, 255);
}

function mousePressed(e) {
	if (e && (
		(e.button === 0 && mouseX >= width - 50 && mouseY <= 40) ||
		(e.button === 1))) {
		opt.menu = !opt.menu;
		e.preventDefault();
	}
}

function keyPressed() {
	if (keyCode === 32) {
		opt.paused = !opt.paused;
		return false;
	}

	if (keyCode === 190 && opt.paused) {
		nextFrame = true;
		return false;
	}
}

new Hammer(document).on("doubletap", function() {
	if (mouseIsOver) {
		explode = 1;
		V.set(explodePos, mouseX, mouseY);
	}
});
const Vec2 = glMatrix.vec2;

function limitVec(vec, length) {
	let l1 = Vec2.sqrLen(vec);
	let l2 = length * length;
	if (l1 <= l2) return;
	Vec2.normalize(vec, vec);
	Vec2.scale(vec, vec, length);
}

class Boid {
	constructor (index) {
		this.index = index;
		this.pos = Vec2.fromValues(random(width), random(height));

		this.vel = Vec2.create();
		Vec2.random(this.vel, random(maxSpeedS.value()));
		this.acc = Vec2.create();

		this.aln = Vec2.create();
		this.csn = Vec2.create();
		this.sep = Vec2.create();

		this.neighbors = [];
		this.dists = [];

		this.temp = Vec2.create();
		this.mouseVec = Vec2.create();
		this.explodeVec = Vec2.create();
	}

	flock(boids) {
		Vec2.zero(this.acc);

		let total = 0;
		Vec2.zero(this.aln);
		Vec2.zero(this.csn);
		Vec2.zero(this.sep);

		this.neighbors = [];
		this.dists = [];

		for (const boid of boids) {
			if (boid === this) continue;

			let d;

			if (this.index > boid.index) {
				let i = boid.neighbors.indexOf(this);
				if (i + 1) {
					d = boid.dists[i];
				} else continue;
			} else d = Vec2.sqrDist(this.pos, boid.pos);
			
			if (d <= sqVis) {
				this.neighbors.push(boid);
				this.dists.push(d);

				Vec2.add(this.aln, this.aln, boid.vel);
				Vec2.add(this.csn, this.csn, boid.pos);
				
				Vec2.sub(this.temp, this.pos, boid.pos);
				Vec2.scale(this.temp, this.temp, 1 / d || 1);
				Vec2.add(this.sep, this.sep, this.temp);
				
				total++;
			}
		}

		if (total > 0) {
			Vec2.normalize(this.aln, this.aln);
			Vec2.scale(this.aln, this.aln, maxSpeedS.value());
			Vec2.sub(this.aln, this.aln, this.vel);
			limitVec(this.aln, maxForceS.value());
			
			Vec2.scale(this.csn, this.csn, 1 / total);
			Vec2.sub(this.csn, this.csn, this.pos);
			Vec2.normalize(this.csn, this.csn);
			Vec2.scale(this.csn, this.csn, maxSpeedS.value());
			Vec2.sub(this.csn, this.csn, this.vel);
			limitVec(this.csn, maxForceS.value());
			
			Vec2.normalize(this.sep, this.sep);
			Vec2.scale(this.sep, this.sep, maxSpeedS.value());
			Vec2.sub(this.sep, this.sep, this.vel);
			limitVec(this.sep, maxForceS.value());
		}

		Vec2.scale(this.aln, this.aln, alignS.value());
		Vec2.scale(this.csn, this.csn, cohesionS.value());
		Vec2.scale(this.sep, this.sep, separationS.value());

		Vec2.add(this.acc, this.acc, this.aln);
		Vec2.add(this.acc, this.acc, this.csn);
		Vec2.add(this.acc, this.acc, this.sep);

		if (mouseIsOver && mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
			Vec2.set(this.mouseVec, mouseX, mouseY);

			const d = Vec2.sqrDist(this.mouseVec, this.pos);

			Vec2.sub(this.mouseVec, this.mouseVec, this.pos);
			Vec2.normalize(this.mouseVec, this.mouseVec);
			Vec2.scale(this.mouseVec, this.mouseVec, 10000 / d || 1);
			limitVec(this.mouseVec, mouseForce);

			if (mouseButton === LEFT) {
				Vec2.add(this.acc, this.acc, this.mouseVec);
			} else if (mouseButton === RIGHT) {
				Vec2.sub(this.acc, this.acc, this.mouseVec);
			}
		}

		if (explode > 0.001) {
			Vec2.copy(this.explodeVec, explodePos);

			const d = Vec2.sqrDist(this.explodeVec, this.pos);

			Vec2.sub(this.explodeVec, this.explodeVec, this.pos);
			Vec2.normalize(this.explodeVec, this.explodeVec);
			Vec2.scale(this.explodeVec, this.explodeVec, explode * 100000 / d || 1);
			limitVec(this.explodeVec, mouseForce * 3);

			Vec2.sub(this.acc, this.acc, this.explodeVec);
		}
	}

	showData() {
		if (vision1C.checked() || vision2C.checked()) {
			if (vision1C.checked()) fill(255, 4);
			else noFill();

			if (vision2C.checked()) {
				strokeWeight(0.5);
				stroke(255, 80);
			}
			else noStroke();
			
			let dia = visionS.value() * 2;
			ellipse(this.pos[0], this.pos[1], dia, dia);
		}
		
		if (directionC.checked()) {
			strokeWeight(1);
			stroke(255, 63);
			Vec2.scale(this.temp, this.vel, 50 / maxSpeedS.value());
			Vec2.add(this.temp, this.temp, this.pos);
			line(this.pos[0], this.pos[1], this.temp[0], this.temp[1]);
		}

		if (desiredC.checked()) {
			if (Vec2.sqrLen(this.acc)) {
				strokeWeight(2);
				stroke(239, 255, 255, 127);
				Vec2.scale(this.temp, this.acc, 10 / maxForceS.value());
				Vec2.add(this.temp, this.temp, this.pos);
				line(this.pos[0], this.pos[1], this.temp[0], this.temp[1]);
			}
		}

		if (neighborsC.checked()) {
			strokeWeight(1);
			stroke(127, 255, 255, 63);

			for (const boid of this.neighbors) {
				if (boid.index > this.index && Vec2.sqrDist(this.pos, boid.pos) <= sqVis)
					line(this.pos[0], this.pos[1], boid.pos[0], boid.pos[1]);
			}
		}
	}

	showSelf() {
		strokeWeight(6);
		if (hueC.checked()) stroke(map(Vec2.len(this.vel), maxSpeedS.value() / 10, maxSpeedS.value(), 0, 127, true), 255, 255);
		else stroke(255);
		point(this.pos[0], this.pos[1]);
	}

	update() {
		Vec2.add(this.vel, this.vel, this.acc);
		Vec2.random(this.temp);
		Vec2.scale(this.temp, this.temp, noiseS.value() * maxSpeedS.value() / 100);
		Vec2.add(this.vel, this.vel, this.temp);
		limitVec(this.vel, maxSpeedS.value());

		Vec2.add(this.pos, this.pos, this.vel);

		if (bounceC.checked()) {
			let ran = false;
			if (this.pos[0] < 0 || this.pos[0] > width) {
				ran = true;
				this.vel[0] = -this.vel[0];
			}
			if (this.pos[1] < 0 || this.pos[1] > height) {
				ran = true;
				this.vel[1] = -this.vel[1];
			}
			if (ran) {
				this.pos[0] = constrain(this.pos[0], 0, width);
				this.pos[1] = constrain(this.pos[1], 0, height);
			}
		} else {
			if (this.pos[0] < 0) this.pos[0] = width;
			if (this.pos[0] > width) this.pos[0] = 0;
			if (this.pos[1] < 0) this.pos[1] = height;
			if (this.pos[1] > height) this.pos[1] = 0;
		}
	}
}
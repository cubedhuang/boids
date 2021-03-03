class Boid {
	constructor (index) {
		this.index = index;
		this.pos = V.from(random(width), random(height));

		this.vel = V.create();
		V.random(this.vel, random(maxSpeedS.value()));
		this.acc = V.create();

		this.aln = V.create();
		this.csn = V.create();
		this.sep = V.create();

		this.neighbors = [];
		this.dists = [];

		this.temp = V.create();
		this.mouseVec = V.create();
		this.explodeVec = V.create();
	}

	flock(flock) {
		V.zero(this.acc);

		let total = 0;
		V.zero(this.aln);
		V.zero(this.csn);
		V.zero(this.sep);

		this.neighbors = [];
		this.dists = [];

		flock.qt.visit((node, x1, y1, x2, y2) => {
			if (node.length) {
				return x1 >= this.pos[0] + vis || y1 >= this.pos[1] + vis || x2 < this.pos[0] - vis || y2 < this.pos[1] - vis;
			}

			let boid = node.data;

			let d;
			if (this.index > boid.index) {
				let i = boid.neighbors.indexOf(this);
				if (~i) {
					d = boid.dists[i];
				} else return;
			} else d = V.sqrDist(this.pos, boid.pos);

			if (d < sqVis) {
				do {
					if (boid !== this) {
						this.neighbors.push(boid);
						this.dists.push(d);
		
						V.add(this.aln, this.aln, boid.vel);
						V.add(this.csn, this.csn, boid.pos);
						
						V.sub(this.temp, this.pos, boid.pos);
						V.sclAdd(this.sep, this.sep, this.temp, 1 / d || 1);
						
						total++;
					}
				} while (boid = node.next?.data);
			}
		});

		// for (const boid of boids) {
		// 	if (boid === this) continue;

		// 	let d;

		// 	if (this.index > boid.index) {
		// 		let i = boid.neighbors.indexOf(this);
		// 		if (i + 1) {
		// 			d = boid.dists[i];
		// 		} else continue;
		// 	} else d = V.sqrDist(this.pos, boid.pos);
			
		// 	if (d <= sqVis) {
		// 		this.neighbors.push(boid);
		// 		this.dists.push(d);

		// 		V.add(this.aln, this.aln, boid.vel);
		// 		V.add(this.csn, this.csn, boid.pos);
				
		// 		V.sub(this.temp, this.pos, boid.pos);
		// 		V.sclAdd(this.sep, this.sep, this.temp, 1 / d || 1);
				
		// 		total++;
		// 	}
		// }

		if (total > 0) {
			V.setLen(this.aln, this.aln, maxSpeedS.value());
			V.sub(this.aln, this.aln, this.vel);
			V.limit(this.aln, this.aln, maxForceS.value());
			
			V.scale(this.csn, this.csn, 1 / total);
			V.sub(this.csn, this.csn, this.pos);
			V.setLen(this.csn, this.csn, maxSpeedS.value());
			V.sub(this.csn, this.csn, this.vel);
			V.limit(this.csn, this.csn, maxForceS.value());
			
			V.setLen(this.sep, this.sep, maxSpeedS.value());
			V.sub(this.sep, this.sep, this.vel);
			V.limit(this.sep, this.sep, maxForceS.value());
		}

		V.sclAdd(this.acc, this.acc, this.aln, alignS.value());
		V.sclAdd(this.acc, this.acc, this.csn, cohesionS.value());
		V.sclAdd(this.acc, this.acc, this.sep, separationS.value());

		if (mouseIsOver && mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
			V.set(this.mouseVec, mouseX, mouseY);

			const d = V.sqrDist(this.mouseVec, this.pos);

			V.sub(this.mouseVec, this.mouseVec, this.pos);
			V.setLen(this.mouseVec, this.mouseVec, 10000 / d || 1);
			V.limit(this.mouseVec, this.mouseVec, mouseForce);

			if (mouseButton === LEFT) {
				V.add(this.acc, this.acc, this.mouseVec);
			} else if (mouseButton === RIGHT) {
				V.sub(this.acc, this.acc, this.mouseVec);
			}
		}

		if (explode > 0.001) {
			V.copy(this.explodeVec, explodePos);

			const d = V.sqrDist(this.explodeVec, this.pos);

			V.sub(this.explodeVec, this.explodeVec, this.pos);
			V.setLen(this.explodeVec, this.explodeVec, explode * 100000 / d || 1);
			V.limit(this.explodeVec, this.explodeVec, mouseForce * 3);

			V.sub(this.acc, this.acc, this.explodeVec);
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
			V.sclAdd(this.temp, this.pos, this.vel, 50 / maxSpeedS.value());
			line(this.pos[0], this.pos[1], this.temp[0], this.temp[1]);
		}

		if (desiredC.checked()) {
			if (V.sqrLen(this.acc)) {
				strokeWeight(2);
				stroke(239, 255, 255, 127);
				V.sclAdd(this.temp, this.pos, this.acc, 10 / maxForceS.value());
				line(this.pos[0], this.pos[1], this.temp[0], this.temp[1]);
			}
		}

		if (neighborsC.checked()) {
			strokeWeight(1);
			stroke(127, 255, 255, 63);

			for (const boid of this.neighbors) {
				if (boid.index > this.index)
					line(this.pos[0], this.pos[1], boid.pos[0], boid.pos[1]);
			}
		}
	}

	showSelf() {
		if (indexC.checked()) {
			noStroke();
			textAlign(CENTER);
			textFont("monospace");
			fill(255);
			text(this.index, this.pos[0], this.pos[1] - 5);
		}

		strokeWeight(6);
		if (hueC.checked()) stroke(map(V.len(this.vel), maxSpeedS.value() / 10, maxSpeedS.value(), 0, 127, true), 255, 255);
		else stroke(255);
		point(this.pos[0], this.pos[1]);
	}

	update() {
		V.add(this.vel, this.vel, this.acc);
		if (noiseS.value()) {
			V.random(this.temp);
			V.sclAdd(this.vel, this.vel, this.temp, noiseS.value() * maxSpeedS.value() / 100);
		}
		V.limit(this.vel, this.vel, maxSpeedS.value());

		V.add(this.pos, this.pos, this.vel);

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
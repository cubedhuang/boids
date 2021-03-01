class Boid {
	constructor (index) {
		this.index = index;
		this.pos = createVector(random(width), random(height));
		this.vel = p5.Vector.random2D();
		this.vel.setMag(random(maxSpeedS.value()));
		this.acc = createVector();
		this.neighbors = [];
		this.dists = [];
	}

	flock(boids) {
		this.acc.mult(0);

		let total = 0;
		let alignment = createVector();
		let cohesion = createVector();
		let separation = createVector();

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
			} else d = this.pos.dist(boid.pos);
			
			if (d <= visionS.value()) {
				this.neighbors.push(boid);
				this.dists.push(d);

				alignment.add(boid.vel);
				cohesion.add(boid.pos);
				
				let diff = p5.Vector.sub(this.pos, boid.pos);
				diff.div((d * d) || 1);
				separation.add(diff);
				
				total++;
			}
		}

		if (total > 0) {
			alignment.div(total);
			alignment.setMag(maxSpeedS.value());
			alignment.sub(this.vel);
			alignment.limit(maxForceS.value());

			cohesion.div(total);
			cohesion.sub(this.pos);
			cohesion.setMag(maxSpeedS.value());
			cohesion.sub(this.vel);
			cohesion.limit(maxForceS.value());

			separation.div(total);
			separation.setMag(maxSpeedS.value());
			separation.sub(this.vel);
			separation.limit(maxForceS.value());
		}

		alignment.mult(alignS.value());
		cohesion.mult(cohesionS.value());
		separation.mult(separationS.value());

		this.acc.add(alignment);
		this.acc.add(cohesion);
		this.acc.add(separation);

		if (mouseIsOver && mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
			let mouseVector = createVector(mouseX, mouseY);

			const d = mouseVector.dist(this.pos);

			mouseVector.sub(this.pos);
			mouseVector.normalize();
			mouseVector.div(d * d / 10000 || 1);
			mouseVector.limit(mouseForce);

			if (mouseButton === LEFT) {
				this.acc.add(mouseVector);
			} else if (mouseButton === RIGHT) {
				this.acc.sub(mouseVector);
			}
		}

		if (explode > 0.001) {
			let mouseVector = explodePos.copy();

			const d = mouseVector.dist(this.pos);

			mouseVector.sub(this.pos);
			mouseVector.normalize();
			mouseVector.setMag(explode);
			mouseVector.div(d * d / 100000 || 1);
			mouseVector.limit(mouseForce * 3);

			this.acc.sub(mouseVector);
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
			ellipse(this.pos.x, this.pos.y, dia, dia);
		}
		
		if (directionC.checked()) {
			strokeWeight(1);
			stroke(255, 63);
			let end = p5.Vector.add(this.pos, p5.Vector.mult(this.vel, 50 / maxSpeedS.value()));
			line(this.pos.x, this.pos.y, end.x, end.y);
		}

		if (desiredC.checked()) {
			if (this.acc.magSq()) {
				strokeWeight(2);
				stroke(239, 255, 255, 127);
				let end = p5.Vector.add(this.pos, p5.Vector.mult(this.acc, 10 / maxForceS.value()));
				line(this.pos.x, this.pos.y, end.x, end.y);
			}
		}

		if (neighborsC.checked()) {
			strokeWeight(1);
			stroke(127, 255, 255, 63);

			for (const boid of this.neighbors) {
				if (boid.index > this.index && this.pos.dist(boid.pos) <= visionS.value())
					line(this.pos.x, this.pos.y, boid.pos.x, boid.pos.y);
			}
		}
	}

	showSelf() {
		strokeWeight(6);
		if (hueC.checked()) stroke(map(this.vel.mag(), maxSpeedS.value() / 10, maxSpeedS.value(), 0, 127, true), 255, 255);
		else stroke(255);
		point(this.pos.x, this.pos.y);
	}

	update() {
		this.vel.add(this.acc);
		let noise = p5.Vector.random2D();
		noise.mult(noiseS.value());
		noise.mult(maxSpeedS.value() / 100);
		this.vel.add(noise);
		this.vel.limit(maxSpeedS.value());

		this.pos.add(this.vel);

		if (bounceC.checked()) {
			let ran = false;
			if (this.pos.x < 0 || this.pos.x > width) {
				ran = true;
				this.vel.x = -this.vel.x;
			}
			if (this.pos.y < 0 || this.pos.y > height) {
				ran = true;
				this.vel.y = -this.vel.y;
			}
			if (ran) {
				let center = createVector(width / 2, height / 2);
				center.sub(this.pos);
				center.div(center.dist(this.pos));
				this.acc.add(center);
				this.pos.x = constrain(this.pos.x, 0, width);
				this.pos.y = constrain(this.pos.y, 0, height);
			}
		} else {
			if (this.pos.x < 0) this.pos.x = width;
			if (this.pos.x > width) this.pos.x = 0;
			if (this.pos.y < 0) this.pos.y = height;
			if (this.pos.y > height) this.pos.y = 0;
		}
	}
}
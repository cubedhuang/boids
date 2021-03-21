class Flock {
	constructor(boids) {
		this.length = boids;
		this.reset();
	}

	update() {
		for (const boid of this.boids) {
			B.update(boid);
		}
		this.quadtree();
		if (opt.particle || opt.vision === 0)
			for (const boid of this.boids)
				B.interact(boid, flock);
		else
			for (const boid of this.boids) {
				B.flock(boid, flock);
				B.interact(boid);
			}
	}

	quadtree() {
		this.qt = d3.quadtree()
			.extent([[-1, -1], [width + 1, height + 1]])
			.addAll(this.boids);
	}

	draw() {
		for (const boid of this.boids) {
			if ((opt.paused || opt.particle) && opt.neighbors) {
				B.neighbors(boid, this);
			}
			B.showData(boid);
		}

		if (opt.direction) {
			let m = 30 / opt.maxSpeed;

			drawingContext.lineWidth = 1;
			drawingContext.strokeStyle = "rgba(255, 255, 255, 0.25)";
			drawingContext.beginPath();
			for (const boid of this.boids) {
				drawingContext.moveTo(boid[0], boid[1]);
				drawingContext.lineTo(boid[0] + boid[2] * m, boid[1] + boid[3] * m);
			}
			drawingContext.stroke();
		}

		if (opt.desired) {
			let m = 10 / opt.maxForce;

			drawingContext.lineWidth = 1;
			drawingContext.strokeStyle = "rgba(255, 0, 127, 0.5)";
			drawingContext.beginPath();
			for (const boid of this.boids) {
				drawingContext.moveTo(boid[0], boid[1]);
				drawingContext.lineTo(boid[0] + boid[4] * m, boid[1] + boid[5] * m);
			}
			drawingContext.stroke();
		}
		
		if (!opt.hidden) {
			for (const boid of this.boids) {
				B.showBoid(boid);
			}
		}

		if (opt.quadtree) {
			strokeWeight(0.5);
			stroke(0, 255, 255, 191);
			noFill();
			this.qt.visit((node, x0, y0, x1, y1) => {
				rect(x0, y0, x1 - x0, y1 - y0);
			});
		}
	}

	resize(n) {
		if (this.boids.length > n) {
			this.boids = this.boids.slice(0, n);
		} else {
			for (let i = this.boids.length; i < n; i++) {
				this.boids.push(B.create(i));
			}
		}
	}

	reset() {
		this.boids = [];

		for (let i = 0; i < this.length; i++) {
			this.boids.push(B.create(i));
		}

		this.quadtree();
	}
}
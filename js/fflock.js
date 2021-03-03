class Flock {
	constructor(boids) {
		this.boids = [];
		this.neighbors = [];
		this.dists = [];

		for (let i = 0; i < boids; i++) {
			this.boids.push(B.create(i));
		}

		this.quadtree();
	}

	update() {
		for (const boid of this.boids) {
			B.update(boid);
		}
		this.quadtree();
		for (const boid of this.boids) {
			B.flock(boid, flock);
		}
	}

	quadtree() {
		this.qt = d3.quadtree()
			.extent([[0, 0], [width, height]])
			.addAll(this.boids);
	}

	draw() {
		for (const boid of this.boids) {
			B.showData(boid);
			if (pauseC.checked()) {
				B.neighbors(boid, this);
			}
		}
		
		if (!hideBoidC.checked()) {
			for (const boid of this.boids) {
				B.showBoid(boid);
			}
		}

		if (qtC.checked()) {
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
}
const accessorX = d => d.pos[0];
const accessorY= d => d.pos[1];

class Flock {
	constructor(boids) {
		this.boids = [];

		for (let i = 0; i < boids; i++) {
			this.boids.push(new Boid(i));
		}

		this.quadtree();
	}

	update() {
		for (const boid of this.boids) {
			boid.flock(this);
		}
		for (const boid of this.boids) {
			boid.update();
		}
		this.quadtree();
	}

	quadtree() {
		this.qt = d3.quadtree()
			.extent([[0, 0], [width, height]])
			.x(accessorX)
			.y(accessorY)
			.addAll(this.boids);
	}

	draw() {
		for (const boid of this.boids) {
			boid.showData();
		}
		
		if (!hideBoidC.checked()) {
			for (const boid of this.boids) {
				boid.showSelf();
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
				this.boids.push(new Boid(i));
			}
		}
	}
}
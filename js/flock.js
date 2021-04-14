class Flock {
	constructor(boids) {
		this.length = boids;
		this.boids = [];
		this.buckets = [];
		this.space = {};
		this.organize();
		this.reset();
	}

	update() {
		if (this.length !== opt.boids) {
			this.resize(opt.boids);
		}

		for (const boid of this.boids) {
			boid.update();
		}
		
		if (opt.particle || opt.vision === 0)
			for (const boid of this.boids)
				boid.interact();
		else {
			this.organize();
			for (const boid of this.boids) {
				boid.flock(flock);
				boid.interact();
			}
		}
	}

	draw() {
		// for (const boid of this.boids) {
		// 	if ((opt.paused || opt.particle) && opt.neighbors) {
		// 		B.neighbors(boid, this);
		// 	}
		// 	B.showData(boid);
		// }

		// if (opt.direction) {
		// 	let m = 30 / opt.maxSpeed;

		// 	drawingContext.lineWidth = 1;
		// 	drawingContext.strokeStyle = "rgba(255, 255, 255, 0.25)";
		// 	drawingContext.beginPath();
		// 	for (const boid of this.boids) {
		// 		drawingContext.moveTo(boid[0], boid[1]);
		// 		drawingContext.lineTo(boid[0] + boid[2] * m, boid[1] + boid[3] * m);
		// 	}
		// 	drawingContext.stroke();
		// }

		// if (opt.desired) {
		// 	let m = 10 / opt.maxForce;

		// 	drawingContext.lineWidth = 1;
		// 	drawingContext.strokeStyle = "rgba(255, 0, 127, 0.5)";
		// 	drawingContext.beginPath();
		// 	for (const boid of this.boids) {
		// 		drawingContext.moveTo(boid[0], boid[1]);
		// 		drawingContext.lineTo(boid[0] + boid[4] * m, boid[1] + boid[5] * m);
		// 	}
		// 	drawingContext.stroke();
		// }
		
		if (!opt.hidden) {
			for (const boid of this.boids) {
				boid.show();
			}
		}

		if (opt.buckets) {
			this.space.shape.alpha = 0.3;
		} else this.space.shape.alpha = 0;
	}

	resize(n) {
		this.length = n;

		if (this.boids.length > n) {
			while (this.boids.length > n) {
				this.boids.pop().destroy();
			}
		} else {
			for (let i = this.boids.length; i < n; i++) {
				this.boids.push(new Boid(i));
			}
		}
	}

	reset() {
		const l = this.length;
		this.resize(0);
		this.resize(l);
	}

	organize() {
		let s = opt.vision;
		if (this.space.scale !== s || this.space.gwidth !== g.width || this.space.gheight !== g.height) {
			this.space.scale = s;
	
			this.space.gwidth = g.width;
			this.space.gheight = g.height;
			this.space.width = Math.ceil(g.width / this.space.scale) * this.space.scale;
			this.space.height = Math.ceil(g.height / this.space.scale) * this.space.scale;
			const shape = this.space.shape ??= new PIXI.Graphics();

			shape.clear();
			shape.lineStyle(0.5, 0xffffff);
			
			for (let row = 0; row < this.space.height; row += this.space.scale) {
				for (let col = 0; col < this.space.width; col += this.space.scale) {
					shape.drawRect(col, row, this.space.scale, this.space.scale);
				}
			}

			app.stage.addChild(shape);
		}

		this.buckets.fill(undefined);

		for (const boid of this.boids) {
			const row = Math.floor(boid[1] / this.space.scale);
			const col = Math.floor(boid[0] / this.space.scale);
			this.buckets[row] ??= [];
			this.buckets[row][col] ??= [];
			this.buckets[row][col].push(boid);
		}
	}

	_b(r, c, a) {
		if (this.buckets[r]?.[c])
			a.push(...this.buckets[r][c]);
	}

	candidates(boid) {
		const cand = [];

		const row = Math.floor(boid[1] / this.space.scale);
		const col = Math.floor(boid[0] / this.space.scale);

		this._b(row    , col    , cand);
		this._b(row    , col + 1, cand);
		this._b(row    , col - 1, cand);
		this._b(row + 1, col    , cand);
		this._b(row + 1, col + 1, cand);
		this._b(row + 1, col - 1, cand);
		this._b(row - 1, col    , cand);
		this._b(row - 1, col + 1, cand);
		this._b(row - 1, col - 1, cand);

		return cand;
	}
}
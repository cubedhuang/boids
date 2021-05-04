class Flock {
	constructor(boids) {
		this.length = boids;
		this.boids = [];
		this.buckets = [];
		this.space = {
			shape: null,
			scale: null,
			gwidth: null,
			gheight: null,
			width: null,
			height: null
		};
		this.organize();
		this.reset();
	}

	update() {
		if (this.length !== opt.boids) this.resize(opt.boids);

		for (const boid of this.boids) boid.update();

		if (opt.particle || opt.vision === 0)
			for (const boid of this.boids) boid.interact();
		else {
			this.organize();
			for (const boid of this.boids) {
				boid.flock(flock);
				boid.interact();
			}
		}
	}

	draw() {
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
		if (
			this.space.scale !== s ||
			this.space.gwidth !== g.width ||
			this.space.gheight !== g.height
		) {
			this.space.scale = s;

			this.space.gwidth = g.width;
			this.space.gheight = g.height;
			this.space.width = Math.ceil(g.width / s) * s;
			this.space.height = Math.ceil(g.height / s) * s;
			const shape = (this.space.shape ??= new PIXI.Graphics());

			shape.clear();
			shape.lineStyle(0.5, 0xffffff);

			for (let row = 0; row < this.space.height; row += s) {
				for (let col = 0; col < this.space.width; col += s) {
					shape.drawRect(col, row, s, s);
				}
			}

			app.stage.addChild(shape);
		}

		this.buckets.fill(undefined);

		for (const boid of this.boids) {
			const row = Math.floor(boid.y / this.space.scale);
			const col = Math.floor(boid.x / this.space.scale);
			this.buckets[row] ??= [];
			this.buckets[row][col] ??= [];
			this.buckets[row][col].push(boid);
		}
	}

	_b(r, c, a) {
		if (this.buckets[r]?.[c]) a.push(...this.buckets[r][c]);
	}

	candidates(boid) {
		const cand = [];

		const row = Math.floor(boid.y / this.space.scale);
		const col = Math.floor(boid.x / this.space.scale);

		this._b(row, col, cand);
		this._b(row, col + 1, cand);
		this._b(row, col - 1, cand);
		this._b(row + 1, col, cand);
		this._b(row + 1, col + 1, cand);
		this._b(row + 1, col - 1, cand);
		this._b(row - 1, col, cand);
		this._b(row - 1, col + 1, cand);
		this._b(row - 1, col - 1, cand);

		return cand;
	}
}

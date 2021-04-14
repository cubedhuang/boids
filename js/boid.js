/**
 * 0, 1 = position
 * 2, 3 = velocity
 * 4, 5 = acceleration
 * 6 = index
 * 7 = pixi shape
 * 8 = shape mode
 */

class Boid extends V2D {
	constructor(index) {
		super(random(g.width), random(g.height));

		this.vel = V2D.random(random(opt.maxSpeed));
		this.acc = new V2D();

		this.index = index;

		this.shape = new PIXI.Graphics();
		this.shapeMode = null;

		this.desired = new PIXI.Graphics();
		this.desired.clear();
		this.desired.beginFill();
		this.desired.lineStyle(2, hsv(0.9, 1, 1));
		this.desired.moveTo(0, 0);
		this.desired.lineTo(12, 0);
		this.desired.endFill();
		this.desired.alpha = 0;

		app.stage.addChild(this.shape);
		app.stage.addChild(this.desired);
	}

	neighbors(flock) {
		const cand = flock.candidates(this);
		const ns = [];
		const ds = [];

		let step = opt.accuracy === 0 ? 1 : Math.ceil(cand.length / opt.accuracy);

		for (let i = Math.floor(random(step)); i < cand.length; i += step) {
			if (!cand[i]) break;
			const d = this.sqrDist(cand[i]);
			if (d < g.sqVis && this !== cand[i]) {
				ns.push(cand[i]);
				ds.push(d);
			}
		}

		return [ns, ds];
	}

	flock(flock) {
		this.acc.zero();
		
		const aln = new V2D();
		const csn = new V2D();
		const sep = new V2D();

		let [ns, ds] = this.neighbors(flock);

		let i = 0;
		for (const other of ns) {
			aln.add(other.vel);
			csn.add(other);

			let diff = [this[0] - other[0], this[1] - other[1]];
			sep.sclAdd(diff, 1 / (ds[i] || 1));

			i++;
		}

		if (ns.length > 0) {
			aln.setLen(opt.maxSpeed)
				.sub(this.vel)
				.max(opt.maxForce);

			csn.scale(1 / ns.length)
				.sub(this)
				.setLen(opt.maxSpeed)
				.sub(this.vel)
				.max(opt.maxForce);
			
			sep.setLen(opt.maxSpeed)
				.sub(this.vel)
				.max(opt.maxForce);
		}

		this.acc.sclAdd(aln, opt.alignment);
		this.acc.sclAdd(csn, opt.cohesion);
		this.acc.sclAdd(sep, opt.separation);
	}

	interact() {
		if (opt.particle) {
			this.acc.zero();
		}

		if (g.mouse.down && g.mouse.over) {
			const mv = new V2D(g.mouse.x, g.mouse.y);

			const d = mv.sqrDist(this);

			mv.sub(this)
				.setLen(10000 / d || 1)
				.max(g.mouseForce);

			if (g.mouse.button === 0) {
				this.acc.add(mv);
			} else if (g.mouse.button === 2) {
				this.acc.sub(mv);
			}
		}

		if (g.explode > 0.001) {
			const ev = V2D.copy(g.explodePos);

			const d = ev.sqrDist(this);

			ev.sub(this)
				.setLen(g.explode * 100000 / d || 1)
				.max(g.mouseForce * 3);

			this.acc.sub(ev);
		}
	}

	update() {
		this.vel.add(this.acc);

		if (opt.drag)
			this.vel.scale(1 - opt.drag);
		if (opt.noise) {
			const temp = V2D.random(opt.noise / 20);
			this.vel.add(temp, opt.noise * opt.maxSpeed / 100);
		}
		if (opt.minSpeed) {
			if (this.vel.sqrLen() === 0) this.vel.random(0.1);
			this.vel.min(opt.minSpeed);
		}

		this.vel.max(opt.maxSpeed);
		this.add(this.vel);

		if (opt.bounce) {
			let ran = false;
			if (this[0] < 0 || this[0] > g.width) {
				ran = true;
				this.vel[0] *= -1;
			}
			if (this[1] < 0 || this[1] > g.height) {
				ran = true;
				this.vel[1] *= -1;
			}
			if (ran) {
				this[0] = constrain(this[0], 0, g.width);
				this[1] = constrain(this[1], 0, g.height);
			}
		} else {
			if (this[0] < 0) this[0] = g.width;
			if (this[0] > g.width) this[0] = 0;
			if (this[1] < 0) this[1] = g.height;
			if (this[1] > g.height) this[1] = 0;
		}
	}

	show() {
		this.shape = this.getShape();
		this.shape.x = this[0];
		this.shape.y = this[1];
		this.shape.rotation = Math.atan2(this.vel[1], this.vel[0]);
		
		if (opt.hues)
			this.shape.tint = hsv(constrain(this.vel.len() / (opt.maxSpeed * 2), 0, 1), 1, 1);
		else this.shape.tint = 0xffffff;

		if (opt.desired && this.acc.sqrLen() > 0.01) {
			this.desired.alpha = 0.5;
			this.desired.x = this[0];
			this.desired.y = this[1];
			this.desired.rotation = Math.atan2(this.acc[1], this.acc[0]);
		} else this.desired.alpha = 0;
	}

	getShape() {
		if (this.shapeMode !== g.shapeMode) {
			this.shape.clear();

			this.shape.beginFill(0xffffff);
			this.shape.lineStyle();
			this.shape.moveTo(6, 0);
			this.shape.lineTo(-6, -4);
			this.shape.lineTo(-4, 0);
			this.shape.lineTo(-6, 4);
			this.shape.lineTo(6, 0);
			this.shape.endFill();

			if (opt.areas || opt.outlines) {
				this.shape.beginFill(opt.areas ? 0xffffff : 0, 0.03);
				this.shape.lineStyle(opt.outlines ? 0.5 : 0, 0xffffff, 0.2);
				this.shape.drawCircle(0, 0, g.vis);
				this.shape.endFill();
			}

			this.shape.alpha = 0.8;

			this.shapeMode = g.shapeMode;
		}

		return this.shape;
	}

	destroy() {
		this.shape.destroy();
		this.desired.destroy();
	}
}
function random(a, b) {
	if (b === undefined)
		return Math.random() * a;
	return Math.random() * (b - a) + a;
}

function max(a, b) {
	if (a >= b) return a;
	return b;
}

function constrain(x, a, b) {
	if (x < a) return a;
	if (x > b) return b;
	return x;
}

function hsv(h, s, v) {
    let r, g, b, i, f, p, q, t;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

	const R = Math.round(r * 255);
	const G = Math.round(g * 255);
	const B = Math.round(b * 255);
    return 0x010000 * R + 0x000100 * G + 0x000001 * B;
}

class V2D extends Array {
	static copy(v) {
		return new V2D(v[0], v[1]);
	}

	static random(scale) {
		const r = Math.random() * 2.0 * Math.PI;
		return new V2D(Math.cos(r) * scale, Math.sin(r) * scale)
	}

	static add(a, b) {
		return new V2D(a[0] + b[0], a[1] + b[1])
	}

	static sub(a, b) {
		return new V2D(b[0] - a[0], b[1] - a[1])
	}

	constructor(x = 0, y = 0) {
		super(x, y);
	}

	set(x, y) {
		this[0] = x;
		this[1] = y;
		return this;
	}

	// SCALAR PROPERTIES ----------------------------

	sqrLen() {
		return this[0] * this[0] + this[1] * this[1];
	}

	len() {
		return Math.hypot(this[0], this[1]);
	}

	sqrDist(v) {
		const x = this[0] - v[0],
			y = this[1] - v[1];
		return x * x + y * y;
	}

	dist(v) {
		return Math.hypot(this[0] - v[0], this[1] - v[1]);
	}

	dot(v) {
		return v[0] * this[0] + v[1] * this[1];
	}

	// UNARY -----------------------------------------

	zero() {
		this[0] = 0;
		this[1] = 0;
		return this;
	}

	normalize() {
		let l = this.sqrLen();
		if (l > 0) {
			l = 1 / Math.sqrt(l);
		}
		this[0] *= l;
		this[1] *= l;
		return this;
	}

	random(scale) {
		const r = Math.random() * 2.0 * Math.PI;
		this[0] = Math.cos(r) * scale;
		this[1] = Math.sin(r) * scale;
		return this;
	}

	// SCALAR INPUT ----------------------------------

	scale(mult) {
		this[0] *= mult;
		this[1] *= mult;
		return this;
	}

	setLen(scale) {
		let l = this.sqrLen();
		if (l > 0) {
			l = scale / Math.sqrt(l);
		}
		this[0] *= l;
		this[1] *= l;
		return this;
	}

	max(scale) {
		const l1 = this.sqrLen();
		const l2 = scale * scale;
		if (l1 <= l2) {
			return this;
		}
		this.setLen(scale);
		return this;
	}

	min(scale) {
		const l1 = this.sqrLen();
		const l2 = scale * scale;
		if (l1 >= l2) {
			return this;
		}
		this.setLen(scale);
		return this;
	}

	// VECTOR INPUT -----------------------------------

	add(v) {
		this[0] += v[0];
		this[1] += v[1];
		return this;
	}

	sub(v) {
		this[0] -= v[0];
		this[1] -= v[1];
		return this;
	}

	sclAdd(v, scale) {
		this[0] += v[0] * scale;
		this[1] += v[1] * scale;
		return this;
	}
}
/**
 * Most of this is taken from the library glMatrix,
 * but i've only taken the features that i really need for the boids
 */

const V = {
	create() {
		return [0, 0];
	},

	from(x, y) {
		let out = [0, 0];
		out[0] = x;
		out[1] = y;
		return out;
	},

	copy(out, a) {
		out[0] = a[0];
		out[1] = a[1];
		return out;
	},

	set(out, x, y) {
		out[0] = x;
		out[1] = y;
		return out;
	},

	zero(out) {
		out[0] = 0.0;
		out[1] = 0.0;
		return out;
	},

	normalize(out, a) {
		let x = a[0],
			y = a[1];
		let len = x * x + y * y;
		if (len > 0) {
			len = 1 / Math.sqrt(len);
		}
		out[0] = a[0] * len;
		out[1] = a[1] * len;
		return out;
	},

	add(out, a, b) {
		out[0] = a[0] + b[0];
		out[1] = a[1] + b[1];
		return out;
	},

	sub(out, a, b) {
		out[0] = a[0] - b[0];
		out[1] = a[1] - b[1];
		return out;
	},

	scale(out, a, b) {
		out[0] = a[0] * b;
		out[1] = a[1] * b;
		return out;
	},

	sclAdd(out, a, b, scale) {
		out[0] = a[0] + b[0] * scale;
		out[1] = a[1] + b[1] * scale;
		return out;
	},

	setLen(out, a, b) {
		let x = a[0],
			y = a[1];
		let len = x * x + y * y;
		if (len > 0) {
			len = b / Math.sqrt(len);
		}
		out[0] = a[0] * len;
		out[1] = a[1] * len;
		return out;
	},

	max(out, a, b) {
		let l1 = V.sqrLen(a);
		let l2 = b * b;
		if (l1 <= l2) {
			V.copy(out, a);
			return out;
		}
		V.setLen(out, a, b);
		return out;
	},

	min(out, a, b) {
		let l1 = V.sqrLen(a);
		let l2 = b * b;
		if (l1 >= l2) {
			V.copy(out, a);
			return out;
		}
		V.setLen(out, a, b);
		return out;
	},

	random(out, scale = 1.0) {
		let r = Math.random() * 2.0 * Math.PI;
		out[0] = Math.cos(r) * scale;
		out[1] = Math.sin(r) * scale;
		return out;
	},

	sqrLen(a) {
		let x = a[0],
			y = a[1];
		return x * x + y * y;
	},

	len(a) {
		let x = a[0],
			y = a[1];
		return Math.hypot(x, y);
	},

	sqrDist(a, b) {
		let x = b[0] - a[0],
			y = b[1] - a[1];
		return x * x + y * y;
	},

	dot(a, b) {
		return a[0] * b[0] + a[1] * b[1];
	}
};
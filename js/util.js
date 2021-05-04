const random = (() => {
	const size = 1000000;
	const lookup = new Array(size);
	let i = -1;

	for (let i = 0; i < size; i++) {
		lookup[i] = Math.random();
	}

	return (a, b) => {
		const r = lookup[++i >= size ? (i = 0) : i];
		return b ? r * (b - a) + a : r * a;
	};
})();

function max(a, b) {
	if (a >= b) return a;
	return b;
}

function constrain(x, a, b) {
	if (x <= a) return a;
	if (x >= b) return b;
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
		case 0:
			(r = v), (g = t), (b = p);
			break;
		case 1:
			(r = q), (g = v), (b = p);
			break;
		case 2:
			(r = p), (g = v), (b = t);
			break;
		case 3:
			(r = p), (g = q), (b = v);
			break;
		case 4:
			(r = t), (g = p), (b = v);
			break;
		case 5:
			(r = v), (g = p), (b = q);
			break;
	}

	const R = Math.round(r * 255);
	const G = Math.round(g * 255);
	const B = Math.round(b * 255);
	return 0x010000 * R + 0x000100 * G + 0x000001 * B;
}

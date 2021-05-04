// i made this library and it has jsdoc but it's not released or anything

/**
 * 2D vector
 */
class V2D {
	/**
	 * Returns a new V2D from an array with components in [0] and [1]
	 * @param {Array} v Array to copy
	 * @returns {V2D}
	 */
	static fromArray(array) {
		return new V2D(array[0], array[1]);
	}

	/**
	 * Returns a new V2D from an object with x and y properties
	 * @param {Object} v Array to copy
	 * @returns {V2D}
	 */
	static fromObject(array) {
		return new V2D(array.x, array.y);
	}

	/**
	 * Creates a random vector with a specified magnitude
	 * @param {number} scale Magnitude of the random vector
	 * @returns {V2D}
	 */
	static random(scale = 1) {
		const r = Math.random() * 2.0 * Math.PI;
		return new V2D(Math.cos(r) * scale, Math.sin(r) * scale);
	}

	/**
	 * Adds two vectors and returns the resultant
	 * @param {V2D} a First vector
	 * @param {V2D} b Second vector
	 * @returns {V2D}
	 */
	static add(a, b) {
		return new V2D(a.x + b.x, a.y + b.y);
	}

	/**
	 * Subtracts two vectors and returns the resultant
	 * @param {V2D} a First vector
	 * @param {V2D} b Second vector
	 * @returns {V2D}
	 */
	static sub(a, b) {
		return new V2D(a.x - b.x, a.y - b.y);
	}

	/**
	 * Multiplies a vector by a scalar value and returns the resultant
	 * @param {V2D} v Vector
	 * @param {number} scale Scale
	 * @returns {V2D}
	 */
	static mult(v, scale) {
		return new V2D(v.x * scale, v.y * scale);
	}

	/**
	 * Divides a vector by a scalar value and returns the resultant
	 * @param {V2D} a Vector
	 * @param {number} b Scale
	 * @returns {V2D}
	 */
	static div(v, scale) {
		return new V2D(v.x / scale, v.y / scale);
	}

	/**
	 * Create a new 2D vector
	 * @param {number} x X component
	 * @param {number} y Y component
	 */
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Converts the vector to a string with the x and y components
	 * @param {number} radix Specifies the radix for the components
	 * @returns {string}
	 */
	toString(radix = 10) {
		return `${this.x.toString(radix)},${this.y.toString(radix)}`;
	}

	/**
	 * Converts the vector to an array with components in [0] and [1]
	 * @returns {Array}
	 */
	toArray() {
		return [this.x, this.y];
	}

	/**
	 * Converts the vector to a plain object
	 * @returns {Object}
	 */
	toObject() {
		return { x: this.x, y: this.y };
	}

	/**
	 * Set the components of the vector
	 * @param {number} x X component
	 * @param {number} y Y component
	 * @returns {V2D}
	 */
	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	/**
	 * Copies the given vector to this one
	 * @param {V2D} v Given vector to copy
	 * @returns {V2D}
	 */
	copy(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	/**
	 * Returns a new identical vector
	 * @returns {V2D}
	 */
	clone() {
		return new V2D(this.x, this.y);
	}

	// SCALAR PROPERTIES ----------------------------

	/**
	 * Returns the angle of the vector in radians
	 * @returns {number}
	 */
	angle() {
		return Math.atan2(this.y, this.x);
	}

	/**
	 * Returns the squared magnitude of the vector
	 * @returns {number}
	 */
	sqrMag() {
		return this.x * this.x + this.y * this.y;
	}

	/**
	 * Returns the magnitude of the vector
	 * @returns {number}
	 */
	mag() {
		return Math.hypot(this.x, this.y);
	}

	/**
	 * Returns the squared distance between this vector and a given vector
	 * @param {V2D} v Given vector
	 * @returns {V2D}
	 */
	sqrDist(v) {
		const x = this.x - v.x,
			y = this.y - v.y;
		return x * x + y * y;
	}

	/**
	 * Returns the distance between this vector and a given vector
	 * @param {V2D} v Given vector
	 * @returns {V2D}
	 */
	dist(v) {
		return Math.hypot(this.x - v.x, this.y - v.y);
	}

	/**
	 * Returns the dot product between this vector and a given vector
	 * @param {V2D} v Given vector
	 * @returns {V2D}
	 */
	dot(v) {
		return v.x * this.x + v.y * this.y;
	}

	// UNARY -----------------------------------------

	/**
	 * Sets the vector to 0
	 * @returns {V2D}
	 */
	zero() {
		this.x = 0;
		this.y = 0;
		return this;
	}

	/**
	 * Sets the magnitude of the vector to 1
	 * @returns {V2D}
	 */
	normalize() {
		let l = this.sqrMag();
		if (l > 0) {
			l = 1 / Math.sqrt(l);
		}
		this.x *= l;
		this.y *= l;
		return this;
	}

	// SCALAR INPUT ----------------------------------

	/**
	 * Randomizes the vector with a specified magnitude
	 * @param {number} scale Magnitude of the random vector
	 * @returns {V2D}
	 */
	random(scale) {
		const r = Math.random() * 2.0 * Math.PI;
		this.x = Math.cos(r) * scale;
		this.y = Math.sin(r) * scale;
		return this;
	}

	/**
	 * Rotates the vector by a given angle
	 * @param {number} angle The angle to rotate the vector in radians
	 * @returns {V2D}
	 */
	rotate(angle) {
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		const rx = this.x * cos - this.y * sin;
		this.y = this.x * sin + this.y * cos;
		this.x = rx;
		return this;
	}

	/**
	 * Multiplies the vector by a given scale
	 * @param {number} scale Factor to scale the vector
	 * @returns {V2D}
	 */
	mult(scale) {
		this.x *= scale;
		this.y *= scale;
		return this;
	}

	/**
	 * Divides the vector by a given scale
	 * @param {number} scale Divisor to scale the vector
	 * @returns {V2D}
	 */
	div(scale) {
		this.x /= scale;
		this.y /= scale;
		return this;
	}

	/**
	 * Sets the vector's magnitude to a given scale
	 * @param {number} scale Magnitude of the resulting vector
	 * @returns {V2D}
	 */
	setMag(scale) {
		let l = this.sqrMag();
		if (l > 0) {
			l = scale / Math.sqrt(l);
		}
		this.x *= l;
		this.y *= l;
		return this;
	}

	/**
	 * Limits the vector's magnitude upwards to a given scale
	 * @param {number} scale Maximum magnitude of the resulting vector
	 * @returns {V2D}
	 */
	max(scale) {
		const l1 = this.sqrMag();
		const l2 = scale * scale;
		if (l1 <= l2) {
			return this;
		}
		this.setMag(scale);
		return this;
	}

	/**
	 * Limits the vector's downwards to a given scale
	 * @param {number} scale Minimum magnitude of the resulting vector
	 * @returns {V2D}
	 */
	min(scale) {
		const l1 = this.sqrMag();
		const l2 = scale * scale;
		if (l1 >= l2) {
			return this;
		}
		this.setMag(scale);
		return this;
	}

	// VECTOR INPUT -----------------------------------

	/**
	 * Adds the vector to a given vector
	 * @param {V2D} v The vector to add
	 * @returns {V2D}
	 */
	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	/**
	 * Subtracts a given vector from the vector
	 * @param {V2D} v The vector to subtract
	 * @returns {V2D}
	 */
	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	/**
	 * Adds the vector to a given vector after multiplying the given vector by a given scale
	 * @param {V2D} v The vector to scale and add
	 * @param {number} scale The scaling factor
	 * @returns {V2D}
	 */
	sclAdd(v, scale) {
		this.x += v.x * scale;
		this.y += v.y * scale;
		return this;
	}
}

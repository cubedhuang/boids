function getDefaults() {
	return {
		menu: true,
		paused: false,
		rboids: 1500,

		toggle: false,
		desired: false,
		hues: true,
		areas: false,
		outlines: false,

		particle: false,
		bounce: false,
		raccuracy: 5,
		rvision: 25,
		ralignment: 1.1,
		rbias: 1.5,
		rcohesion: 1,
		rseparation: 1.1,
		rmaxForce: 0.2,
		rminSpeed: 1,
		rmaxSpeed: 4,
		rdrag: 0.005,
		rnoise: 1,

		debug: false,
		buckets: false,

		special: {
			encode: {
				menu: "a",
				paused: "b",
				rboids: "c",

				toggle: "d",
				desired: "e",
				hues: "f",
				areas: "g",
				outlines: "h",

				bounce: "i",
				particle: "j",
				raccuracy: "k",
				rvision: "l",
				ralignment: "m",
				rbias: "n",
				rcohesion: "o",
				rseparation: "p",
				rmaxForce: "q",
				rminSpeed: "r",
				rmaxSpeed: "s",
				rdrag: "t",
				rnoise: "u",

				debug: "v",
				buckets: "w"
			},
			fpsA: [],
			fps: 60,

			inExport: false,
			inImport: false,

			save: "",
			inSave: ""
		}
	};
}

const opt = new Vue({
	el: "#app",

	data: getDefaults,

	watch: {
		maxSpeed(v) {
			if (v < this.rminSpeed) this.rminSpeed = v;
		},

		toggle(v) {
			if (!v) app.stage.addChild(g.sprites.menu);
			else app.stage.removeChild(g.sprites.menu);
		},

		areas() {
			g.shapeMode++;
		},
		outlines() {
			g.shapeMode++;
		},
		noise() {
			g.noiseRange = (Math.PI / 80) * opt.noise;
		},

		rbias(val) {
			g.bias = parseFloat(val);
		},

		["special.inImport"](val) {
			console.log("test");
			if (val) this.special.inSave = "";
		}
	},

	computed: {
		boids() {
			return parseFloat(this.rboids);
		},
		// trail() { return parseFloat(this.rtrail) },
		accuracy() {
			const v = Math.round(2 ** parseFloat(this.raccuracy));
			if (v === 1024) return 0;
			return v;
		},
		vision() {
			return parseFloat(this.rvision);
		},
		alignment() {
			return parseFloat(this.ralignment);
		},
		cohesion() {
			return parseFloat(this.rcohesion);
		},
		separation() {
			return parseFloat(this.rseparation);
		},
		maxForce() {
			return parseFloat(this.rmaxForce);
		},
		minSpeed() {
			return parseFloat(this.rminSpeed);
		},
		maxSpeed() {
			return parseFloat(this.rmaxSpeed);
		},
		drag() {
			return parseFloat(this.rdrag);
		},
		noise() {
			return parseFloat(this.rnoise);
		}
	},

	methods: {
		restart() {
			flock.reset();
		},

		reset() {
			Object.assign(this.$data, getDefaults());
		},

		next() {
			g.nextFrame = true;
		},

		exportSave() {
			let array = [];

			const entries = Object.entries(this.$data);
			for (const [key, value] of entries) {
				if (key === "special") continue;

				const k = this.special.encode[key];

				if (typeof value === "boolean") array.push(`${k}=${value ? "1" : "0"}`);
				else array.push(`${k}=${value}`);
			}

			this.special.save = btoa(array.join("|"));
			this.special.inExport = true;
		},

		importSave() {
			const str = this.special.inSave.trim();
			if (!str) return;

			let split = atob(str).split("|");
			let args = new Map();
			for (const arg of split) {
				try {
					const [key, val] = arg.split("=");
					args.set(key, val);
				} catch {}
			}

			for (const [key, value] of Object.entries(this.$data)) {
				const param = args.get(this.special.encode[key]);
				if (!param) continue;

				if (typeof value === "boolean") {
					this[key] = param !== "0";
				} else {
					this[key] = parseFloat(param);
				}
			}

			this.special.inImport = false;
		},

		copy() {
			document.getElementById("exporter").select();
			document.execCommand("copy");
		}
	}
});

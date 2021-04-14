const opt = new Vue({
	el: "#container",

	data: {
		menu: true,
		paused: false,
		rboids: 1500,

		toggle: false,
		direction: false,
		desired: false,
		hues: true,
		areas: false,
		outlines: false,

		particle: false,
		bounce: false,
		raccuracy: 5,
		rvision: 25,
		ralignment: 1,
		rcohesion: 1,
		rseparation: 1,
		rmaxForce: 0.2,
		rminSpeed: 1,
		rmaxSpeed: 4,
		rdrag: 0.005,
		rnoise: 0,

		debug: false,
		indices: false,
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
				rcohesion: "n",
				rseparation: "o",
				rmaxForce: "p",
				rminSpeed: "q",
				rmaxSpeed: "r",
				rdrag: "s",
				rnoise: "t",
				
				debug: "u",
				indices: "v",
				buckets: "w",
			},
			fpsA: [],
			fps: 60,
		},
	},

	watch: {
		maxSpeed(v) {
			if (v < this.rminSpeed)
				this.rminSpeed = v;
		},

		toggle(v) {
			if (!v) app.stage.addChild(g.sprites.menu);
			else app.stage.removeChild(g.sprites.menu);
		},

		areas() { g.shapeMode++ },
		outlines() { g.shapeMode++ },
	},

	computed: {
		boids() { return parseFloat(this.rboids) },
		// trail() { return parseFloat(this.rtrail) },
		accuracy() {
			const v = Math.round(2 ** parseFloat(this.raccuracy));
			if (v === 1024) return 0;
			return v;
		},
		vision() { return parseFloat(this.rvision) },
		alignment() { return parseFloat(this.ralignment) },
		cohesion() { return parseFloat(this.rcohesion) },
		separation() { return parseFloat(this.rseparation) },
		maxForce() { return parseFloat(this.rmaxForce) },
		minSpeed() { return parseFloat(this.rminSpeed) },
		maxSpeed() { return parseFloat(this.rmaxSpeed) },
		drag() { return parseFloat(this.rdrag) },
		noise() { return parseFloat(this.rnoise) },
	},
	
	methods: {
		restart() {
			flock.reset();
		},

		reset() {
			this.updateURL(window.location.href.split('?')[0]);
			location.reload();
		},

		next() {
			g.nextFrame = true;
		},
		
		getURL() {
			let array = [window.location.href.split("?")[0] + "?"];

			const entries = Object.entries(this.$data);
			for (const [key, value] of entries) {
				if (key === "special") continue;

				const k = this.special.encode[key];
				
				if (typeof value === "boolean")
					array.push(`${ k }=${ value ? "1" : "0" }`);
				else array.push(`${ k }=${ value }`);
			}
		
			return array.join("&");
		},

		updateURL(val) {
			window.history.replaceState({}, document.title, typeof val === "string" ? val : this.getURL());
		},
	},

	created() {
		setInterval(this.updateURL, 1000);

		if (window.location.href.split("?").length < 2) {
			this.updateURL();
			return;
		}

		function param(name) {
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(window.location.href);
			if (!results) return null;
			if (!results[2]) return "";
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		}

		const entries = Object.entries(this.$data);
		for (const [key, value] of entries) {
			const p = param(this.special.encode[key] || "");
			if (!p) continue;

			if (typeof value === "boolean") {
				this[key] = p === "1";
			} else {
				this[key] = parseFloat(p);
			}
		}
	},
});
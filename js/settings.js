const opt = new Vue({
	el: "#container",

	data: {
		menu: true,
		paused: false,
		rboids: 250,

		toggle: false,
		squares: false,
		direction: true,
		desired: false,
		hues: true,
		areas: false,
		outlines: false,
		neighbors: false,
		rtrail: 0,

		bounce: false,
		rvision: 75,
		ralignment: 1,
		rcohesion: 1,
		rseparation: 1,
		rmaxForce: 0.2,
		rmaxSpeed: 8,
		rdrag: 0,
		rnoise: 0,

		debug: false,
		hidden: false,
		indices: false,
		quadtree: false,

		special: {
			rerender: 0,
			encode: {
				menu: "a",
				paused: "b",
				rboids: "c",
			
				toggle: "d",
				squares: "e",
				direction: "f",
				desired: "g",
				hues: "h",
				areas: "i",
				outlines: "j",
				neighbors: "k",
				rtrail: "l",
			
				bounce: "m",
				rvision: "n",
				ralignment: "o",
				rcohesion: "p",
				rseparation: "q",
				rmaxForce: "r",
				rmaxSpeed: "s",
				rdrag: "t",
				rnoise: "u",
			
				debug: "v",
				hidden: "w",
				indices: "x",
				quadtree: "y",
			},
			fpsA: [],
			fps: 60,
		},
	},

	computed: {
		boids() { return parseFloat(this.rboids )},
		trail() { return parseFloat(this.rtrail )},
		vision() { return parseFloat(this.rvision )},
		alignment() { return parseFloat(this.ralignment )},
		cohesion() { return parseFloat(this.rcohesion )},
		separation() { return parseFloat(this.rseparation )},
		maxForce() { return parseFloat(this.rmaxForce )},
		maxSpeed() { return parseFloat(this.rmaxSpeed )},
		drag() { return parseFloat(this.rdrag )},
		noise() { return parseFloat(this.rnoise )},
	},
	
	methods: {
		restart() {
			flock = new Flock(this.boids);
		},

		reset() {
			this.updateURL(window.location.href.split('?')[0]);
			location.reload();
		},

		next() {
			nextFrame = true;
		},

		fps() {
			return fps.toFixed(1);
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
			const p = param(this.special.encode[key]);
			if (!p) continue;

			if (typeof value === "boolean") {
				this[key] = p === "1";
			} else {
				this[key] = parseFloat(p);
			}
		}
	},
});
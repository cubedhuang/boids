const select = (() => {
	const cached = new Map();
	return query => {
		if (cached.has(query)) return cached.get(query);
		const el = document.querySelector(query);
		cached.set(query, el);
		return el;
	};
})();

let toggleMenu, togglePause;

const opt = (() => {
	const defaults = {
		menu: true,
		paused: false,
		boids: 1500,

		toggle: false,
		desired: false,
		hues: true,
		areas: false,
		outlines: false,

		particle: false,
		bounce: false,
		accuracy: 5,
		vision: 25,
		alignment: 1.1,
		bias: 1.5,
		cohesion: 1,
		separation: 1.1,
		maxForce: 0.2,
		minSpeed: 1,
		maxSpeed: 4,
		drag: 0.005,
		noise: 1,

		debug: false,
		buckets: false
	};

	const encode = {
		menu: "a",
		paused: "b",
		boids: "c",

		toggle: "d",
		desired: "e",
		hues: "f",
		areas: "g",
		outlines: "h",

		bounce: "i",
		particle: "j",
		accuracy: "k",
		vision: "l",
		alignment: "m",
		bias: "n",
		cohesion: "o",
		separation: "p",
		maxForce: "q",
		minSpeed: "r",
		maxSpeed: "s",
		drag: "t",
		noise: "u",

		debug: "v",
		buckets: "w"
	};

	const data = Object.assign({}, defaults);

	// detecting data changes

	const checks = document.body.querySelectorAll(
		"input[type=checkbox][data-model]"
	);
	const sliders = document.body.querySelectorAll(
		"input[type=range][data-model]"
	);

	for (const el of checks) {
		el.addEventListener("input", e => {
			const model = el.dataset.model;
			data[model] = el.checked;

			if (model === "toggle")
				select("#toggler img").classList.toggle("gone", el.checked);
		});
	}

	for (const el of sliders) {
		const model = el.dataset.model;
		el.addEventListener("input", e => {
			data[model] = parseFloat(el.value);

			if (model === "maxSpeed") {
				const $min = select("[data-model=minSpeed]");
				$min.max = data.maxSpeed;

				if (data.maxSpeed <= data.minSpeed) $min.value = data.maxSpeed;
			} else if (model === "accuracy") {
				const v = Math.round(2 ** parseFloat(data.accuracy));
				if (v === 1024) data.accuracy = 0;
				data.accuracy = v;
			}

			select(`[data-show=${model}]`).textContent = data[model];
		});
	}

	function updateAll() {
		for (const el of checks) {
			const model = el.dataset.model;
			el.checked = data[model];
			if (model === "toggle")
				select("#toggler img").classList.toggle("gone", el.checked);
		}
		for (const el of sliders) {
			const model = el.dataset.model;
			el.value = data[model];
			select(`[data-show=${model}]`).textContent = data[model];
		}
	}
	updateAll();

	// methods to call from html

	toggleMenu = function () {
		data.menu = !data.menu;
		select("#container").classList.toggle("hidden", !data.menu);
		select("#toggler").classList.toggle("hidden", !data.menu);
	};

	togglePause = () => {
		data.paused = !data.paused;
		select("#pauseButton").checked = data.paused;
	};

	const methods = {
		restart() {
			flock.reset();
		},

		reset() {
			Object.assign(data, defaults);
			updateAll();
		},

		next() {
			g.nextFrame = true;
		},

		exportSave() {
			const array = [];

			const entries = Object.entries(data);
			for (const [key, value] of entries) {
				const k = encode[key];

				if (!k) continue;

				if (typeof value === "boolean") array.push(`${k}=${value ? "1" : "0"}`);
				else array.push(`${k}=${value}`);
			}

			select("#exporter").value = btoa(array.join("|"));
			select("#export-popup").classList.add("visible");
			select("#popupwindow").classList.add("visible");
		},

		leaveMenu() {
			select("#popupwindow").classList.remove("visible");
			select("#export-popup").classList.remove("visible");
			select("#import-popup").classList.remove("visible");
		},

		importMenu() {
			select("#importer").value = "";
			select("#import-popup").classList.add("visible");
			select("#popupwindow").classList.add("visible");
		},

		importSave() {
			const str = select("#importer").value.trim();
			if (!str) return;

			const split = atob(str).split("|");
			const args = new Map();
			for (const arg of split) {
				try {
					const [key, val] = arg.split("=");
					args.set(key, val);
				} catch {}
			}

			for (const [key, value] of Object.entries(data)) {
				const param = args.get(encode[key]);
				if (!param) continue;

				if (typeof value === "boolean") {
					data[key] = param !== "0";
				} else {
					data[key] = parseFloat(param);
				}
			}

			methods.leaveMenu();
			updateAll();
		},

		copy() {
			document.getElementById("exporter").select();
			document.execCommand("copy");
		},

		toggleMenu
	};

	document.body
		.querySelectorAll("[data-click]")
		.forEach(el => el.addEventListener("click", methods[el.dataset.click]));

	return data;
})();

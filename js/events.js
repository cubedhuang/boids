(() => {
	const prevent = e => e.preventDefault();

	const cont = document.getElementById("container");
	cont.addEventListener("mouseover", () => (g.mouse.over = false));
	cont.addEventListener("mouseout", () => (g.mouse.over = true));

	app.view.addEventListener("contextmenu", prevent);
	cont.addEventListener("contextmenu", prevent);

	let t = 0;
	document.addEventListener("mousedown", down);
	document.addEventListener("touchstart", e => {
		down(e);
		if (e.timeStamp - t < 500) double();
		else t = e.timeStamp;
	});
	document.addEventListener("mouseup", up);
	document.addEventListener("touchend", up);
	document.addEventListener("mousemove", move);
	document.addEventListener("touchmove", move);
	document.addEventListener("dblclick", double);

	function down(e) {
		g.mouse.x = e.clientX ?? e.touches[0].clientX;
		g.mouse.y = e.clientY ?? e.touches[0].clientY;
		g.mouse.down = true;
		g.mouse.button = e.button || 0;

		if (
			e &&
			((e.button === 0 && g.mouse.x >= g.width - 50 && g.mouse.y <= 40) ||
				e.button === 1)
		) {
			toggleMenu();
			prevent(e);
		}
	}

	function up() {
		g.mouse.down = false;
	}

	function move(e) {
		g.mouse.x = e.clientX ?? e.touches[0].clientX;
		g.mouse.y = e.clientY ?? e.touches[0].clientY;
	}

	function double() {
		if (g.mouse.over) {
			g.explode = 1;
			g.explodePos.copy(g.mouse);
			g.sprites.explode.x = g.explodePos.x;
			g.sprites.explode.y = g.explodePos.y;
		}
	}

	document.addEventListener("keydown", e => {
		if (e.key === " ") {
			togglePause();
			prevent(e);
		}

		if (e.key === "." && opt.paused) {
			g.nextFrame = true;
			prevent(e);
		}
	});

	window.addEventListener("resize", e => {
		g.width = window.innerWidth;
		g.height = window.innerHeight;
		app.renderer.resize(window.innerWidth, window.innerHeight);
	});
})();

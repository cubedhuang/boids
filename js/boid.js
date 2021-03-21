/**
 * 0, 1 = position
 * 2, 3 = velocity
 * 4, 5 = acceleration
 * 6 = index
 */

const B = (() => {
	const temp = V.create();

	const tvel = V.create();
	const tacc = V.create();

	const mvec = V.create();
	const evec = V.create();

	const aln = V.create();
	const csn = V.create();
	const sep = V.create();

	function vel(boid) {
		V.set(temp, boid[2], boid[3]);
		return temp;
	}

	function acc(boid) {
		V.set(temp, boid[4], boid[5]);
		return temp;
	}

	return {
		create(index) {
			let out = [
				random(width), // position
				random(height),
				0, 0, // velocity
				0, 0, // acceleration
				index
			];
			return out;
		},

		neighbors(boid, flock) {
			let ns = [];
			let ds = [];
	
			flock.qt.visit((node, x1, y1, x2, y2) => {
				if (node.length) {
					return x1 >= boid[0] + vis || y1 >= boid[1] + vis || x2 < boid[0] - vis || y2 < boid[1] - vis;
				}

				let d = V.sqrDist(boid, node.data);
				if (d < sqVis) {
					do {
						if (boid !== node.data) {
							ns.push(node.data);
							ds.push(d);
						}
					} while (node = node.next);
				}
			});

			if (opt.neighbors) {
				drawingContext.lineWidth = 1;
				drawingContext.strokeStyle = "rgba(0, 255, 255, 0.25)";
				drawingContext.beginPath();
				for (const other of ns) {
					if (other[6] <= boid[6]) continue;
					drawingContext.moveTo(boid[0], boid[1]);
					drawingContext.lineTo(other[0], other[1]);
				}
				drawingContext.stroke();
			}

			return [ns, ds];
		},

		flock(boid, flock) {
			boid[4] = 0;
			boid[5] = 0;
			
			V.zero(tacc);
			V.zero(aln);
			V.zero(csn);
			V.zero(sep);
	
			let [ns, ds] = this.neighbors(boid, flock);

			let i = 0;

			for (const other of ns) {
				V.add(aln, aln, vel(other));
				V.add(csn, csn, other);

				V.sub(temp, boid, other);
				V.sclAdd(sep, sep, temp, 1 / ds[i] || 1);

				i++;
			}

			if (ns.length > 0) {
				V.setLen(aln, aln, opt.maxSpeed);
				V.sub(aln, aln, vel(boid));
				V.max(aln, aln, opt.maxForce);

				V.scale(csn, csn, 1 / ns.length);
				V.sub(csn, csn, boid);
				V.setLen(csn, csn, opt.maxSpeed);
				V.sub(csn, csn, temp);
				V.max(csn, csn, opt.maxForce);
				
				V.setLen(sep, sep, opt.maxSpeed);
				V.sub(sep, sep, temp);
				V.max(sep, sep, opt.maxForce);
			}
	
			V.sclAdd(tacc, tacc, aln, opt.alignment);
			V.sclAdd(tacc, tacc, csn, opt.cohesion);
			V.sclAdd(tacc, tacc, sep, opt.separation);

			boid[4] = tacc[0];
			boid[5] = tacc[1];
		},

		interact(boid) {
			if (opt.particle) {
				boid[4] = 0;
				boid[5] = 0;
			}
			V.zero(tacc);

			if (mouseIsOver && mouseIsPressed) {
				V.set(mvec, mouseX, mouseY);
	
				const d = V.sqrDist(mvec, boid);
	
				V.sub(mvec, mvec, boid);
				V.setLen(mvec, mvec, 10000 / d || 1);
				V.max(mvec, mvec, mouseForce);
	
				if (mouseButton === LEFT) {
					V.add(tacc, tacc, mvec);
				} else if (mouseButton === RIGHT) {
					V.sub(tacc, tacc, mvec);
				}
			}
	
			if (explode > 0.001) {
				V.copy(evec, explodePos);
	
				const d = V.sqrDist(evec, boid);
	
				V.sub(evec, evec, boid);
				V.setLen(evec, evec, explode * 100000 / d || 1);
				V.max(evec, evec, mouseForce * 3);
	
				V.sub(tacc, tacc, evec);
			}

			boid[4] += tacc[0];
			boid[5] += tacc[1];
		},

		update(boid) {
			tvel[0] = boid[2];
			tvel[1] = boid[3];

			V.add(tvel, tvel, acc(boid));
			if (opt.drag) {
				V.scale(tvel, tvel, 1 - opt.drag);
			}
			if (opt.noise) {
				V.random(temp);
				V.sclAdd(tvel, tvel, temp, opt.noise * opt.maxSpeed / 100);
			}
			if (opt.minSpeed) {
				if (V.sqrLen(tvel) === 0) V.random(tvel, 0.1);
				V.min(tvel, tvel, opt.minSpeed);
			}
			V.max(tvel, tvel, opt.maxSpeed);

			V.add(boid, boid, tvel);

			if (opt.bounce) {
				let ran = false;
				if (boid[0] < 0 || boid[0] > width) {
					ran = true;
					tvel[0] *= -1;
				}
				if (boid[1] < 0 || boid[1] > height) {
					ran = true;
					tvel[1] *= -1;
				}
				if (ran) {
					boid[0] = constrain(boid[0], 0, width);
					boid[1] = constrain(boid[1], 0, height);
				}
			} else {
				if (boid[0] < 0) boid[0] = width;
				if (boid[0] > width) boid[0] = 0;
				if (boid[1] < 0) boid[1] = height;
				if (boid[1] > height) boid[1] = 0;
			}

			boid[2] = tvel[0];
			boid[3] = tvel[1];
		},

		showBoid(boid) {
			if (opt.indices) {
				noStroke();
				textAlign(CENTER);
				textFont("monospace");
				fill(255);
				text(boid[6], boid[0], boid[1] - 5);
			}

			let c;
			if (opt.hues)
				c = color(map(V.len(vel(boid)), opt.minSpeed, opt.maxSpeed, 0, 127, true), 255, 255);
			else c = color(159);

			if (!opt.squares) {
				strokeWeight(4);
				stroke(c);
				point(boid[0], boid[1]);
			} else {
				noStroke();
				fill(c);
				rect(boid[0] - 2, boid[1] - 2, 4, 4);
			}
		},

		showData(boid) {
			if (opt.areas || opt.outlines) {
				if (opt.areas) fill(255, 3);
				else noFill();
	
				if (opt.outlines) {
					strokeWeight(0.5);
					stroke(255, 63);
				}
				else noStroke();
				
				ellipse(boid[0], boid[1], dbVis, dbVis);
			}
		}
	};
})();
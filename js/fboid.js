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
			let out = new Float32Array(7);
			out[0] = random(width);
			out[1] = random(height);
			V.random(temp, random(maxSpeedS.value()));
			out[2] = temp[0];
			out[3] = temp[1];
			out[6] = index;
			return out;
		},

		neighbors(boid, flock) {
			let ns = [];
			let ds = [];
	
			flock.qt.visit((node, x1, y1, x2, y2) => {
				if (node.length) {
					return x1 >= boid[0] + vis || y1 >= boid[1] + vis || x2 < boid[0] - vis || y2 < boid[1] - vis;
				}
	
				let other = node.data;
				let d = V.sqrDist(boid, other);
				if (d < sqVis) {
					do {
						if (boid !== other) {
							ns.push(other);
							ds.push(d);
						}
					} while (other = node.next?.data);
				}
			});

			if (neighborsC.checked()) {
				strokeWeight(1);
				stroke(127, 255, 255, 63);
	
				for (const other of ns) {
					if (other[6] > boid[6])
						line(boid[0], boid[1], other[0], other[1]);
				}
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
				V.setLen(aln, aln, maxSpeedS.value());
				V.sub(aln, aln, vel(boid));
				V.limit(aln, aln, maxForceS.value());

				V.scale(csn, csn, 1 / ns.length);
				V.sub(csn, csn, boid);
				V.setLen(csn, csn, maxSpeedS.value());
				V.sub(csn, csn, vel(boid));
				V.limit(csn, csn, maxForceS.value());
				
				V.setLen(sep, sep, maxSpeedS.value());
				V.sub(sep, sep, vel(boid));
				V.limit(sep, sep, maxForceS.value());
			}
	
			V.sclAdd(tacc, tacc, aln, alignS.value());
			V.sclAdd(tacc, tacc, csn, cohesionS.value());
			V.sclAdd(tacc, tacc, sep, separationS.value());
	
			if (mouseIsOver && mouseIsPressed && mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
				V.set(mvec, mouseX, mouseY);
	
				const d = V.sqrDist(mvec, boid);
	
				V.sub(mvec, mvec, boid);
				V.setLen(mvec, mvec, 10000 / d || 1);
				V.limit(mvec, mvec, mouseForce);
	
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
				V.limit(evec, evec, mouseForce * 3);
	
				V.sub(tacc, tacc, evec);
			}

			boid[4] = tacc[0];
			boid[5] = tacc[1];
		},

		update(boid) {
			tvel[0] = boid[2];
			tvel[1] = boid[3];

			V.add(tvel, tvel, acc(boid));
			if (noiseS.value()) {
				V.random(temp);
				V.sclAdd(tvel, tvel, temp, noiseS.value() * maxSpeedS.value() / 100);
			}
			V.limit(tvel, tvel, maxSpeedS.value());

			V.add(boid, boid, tvel);

			if (bounceC.checked()) {
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
			if (indexC.checked()) {
				noStroke();
				textAlign(CENTER);
				textFont("monospace");
				fill(255);
				text(boid[6], boid[0], boid[1] - 5);
			}

			if (!squareBoidC.checked()) {
				strokeWeight(6);
				if (hueC.checked()) stroke(map(V.len(vel(boid)), maxSpeedS.value() / 10, maxSpeedS.value(), 0, 127, true), 255, 255);
				else stroke(255);
				point(boid[0], boid[1]);
			} else {
				noStroke();
				if (hueC.checked()) fill(map(V.len(vel(boid)), maxSpeedS.value() / 10, maxSpeedS.value(), 0, 127, true), 255, 255);
				else fill(255);
				rect(boid[0] - 3, boid[1] - 3, 6, 6);
			}
		},

		showData(boid) {
			if (vision1C.checked() || vision2C.checked()) {
				if (vision1C.checked()) fill(255, 4);
				else noFill();
	
				if (vision2C.checked()) {
					strokeWeight(0.5);
					stroke(255, 80);
				}
				else noStroke();
				
				let dia = visionS.value() * 2;
				ellipse(boid[0], boid[1], dia, dia);
			}
			
			if (directionC.checked()) {
				strokeWeight(1);
				stroke(255, 63);
				V.sclAdd(tvel, boid, vel(boid), 50 / maxSpeedS.value());
				line(boid[0], boid[1], tvel[0], tvel[1]);
			}
	
			if (desiredC.checked()) {
				if (V.sqrLen(acc(boid))) {
					strokeWeight(2);
					stroke(239, 255, 255, 127);
					V.sclAdd(tacc, boid, acc(boid), 10 / maxForceS.value());
					line(boid[0], boid[1], tacc[0], tacc[1]);
				}
			}
		}
	};
})();
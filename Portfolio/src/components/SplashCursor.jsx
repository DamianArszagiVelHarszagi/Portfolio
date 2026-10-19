import { useEffect, useRef } from "react";
import styles from "./SplashCursor.module.css";

const SIM_RESOLUTION = 128;
const DYE_RESOLUTION = 1024;
const DENSITY_DISSIPATION = 10;
const VELOCITY_DISSIPATION = 3;
const PRESSURE = 0.5;
const PRESSURE_ITERATIONS = 20;
const SPLAT_RADIUS = 0.12;
const SPLAT_FORCE = 1000;

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

// Shared fragment header: t = sim texel size, L/R/T/B sample neighbours
const HEAD = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform vec2 t;
vec4 L(sampler2D s) { return texture(s, vUv - vec2(t.x, 0.0)); }
vec4 R(sampler2D s) { return texture(s, vUv + vec2(t.x, 0.0)); }
vec4 T(sampler2D s) { return texture(s, vUv + vec2(0.0, t.y)); }
vec4 B(sampler2D s) { return texture(s, vUv - vec2(0.0, t.y)); }
`;

const FRAG = {
	splat: `uniform sampler2D uTarget; uniform float aspect, radius; uniform vec2 point; uniform vec3 color;
		void main() { vec2 p = vUv - point; p.x *= aspect; o = vec4(texture(uTarget, vUv).rgb + exp(-dot(p, p) / radius) * color, 1.0); }`,
	advect: `uniform sampler2D uVel, uSrc; uniform float dt, diss;
		void main() { o = texture(uSrc, vUv - dt * texture(uVel, vUv).xy * t) / (1.0 + diss * dt); }`,
	div: `uniform sampler2D uVel;
		void main() { o = vec4(0.5 * (R(uVel).x - L(uVel).x + T(uVel).y - B(uVel).y), 0.0, 0.0, 1.0); }`,
	scale: `uniform sampler2D uSrc; uniform float v;
		void main() { o = v * texture(uSrc, vUv); }`,
	pressure: `uniform sampler2D uP, uDiv;
		void main() { o = vec4((L(uP).x + R(uP).x + T(uP).x + B(uP).x - texture(uDiv, vUv).x) * 0.25, 0.0, 0.0, 1.0); }`,
	grad: `uniform sampler2D uP, uVel;
		void main() { o = vec4(texture(uVel, vUv).xy - vec2(R(uP).x - L(uP).x, T(uP).x - B(uP).x), 0.0, 1.0); }`,
	display: `uniform sampler2D uSrc;
		void main() { vec3 c = texture(uSrc, vUv).rgb; o = vec4(c, max(c.r, max(c.g, c.b))); }`,
};

export default function SplashCursor() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const gl = canvas.getContext("webgl2", { depth: false, antialias: false });
		if (!gl || !gl.getExtension("EXT_color_buffer_float")) return;

		function resize() {
			const dpr = Math.min(window.devicePixelRatio, 2);
			canvas.width = Math.floor(window.innerWidth * dpr);
			canvas.height = Math.floor(window.innerHeight * dpr);
		}
		resize();

		function getRes(res) {
			const w = Math.round(res * (canvas.width / canvas.height));
			return w < res ? { w: res, h: w } : { w, h: res };
		}
		const sim = getRes(SIM_RESOLUTION);
		const dyeRes = getRes(DYE_RESOLUTION);

		// Fullscreen quad
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
			gl.STATIC_DRAW,
		);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(0);

		const P = {};
		for (const [name, frag] of Object.entries(FRAG)) {
			const prog = gl.createProgram();
			for (const [type, src] of [
				[gl.VERTEX_SHADER, VERT],
				[gl.FRAGMENT_SHADER, HEAD + frag],
			]) {
				const shader = gl.createShader(type);
				gl.shaderSource(shader, src);
				gl.compileShader(shader);
				gl.attachShader(prog, shader);
			}
			gl.bindAttribLocation(prog, 0, "aPos");
			gl.linkProgram(prog);
			gl.useProgram(prog);
			gl.uniform2f(gl.getUniformLocation(prog, "t"), 1 / sim.w, 1 / sim.h);
			P[name] = prog;
		}

		function fbo(w, h) {
			const tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGBA16F,
				w,
				h,
				0,
				gl.RGBA,
				gl.HALF_FLOAT,
				null,
			);
			const fb = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER,
				gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D,
				tex,
				0,
			);
			return { tex, fb, w, h };
		}

		function doubleFbo(w, h) {
			const d = { read: fbo(w, h), write: fbo(w, h) };
			d.swap = () => ([d.read, d.write] = [d.write, d.read]);
			return d;
		}

		const vel = doubleFbo(sim.w, sim.h);
		const dye = doubleFbo(dyeRes.w, dyeRes.h);
		const pres = doubleFbo(sim.w, sim.h);
		const div = fbo(sim.w, sim.h);

		// Draw one pass into target (null = screen; double FBOs are swapped after)
		function run(prog, target, uniforms) {
			gl.useProgram(prog);
			let unit = 0;
			for (const [name, v] of Object.entries(uniforms)) {
				const loc = gl.getUniformLocation(prog, name);
				if (v.tex) {
					gl.activeTexture(gl.TEXTURE0 + unit);
					gl.bindTexture(gl.TEXTURE_2D, v.tex);
					gl.uniform1i(loc, unit++);
				} else if (typeof v === "number") gl.uniform1f(loc, v);
				else gl[`uniform${v.length}fv`](loc, v);
			}
			const out = target?.swap ? target.write : target;
			gl.bindFramebuffer(gl.FRAMEBUFFER, out ? out.fb : null);
			gl.viewport(
				0,
				0,
				out ? out.w : canvas.width,
				out ? out.h : canvas.height,
			);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			target?.swap?.();
		}

		let prev = null;
		function onMove(e) {
			const x = e.clientX / window.innerWidth;
			const y = e.clientY / window.innerHeight;
			if (prev) {
				const aspect = canvas.width / canvas.height;
				const k = SPLAT_FORCE * Math.min(aspect, 1);
				const shared = {
					aspect,
					point: [x, 1 - y],
					radius: (SPLAT_RADIUS / 100) * Math.max(aspect, 1),
				};
				const grey = 0.62 + Math.random() * 0.18;
				run(P.splat, vel, {
					...shared,
					uTarget: vel.read,
					color: [(x - prev.x) * k, -(y - prev.y) * k, 0],
				});
				run(P.splat, dye, {
					...shared,
					uTarget: dye.read,
					color: [grey, grey, grey],
				});
			}
			prev = { x, y };
		}

		let last = performance.now();
		let frameId;
		function frame(now) {
			const dt = Math.min((now - last) / 1000, 0.016);
			last = now;
			run(P.div, div, { uVel: vel.read });
			run(P.scale, pres, { uSrc: pres.read, v: PRESSURE });
			for (let i = 0; i < PRESSURE_ITERATIONS; i++)
				run(P.pressure, pres, { uP: pres.read, uDiv: div });
			run(P.grad, vel, { uP: pres.read, uVel: vel.read });
			run(P.advect, vel, {
				uVel: vel.read,
				uSrc: vel.read,
				dt,
				diss: VELOCITY_DISSIPATION,
			});
			run(P.advect, dye, {
				uVel: vel.read,
				uSrc: dye.read,
				dt,
				diss: DENSITY_DISSIPATION,
			});
			run(P.display, null, { uSrc: dye.read });
			frameId = requestAnimationFrame(frame);
		}
		frameId = requestAnimationFrame(frame);

		window.addEventListener("mousemove", onMove);
		window.addEventListener("resize", resize);
		return () => {
			cancelAnimationFrame(frameId);
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("resize", resize);
		};
	}, []);

	return <canvas ref={canvasRef} className={styles.canvas} />;
}

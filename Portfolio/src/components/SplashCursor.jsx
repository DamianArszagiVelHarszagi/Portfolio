import { useEffect, useRef } from "react";

// Selectors that trigger a hover burst
const HOVER_SELECTOR = "a, button, [role='button']";

// Light-grey palette — subtle variation around a neutral grey
function generateColor() {
	const base = 0.62 + Math.random() * 0.18; // 0.62–0.80
	const tint = (Math.random() - 0.5) * 0.06;
	return { r: base + tint, g: base + tint, b: base + tint };
}

export default function SplashCursor({
	SIM_RESOLUTION = 128,
	DYE_RESOLUTION = 1024,
	DENSITY_DISSIPATION = 6,
	VELOCITY_DISSIPATION = 2.5,
	PRESSURE = 0.1,
	PRESSURE_ITERATIONS = 20,
	CURL = 2,
	SPLAT_RADIUS = 0.04,
	SPLAT_FORCE = 1000,
	OPACITY = 0.4,
}) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// ── WebGL context ─────────────────────────────────────────────────────
		function getWebGLContext(c) {
			const params = {
				alpha: true,
				depth: false,
				stencil: false,
				antialias: false,
				preserveDrawingBuffer: false,
			};
			let gl = c.getContext("webgl2", params);
			const isWebGL2 = !!gl;
			if (!isWebGL2)
				gl =
					c.getContext("webgl", params) ||
					c.getContext("experimental-webgl", params);

			let halfFloat, supportLinearFiltering;
			if (isWebGL2) {
				gl.getExtension("EXT_color_buffer_float");
				supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
			} else {
				halfFloat = gl.getExtension("OES_texture_half_float");
				supportLinearFiltering = gl.getExtension(
					"OES_texture_half_float_linear",
				);
			}
			gl.clearColor(0, 0, 0, 1);
			const halfFloatTexType = isWebGL2
				? gl.HALF_FLOAT
				: halfFloat?.HALF_FLOAT_OES;
			let formatRGBA, formatRG, formatR;
			if (isWebGL2) {
				formatRGBA = getSupportedFormat(
					gl,
					gl.RGBA16F,
					gl.RGBA,
					halfFloatTexType,
				);
				formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
				formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
			} else {
				formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
				formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
				formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
			}
			return {
				gl,
				ext: {
					formatRGBA,
					formatRG,
					formatR,
					halfFloatTexType,
					supportLinearFiltering,
				},
			};
		}

		function getSupportedFormat(gl, internalFormat, format, type) {
			if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
				switch (internalFormat) {
					case gl.R16F:
						return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
					case gl.RG16F:
						return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
					default:
						return null;
				}
			}
			return { internalFormat, format };
		}

		function supportRenderTextureFormat(gl, internalFormat, format, type) {
			const tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				internalFormat,
				4,
				4,
				0,
				format,
				type,
				null,
			);
			const fbo = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER,
				gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D,
				tex,
				0,
			);
			return (
				gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
			);
		}

		const { gl, ext } = getWebGLContext(canvas);
		if (!ext.formatRGBA) return;

		// ── Shaders ───────────────────────────────────────────────────────────
		const baseVert = `
			precision highp float;
			attribute vec2 aPosition;
			varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;
			uniform vec2 texelSize;
			void main(){
				vUv=aPosition*0.5+0.5;
				vL=vUv-vec2(texelSize.x,0.);vR=vUv+vec2(texelSize.x,0.);
				vT=vUv+vec2(0.,texelSize.y);vB=vUv-vec2(0.,texelSize.y);
				gl_Position=vec4(aPosition,0.,1.);
			}`;

		const copyFrag = `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;void main(){gl_FragColor=texture2D(uTexture,vUv);}`;
		const clearFrag = `precision mediump float;precision mediump sampler2D;varying highp vec2 vUv;uniform sampler2D uTexture;uniform float value;void main(){gl_FragColor=value*texture2D(uTexture,vUv);}`;

		const splatFrag = `
			precision highp float;precision highp sampler2D;
			varying vec2 vUv;
			uniform sampler2D uTarget;uniform float aspectRatio;uniform vec3 color;uniform vec2 point;uniform float radius;
			void main(){
				vec2 p=vUv-point.xy;p.x*=aspectRatio;
				vec3 splat=exp(-dot(p,p)/radius)*color;
				gl_FragColor=vec4(texture2D(uTarget,vUv).xyz+splat,1.);
			}`;

		const advectionFrag = `
			precision highp float;precision highp sampler2D;
			varying vec2 vUv;
			uniform sampler2D uVelocity;uniform sampler2D uSource;uniform vec2 texelSize;uniform vec2 dyeTexelSize;uniform float dt;uniform float dissipation;
			vec4 bilerp(sampler2D sam,vec2 uv,vec2 tsize){
				vec2 st=uv/tsize-.5;vec2 iuv=floor(st);vec2 fuv=fract(st);
				vec4 a=texture2D(sam,(iuv+vec2(.5,.5))*tsize);vec4 b=texture2D(sam,(iuv+vec2(1.5,.5))*tsize);
				vec4 c=texture2D(sam,(iuv+vec2(.5,1.5))*tsize);vec4 d=texture2D(sam,(iuv+vec2(1.5,1.5))*tsize);
				return mix(mix(a,b,fuv.x),mix(c,d,fuv.x),fuv.y);
			}
			void main(){
				vec2 coord=vUv-dt*bilerp(uVelocity,vUv,texelSize).xy*texelSize;
				vec4 result=bilerp(uSource,coord,dyeTexelSize);
				gl_FragColor=result/(1.+dissipation*dt);
			}`;

		const divFrag = `
			precision mediump float;precision mediump sampler2D;
			varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;
			uniform sampler2D uVelocity;
			void main(){
				float L=texture2D(uVelocity,vL).x,R=texture2D(uVelocity,vR).x;
				float T=texture2D(uVelocity,vT).y,B=texture2D(uVelocity,vB).y;
				vec2 C=texture2D(uVelocity,vUv).xy;
				if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;
				gl_FragColor=vec4(.5*(R-L+T-B),0.,0.,1.);
			}`;

		const curlFrag = `
			precision mediump float;precision mediump sampler2D;
			varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;
			uniform sampler2D uVelocity;
			void main(){
				float L=texture2D(uVelocity,vL).y,R=texture2D(uVelocity,vR).y;
				float T=texture2D(uVelocity,vT).x,B=texture2D(uVelocity,vB).x;
				gl_FragColor=vec4(.5*(R-L-T+B),0.,0.,1.);
			}`;

		const vorticityFrag = `
			precision highp float;precision highp sampler2D;
			varying vec2 vUv;varying vec2 vL;varying vec2 vR;varying vec2 vT;varying vec2 vB;
			uniform sampler2D uVelocity;uniform sampler2D uCurl;uniform float curl;uniform float dt;
			void main(){
				float L=texture2D(uCurl,vL).x,R=texture2D(uCurl,vR).x;
				float T=texture2D(uCurl,vT).x,B=texture2D(uCurl,vB).x,C=texture2D(uCurl,vUv).x;
				vec2 force=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));
				force/=length(force)+.0001;force*=curl*C;force.y*=-1.;
				gl_FragColor=vec4(texture2D(uVelocity,vUv).xy+force*dt,0.,1.);
			}`;

		const pressureFrag = `
			precision mediump float;precision mediump sampler2D;
			varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;
			uniform sampler2D uPressure;uniform sampler2D uDivergence;
			void main(){
				float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x;
				float T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;
				float div=texture2D(uDivergence,vUv).x;
				gl_FragColor=vec4((L+R+B+T-div)*.25,0.,0.,1.);
			}`;

		const gradSubFrag = `
			precision mediump float;precision mediump sampler2D;
			varying highp vec2 vUv;varying highp vec2 vL;varying highp vec2 vR;varying highp vec2 vT;varying highp vec2 vB;
			uniform sampler2D uPressure;uniform sampler2D uVelocity;
			void main(){
				float L=texture2D(uPressure,vL).x,R=texture2D(uPressure,vR).x;
				float T=texture2D(uPressure,vT).x,B=texture2D(uPressure,vB).x;
				vec2 vel=texture2D(uVelocity,vUv).xy-vec2(R-L,T-B);
				gl_FragColor=vec4(vel,0.,1.);
			}`;

		const displayFrag = `
			precision highp float;precision highp sampler2D;
			varying vec2 vUv;
			uniform sampler2D uTexture;uniform vec2 texelSize;
			void main(){
				vec3 c=texture2D(uTexture,vUv).rgb;
				float a=max(c.r,max(c.g,c.b));
				gl_FragColor=vec4(c,a);
			}`;

		// ── Compile / link helpers ────────────────────────────────────────────
		function compile(type, src) {
			const s = gl.createShader(type);
			gl.shaderSource(s, src);
			gl.compileShader(s);
			return s;
		}

		function createProgram(vertSrc, fragSrc) {
			const p = gl.createProgram();
			gl.attachShader(p, compile(gl.VERTEX_SHADER, vertSrc));
			gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fragSrc));
			gl.linkProgram(p);
			const u = {};
			const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
			for (let i = 0; i < n; i++) {
				const { name } = gl.getActiveUniform(p, i);
				u[name] = gl.getUniformLocation(p, name);
			}
			return { prog: p, uniforms: u };
		}

		const P = {
			copy: createProgram(baseVert, copyFrag),
			clear: createProgram(baseVert, clearFrag),
			splat: createProgram(baseVert, splatFrag),
			adv: createProgram(baseVert, advectionFrag),
			div: createProgram(baseVert, divFrag),
			curl: createProgram(baseVert, curlFrag),
			vort: createProgram(baseVert, vorticityFrag),
			pressure: createProgram(baseVert, pressureFrag),
			gradSub: createProgram(baseVert, gradSubFrag),
			display: createProgram(baseVert, displayFrag),
		};

		// ── Geometry ──────────────────────────────────────────────────────────
		gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
			gl.STATIC_DRAW,
		);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
		gl.bufferData(
			gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array([0, 1, 2, 0, 2, 3]),
			gl.STATIC_DRAW,
		);
		gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(0);

		// ── FBOs ──────────────────────────────────────────────────────────────
		function createFBO(w, h, iF, f, t, param) {
			gl.activeTexture(gl.TEXTURE0);
			const tex = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, tex);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texImage2D(gl.TEXTURE_2D, 0, iF, w, h, 0, f, t, null);
			const fbo = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
			gl.framebufferTexture2D(
				gl.FRAMEBUFFER,
				gl.COLOR_ATTACHMENT0,
				gl.TEXTURE_2D,
				tex,
				0,
			);
			gl.viewport(0, 0, w, h);
			gl.clear(gl.COLOR_BUFFER_BIT);
			return {
				texture: tex,
				fbo,
				width: w,
				height: h,
				attach(id) {
					gl.activeTexture(gl.TEXTURE0 + id);
					gl.bindTexture(gl.TEXTURE_2D, tex);
					return id;
				},
			};
		}

		function createDoubleFBO(w, h, iF, f, t, param) {
			let a = createFBO(w, h, iF, f, t, param),
				b = createFBO(w, h, iF, f, t, param);
			return {
				width: w,
				height: h,
				get read() {
					return a;
				},
				get write() {
					return b;
				},
				swap() {
					[a, b] = [b, a];
				},
			};
		}

		function getRes(res) {
			let w = Math.round(res * (canvas.width / canvas.height)),
				h = res;
			if (w < h) {
				[w, h] = [h, w];
			}
			return { width: w, height: h };
		}

		function resizeCanvas() {
			const dpr = Math.min(window.devicePixelRatio, 2);
			canvas.width = Math.floor(window.innerWidth * dpr);
			canvas.height = Math.floor(window.innerHeight * dpr);
		}
		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const texType = ext.halfFloatTexType;
		const rgba = ext.formatRGBA,
			rg = ext.formatRG,
			r = ext.formatR;
		const lin = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
		const simRes = getRes(SIM_RESOLUTION),
			dyeRes = getRes(DYE_RESOLUTION);

		let vel = createDoubleFBO(
			simRes.width,
			simRes.height,
			rg.internalFormat,
			rg.format,
			texType,
			lin,
		);
		let dye = createDoubleFBO(
			dyeRes.width,
			dyeRes.height,
			rgba.internalFormat,
			rgba.format,
			texType,
			lin,
		);
		let div = createFBO(
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);
		let curl = createFBO(
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);
		let pres = createDoubleFBO(
			simRes.width,
			simRes.height,
			r.internalFormat,
			r.format,
			texType,
			gl.NEAREST,
		);

		// ── Blit ──────────────────────────────────────────────────────────────
		function blit(target) {
			if (!target) {
				gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			} else {
				gl.viewport(0, 0, target.width, target.height);
				gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
			}
			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		}

		// ── Splat helpers ─────────────────────────────────────────────────────
		function correctRadius(rad) {
			const ar = canvas.width / canvas.height;
			return ar > 1 ? rad * ar : rad;
		}

		function correctDelta(d) {
			const ar = canvas.width / canvas.height;
			return ar < 1 ? d * ar : d;
		}

		// x, y in canvas px; dx, dy in normalised units * force; color {r,g,b}
		function splat(x, y, dx, dy, color) {
			const { prog, uniforms } = P.splat;
			gl.useProgram(prog);
			gl.uniform1i(uniforms.uTarget, vel.read.attach(0));
			gl.uniform1f(uniforms.aspectRatio, canvas.width / canvas.height);
			gl.uniform2f(uniforms.point, x / canvas.width, 1 - y / canvas.height);
			gl.uniform3f(uniforms.color, dx, -dy, 0);
			gl.uniform1f(uniforms.radius, correctRadius(SPLAT_RADIUS / 100));
			blit(vel.write);
			vel.swap();

			gl.uniform1i(uniforms.uTarget, dye.read.attach(0));
			gl.uniform3f(uniforms.color, color.r, color.g, color.b);
			blit(dye.write);
			dye.swap();
		}

		// Radial burst: n splats in random directions (used on hover)
		function splatBurst(x, y, count = 5) {
			const dpr = Math.min(window.devicePixelRatio, 2);
			const cx = x * dpr,
				cy = y * dpr;
			for (let i = 0; i < count; i++) {
				const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
				const strength = SPLAT_FORCE * (0.4 + Math.random() * 0.5);
				splat(
					cx,
					cy,
					Math.cos(angle) * strength,
					Math.sin(angle) * strength,
					generateColor(),
				);
			}
		}

		// ── Pointer tracking ──────────────────────────────────────────────────
		const pointer = {
			texcoordX: 0,
			texcoordY: 0,
			prevX: 0,
			prevY: 0,
			deltaX: 0,
			deltaY: 0,
			moved: false,
			color: generateColor(),
		};

		function onMouseMove(e) {
			const dpr = Math.min(window.devicePixelRatio, 2);
			pointer.prevX = pointer.texcoordX;
			pointer.prevY = pointer.texcoordY;
			pointer.texcoordX = (e.clientX / canvas.width) * dpr;
			pointer.texcoordY = (e.clientY / canvas.height) * dpr;
			pointer.deltaX = correctDelta(pointer.texcoordX - pointer.prevX);
			pointer.deltaY = correctDelta(pointer.texcoordY - pointer.prevY);
			pointer.moved =
				Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
		}

		// ── Hover burst on interactive elements ───────────────────────────────
		// We use event delegation on document so it works for dynamically mounted elements
		let lastHoverTarget = null;

		function onMouseEnterInteractive(e) {
			const target = e.target.closest(HOVER_SELECTOR);
			if (!target || target === lastHoverTarget) return;
			lastHoverTarget = target;
			splatBurst(e.clientX, e.clientY);
		}

		function onMouseLeaveInteractive(e) {
			if (!e.target.closest(HOVER_SELECTOR)) lastHoverTarget = null;
		}

		document.addEventListener("mouseover", onMouseEnterInteractive);
		document.addEventListener("mouseout", onMouseLeaveInteractive);
		window.addEventListener("mousemove", onMouseMove);

		// ── Simulation step ───────────────────────────────────────────────────
		function step(dt) {
			gl.disable(gl.BLEND);

			gl.useProgram(P.curl.prog);
			gl.uniform2f(
				P.curl.uniforms.texelSize,
				1 / simRes.width,
				1 / simRes.height,
			);
			gl.uniform1i(P.curl.uniforms.uVelocity, vel.read.attach(0));
			blit(curl);

			gl.useProgram(P.vort.prog);
			gl.uniform2f(
				P.vort.uniforms.texelSize,
				1 / simRes.width,
				1 / simRes.height,
			);
			gl.uniform1i(P.vort.uniforms.uVelocity, vel.read.attach(0));
			gl.uniform1i(P.vort.uniforms.uCurl, curl.attach(1));
			gl.uniform1f(P.vort.uniforms.curl, CURL);
			gl.uniform1f(P.vort.uniforms.dt, dt);
			blit(vel.write);
			vel.swap();

			gl.useProgram(P.div.prog);
			gl.uniform2f(
				P.div.uniforms.texelSize,
				1 / simRes.width,
				1 / simRes.height,
			);
			gl.uniform1i(P.div.uniforms.uVelocity, vel.read.attach(0));
			blit(div);

			gl.useProgram(P.clear.prog);
			gl.uniform1i(P.clear.uniforms.uTexture, pres.read.attach(0));
			gl.uniform1f(P.clear.uniforms.value, PRESSURE);
			blit(pres.write);
			pres.swap();

			gl.useProgram(P.pressure.prog);
			gl.uniform2f(
				P.pressure.uniforms.texelSize,
				1 / simRes.width,
				1 / simRes.height,
			);
			gl.uniform1i(P.pressure.uniforms.uDivergence, div.attach(0));
			for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
				gl.uniform1i(P.pressure.uniforms.uPressure, pres.read.attach(1));
				blit(pres.write);
				pres.swap();
			}

			gl.useProgram(P.gradSub.prog);
			gl.uniform2f(
				P.gradSub.uniforms.texelSize,
				1 / simRes.width,
				1 / simRes.height,
			);
			gl.uniform1i(P.gradSub.uniforms.uPressure, pres.read.attach(0));
			gl.uniform1i(P.gradSub.uniforms.uVelocity, vel.read.attach(1));
			blit(vel.write);
			vel.swap();

			gl.useProgram(P.adv.prog);
			gl.uniform2f(
				P.adv.uniforms.texelSize,
				1 / simRes.width,
				1 / simRes.height,
			);
			gl.uniform2f(
				P.adv.uniforms.dyeTexelSize,
				1 / simRes.width,
				1 / simRes.height,
			);
			gl.uniform1i(P.adv.uniforms.uVelocity, vel.read.attach(0));
			gl.uniform1i(P.adv.uniforms.uSource, vel.read.attach(0));
			gl.uniform1f(P.adv.uniforms.dt, dt);
			gl.uniform1f(P.adv.uniforms.dissipation, VELOCITY_DISSIPATION);
			blit(vel.write);
			vel.swap();

			gl.uniform2f(
				P.adv.uniforms.dyeTexelSize,
				1 / dyeRes.width,
				1 / dyeRes.height,
			);
			gl.uniform1i(P.adv.uniforms.uVelocity, vel.read.attach(0));
			gl.uniform1i(P.adv.uniforms.uSource, dye.read.attach(1));
			gl.uniform1f(P.adv.uniforms.dissipation, DENSITY_DISSIPATION);
			blit(dye.write);
			dye.swap();
		}

		function render() {
			gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
			gl.enable(gl.BLEND);
			gl.useProgram(P.display.prog);
			gl.uniform2f(
				P.display.uniforms.texelSize,
				1 / dyeRes.width,
				1 / dyeRes.height,
			);
			gl.uniform1i(P.display.uniforms.uTexture, dye.read.attach(0));
			blit(null);
		}

		// ── RAF loop ──────────────────────────────────────────────────────────
		let lastTime = Date.now();
		let colorTimer = 0;
		let frameId;

		function update() {
			const now = Date.now();
			const dt = Math.min((now - lastTime) / 1000, 0.016);
			lastTime = now;

			// Slowly rotate the palette
			colorTimer += dt * 4;
			if (colorTimer >= 1) {
				colorTimer = 0;
				pointer.color = generateColor();
			}

			if (pointer.moved) {
				splat(
					pointer.texcoordX * canvas.width,
					pointer.texcoordY * canvas.height,
					pointer.deltaX * SPLAT_FORCE,
					pointer.deltaY * SPLAT_FORCE,
					pointer.color,
				);
				pointer.moved = false;
			}

			step(dt);
			render();
			frameId = requestAnimationFrame(update);
		}

		frameId = requestAnimationFrame(update);

		return () => {
			cancelAnimationFrame(frameId);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("resize", resizeCanvas);
			document.removeEventListener("mouseover", onMouseEnterInteractive);
			document.removeEventListener("mouseout", onMouseLeaveInteractive);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100vw",
				height: "100vh",
				pointerEvents: "none",
				zIndex: 9997,
				opacity: OPACITY,
			}}
		/>
	);
}

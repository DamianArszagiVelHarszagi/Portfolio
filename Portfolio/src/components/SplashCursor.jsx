import { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";
import styles from "./SplashCursor.module.css";

const CONFIG = {
	transparent: true,
	shading: false,
	bloom: false,
	sunrays: false,
	colorPalette: ["#D9D9D9"],
	brightness: 8,
	densityDissipation: 5,
	velocityDissipation: 3,
	pressure: 0.5,
	curl: 5,
	splatRadius: 0.12,
	splatForce: 1000,
};

export default function SplashCursor() {
	const containerRef = useRef(null);

	useEffect(() => {
		const container = containerRef.current;
		const fluid = new WebGLFluidEnhanced(container);
		fluid.setConfig(CONFIG);
		fluid.start();

		const canvas = container.querySelector("canvas");
		const onMove = (e) =>
			canvas.dispatchEvent(
				new MouseEvent("mousemove", { clientX: e.clientX, clientY: e.clientY }),
			);
		window.addEventListener("mousemove", onMove);

		return () => {
			window.removeEventListener("mousemove", onMove);
			fluid.stop();
			container.replaceChildren();
		};
	}, []);

	return (
		<div className={styles.wrapper}>
			<div ref={containerRef} className={styles.fluid} />
		</div>
	);
}

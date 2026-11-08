import { useEffect, useRef } from "react";
import Lenis from "lenis";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	useLocation,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Works from "./pages/Works";
import OtherWorks from "./pages/OtherWorks";
import Contact from "./pages/Contact";
import Project from "./pages/Project";
import SplashCursor from "./components/SplashCursor";

import "./App.css";

function SmoothScroll() {
	const location = useLocation();
	const lenisRef = useRef(null);

	useEffect(() => {
		const lenis = new Lenis({
			anchors: true,
			autoRaf: true,
			lerp: 0.055,
			smoothWheel: true,
			touchMultiplier: 1.15,
			wheelMultiplier: 0.82,
		});
		lenisRef.current = lenis;

		return () => {
			lenis.destroy();
			lenisRef.current = null;
		};
	}, []);

	useEffect(() => {
		const lenis = lenisRef.current;

		if (!lenis) return;

		lenis.scrollTo(0, { immediate: true });
		requestAnimationFrame(() => {
			lenis.resize();
		});
	}, [location.pathname]);

	return null;
}

function App() {
	return (
		<>
			<SplashCursor />
			<BrowserRouter>
				<SmoothScroll />
				<Routes>
					<Route element={<MainLayout />}>
						<Route path="/" element={<Home />} />
						<Route
							path="/works"
							element={<Navigate to="/works/react" replace />}
						/>
						<Route
							path="/works/react"
							element={<Works key="react" categoryKey="react" />}
						/>
						<Route
							path="/works/laravel"
							element={<Works key="laravel" categoryKey="laravel" />}
						/>
						<Route path="/works/others" element={<OtherWorks />} />
						<Route path="/works/:slug" element={<Project />} />
						<Route path="/contact" element={<Contact />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;

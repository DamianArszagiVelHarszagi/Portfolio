import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import styles from './MainLayout.module.css';

export default function MainLayout() {
	const location = useLocation();
	const [overlayVisible, setOverlayVisible] = useState(false);
	const [overlayKey, setOverlayKey] = useState(0);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		setOverlayKey(k => k + 1);
		setOverlayVisible(true);
	}, [location.pathname]);

	return (
		<div className={styles.layout}>
			<Sidebar />
			<main className={styles.main}>
				{overlayVisible && (
					<motion.div
						key={overlayKey}
						initial={{ opacity: 1 }}
						animate={{ opacity: 0 }}
						transition={{ duration: 0.8, ease: 'easeInOut' }}
						onAnimationComplete={() => setOverlayVisible(false)}
						style={{
							position: 'fixed',
							inset: 0,
							background: 'black',
							zIndex: 9998,
							pointerEvents: 'none',
						}}
					/>
				)}
				<Outlet />
			</main>
		</div>
	);
}

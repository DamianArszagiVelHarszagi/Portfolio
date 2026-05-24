import { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Works from './pages/Works';
import Contact from './pages/Contact';
import SplashCursor from './components/SplashCursor';
import './App.css';

function SmoothScroll() {
  const location = useLocation();
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });
    lenisRef.current = lenis;
    let frameId;

    function raf(time) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
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
  const [overlayVisible, setOverlayVisible] = useState(true);

  return (
    <>
      <SplashCursor />
      {overlayVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: 'easeInOut' }}
          onAnimationComplete={() => setOverlayVisible(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'black',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}
      <BrowserRouter>
        <SmoothScroll />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/works" element={<Works />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

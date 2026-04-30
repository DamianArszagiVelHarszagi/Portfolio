import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Works from './pages/Works';
import Contact from './pages/Contact';
import './App.css';

function App() {
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
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

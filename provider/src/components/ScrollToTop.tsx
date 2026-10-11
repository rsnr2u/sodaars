import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Global ScrollToTop Component
 *
 * Automatically resets the window scroll position to top (0, 0) upon any internal route navigation.
 * Respects intentional hash/anchor links (e.g., #section) if present in the URL.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If a hash is present, allow intentional anchor navigation
    if (hash) {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      // Retry on next animation frame in case the target element is still mounting
      requestAnimationFrame(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
      return;
    }

    // Normal route navigation without hash: instant reset to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

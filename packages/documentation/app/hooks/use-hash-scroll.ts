import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Hook to handle hash scrolling for anchor links
 * Scrolls to the element with the ID matching the URL hash
 */
export function useHashScroll() {
  const location = useLocation();

  useEffect(() => {
    // Only run if there's a hash in the URL
    if (!location.hash) return;

    // Remove the # to get the element ID
    const elementId = location.hash.substring(1);
    
    // Try to find the element immediately
    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        // Add a small delay to ensure layout is complete
        setTimeout(() => {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest' 
          });
          
          // Add a highlight effect
          element.classList.add('target-highlight');
          setTimeout(() => {
            element.classList.remove('target-highlight');
          }, 2000);
        }, 100);
        return true;
      }
      return false;
    };

    // Try immediately
    if (scrollToElement()) return;

    // If element not found, try again after a delay (for dynamic content)
    const timeoutId = setTimeout(() => {
      scrollToElement();
    }, 500);

    // Also try when images load (they can affect layout)
    const handleLoad = () => {
      scrollToElement();
    };
    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', handleLoad);
    };
  }, [location]);
}

/**
 * Hook to add IDs to headings for hash navigation
 * This is useful when content is dynamically generated
 */
export function useHeadingIds() {
  useEffect(() => {
    // Find all headings without IDs
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headings.forEach((heading) => {
      if (!heading.id && heading.textContent) {
        // Generate ID from heading text
        const id = heading.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        // Only set if no existing element has this ID
        if (!document.getElementById(id)) {
          heading.id = id;
        }
      }
    });
  }, []);
}
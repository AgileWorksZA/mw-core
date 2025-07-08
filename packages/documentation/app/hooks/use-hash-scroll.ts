import { useEffect } from 'react';
import { useLocation, useNavigation } from 'react-router';

/**
 * Hook to handle hash scrolling for anchor links
 * Scrolls to the element with the ID matching the URL hash
 */
export function useHashScroll() {
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    // Wait for navigation to complete
    if (navigation.state !== 'idle') return;
    // Only run if there's a hash in the URL
    if (!location.hash) return;

    // Remove the # to get the element ID
    const elementId = location.hash.substring(1);
    console.log('[useHashScroll] Looking for element with ID:', elementId);
    
    // Function to scroll to element
    const scrollToElement = () => {
      const element = document.getElementById(elementId);
      if (element) {
        console.log('[useHashScroll] Found element:', element);
        
        // Get the element's position
        const rect = element.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + rect.top;
        
        // Account for fixed header (80px)
        const scrollPosition = absoluteTop - 80;
        
        console.log('[useHashScroll] Scrolling to position:', scrollPosition);
        
        // Use window.scrollTo for more reliable scrolling
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
        
        // Add highlight effect after scroll
        setTimeout(() => {
          element.classList.add('target-highlight');
          setTimeout(() => {
            element.classList.remove('target-highlight');
          }, 2000);
        }, 500);
        
        return true;
      }
      console.log('[useHashScroll] Element not found');
      
      // Log all elements with IDs to help debug
      const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      console.log('[useHashScroll] Available IDs on page:', allIds);
      
      return false;
    };

    // Try multiple times with increasing delays
    const attempts = [0, 100, 300, 500, 1000];
    let attemptIndex = 0;
    
    const tryScroll = () => {
      if (scrollToElement()) {
        console.log('[useHashScroll] Successfully scrolled on attempt', attemptIndex + 1);
        return;
      }
      
      attemptIndex++;
      if (attemptIndex < attempts.length) {
        setTimeout(tryScroll, attempts[attemptIndex]);
      }
    };
    
    tryScroll();
  }, [location, navigation.state]);
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
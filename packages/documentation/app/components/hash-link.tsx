import { Link } from "react-router";
import { useNavigate } from "react-router";

interface HashLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A link component that handles hash navigation properly
 * Works for both same-page anchors and cross-page anchors
 */
export function HashLink({ to, children, className }: HashLinkProps) {
  const navigate = useNavigate();
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const [pathname, hash] = to.split('#');
    const currentPath = window.location.pathname;
    
    if (pathname === currentPath && hash) {
      // Same page - just scroll to the element
      window.location.hash = hash;
      
      // Try to scroll immediately
      const element = document.getElementById(hash);
      if (element) {
        const rect = element.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + rect.top;
        window.scrollTo({
          top: absoluteTop - 80, // Account for fixed header
          behavior: 'smooth'
        });
      }
    } else {
      // Different page - navigate and let the hash scroll hook handle it
      navigate(to);
    }
  };
  
  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
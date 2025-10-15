import { useEffect } from "react";
import { useLocation } from "react-router";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top-left corner of the page
  }, [pathname]); // Trigger the effect whenever the pathname changes

  return null;
};

export default ScrollToTop;

import { useState, useEffect } from "react";
import { TbArrowBigUpLines } from "react-icons/tb";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down by 300px
  const toggleVisibility = () => {
    if (window.scrollY > 50) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll the page to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <div className=" ">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="backToTop bg-amber-500 tooltip"
          data-tip="Haut de page"
        >
          <TbArrowBigUpLines className="text-[20px] md:text-[30px] " />
        </button>
      )}
    </div>
  );
};

export default BackToTop;

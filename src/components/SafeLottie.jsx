import { useEffect, useRef, useState } from "react";
import Lottie from "lottie-react";

const SafeLottie = ({ animationData, loop = true, className, ...props }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Use a timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Error boundary for Lottie specifically
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      if (error.message?.includes("removeChild") || error.message?.includes("Node")) {
        console.warn("Lottie DOM error caught and handled:", error);
        setHasError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    // Fallback UI for failed Lottie animations
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isVisible) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <div className="animate-pulse bg-gray-200 rounded h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      <Lottie
        animationData={animationData}
        loop={loop}
        {...props}
        onError={(error) => {
          console.warn("Lottie animation error:", error);
          setHasError(true);
        }}
      />
    </div>
  );
};

export default SafeLottie;
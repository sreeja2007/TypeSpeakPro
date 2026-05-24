import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";

const SCROLL_THRESHOLD = 320;

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="accent"
      onClick={handleClick}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-[0_0_24px_hsl(280_100%_65%/0.45)] transition-all duration-300 sm:bottom-8 sm:right-8"
    >
      <ArrowUp className="h-4 w-4" />
      <span className="hidden sm:inline">Back to top</span>
    </Button>
  );
};

export default BackToTopButton;

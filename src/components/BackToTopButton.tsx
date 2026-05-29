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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label="Back to top"
      className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full border border-primary/30 bg-card/75 text-primary shadow-[0_12px_32px_hsl(222_47%_4%/0.28),0_0_24px_hsl(186_100%_50%/0.24),0_0_32px_hsl(280_100%_65%/0.18)] backdrop-blur-xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-300 hover:-translate-y-1 hover:border-primary/50 hover:bg-card/90 hover:text-primary hover:shadow-[0_16px_42px_hsl(222_47%_4%/0.32),0_0_34px_hsl(186_100%_50%/0.34),0_0_44px_hsl(280_100%_65%/0.24)] focus-visible:ring-primary sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
    >
      <ArrowUp className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
    </Button>
  );
};

export default BackToTopButton;

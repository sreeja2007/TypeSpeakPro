import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import BackToTopButton from "./BackToTopButton";

describe("BackToTopButton", () => {
  it("appears after scrolling and scrolls smoothly to the top", () => {
    const scrollToSpy = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => undefined);

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
    });

    render(<BackToTopButton />);

    expect(
      screen.queryByRole("button", { name: /back to top/i }),
    ).not.toBeInTheDocument();

    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 500,
    });

    fireEvent.scroll(window);

    const button = screen.getByRole("button", { name: /back to top/i });

    expect(screen.queryByText(/back to top/i)).not.toBeInTheDocument();

    fireEvent.click(button);

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: "smooth",
    });

    scrollToSpy.mockRestore();
  });
});

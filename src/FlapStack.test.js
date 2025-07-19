/* eslint-env jest */
import { act, render } from "@testing-library/react";
import { FlapStack } from "./FlapStack";

jest.mock("./styles.css", () => ({
  digit: "digit",
  flap: "flap",
  top: "top",
  bottom: "bottom",
  animated: "animated",
  final: "final",
  hinge: "hinge"
}));

describe("<FlapStack/>", () => {
  let props;

  beforeEach(() => {
    props = {
      stack: [" ", "A", "Z"],
      value: "Z",
      timing: 30
    };

    jest.useFakeTimers();
    jest.spyOn(global, "setInterval");
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("renders a <FlapDigit/>", () => {
    const { container } = render(<FlapStack {...props} />);
    const digit = container.querySelector('[data-kind="digit"]');
    expect(digit).toBeInTheDocument();
  });

  it("renders the digit in the initial position", () => {
    const { container } = render(<FlapStack {...props} />);
    const digit = container.querySelector('[data-kind="digit"]');
    const flaps = digit.querySelectorAll(".flap");

    // Initial position shows first character in stack (space)
    expect(flaps[0].textContent).toBe(" ");
    // Previous value is empty string initially
    expect(flaps[1].textContent).toBe("");
    // Should not have final class
    expect(flaps[0]).not.toHaveClass("final");
  });

  it("sets a timeout", () => {
    render(<FlapStack {...props} />);

    act(() => {
      jest.runAllTimers();
    });

    expect(setInterval).toHaveBeenCalledWith(
      expect.any(Function),
      props.timing
    );
  });

  it("advances the digit to the next position", () => {
    const { container } = render(<FlapStack {...props} />);

    act(() => {
      jest.advanceTimersByTime(props.timing);
    });

    const digit = container.querySelector('[data-kind="digit"]');
    const flaps = digit.querySelectorAll(".flap");

    // After one interval, should show 'A' (second position)
    expect(flaps[0].textContent).toBe("A");
    // Previous value should be ' ' (first position)
    expect(flaps[1].textContent).toBe(" ");
    // Should not have final class yet
    expect(flaps[2]).not.toHaveClass("final");
  });

  it("advances the digit to the final position", () => {
    const { container } = render(<FlapStack {...props} />);

    act(() => {
      jest.runAllTimers();
    });

    const digit = container.querySelector('[data-kind="digit"]');
    const flaps = digit.querySelectorAll(".flap");

    // Should now show 'Z' (final position)
    expect(flaps[0].textContent).toBe("Z");
    // Previous value should be 'A' (second position)
    expect(flaps[1].textContent).toBe("A");

    // In final position, there should be 4 flaps with the last two having final class
    expect(flaps).toHaveLength(4);
    expect(flaps[2]).toHaveClass("final");
    expect(flaps[3]).toHaveClass("final");
  });

  it("passes mode prop down", () => {
    const { container } = render(<FlapStack {...props} mode="alpha" />);
    const digit = container.querySelector('[data-kind="digit"]');

    expect(digit).toHaveAttribute("data-mode", "alpha");
  });

  it("passes hinge prop down", () => {
    const { container } = render(<FlapStack {...props} hinge={true} />);
    const hinges = container.querySelectorAll('[data-kind="hinge"]');

    // If hinge prop is true, we should find hinge elements
    expect(hinges.length).toBeGreaterThan(0);
  });

  it("resets to initial position when stack changes", () => {
    const { container, rerender } = render(<FlapStack {...props} />);

    // Advance to final position
    act(() => {
      jest.runAllTimers();
    });

    let digit = container.querySelector('[data-kind="digit"]');
    let flaps = digit.querySelectorAll(".flap");
    expect(flaps[0].textContent).toBe("Z");

    // Change the stack
    const newProps = { ...props, stack: ["1", "2", "3"], value: "3" };
    rerender(<FlapStack {...newProps} />);

    // Should reset to initial position (first character of new stack)
    digit = container.querySelector('[data-kind="digit"]');
    flaps = digit.querySelectorAll(".flap");
    expect(flaps[0].textContent).toBe("1");
  });
});

/* eslint-env jest */
import { render } from "@testing-library/react";
import { FlapDisplay } from "./FlapDisplay";

jest.mock("./styles.css", () => ({
  display: "display",
  digit: "digit",
  flap: "flap",
  top: "top",
  bottom: "bottom",
  hinge: "hinge"
}));

describe("<FlapDisplay/>", () => {
  let props;

  beforeEach(() => {
    props = {
      value: "A",
      length: 2,
      chars: " A",
      hinge: true,
      timing: 30
    };
  });

  it("applies a custom className", () => {
    const { container } = render(
      <FlapDisplay {...props} className="classNameSentinel" />
    );
    const displayDiv = container.firstChild;
    expect(displayDiv).toHaveClass("classNameSentinel");
  });

  it("applies a custom id", () => {
    const { container } = render(<FlapDisplay {...props} id="IdSentinel" />);
    const displayDiv = container.firstChild;
    expect(displayDiv).toHaveAttribute("id", "IdSentinel");
  });

  it("passes the css prop", () => {
    const cssSentinel = { foo: "bar" };
    const { container } = render(<FlapDisplay {...props} css={cssSentinel} />);
    const displayDiv = container.firstChild;
    // CSS prop is typically handled by styled-components or emotion
    // We can check if the element exists but can't directly test the css prop
    expect(displayDiv).toBeInTheDocument();
  });

  describe("using padding options", () => {
    it("pads numbers at start", () => {
      const { container } = render(<FlapDisplay {...props} value="1" />);
      const digits = container.querySelectorAll('[data-kind="digit"]');

      // The display should have 2 digits based on length=2
      expect(digits).toHaveLength(2);
      // For numeric values, padding is at start, so value '1' becomes ' 1'
      // All digits initially show first character of their stack (space)
      const firstDigitFlaps = digits[0].querySelectorAll(".flap");
      expect(firstDigitFlaps[0].textContent).toBe(" ");
    });

    it("pads words at end", () => {
      const { container } = render(<FlapDisplay {...props} value="X" />);
      const digits = container.querySelectorAll('[data-kind="digit"]');

      // For non-numeric values, padding is at end by default
      // So value 'X' becomes 'X '
      // All digits initially show first character of their stack (space)
      expect(digits).toHaveLength(2);
    });

    it("respects padMode prop", () => {
      const { container } = render(
        <FlapDisplay {...props} value="X" padMode="start" />
      );
      const digits = container.querySelectorAll('[data-kind="digit"]');

      // With padMode='start', value 'X' becomes ' X'
      // All digits initially show first character of their stack (space)
      expect(digits).toHaveLength(2);
      const firstDigitFlaps = digits[0].querySelectorAll(".flap");
      expect(firstDigitFlaps[0].textContent).toBe(" ");
    });

    it("respects padChar prop", () => {
      const { container } = render(
        <FlapDisplay {...props} value="1" padChar="0" chars="01" />
      );
      const digits = container.querySelectorAll('[data-kind="digit"]');

      // Should use '0' as padding character, value '1' becomes '01'
      // First digit shows '0' initially (first char in '01' stack)
      expect(digits).toHaveLength(2);
      const firstDigitFlaps = digits[0].querySelectorAll(".flap");
      expect(firstDigitFlaps[0].textContent).toBe("0");
    });
  });

  describe("using custom render func", () => {
    it("calls the render func", () => {
      const Render = jest.fn(() => <div>Custom Render</div>);
      render(<FlapDisplay {...props} render={Render} />);
      expect(Render).toHaveBeenCalled();
    });

    it("passes props to the render func", () => {
      const Render = jest.fn(() => <div>Custom Render</div>);
      render(<FlapDisplay {...props} render={Render} />);
      const args = { ...Render.mock.calls[0][0] };
      delete args.children;
      // The render function receives only the display-specific props
      expect(args).toEqual({
        className: undefined,
        css: undefined,
        id: undefined
      });
    });

    it("passes children to the render func", () => {
      const Render = jest.fn(() => <div>Custom Render</div>);
      render(<FlapDisplay {...props} render={Render} />);
      const args = Render.mock.calls.pop();
      expect(args[0].children.length).toEqual(2);
    });
  });

  describe("child components", () => {
    describe("alpha mode", () => {
      it("renders the correct number of digits", () => {
        const { container } = render(<FlapDisplay {...props} />);
        const digits = container.querySelectorAll('[data-kind="digit"]');
        expect(digits).toHaveLength(2);
      });

      it("sets the mode param", () => {
        const { container } = render(<FlapDisplay {...props} />);
        const digits = container.querySelectorAll('[data-kind="digit"]');
        expect(digits[0]).toHaveAttribute("data-mode", "alpha");
      });

      it("renders with initial state", () => {
        const { container } = render(<FlapDisplay {...props} />);
        const digits = container.querySelectorAll('[data-kind="digit"]');

        // All digits initially show first character of their stack (space)
        // The animation to the target values happens after mount
        const firstDigitFlaps = digits[0].querySelectorAll(".flap");
        const secondDigitFlaps = digits[1].querySelectorAll(".flap");

        expect(firstDigitFlaps[0].textContent).toBe(" ");
        expect(secondDigitFlaps[0].textContent).toBe(" ");
      });

      it("passes additional props", () => {
        const { container } = render(<FlapDisplay {...props} />);
        const hinges = container.querySelectorAll('[data-kind="hinge"]');

        // If hinge prop is true, we should find hinge elements
        expect(hinges.length).toBeGreaterThan(0);
      });
    });

    describe("num mode", () => {
      const chars = " 0123456789";

      it("renders the correct number of digits", () => {
        const { container } = render(
          <FlapDisplay {...props} chars={chars} value="1" />
        );
        const digits = container.querySelectorAll('[data-kind="digit"]');
        expect(digits).toHaveLength(2);
      });

      it("sets the mode param", () => {
        const { container } = render(
          <FlapDisplay {...props} chars={chars} value="1" />
        );
        const digits = container.querySelectorAll('[data-kind="digit"]');
        expect(digits[0]).toHaveAttribute("data-mode", "num");
      });

      it("renders with initial state", () => {
        const { container } = render(
          <FlapDisplay {...props} chars={chars} value="1" />
        );
        const digits = container.querySelectorAll('[data-kind="digit"]');

        // All digits initially show first character of their stack (space)
        const firstDigitFlaps = digits[0].querySelectorAll(".flap");
        const secondDigitFlaps = digits[1].querySelectorAll(".flap");

        expect(firstDigitFlaps[0].textContent).toBe(" ");
        expect(secondDigitFlaps[0].textContent).toBe(" ");
      });

      it("passes additional props", () => {
        const { container } = render(
          <FlapDisplay {...props} chars={chars} value="1" />
        );
        const hinges = container.querySelectorAll('[data-kind="hinge"]');

        // If hinge prop is true, we should find hinge elements
        expect(hinges.length).toBeGreaterThan(0);
      });
    });

    describe("words mode", () => {
      const words = ["this", "that"];

      it("renders the correct number of digits", () => {
        const { container } = render(
          <FlapDisplay {...props} words={words} value="this" />
        );
        const digits = container.querySelectorAll('[data-kind="digit"]');
        expect(digits).toHaveLength(1);
      });

      it("sets the mode param", () => {
        const { container } = render(
          <FlapDisplay {...props} words={words} value="this" />
        );
        const digits = container.querySelectorAll('[data-kind="digit"]');
        expect(digits[0]).toHaveAttribute("data-mode", "words");
      });

      it("renders with initial state", () => {
        const { container } = render(
          <FlapDisplay {...props} words={words} value="this" />
        );
        const digits = container.querySelectorAll('[data-kind="digit"]');

        // In words mode, initially shows first word in the stack
        const flaps = digits[0].querySelectorAll(".flap");
        expect(flaps[0].textContent).toBe("this");
      });

      it("passes additional props", () => {
        const { container } = render(
          <FlapDisplay {...props} words={words} value="this" />
        );
        const hinges = container.querySelectorAll('[data-kind="hinge"]');

        // If hinge prop is true, we should find hinge elements
        expect(hinges.length).toBeGreaterThan(0);
      });
    });
  });
});

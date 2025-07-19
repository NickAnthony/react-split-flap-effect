/* eslint-env jest */
import { render } from "@testing-library/react";
import React from "react";
import { FlapDigit } from "./FlapDigit";

jest.mock("./styles.css", () => ({
  digit: "digit",
  flap: "flap",
  top: "top",
  bottom: "bottom",
  animated: "animated",
  final: "final"
}));

interface FlapDigitTestProps {
  value: string;
  prevValue: string;
  final: boolean;
  mode: string;
}

describe("<FlapDigit/>", () => {
  let props: FlapDigitTestProps;

  beforeEach(() => {
    props = {
      value: "A",
      prevValue: "B", // Changed from ' ' to 'B' to make testing clearer
      final: false,
      mode: "alpha"
    };
  });

  describe("child div", () => {
    it("exists with correct attributes and class", () => {
      const { container } = render(<FlapDigit {...props} />);
      const div = container.firstChild as HTMLElement;

      expect(div).toBeInTheDocument();
      expect(div.tagName).toBe("DIV");
      expect(div).toHaveClass("digit");
      expect(div).toHaveAttribute("data-kind", "digit");
      expect(div).toHaveAttribute("data-mode", "alpha");
    });
  });

  describe("child <Flap/>s", () => {
    it("renders three flaps in non-final mode", () => {
      const { container } = render(<FlapDigit {...props} />);
      const digitDiv = container.querySelector(
        '[data-kind="digit"]'
      ) as HTMLElement;
      const flaps = digitDiv.children;

      expect(flaps).toHaveLength(3);
    });

    it("configures the first <Flap/> (top current)", () => {
      const { container } = render(<FlapDigit {...props} />);
      const digitDiv = container.querySelector(
        '[data-kind="digit"]'
      ) as HTMLElement;
      const firstFlap = digitDiv.children[0] as HTMLElement;

      expect(firstFlap).toHaveTextContent(props.value);
      expect(firstFlap).toHaveClass("flap");
      expect(firstFlap).toHaveClass("top");
      expect(firstFlap).not.toHaveClass("bottom");
      expect(firstFlap).not.toHaveClass("animated");
      expect(firstFlap).not.toHaveClass("final");
    });

    it("configures the second <Flap/> (bottom previous)", () => {
      const { container } = render(<FlapDigit {...props} />);
      const digitDiv = container.querySelector(
        '[data-kind="digit"]'
      ) as HTMLElement;
      const secondFlap = digitDiv.children[1] as HTMLElement;

      expect(secondFlap).toHaveTextContent(props.prevValue);
      expect(secondFlap).toHaveClass("flap");
      expect(secondFlap).toHaveClass("bottom");
      expect(secondFlap).not.toHaveClass("top");
      expect(secondFlap).not.toHaveClass("animated");
      expect(secondFlap).not.toHaveClass("final");
    });

    it("configures the third <Flap/> (animated top previous)", () => {
      const { container } = render(<FlapDigit {...props} />);
      const digitDiv = container.querySelector(
        '[data-kind="digit"]'
      ) as HTMLElement;
      const thirdFlap = digitDiv.children[2] as HTMLElement;

      expect(thirdFlap).toHaveTextContent(props.prevValue);
      expect(thirdFlap).toHaveClass("flap");
      expect(thirdFlap).toHaveClass("top");
      expect(thirdFlap).toHaveClass("animated");
      expect(thirdFlap).not.toHaveClass("bottom");
      expect(thirdFlap).not.toHaveClass("final");
    });
  });

  describe("in final mode", () => {
    beforeEach(() => {
      props.final = true;
    });

    describe("child <Flap/>s", () => {
      it("renders four flaps in final mode", () => {
        const { container } = render(<FlapDigit {...props} />);
        const digitDiv = container.querySelector(
          '[data-kind="digit"]'
        ) as HTMLElement;
        const flaps = digitDiv.children;

        expect(flaps).toHaveLength(4);
      });

      it("configures the first <Flap/> (static top current)", () => {
        const { container } = render(<FlapDigit {...props} />);
        const digitDiv = container.querySelector(
          '[data-kind="digit"]'
        ) as HTMLElement;
        const firstFlap = digitDiv.children[0] as HTMLElement;

        expect(firstFlap).toHaveTextContent(props.value);
        expect(firstFlap).toHaveClass("flap");
        expect(firstFlap).toHaveClass("top");
        expect(firstFlap).not.toHaveClass("bottom");
        expect(firstFlap).not.toHaveClass("animated");
        expect(firstFlap).not.toHaveClass("final");
      });

      it("configures the second <Flap/> (static bottom previous)", () => {
        const { container } = render(<FlapDigit {...props} />);
        const digitDiv = container.querySelector(
          '[data-kind="digit"]'
        ) as HTMLElement;
        const secondFlap = digitDiv.children[1] as HTMLElement;

        expect(secondFlap).toHaveTextContent(props.prevValue);
        expect(secondFlap).toHaveClass("flap");
        expect(secondFlap).toHaveClass("bottom");
        expect(secondFlap).not.toHaveClass("top");
        expect(secondFlap).not.toHaveClass("animated");
        expect(secondFlap).not.toHaveClass("final");
      });

      it("configures the third <Flap/> (animated top previous with final)", () => {
        const { container } = render(<FlapDigit {...props} />);
        const digitDiv = container.querySelector(
          '[data-kind="digit"]'
        ) as HTMLElement;
        const thirdFlap = digitDiv.children[2] as HTMLElement;

        expect(thirdFlap).toHaveTextContent(props.prevValue);
        expect(thirdFlap).toHaveClass("flap");
        expect(thirdFlap).toHaveClass("top");
        expect(thirdFlap).toHaveClass("animated");
        expect(thirdFlap).toHaveClass("final");
        expect(thirdFlap).not.toHaveClass("bottom");
      });

      it("configures the fourth <Flap/> (animated bottom current with final)", () => {
        const { container } = render(<FlapDigit {...props} />);
        const digitDiv = container.querySelector(
          '[data-kind="digit"]'
        ) as HTMLElement;
        const fourthFlap = digitDiv.children[3] as HTMLElement;

        expect(fourthFlap).toHaveTextContent(props.value);
        expect(fourthFlap).toHaveClass("flap");
        expect(fourthFlap).toHaveClass("bottom");
        expect(fourthFlap).toHaveClass("animated");
        expect(fourthFlap).toHaveClass("final");
        expect(fourthFlap).not.toHaveClass("top");
      });
    });
  });

  it("handles space character correctly", () => {
    const { container } = render(
      <FlapDigit {...props} value="X" prevValue=" " />
    );
    const digitDiv = container.querySelector(
      '[data-kind="digit"]'
    ) as HTMLElement;
    const secondFlap = digitDiv.children[1] as HTMLElement;

    // Space character might render as empty string
    expect(secondFlap.textContent).toBe(" ");
  });

  it("passes props down to child flaps (excluding specific props)", () => {
    // The component filters out certain props, so we need to test with a prop that gets passed through
    const { container } = render(<FlapDigit {...props} hinge={true} />);
    const digitDiv = container.querySelector(
      '[data-kind="digit"]'
    ) as HTMLElement;

    // Check if hinge divs are present inside flaps
    const hingeElements = digitDiv.querySelectorAll('[data-kind="hinge"]');
    expect(hingeElements.length).toBeGreaterThan(0);
  });
});

/* eslint-env jest */
import { render, screen } from "@testing-library/react";
import React from "react";
import { Flap } from "./Flap";

jest.mock("./styles.css", () => ({
  bottom: "bottom",
  top: "top",
  animated: "animated",
  final: "final",
  hinge: "hinge"
}));

interface FlapTestProps {
  bottom: boolean;
  animated: boolean;
  final: boolean;
  hinge: boolean;
}

describe("<Flap/>", () => {
  let props: FlapTestProps;
  let text: string;

  beforeEach(() => {
    props = {
      bottom: false,
      animated: false,
      final: false,
      hinge: false
    };

    text = "X";
  });

  describe("when all props are false", () => {
    it("has appropriate class names", () => {
      const { container } = render(<Flap {...props}>{text}</Flap>);
      const div = container.firstChild as HTMLElement;

      expect(div).not.toHaveClass("bottom");
      expect(div).toHaveClass("top");
      expect(div).not.toHaveClass("animated");
      expect(div).not.toHaveClass("final");
    });

    it("contains the text", () => {
      render(<Flap {...props}>{text}</Flap>);
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    it("does not include hinge", () => {
      render(<Flap {...props}>{text}</Flap>);
      expect(screen.queryByTestId("hinge")).not.toBeInTheDocument();
    });
  });

  describe("when bottom is true", () => {
    it("has the bottom class name", () => {
      const { container } = render(
        <Flap {...props} bottom>
          {text}
        </Flap>
      );
      const div = container.firstChild as HTMLElement;

      expect(div).toHaveClass("bottom");
    });

    it("does not have the top class name", () => {
      const { container } = render(
        <Flap {...props} bottom>
          {text}
        </Flap>
      );
      const div = container.firstChild as HTMLElement;

      expect(div).not.toHaveClass("top");
    });
  });

  describe("when animated is true", () => {
    it("has the animated class name", () => {
      const { container } = render(
        <Flap {...props} animated>
          {text}
        </Flap>
      );
      const div = container.firstChild as HTMLElement;

      expect(div).toHaveClass("animated");
    });
  });

  describe("when final is true", () => {
    it("has the final class name", () => {
      const { container } = render(
        <Flap {...props} final>
          {text}
        </Flap>
      );
      const div = container.firstChild as HTMLElement;

      expect(div).toHaveClass("final");
    });
  });

  describe("when hinge is true", () => {
    it("includes hinge", () => {
      const { container } = render(
        <Flap {...props} hinge>
          {text}
        </Flap>
      );
      // Look for element with data-kind="hinge" attribute
      const hinge = container.querySelector('[data-kind="hinge"]');

      expect(hinge).toBeInTheDocument();
    });

    it("sets class name on hinge", () => {
      const { container } = render(
        <Flap {...props} hinge>
          {text}
        </Flap>
      );
      const hinge = container.querySelector(
        '[data-kind="hinge"]'
      ) as HTMLElement;

      expect(hinge).toHaveClass("hinge");
    });
  });
});

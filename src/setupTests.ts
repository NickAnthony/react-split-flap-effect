// Setup for React Testing Library
// This extends Jest matchers with custom matchers for testing DOM elements
import "@testing-library/jest-dom";
import * as React from "react";

// Make React available globally for tests
declare global {
  namespace NodeJS {
    interface Global {
      React: typeof React;
    }
  }
}

global.React = React;

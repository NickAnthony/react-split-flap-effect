import React, { useEffect, useState } from "react";
import { FlapDisplay } from "react-split-flap-effect";

export const TripleDigit: React.FC = () => {
  const [value, setValue] = useState<string>("0");

  useEffect(() => {
    const interval = setInterval(() => {
      const next = String(Math.floor(Math.random() * 999));
      console.log("next", next);
      setValue(next);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Triple Digit</h2>
      <p>This demo shows a triple digit split-flap display updating.</p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "start",
          height: "100vh",
          width: "100vw"
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "4px",
            textAlign: "center"
          }}
        >
          <FlapDisplay
            className="singleDigitFlapper"
            value={value}
            chars={"0123456789"}
            words={false}
            length={3}
            timing={150}
            hinge={true}
            padChar={" "}
            padMode={"auto"}
            style={{ fontSize: "100px", height: "100px", width: "300px" }}
            useCss={true}
          />
        </div>
      </div>
    </div>
  );
};

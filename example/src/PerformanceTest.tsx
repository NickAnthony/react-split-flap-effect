import React, { useEffect, useState } from "react";
import { FlapDisplay, FlapDisplayProvider } from "react-split-flap-effect";

export const PerformanceTest: React.FC = () => {
  const [values, setValues] = useState<string[]>(
    Array(30)
      .fill("")
      .map((_, i) => String(i).padStart(6, "0"))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev =>
        prev.map((_, i) =>
          String(Math.floor(Math.random() * 1000000)).padStart(6, "0")
        )
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Performance Test: 100 Displays</h2>
      <p>This demo shows 100 split-flap displays updating simultaneously.</p>

      <FlapDisplayProvider batchSize={20} batchDelayMs={20}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "10px",
            marginTop: "20px"
          }}
        >
          {values.map((value, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "4px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "12px", marginBottom: "5px" }}>
                Display #{i + 1}
              </div>
              <FlapDisplay value={value} length={6} timing={300} />
            </div>
          ))}
        </div>
      </FlapDisplayProvider>
    </div>
  );
};

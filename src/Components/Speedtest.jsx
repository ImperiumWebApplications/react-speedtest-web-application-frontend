import React, { useState, useEffect } from "react";

const SpeedTest = () => {
  const [speed, setSpeed] = useState(0);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3001/events");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSpeed(data.downloadSpeedMbps);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const startTest = async () => {
    setIsTesting(true);

    try {
      const response = await fetch("http://localhost:3001/speedtest", {
        method: "GET",
      });

      if (response.ok) {
        setIsTesting(false);
      } else {
        throw new Error("Speed test failed");
      }
    } catch (error) {
      console.error("Error during speed test:", error);
      setIsTesting(false);
    }
  };

  return (
    <div className="speed-test">
      <h1>Speed Test</h1>
      <p>
        {isTesting
          ? `Testing... Current speed: ${speed.toFixed(2)} Mbps`
          : `Download speed: ${speed.toFixed(2)} Mbps`}
      </p>
      <button onClick={startTest} disabled={isTesting}>
        {isTesting ? "Testing..." : "Start Speed Test"}
      </button>
    </div>
  );
};

export default SpeedTest;

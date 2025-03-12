import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export const LoaderView = () => {
  const texts = [
    "Building your career path...",
    "Matching you with top employers...",
    "Preparing your dream job...",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="loader-container">
      <div className="icons">
        <span role="img" aria-label="education">
          🎓
        </span>
        <span role="img" aria-label="briefcase">
          💼
        </span>
        <span role="img" aria-label="rocket">
          🚀
        </span>
      </div>
      <div className="path"></div>
      <p className="loading-text">{texts[index]}</p>
    </div>
  );
};

export const FailureView = () => {
  const navigate = useNavigate();

  return (
    <div className="failure-container">
      <span className="failure-icon">⚠️</span>
      <h2>Something Went Wrong</h2>
      <p>We couldn't complete your request. Please check your connection or try again later.</p>
      <button className="retry-button" onClick={() => navigate("/")}>
        Retry
      </button>
    </div>
  );
};


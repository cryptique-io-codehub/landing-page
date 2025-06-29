import React from 'react';
import ReactDOM from 'react-dom/client';
import FeatureShowcase from './FeatureShowcase.js';
import './feature-showcase.css';

// Create the React app that renders the FeatureShowcase component
const FeatureApp = () => {
  return (
    <div className="feature-app">
      <FeatureShowcase />
    </div>
  );
};

// Function to initialize the React component
export const initializeFeatureShowcase = (containerId = 'feature-showcase-root') => {
  const container = document.getElementById(containerId);
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<FeatureApp />);
  } else {
    console.error(`Container with ID "${containerId}" not found`);
  }
};

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  initializeFeatureShowcase();
});

export default FeatureApp; 
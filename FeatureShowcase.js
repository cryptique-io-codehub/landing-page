import React, { useState, useEffect } from 'react';

const FeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(1);
  const features = [
    {
      id: 1,
      title: "ROI Attribution",
      description: "Stop guessing where your most valuable users come from. Measure the true ROI of your marketing spend, cut inefficient channels with confidence, and reallocate your budget to the strategies that deliver genuine, high-value on-chain activity like swaps, stakes, and mints."
    },
    {
      id: 2,
      title: "User Intelligence",
      description: "Understand your users like never before. Track their journey from first interaction to on-chain actions, segment them based on behavior, and identify high-value opportunities for engagement and growth."
    },
    {
      id: 3,
      title: "CQ Intelligence",
      description: "Let AI be your strategic advantage. Our advanced AI analyzes patterns across user behavior, market conditions, and on-chain activity to provide actionable insights and predictive analytics for your Web3 business."
    }
  ];

  useEffect(() => {
    // Set up intersection observer for feature sections
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const featureId = parseInt(entry.target.getAttribute('data-feature'));
          setActiveFeature(featureId);
          
          // Update tracker node
          document.querySelectorAll('.tracker-node').forEach(node => {
            node.classList.remove('active');
            if (parseInt(node.getAttribute('data-feature')) === featureId) {
              node.classList.add('active');
            }
          });
        }
      });
    }, { threshold: 0.5 });

    // Observe all feature sections
    document.querySelectorAll('.feature-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="features">
      <div className="container">
        <h2 className="section-title">Our Features</h2>
        
        <div className="side-feature-tracker">
          {features.map((feature) => (
            <React.Fragment key={feature.id}>
              <div 
                className={`tracker-node ${activeFeature === feature.id ? 'active' : ''}`}
                data-feature={feature.id}
                onClick={() => {
                  const section = document.getElementById(`feature-${feature.id}`);
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span className="node-number">{feature.id}</span>
              </div>
              {feature.id < features.length && <div className="tracker-line"></div>}
            </React.Fragment>
          ))}
        </div>

        {features.map((feature) => (
          <div 
            key={feature.id}
            id={`feature-${feature.id}`}
            className={`feature-section ${activeFeature === feature.id ? 'active' : ''}`}
            data-feature={feature.id}
          >
            <div className="feature-description-sticky">
              <div className="feature-header sticky-feature-header">
                <div className="feature-header-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-text">{feature.description}</p>
                  <button className="learn-more-btn">
                    Learn More <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="feature-visual-scrolling">
              {/* Feature specific visuals will be rendered here */}
              {feature.id === 1 && <div className="analytics-dashboard">
                {/* ROI Attribution visuals */}
              </div>}
              {feature.id === 2 && <div className="user-intelligence-dashboard">
                {/* User Intelligence visuals */}
              </div>}
              {feature.id === 3 && <div className="cq-intelligence-dashboard">
                {/* CQ Intelligence visuals */}
              </div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureShowcase; 
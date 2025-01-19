import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="text-center">
        <h1 className="display-4">Welcome to MealPrep Master</h1>
        <p className="lead">
          Plan your meals, organize recipes, and streamline grocery shopping with ease.
        </p>
        <div className="mt-5">
          <h2 className="mb-4">Features</h2>
          <div className="row">
            <div className="col-md-4">
              <i className="bi bi-calendar-check display-4"></i>
              <h4 className="mt-3">Meal Planner</h4>
              <p>Plan meals for the week, organize your grocery shopping, and stay on track with your diet.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-book display-4"></i>
              <h4 className="mt-3">Recipe Library</h4>
              <p>Save, organize, and share your favorite recipes. Your personalized cookbook awaits.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-graph-up display-4"></i>
              <h4 className="mt-3">Progress Tracking</h4>
              <p>Monitor your meal prep habits and see how far you've come. Consistency made simple!</p>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3>Start Your Journey Today</h3>
          <p>
            Ready to simplify meal prep and take control of your kitchen? Let's get started!
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/login')}
          >
            Explore the App
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

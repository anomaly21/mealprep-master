import React from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mt-5">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="display-4">Welcome Back to MealPrep Master</h1>
        <p className="lead">
          Let's get started on planning your meals, organizing recipes, and tracking your progress.
        </p>
      </div>

      {/* Features Section */}
      <div className="mt-5">
        <h2 className="text-center">Features</h2>
        <div className="row text-center mt-4">
          <div className="col-md-4">
            <i className="bi bi-calendar-check display-4 mb-3"></i>
            <h4>Meal Planner</h4>
            <p>
              Plan meals for the week, organize your grocery shopping list, and stay on track with your diet.
            </p>
            <Link to="/meal-planner">
              <button className="btn btn-primary btn-sm">Go to Meal Planner</button>
            </Link>
          </div>
          <div className="col-md-4">
            <i className="bi bi-book display-4 mb-3"></i>
            <h4>Recipe Library</h4>
            <p>
              Save, organize, and share your favorite recipes with ease. Your personalized cookbook awaits.
            </p>
            <Link to="/recipe-library">
              <button className="btn btn-primary btn-sm">Go to Recipe Library</button>
            </Link>
          </div>
          <div className="col-md-4">
            <i className="bi bi-graph-up-arrow display-4 mb-3"></i>
            <h4>Progress Tracking</h4>
            <p>
              Monitor your meal prep habits and see how far you've come. Consistency made simple!
            </p>
            <Link to="/progress-tracking">
              <button className="btn btn-primary btn-sm">View Progress</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-5">
        <h3>Your Meal Prep Journey Awaits</h3>
        <p>
          Explore the tools and features designed to make your meal planning easier than ever.
        </p>
        <Link to="/meal-planner">
          <button className="btn btn-primary mt-4">Get Started Now</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

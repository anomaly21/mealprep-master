import React from 'react';

const MealPlanner = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Weekly Meal Planner</h1>
      <div className="row">
        {days.map((day) => (
          <div className="col-12 col-md-6 col-lg-4 mb-4" key={day}>
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white text-center">
                <h5>{day}</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">Add meals for {day} here.</p>
                <button className="btn btn-outline-primary btn-sm w-100">
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanner;

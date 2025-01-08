import React, { useState, useEffect } from 'react';

const MealPlanner = () => {
  const [days] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  const [meals, setMeals] = useState({});
  const [newMeal, setNewMeal] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  useEffect(() => {
    // Fetch meals for the logged-in user
    fetch('http://localhost:5000/api/meal-planner', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const groupedMeals = data.reduce((acc, meal) => {
          if (!acc[meal.day]) acc[meal.day] = [];
          acc[meal.day].push(meal.meal);
          return acc;
        }, {});
        setMeals(groupedMeals);
      })
      .catch((err) => console.error('Error fetching meals:', err));
  }, []);

  const handleAddMeal = () => {
    if (!newMeal || !selectedDay) return;

    // Add a meal for the logged-in user
    fetch('http://localhost:5000/api/meal-planner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ day: selectedDay, meal: newMeal }),
    })
      .then((response) => response.json())
      .then(() => {
        setMeals((prev) => ({
          ...prev,
          [selectedDay]: [...(prev[selectedDay] || []), newMeal],
        }));
        setNewMeal('');
      })
      .catch((err) => console.error('Error adding meal:', err));
  };

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
                {meals[day] && meals[day].length > 0 ? (
                  <ul className="list-group mb-3">
                    {meals[day].map((meal, index) => (
                      <li key={index} className="list-group-item">{meal}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No meals planned.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4>Add a Meal</h4>
        <div className="row">
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Select a Day</option>
              {days.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Meal"
              value={newMeal}
              onChange={(e) => setNewMeal(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleAddMeal}>
          Add Meal
        </button>
      </div>
    </div>
  );
};

export default MealPlanner;

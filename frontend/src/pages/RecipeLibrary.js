import React from 'react';

const RecipeLibrary = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Recipe Library</h1>
      <p className="text-center text-muted">
        Manage your recipes and find inspiration for your next meal.
      </p>
      <div className="d-flex justify-content-center">
        <button className="btn btn-primary me-2">Add New Recipe</button>
        <button className="btn btn-outline-secondary">Browse Recipes</button>
      </div>
    </div>
  );
};

export default RecipeLibrary;

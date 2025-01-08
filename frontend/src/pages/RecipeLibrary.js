import React, { useState, useEffect } from 'react';

const RecipeLibrary = () => {
  const [recipes, setRecipes] = useState([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch recipes for the logged-in user
    fetch('http://localhost:5000/api/recipes', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching recipes:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAddRecipe = () => {
    if (!title || !ingredients) {
      alert('Please provide both a title and ingredients.');
      return;
    }

    // Add a recipe for the logged-in user
    fetch('http://localhost:5000/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, ingredients }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add recipe');
        }
        return response.json();
      })
      .then((newRecipe) => {
        setRecipes((prev) => [...prev, newRecipe]);
        setTitle('');
        setIngredients('');
      })
      .catch((err) => {
        console.error('Error adding recipe:', err);
        setError(err.message);
      });
  };

  if (loading) {
    return <div className="container mt-5">Loading recipes...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Recipe Library</h1>
      <div className="mt-4">
        {recipes.map((recipe, index) => (
          <div key={index} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{recipe.title}</h5>
              <p className="card-text">{recipe.ingredients}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4>Add a Recipe</h4>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          placeholder="Ingredients"
          rows="4"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddRecipe}>
          Add Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeLibrary;

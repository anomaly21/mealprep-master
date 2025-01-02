import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MealPlanner from './pages/MealPlanner';
import RecipeLibrary from './pages/RecipeLibrary';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/recipe-library" element={<RecipeLibrary />} />
      </Routes>
    </Router>
  );
};

export default App;

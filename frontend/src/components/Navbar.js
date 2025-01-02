import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', justifyContent: 'space-around' }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/meal-planner">Meal Planner</Link></li>
        <li><Link to="/recipe-library">Recipe Library</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

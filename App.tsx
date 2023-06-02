import * as React from 'react';
import './style.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from './Pages/Home';
import About from './Pages/About';

// Defining the default function for the App component
export default function App() {
  return (
    <Router>
      <div>
      </div>
      <Routes>
        {/* Defining routes for the pages */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/About" element={<About />} />
      </Routes>
      <div>
      </div>
    </Router>
  );
}

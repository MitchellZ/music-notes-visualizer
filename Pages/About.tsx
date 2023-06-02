import * as React from 'react';
import '../style.css'
import {
  Link
} from "react-router-dom";

// Defining the About component
const About = () => {
   // Begin HTML Template
  return (
      <div>
        <div className="nav">
          <ul>
          <li><Link to = "/" className="active">Notes Visualizer</Link></li>
          <li className="about"><Link to = "/About" className="active">About</Link></li>
          </ul>
        </div>
        <div className="main_body">
          <div className="welcome">
            <h1>Thank you for your interest in Music Notes Visualizer!</h1>
            <br/>
            <p>This project was built by Mitchell Zoph using <a href='https://legacy.reactjs.org/'>React</a>.</p>
          </div>
        </div>
        <footer>
            <ul>
            <li className="title">Music Notes Visualizer developed by Mitchell Zoph</li>
            </ul>
        </footer>
      </div>
  );
}

export default About;
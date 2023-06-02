import * as React from 'react';
import '../style.css';

import { useEffect, useState } from 'react';

// Defining the Home component
const Home = () => {
  const [peakValue, setPeakValue] = useState<number>(0);

  useEffect(() => {
    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // Create an AudioContext
        const audioContext = new AudioContext();

        // Create a MediaStreamAudioSourceNode
        const sourceNode = audioContext.createMediaStreamSource(stream);

        // Create a ScriptProcessorNode
        const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);

        // Connect the nodes
        sourceNode.connect(scriptNode);
        scriptNode.connect(audioContext.destination);

        // Event handler for audio processing
        scriptNode.onaudioprocess = (event) => {
          // Get the input buffer
          const inputBuffer = event.inputBuffer;

          // Get the channel data
          const channelData = inputBuffer.getChannelData(0);

          // Find the peak value
          let newPeakValue = 0;
          for (let i = 0; i < channelData.length; i++) {
            const value = Math.abs(channelData[i]);
            if (value > newPeakValue) {
              newPeakValue = value;
            }
          }

          // Multiply by 100 and round to the nearest whole number
          newPeakValue = Math.round(newPeakValue * 100);

          // Update the peak value state
          setPeakValue(newPeakValue);
        };
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  }, []);

  // Begin HTML Template
  return (
    <div id="container">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0"
      />
      <div className="nav">
        <ul>
          <li>
            <a className="active" href="/">
              NOTES VISUALIZER
            </a>
          </li>
          <li className="about">
            <a href="/About">About</a>
          </li>
        </ul>
      </div>
      <div className="main_body">
        <div className="welcome">
          <h1>Music Notes Visualizer</h1>
        </div>
        <br />
        {peakValue} dB
        <div id="spacer"></div>
        </div>
      <footer>
        <ul>
          <li className="title">Music Notes Visualizer developed by Mitchell Zoph</li>
        </ul>
      </footer>
    </div>
  );
};

export default Home;

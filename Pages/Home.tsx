import * as React from 'react';
import '../style.css';

import NoteContext from '../Contexts/NoteContext';
import DonutChart from '../Components/DonutChart';

import { useEffect, useState } from 'react';
import { PitchDetector } from 'pitchy';

// Defining the Home component
const Home = () => {
  const [peakValue, setPeakValue] = useState<number>(0);

  // Function to indentify peak volume
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

  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [previousRoundedPitch, setPreviousRoundedPitch] = useState<number | null>(null);
  const [frequencyValue, setFrequencyValue] = useState<number | null>(null);
  const [MIDIValue, setMIDIValue] = useState<number | null>(null);
  const [noteName, setNoteName] = useState<string | null>(null);
  const [clarity, setClarity] = useState<number | null>(null);

  // Function to indentify pitch frequency
  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let sourceNode: MediaStreamAudioSourceNode | null = null;
    let analyserNode: AnalyserNode | null = null;
    let scriptNode: ScriptProcessorNode | null = null;

    // Request access to the microphone
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // Create an AudioContext
        audioContext = new AudioContext();

        // Create a MediaStreamAudioSourceNode
        sourceNode = audioContext.createMediaStreamSource(stream);

        // Create a ScriptProcessorNode
        scriptNode = audioContext.createScriptProcessor(4096, 1, 1);

        // Create an AnalyserNode
        analyserNode = audioContext.createAnalyser();
        analyserNode.fftSize = 2048;

        // Connect the nodes
        sourceNode.connect(analyserNode);
        analyserNode.connect(scriptNode);
        scriptNode.connect(audioContext.destination);

        // Create a pitch detector
        let detector = PitchDetector.forFloat32Array(2048);

        // Event handler for audio processing
        scriptNode.onaudioprocess = () => {
          // Get the frequency data
          const bufferLength = analyserNode.frequencyBinCount;
          const dataArray = new Float32Array(bufferLength);
          analyserNode.getFloatTimeDomainData(dataArray);

          // Resize the dataArray to 2048
          const resizedArray = new Float32Array(2048);
          resizedArray.set(dataArray.slice(0, 2048));

          // Perform pitch detection
          const sampleRate = audioContext.sampleRate;
          const [detectedPitch, detectedClarity] = detector.findPitch(resizedArray, sampleRate);

          // Set clarity
          setClarity(detectedClarity);

          // Get the pitch value
          const pitchValue = detectedPitch;

          // Round the loudest frequency to two decimal places
          const roundedPitch = Math.round(pitchValue * 100) / 100;

          // Print the detected pitch to the console
          if (roundedPitch !== previousRoundedPitch && roundedPitch !== 0) {
            //console.log(`Pitch: ${roundedPitch.toFixed(2)} Hz`);
            setPreviousRoundedPitch(roundedPitch);
            setFrequencyValue(roundedPitch);

            let MIDINum = 69 + 12 * Math.log2(pitchValue / 440);

            setMIDIValue(Math.round(MIDINum));

            let noteName = getNoteName(Math.round(MIDINum))

            setNoteName(noteName);

          }

        };
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
    }, []);

  // Function to get the name of a note from the MIDI#
  function getNoteName(midiNote) {
    var notes = [
      "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
    ];
    
    var octave = Math.floor(midiNote / 12) - 1;
    var noteIndex = midiNote % 12;
    
    var noteName = notes[noteIndex] + octave;
    return noteName;
  }

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
        </div>
        <NoteContext.Provider value={{ noteName, clarity, peakValue }}>
        <DonutChart />
        </NoteContext.Provider>
        <br/> <br/>
        <div className="parameters_form">
          <h3>Tuner Information</h3>
          <p>
          <br/>
          {peakValue} dB
          <br/>
          {frequencyValue} Hz
          <br/>
          MIDI#: {MIDIValue}
          <br/>
          Note Name: {noteName}
          <br/><br/>
          Confidence: {Math.round(clarity * 100)}%
          </p>
        </div>
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

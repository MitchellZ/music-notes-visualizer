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

  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const [previousLoudestFrequency, setPreviousLoudestFrequency] = useState<number | null>(null);
  const [frequencyValue, setFrequencyValue] = useState<number | null>(null);
  const [MIDIValue, setMIDIValue] = useState<number | null>(null);
  const [noteName, setNoteName] = useState<string | null>(null);

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

        // Event handler for audio processing
        scriptNode.onaudioprocess = () => {
          // Get the frequency data
          const bufferLength = analyserNode.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserNode.getByteFrequencyData(dataArray);

          // Find the index of the loudest value
          let loudestIndex = 0;
          let loudestValue = dataArray[0];
          for (let i = 1; i < bufferLength; i++) {
            if (dataArray[i] > loudestValue) {
              loudestValue = dataArray[i];
              loudestIndex = i;
            }
          }

          // Convert the index to frequency in Hz
          const sampleRate = audioContext.sampleRate;
          const nyquistFrequency = sampleRate / 2;
          const frequencyResolution = nyquistFrequency / bufferLength;
          const loudestFrequency = frequencyResolution * loudestIndex;

          // Round the loudest frequency to two decimal places
          const roundedLoudestFrequency = Math.round(loudestFrequency * 100) / 100;

          // Print the loudest frequency to the console
          if (roundedLoudestFrequency !== previousLoudestFrequency && roundedLoudestFrequency !== 0) {
            //console.log(`Loudest frequency: ${roundedLoudestFrequency.toFixed(2)} Hz`);
            setPreviousLoudestFrequency(roundedLoudestFrequency);
            setFrequencyValue(roundedLoudestFrequency);

            let MIDINum = 69 + 12 * Math.log2(loudestFrequency / 440);

            setMIDIValue(Math.round(MIDINum));

            let noteName = getNoteName(Math.round(MIDINum))

            setNoteName(noteName);

          }

          // Update the frequency data state
          setFrequencyData(dataArray);
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
          <h1>Music Notes Visualizer</h1>
        </div>
        <br />
        <p className="parameters_form">
          {peakValue} dB
          <br/>
          {frequencyValue} Hz
          <br/>
          MIDI#: {MIDIValue}
          <br/>
          Note Name: {noteName}
        </p>
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

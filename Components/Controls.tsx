import * as React from 'react';
import '../style.css';

import { useEffect, useState } from 'react';

const Controls = () => {

  const [recording, setRecording] = useState(false);
  const recordedNotes = '';
  const [selectedKey, setSelectedKey] = useState('None');

  useEffect(() => {
    // Call the record function whenever noteName changes
    //record(noteName);
  },);

  // Start recording function
  function startRecording(){
    setRecording(true);
    console.log('Started recording...')
  }

  // Record function
  function record(note){

  }

// Begin HTML Template
return (
<div id='controls'>
  <div className='record' hidden>
      <button onClick={startRecording}>Record</button>
      {recordedNotes}
  </div>

  <br/>
  <div className='keys' hidden>
    <label>Key Selection</label><br/>
    <select name='keys'>
      <option value="None">None</option>
      <option value="C Major">C Major</option>
      <option value="C Minor">C Minor</option>
      <option value="C# Major">C# Major</option>
      <option value="C# Minor">C# Minor</option>
      <option value="D Major">D Major</option>
      <option value="D Minor">D Minor</option>
      <option value="D# Major">D# Major</option>
      <option value="D# Minor">D# Minor</option>
      <option value="E Major">E Major</option>
      <option value="E Minor">E Minor</option>
      <option value="F Major">F Major</option>
      <option value="F Minor">F Minor</option>
      <option value="F# Major">F# Major</option>
      <option value="F# Minor">F# Minor</option>
      <option value="G Major">G Major</option>
      <option value="G Minor">G Minor</option>
      <option value="G# Major">G# Major</option>
      <option value="G# Minor">G# Minor</option>
      <option value="A Major">A Major</option>
      <option value="A Minor">A Minor</option>
      <option value="A# Major">A# Major</option>
      <option value="A# Minor">A# Minor</option>
      <option value="B Major">B Major</option>
      <option value="B Minor">B Minor</option>
    </select>
  </div>
</div>
);
};

export default Controls;
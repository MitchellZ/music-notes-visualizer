import * as React from 'react';
import { useContext, useState } from 'react';
import { Chart } from 'react-google-charts';

import NoteContext from '../Contexts/NoteContext';

const DonutChart = () => {
  const { noteName, clarity, peakValue } = useContext(NoteContext);
  const [recordedNotes, setRecordedNotes] = useState('');

  //console.log('Peak ' + peakValue);

  const handleChartReady = (chartWrapper) => {
    //HandleChartReady must be defined
  };

  const chartOptions = {
    pieHole: 0.45,
    pieSliceText: 'label',
    colors: ['lightblue', 'lightblue', 'lightblue', 'lightblue', 'lightblue', 'lightblue', 'lightblue', 'lightblue', 'lightblue', 'lightblue', 'lightblue', 'lightblue'],
    pieSliceTextStyle: {
      color: 'white',
      bold: true,
      fontSize: 24
    },
    chartArea: { width: '97%', height: '97%' },
    enableInteractivity: false,
    legend: 'none',
    pieStartAngle: -15
  };

  const chartData = [
    ['Note', 'Percentage'],
    ['C', 8.33],
    ['C#', 8.33],
    ['D', 8.33],
    ['D#', 8.33],
    ['E', 8.33],
    ['F', 8.33],
    ['F#', 8.33],
    ['G', 8.33],
    ['G#', 8.33],
    ['A', 8.33],
    ['A#', 8.33],
    ['B', 8.33]
  ];

  let highlightedNote = '';
if (noteName != null) {
  highlightedNote = noteName.substring(0, noteName.length - 1);
}

const highlightedNoteIndex = chartData.findIndex((noteData) => noteData[0] === highlightedNote);
if (highlightedNoteIndex !== -1) {
  if (peakValue >= 1 && clarity >= 0.9) {
    chartOptions.colors[highlightedNoteIndex - 1] = 'SteelBlue';

  } else {
    chartOptions.colors[highlightedNoteIndex - 1] = 'lightblue';
  }
}


  return (
    <Chart
      chartType="PieChart"
      data={chartData}
      options={chartOptions}
      width="100%"
      height="400px"
      chartEvents={[
        {
          eventName: 'ready',
          callback: ({ chartWrapper }) => handleChartReady(chartWrapper)
        }
      ]}
    />
  );
};

export default DonutChart;
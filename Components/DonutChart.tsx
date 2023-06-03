import * as React from 'react';
import { useContext } from 'react';
import { Chart } from 'react-google-charts';

import NoteContext from '../Contexts/NoteContext';

const DonutChart = () => {
  const { noteName, setNoteName } = useContext(NoteContext);

  //console.log('Note: ' + noteName);

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

  let highlightedNote = ''

  if (noteName != null)
    highlightedNote = noteName.substring(0, noteName.length - 1);

    const highlightedNoteIndex = chartData.findIndex((noteData) => noteData[0] === highlightedNote);
    if (highlightedNoteIndex !== -1) {
      chartOptions.colors[highlightedNoteIndex -1] = 'SteelBlue';
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
import * as React from 'react';
import { Chart } from 'react-google-charts';

const DonutChart = () => {
  const handleChartReady = (chartWrapper) => {
    chartWrapper.getChart().setSelection([{ row: 0 }]);
  };

  const chartOptions = {
    pieHole: 0.45,
    pieSliceText: 'label',
    colors: ['lightblue'],
    pieSliceTextStyle: {
      color: 'white',
      bold: true,
      fontSize: 24
    },
    chartArea: { width: '90%', height: '90%' },
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
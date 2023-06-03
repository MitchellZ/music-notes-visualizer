import * as React from 'react';
import { useEffect } from 'react';
import { Chart } from 'google-charts';

const DonutChart = () => {
  useEffect(() => {
    Chart.load('current', { packages: ['corechart'] });
    Chart.setOnLoadCallback(drawChart);
  }, []);

  const drawChart = () => {
    const data = Chart.api.visualization.arrayToDataTable([
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
    ]);

    const options = {
      pieHole: 0.45,
      pieSliceText: 'label',
      colors: ['pink'],
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

    const chart = new Chart.api.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  };

  return <div id="chart_div" style={{ width: '500px', height: '500px' }}></div>;
};

export default DonutChart;
import React from 'react';
import { Line } from 'react-chartjs-2';

class LotData extends React.Component {
  render() {
    const { newData } = this.props;

    // Prepare data for the chart
    const chartData = {
      labels: [],
      datasets: [{
        label: 'Time to Complete (Days)',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    for (const primary in newData) {
      chartData.labels.push(primary);
      chartData.datasets[0].data.push(newData[primary]["Time to Complete"]);
    }

    // Chart options
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    return (
      <div>
        <h2>Lot Data Chart</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    );
  }
}

export default LotData;
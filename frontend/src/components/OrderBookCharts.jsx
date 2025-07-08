import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function OrderBookCharts({ orderbook, qtOffset, amtOffset, loading }) {
  if (loading) return <div>Loading...</div>;
  const bids = orderbook.bids.map(([price, qty]) => [price, qty + qtOffset]);
  const asks = orderbook.asks.map(([price, qty]) => [price + amtOffset, qty]);

  const buyData = {
    labels: bids.map(([price]) => price),
    datasets: [
      {
        label: 'Buy (Bids)',
        data: bids.map(([, qty]) => qty),
        borderColor: 'green',
        backgroundColor: 'rgba(0,128,0,0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
  const sellData = {
    labels: asks.map(([price]) => price),
    datasets: [
      {
        label: 'Sell (Asks)',
        data: asks.map(([, qty]) => qty),
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { title: { display: true, text: 'Price' } }, y: { title: { display: true, text: 'Qty' } } },
  };
  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div style={{ textAlign: 'center', fontWeight: 600 }}>Buy</div>
        <Line data={buyData} options={options} height={220} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ textAlign: 'center', fontWeight: 600 }}>Sell</div>
        <Line data={sellData} options={options} height={220} />
      </div>
    </div>
  );
} 
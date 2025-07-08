import React, { useState, useEffect } from 'react';
import ExchangeSelector from './components/ExchangeSelector';
import OffsetInputs from './components/OffsetInputs';
import OrderBookCharts from './components/OrderBookCharts';

export default function App() {
  const [exchanges, setExchanges] = useState([]);
  const [exchange, setExchange] = useState('');
  const [qtOffset, setQtOffset] = useState(0);
  const [amtOffset, setAmtOffset] = useState(0);
  const [orderbook, setOrderbook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchExchanges() {
      try {
        const res = await fetch('http://localhost:3001/api/exchanges');
        const ids = await res.json();
        setExchanges(ids);
        if (ids.length > 0) setExchange(ids[0]);
      } catch (e) {
        setError('Failed to load exchanges');
      }
    }
    fetchExchanges();
  }, []);

  const fetchOrderbook = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:3001/api/orderbook?exchange=${exchange}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOrderbook(data);
    } catch (e) {
      setError(e.message);
      setOrderbook({ bids: [], asks: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', fontFamily: 'sans-serif', border: '1px solid #ccc', padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>CCXT Orderbook</h2>
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <ExchangeSelector exchanges={exchanges} value={exchange} onChange={setExchange} />
        <OffsetInputs qtOffset={qtOffset} setQtOffset={setQtOffset} amtOffset={amtOffset} setAmtOffset={setAmtOffset} />
        <button onClick={fetchOrderbook} style={{ padding: '0 18px', fontWeight: 600, height: 32 }}>Fetch</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <OrderBookCharts orderbook={orderbook} qtOffset={qtOffset} amtOffset={amtOffset} loading={loading} />
    </div>
  );
}

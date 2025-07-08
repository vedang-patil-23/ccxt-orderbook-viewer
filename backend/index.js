const express = require('express');
const cors = require('cors');
const ccxt = require('ccxt');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/orderbook', async (req, res) => {
  const { exchange } = req.query;
  if (!exchange) return res.status(400).json({ error: 'Exchange required' });
  try {
    const ex = new ccxt[exchange]();
    const orderbook = await ex.fetchOrderBook('BTC/USDT', 20);
    res.json({ bids: orderbook.bids, asks: orderbook.asks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/exchanges', (req, res) => {
  try {
    const ids = ccxt.exchanges;
    res.json(ids);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 
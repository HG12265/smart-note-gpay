const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Ithu thaan .env file-ah read pannum

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log("Mongo Error: ", err));

const transactionSchema = new mongoose.Schema({
  amount: String,
  person: String,
  type: String,
  note: String,
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

app.post('/api/save-transaction', async (req, res) => {
  try {
    const newTx = new Transaction(req.body);
    await newTx.save();
    res.status(200).json({ message: "Saved Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/get-transactions', async (req, res) => {
  const txs = await Transaction.find().sort({ date: -1 });
  res.json(txs);
});

app.delete('/api/delete-transaction/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
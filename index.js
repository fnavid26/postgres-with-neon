const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'fateen',
  host: 'localhost',
  database: 'mytestdb',
  password: 'changeme',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

app.get('/expenses', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
  res.json(rows);
});
app.post('/expenses', async (req, res) => {
  const { expense_date, amount, description } = req.body;
  const result = await pool.query(
    'INSERT INTO expenses (expense_date, amount, description) VALUES ($1, $2, $3) RETURNING *',
    [expense_date, amount, description]
  );
  res.status(201).json(result.rows[0]);
});
app.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));


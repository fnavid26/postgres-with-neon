const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'expense-tracker-db.c7w46q6q83om.us-west-1.rds.amazonaws.com',
  database: 'postgres',
  password: '$h!$h_kebab135',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running!');
});

app.get('/api/expenses', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM expenses ORDER BY expense_date DESC');
  res.json(rows);
});
app.post('/api/expenses', async (req, res) => {
  const { expense_date, amount, description, category } = req.body;
  const result = await pool.query(
    'INSERT INTO expenses (expense_date, amount, description, category) VALUES ($1, $2, $3, $4) RETURNING *',
    [expense_date, amount, description, category]
  );
  res.status(201).json(result.rows[0]);
});
app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM expenses WHERE id = $1', [id]);
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`API running on http://0.0.0.0:${PORT}`));



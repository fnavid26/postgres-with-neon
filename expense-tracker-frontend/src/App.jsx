import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/expenses');
        setExpenses(response.data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };
    fetchExpenses();
  }, []);

  const addExpense = async () => {
    const newExpense = { description, amount, category, expense_date: new Date().toISOString().slice(0,10) };
    const res = await axios.post('http://localhost:3001/expenses', newExpense);
    setExpenses([res.data, ...expenses]);
    setDescription(''); setAmount(''); setCategory('');
  };

  return (
    <div>
      <h1>Expense Tracker</h1>
      <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
      <input placeholder="Category" value={category} onChange={e=>setCategory(e.target.value)} />
      <button onClick={addExpense}>Add</button>
      <ul>
        {expenses.map(exp => (
          <li key={exp.id}>
            {exp.description} - ${exp.amount} [{exp.category}] on {new Date(exp.expense_date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );

 
}

export default App;

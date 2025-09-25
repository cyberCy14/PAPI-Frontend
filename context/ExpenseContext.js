import { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const { token } = useContext(AuthContext);

  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const clearExpenses = () => {
    setExpenses([]);
  };

  useEffect(() => {
    if (!token) {
      clearExpenses();
    }
  }, [token]);

  const getBudgetTotals = () => {
    const totals = {
      Food: 0,
      Bills: 0,
      Rent: 0,
      Others: 0,
    };

    expenses.forEach((item) => {
      const text = item.value.toLowerCase();
      const amount = parseFloat(item.amount) || 0;

      if (text.includes('food') || text.includes('grocery')) {
        totals.Food += amount;
      } else if (text.includes('bill') || text.includes('electricity') || text.includes('water')) {
        totals.Bills += amount;
      } else if (text.includes('rent') || text.includes('apartment') || text.includes('room')) {
        totals.Rent += amount;
      } else {
        totals.Others += amount;
      }
    });

    return totals;
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, getBudgetTotals, clearExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
};

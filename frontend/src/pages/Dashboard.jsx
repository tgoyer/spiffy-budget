import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const data = await apiFetch("/transactions");
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTransactions();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome, {user.name}</h1>
      <button onClick={logout}>Logout</button>
      <h2>Transactions</h2>
      {transactions.length === 0 && <p>No transactions yet.</p>}
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.category}: ${t.amount} — {t.note}
          </li>
        ))}
      </ul>
    </div>
  );
}

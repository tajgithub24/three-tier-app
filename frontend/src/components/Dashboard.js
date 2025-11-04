import React from 'react';

function Dashboard({ user, onLogout }) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>My App Dashboard</h1>
        <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
      </header>

      <section style={styles.card}>
        <h2>Welcome, {user.username}!</h2>
        <p>Email: {user.email}</p>
      </section>

      <section style={styles.card}>
        <h3>Quick Actions</h3>
        <div style={styles.actions}>
          <button style={styles.actionButton}>Profile</button>
          <button style={styles.actionButton}>Settings</button>
          <button style={styles.actionButton}>Messages</button>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: { padding: 20, fontFamily: 'Arial, sans-serif', background: '#f0f2f5', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  logoutButton: { padding: 8, background: '#f44336', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' },
  card: { background: '#fff', padding: 20, borderRadius: 10, boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: 20 },
  actions: { display: 'flex', gap: 10 },
  actionButton: { padding: 10, flex: 1, borderRadius: 5, border: 'none', background: '#007BFF', color: '#fff', cursor: 'pointer' },
  stats: { display: 'flex', justifyContent: 'space-between' },
  statBox: { background: '#e3f2fd', padding: 15, borderRadius: 5, flex: 1, textAlign: 'center', margin: 5 }
};

export default Dashboard;

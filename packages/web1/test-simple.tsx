import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  const [apiStatus, setApiStatus] = React.useState('checking...');
  
  React.useEffect(() => {
    fetch('http://localhost:3000/api/v1/health')
      .then(res => res.json())
      .then(() => setApiStatus('✅ Connected'))
      .catch(() => setApiStatus('❌ Failed'));
  }, []);
  
  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Web1 Test</h1>
      <p>API Status: {apiStatus}</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
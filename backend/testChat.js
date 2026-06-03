import fetch from 'node-fetch';

(async () => {
  try {
    const res = await fetch('http://localhost:5001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello', history: [] })
    });
    const data = await res.json();
    console.log('Chat response:', data);
  } catch (e) {
    console.error('Error during test request:', e);
  }
})();

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [tenders, setTenders] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', startTime: '', endTime: '', bufferTime: '' });

  useEffect(() => {
    const fetchTenders = async () => {
      const response = await axios.get('http://localhost:5000/api/tenders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTenders(response.data);
    };
    fetchTenders();
  }, []);

  const createTender = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/tenders', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setForm({ name: '', description: '', startTime: '', endTime: '', bufferTime: '' });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

      <form onSubmit={createTender} className="mb-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input
            type="text"
            placeholder="Tender Name"
            className="p-3 border border-gray-300 rounded-lg"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Tender Description"
            className="p-3 border border-gray-300 rounded-lg"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            placeholder="Start Time"
            className="p-3 border border-gray-300 rounded-lg"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            required
          />
          <input
            type="datetime-local"
            placeholder="End Time"
            className="p-3 border border-gray-300 rounded-lg"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Buffer Time (minutes)"
            className="p-3 border border-gray-300 rounded-lg"
            value={form.bufferTime}
            onChange={(e) => setForm({ ...form, bufferTime: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition"
        >
          Create Tender
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4">All Tenders</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tenders.map((tender) => (
            <div key={tender._id} className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="font-bold text-lg">{tender.name}</h3>
              <p>{tender.description}</p>
              <p className="text-gray-500">Start: {new Date(tender.startTime).toLocaleString()}</p>
              <p className="text-gray-500">End: {new Date(tender.endTime).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
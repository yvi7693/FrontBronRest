import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RestaurantLayout from './RestaurantLayout';

function App() {
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date: '', time: '', client: '', guests: 1 });

  useEffect(() => {
    axios.get('http://localhost:4000/tables').then(res => setTables(res.data));
  }, []);

  useEffect(() => {
    if (form.date && form.time) {
      axios.get('http://localhost:4000/bookings', { params: { date: form.date, time: form.time } })
        .then(res => setBookings(res.data));
    }
  }, [form.date, form.time]);

  const isBooked = (tableId) => bookings.some(b => b.table._id === tableId);

  const handleBook = () => {
    axios.post('http://localhost:4000/book', {
      tableId: selected,
      ...form
    })
      .then(() => {
        alert('Бронь создана!');
        setSelected(null);
        setForm({ ...form, client: '', guests: 1 });
        // Перезагрузить бронирования
        axios.get('http://localhost:4000/bookings', { params: { date: form.date, time: form.time } })
          .then(res => setBookings(res.data));
      })
      .catch(() => alert('Столик уже занят!'));
  };

  return (
    <div>
      <h1 style={{textAlign: 'center'}}>Рассадка ресторана</h1>
      <div style={{textAlign: 'center', marginBottom: 20}}>
        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{marginLeft: 10}} />
      </div>
      <RestaurantLayout
        tables={tables}
        onTableClick={setSelected}
        selectedTableId={selected}
        isBooked={isBooked}
      />
      {selected && (
        <div style={{textAlign: 'center', marginTop: 30}}>
          <h2>Бронирование столика №{tables.find(t => t._id === selected)?.number}</h2>
          <input placeholder="Имя клиента" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
          <input type="number" min="1" max="20" value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} style={{marginLeft: 10}} />
          <button onClick={handleBook} style={{marginLeft: 10}}>Забронировать</button>
        </div>
      )}
    </div>
  );
}

export default App;
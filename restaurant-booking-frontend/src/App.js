import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

// Моки гостей и бронирований (замените на ваши данные)
const guestsInHall = [
  { id: 1, name: 'Сергей Иванов', table: '101', people: 5, time: '15:00 — 17:00', price: 4800, color: 'blue', vip: true },
  { id: 2, name: 'Иван Которский', table: '10', people: 2, time: '15:00 — 19:00', color: 'green' },
  { id: 3, name: 'Татьяна Самойленко', table: '101-9', people: 2, time: '15:00 — 19:00', color: 'red' },
  { id: 4, name: 'Гость без имени', table: '1', people: 2, time: '14:00 — 20:00', color: 'gray' },
  { id: 5, name: 'Светлана', table: '', people: 2, time: '15:00 — 21:00', color: 'gray' },
];
const waitingGuests = [
  { id: 6, name: 'Сергей Иванов', table: '101', people: 5, time: '15:00 — 17:00', price: 480, color: 'blue', vip: true },
  { id: 7, name: 'Иван Которский', table: '10', people: 2, time: '15:00 — 19:00', color: 'green' },
  { id: 8, name: 'Татьяна Самойленко', table: '101-9', people: 2, time: '15:00 — 19:00', color: 'red' },
];

// Заглушка для схемы столиков (замените на свою реализацию)
const TablesScheme = () => (
  <div className="tables-scheme">
    <div className="table-icon blue"><div>8</div><span>Светлана</span></div>
    <div className="table-icon green"><div>8</div></div>
    <div className="table-icon red"><div>8</div><span>Тимофей Алексеев</span></div>
    <div className="table-icon blue"><div>10</div></div>
    {/* Добавьте нужные столы по аналогии */}
  </div>
);

// Таймлайн и выбор даты
const Timeline = ({ selectedDate, onDateChange }) => (
  <div className="timeline">
    <div className="timeline-date-block">
      <input
        type="date"
        value={selectedDate}
        onChange={e => onDateChange(e.target.value)}
        className="timeline-date-picker"
      />
      <span className="timeline-date-label">
        {selectedDate && new Date(selectedDate).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', weekday: 'short' })}
      </span>
    </div>
    <div className="timeline-slots">
      {['15:15', '15:30', '15:45', '16:00', '16:15', '16:30', '16:45', '17:00', '17:15'].map(time => (
        <div key={time} className="timeline-slot">{time}</div>
      ))}
    </div>
  </div>
);

function App() {
  const [selectedDate, setSelectedDate] = useState('2021-05-12');

  return (
    <div className="app-wrapper dark-theme">
      {/* Header */}
      <header className="header">
        <img src={logo} alt="Логотип" className="logo" />
        <div className="header-actions">
          <span className="header-title">Ресторан</span>
          {/* Можно добавить иконки, уведомления и т.д. */}
        </div>
      </header>
      {/* Timeline */}
      <Timeline selectedDate={selectedDate} onDateChange={setSelectedDate} />
      {/* Main Content */}
      <div className="main-content">
        {/* Left - Guests List */}
        <aside className="guests-list">
          <section>
            <h3>Гости в зале</h3>
            <ul>
              {guestsInHall.map(g => (
                <li key={g.id} className={`guest-card ${g.color}`}>
                  <span className="table-number">{g.table}</span>
                  <span className="guest-name">{g.name}{g.vip && ' 🔒'}</span>
                  <span className="people-count">👥 {g.people}</span>
                  <span className="time">{g.time}</span>
                  {g.price && <span className="price">{g.price} ₽</span>}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h3>Ожидаются</h3>
            <ul>
              {waitingGuests.map(g => (
                <li key={g.id} className={`guest-card ${g.color}`}>
                  <span className="table-number">{g.table}</span>
                  <span className="guest-name">{g.name}{g.vip && ' 🔒'}</span>
                  <span className="people-count">👥 {g.people}</span>
                  <span className="time">{g.time}</span>
                  {g.price && <span className="price">{g.price} ₽</span>}
                </li>
              ))}
            </ul>
          </section>
        </aside>
        {/* Right - Tables Scheme */}
        <section className="tables-section">
          <TablesScheme />
          <div className="zone-switcher">
            <button>Зал 2</button>
            <button>Веранда</button>
            <button>Зал 1</button>
          </div>
        </section>
      </div>
      {/* Footer */}
      <footer className="footer">
        <div className="toast success">
          <span className="toast-title">Татьяна Иванова</span>
          <span className="toast-desc">10 продаж на сумму 10 000 ₽. Последний визит 12 мая 2021 г.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

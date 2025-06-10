import React, { useState } from 'react';

// Пример массива столов, соответствующего твоей схеме
const tables = [
  // Маленький верхний стол
  { _id: '1', number: 1, x: 340, y: 50, seats: 2, width: 80, height: 40 },
  // Левый верхний стол
  { _id: '2', number: 2, x: 170, y: 150, seats: 8, width: 180, height: 60 },
  // Правый верхний стол
  { _id: '3', number: 3, x: 430, y: 150, seats: 8, width: 180, height: 60 },
  // Левый нижний стол
  { _id: '4', number: 4, x: 170, y: 330, seats: 8, width: 180, height: 60 },
  // Правый нижний стол
  { _id: '5', number: 5, x: 430, y: 330, seats: 8, width: 180, height: 60 },
];

// Компонент для отображения рассадки
function RestaurantLayout({ tables, onTableClick, selectedTableId, isBooked }) {
  return (
    <div style={{
      position: 'relative',
      width: 800,
      height: 600,
      border: '2px solid #ccc',
      margin: '20px auto',
      background: '#f9f9f9'
    }}>
      {tables.map(table => (
        <div
          key={table._id}
          style={{
            position: 'absolute',
            left: table.x,
            top: table.y,
            width: table.width,
            height: table.height,
            background: isBooked(table._id) ? '#d9534f' : '#5cb85c',
            border: selectedTableId === table._id ? '3px solid #337ab7' : '1px solid #222',
            borderRadius: table.seats <= 2 ? 10 : 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 22,
            cursor: isBooked(table._id) ? 'not-allowed' : 'pointer',
            transition: '0.2s'
          }}
          onClick={() => !isBooked(table._id) && onTableClick(table._id)}
          title={`Столик №${table.number}, мест: ${table.seats}`}
        >
          {table.number}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [selected, setSelected] = useState(null);

  // Заглушка для бронирования (всегда свободен)
  const isBooked = () => false;

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Рассадка ресторана</h1>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <input type="date" disabled value="2025-06-10" style={{ marginRight: 10 }} />
        <input type="time" disabled value="12:30" />
      </div>
      <RestaurantLayout
        tables={tables}
        onTableClick={setSelected}
        selectedTableId={selected}
        isBooked={isBooked}
      />
      {selected && (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <h2>Столик №{tables.find(t => t._id === selected)?.number}</h2>
          <p>Количество мест: {tables.find(t => t._id === selected)?.seats}</p>
          <button onClick={() => setSelected(null)}>Закрыть</button>
        </div>
      )}
    </div>
  );
}

export default App;

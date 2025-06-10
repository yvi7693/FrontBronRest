import React, { useState } from 'react';
import RestaurantLayout from './RestaurantLayout';

// Первый этаж — схема из предыдущего примера
const firstFloorTables = [
  { _id: '1', number: 1, x: 340, y: 50, seats: 2, width: 80, height: 40 },
  { _id: '2', number: 2, x: 170, y: 150, seats: 8, width: 180, height: 60 },
  { _id: '3', number: 3, x: 430, y: 150, seats: 8, width: 180, height: 60 },
  { _id: '4', number: 4, x: 170, y: 330, seats: 8, width: 180, height: 60 },
  { _id: '5', number: 5, x: 430, y: 330, seats: 8, width: 180, height: 60 },
];

// Второй этаж — примерная схема по изображению (Image 4)
// Координаты и размеры примерные, для точной схемы их можно скорректировать!
const secondFloorTables = [
  // Левый верхний угол
  { _id: '6', number: 6, x: 40, y: 40, seats: 4, width: 60, height: 60 },
  { _id: '7', number: 7, x: 130, y: 40, seats: 4, width: 60, height: 60 },
  { _id: '8', number: 8, x: 40, y: 120, seats: 6, width: 120, height: 40 },
  { _id: '9', number: 9, x: 40, y: 180, seats: 6, width: 120, height: 40 },
  // Центр левой части
  { _id: '10', number: 10, x: 40, y: 250, seats: 6, width: 120, height: 40 },
  // Маленькие столы в центре левой части
  { _id: '11', number: 11, x: 170, y: 100, seats: 4, width: 60, height: 60 },
  // Центр — два квадратных стола под углом
  { _id: '12', number: 12, x: 330, y: 280, seats: 4, width: 70, height: 70, rotate: 20 },
  { _id: '13', number: 13, x: 430, y: 320, seats: 4, width: 70, height: 70, rotate: -20 },
  // Средний зал — прямоугольные столы
  { _id: '14', number: 14, x: 260, y: 120, seats: 4, width: 80, height: 40 },
  { _id: '15', number: 15, x: 350, y: 120, seats: 4, width: 80, height: 40 },
  { _id: '16', number: 16, x: 440, y: 120, seats: 4, width: 80, height: 40 },
  // Правый зал — длинные столы
  { _id: '17', number: 17, x: 530, y: 70, seats: 6, width: 120, height: 40 },
  { _id: '18', number: 18, x: 530, y: 130, seats: 6, width: 120, height: 40 },
  // Барная зона (круглые места)
  { _id: '19', number: 19, x: 680, y: 60, seats: 1, width: 35, height: 35, shape: 'circle' },
  { _id: '20', number: 20, x: 680, y: 110, seats: 1, width: 35, height: 35, shape: 'circle' },
  { _id: '21', number: 21, x: 680, y: 160, seats: 1, width: 35, height: 35, shape: 'circle' },
  { _id: '22', number: 22, x: 720, y: 60, seats: 1, width: 35, height: 35, shape: 'circle' },
  { _id: '23', number: 23, x: 720, y: 110, seats: 1, width: 35, height: 35, shape: 'circle' },
  { _id: '24', number: 24, x: 720, y: 160, seats: 1, width: 35, height: 35, shape: 'circle' },
  // Правый нижний зал — диваны
  { _id: '25', number: 25, x: 600, y: 450, seats: 6, width: 140, height: 50 },
  { _id: '26', number: 26, x: 600, y: 520, seats: 6, width: 140, height: 50 },
  // Правый нижний зал — обычные столы
  { _id: '27', number: 27, x: 700, y: 300, seats: 4, width: 70, height: 70 },
];

function App() {
  const [floor, setFloor] = useState(1);
  const [selected, setSelected] = useState(null);

  const isBooked = () => false; // Заглушка

  const tables = floor === 1 ? firstFloorTables : secondFloorTables;

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Рассадка ресторана</h1>
      <div style={{ textAlign: 'center', margin: 16 }}>
        <button
          style={{
            marginRight: 8,
            background: floor === 1 ? "#337ab7" : "#eee",
            color: floor === 1 ? "#fff" : "#222",
            border: '1px solid #337ab7',
            borderRadius: 4,
            padding: '8px 20px',
            cursor: 'pointer'
          }}
          onClick={() => setFloor(1)}
        >
          1 этаж
        </button>
        <button
          style={{
            background: floor === 2 ? "#337ab7" : "#eee",
            color: floor === 2 ? "#fff" : "#222",
            border: '1px solid #337ab7',
            borderRadius: 4,
            padding: '8px 20px',
            cursor: 'pointer'
          }}
          onClick={() => setFloor(2)}
        >
          2 этаж
        </button>
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

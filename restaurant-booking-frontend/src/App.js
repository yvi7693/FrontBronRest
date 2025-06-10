import React, { useState } from 'react';
import RestaurantLayout from './RestaurantLayout';
import RestaurantDesigner from './RestaurantDesigner';

// Пример начальных массивов столов и стен
const initialFirstFloorTables = [
  { _id: '1', number: 1, x: 340, y: 50, seats: 2, width: 80, height: 40 },
  { _id: '2', number: 2, x: 170, y: 150, seats: 8, width: 180, height: 60 },
  { _id: '3', number: 3, x: 430, y: 150, seats: 8, width: 180, height: 60 },
  { _id: '4', number: 4, x: 170, y: 330, seats: 8, width: 180, height: 60 },
  { _id: '5', number: 5, x: 430, y: 330, seats: 8, width: 180, height: 60 },
];

const initialFirstFloorWalls = [
  // Пример стен (x1, y1, x2, y2)
  { id: 'w1', x1: 100, y1: 100, x2: 300, y2: 100 },
];

const initialSecondFloorTables = [
  { _id: '6', number: 6, x: 40, y: 40, seats: 4, width: 60, height: 60 },
  { _id: '7', number: 7, x: 130, y: 40, seats: 4, width: 60, height: 60 },
  { _id: '8', number: 8, x: 40, y: 120, seats: 6, width: 120, height: 40 },
  // ... остальные столики
];

const initialSecondFloorWalls = [
  // Стен пока нет, добавьте по мере необходимости
];

function App() {
  const [floor, setFloor] = useState(1);
  const [editMode, setEditMode] = useState(false);

  // Состояние для столиков и стен по этажам
  const [firstFloorTables, setFirstFloorTables] = useState(initialFirstFloorTables);
  const [firstFloorWalls, setFirstFloorWalls] = useState(initialFirstFloorWalls);
  const [secondFloorTables, setSecondFloorTables] = useState(initialSecondFloorTables);
  const [secondFloorWalls, setSecondFloorWalls] = useState(initialSecondFloorWalls);

  const [selected, setSelected] = useState(null);

  // Заглушка для бронирования (все столы свободны)
  const isBooked = () => false;

  // Получаем текущие столы, стены и функции сохранения
  const currentTables = floor === 1 ? firstFloorTables : secondFloorTables;
  const setCurrentTables = floor === 1 ? setFirstFloorTables : setSecondFloorTables;
  const currentWalls = floor === 1 ? firstFloorWalls : secondFloorWalls;
  const setCurrentWalls = floor === 1 ? setFirstFloorWalls : setSecondFloorWalls;

  // Сохранение схемы после редактирования
  const handleSaveDesigner = (newTables, newWalls) => {
    setCurrentTables(newTables);
    setCurrentWalls(newWalls);
    setEditMode(false);
  };

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
        <button
          style={{
            marginLeft: 32,
            background: editMode ? "#f0ad4e" : "#eee",
            color: editMode ? "#fff" : "#222",
            border: '1px solid #f0ad4e',
            borderRadius: 4,
            padding: '8px 20px',
            cursor: 'pointer'
          }}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Завершить редактирование" : "Редактировать рассадку"}
        </button>
      </div>
      {editMode ? (
        <RestaurantDesigner
          tables={currentTables}
          walls={currentWalls}
          onSave={handleSaveDesigner}
        />
      ) : (
        <RestaurantLayout
          tables={currentTables}
          walls={currentWalls}
          onTableClick={setSelected}
          selectedTableId={selected}
          isBooked={isBooked}
        />
      )}
      {selected && !editMode && (
        <div style={{ textAlign: 'center', marginTop: 30 }}>
          <h2>Столик №{currentTables.find(t => t._id === selected)?.number}</h2>
          <p>Количество мест: {currentTables.find(t => t._id === selected)?.seats}</p>
          <button onClick={() => setSelected(null)}>Закрыть</button>
        </div>
      )}
    </div>
  );
}

export default App;

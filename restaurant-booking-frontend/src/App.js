import React, { useState, useEffect } from 'react';
import RestaurantLayout from './RestaurantLayout';
import RestaurantDesigner from './RestaurantDesigner';
import './App.css';
import logo from "./logo.png"; 

const initialFirstFloorTables = [
  { _id: '1', number: 1, x: 340, y: 50, seats: 2, width: 80, height: 40 },
  { _id: '2', number: 2, x: 170, y: 150, seats: 8, width: 180, height: 60 },
  { _id: '3', number: 3, x: 430, y: 150, seats: 8, width: 180, height: 60 },
  { _id: '4', number: 4, x: 170, y: 330, seats: 8, width: 180, height: 60 },
  { _id: '5', number: 5, x: 430, y: 330, seats: 8, width: 180, height: 60 },
];

const initialFirstFloorWalls = [
  { id: 'w1', x1: 100, y1: 100, x2: 300, y2: 100 },
];

const initialSecondFloorTables = [
  { _id: '6', number: 6, x: 40, y: 40, seats: 4, width: 60, height: 60 },
  { _id: '7', number: 7, x: 130, y: 40, seats: 4, width: 60, height: 60 },
  { _id: '8', number: 8, x: 40, y: 120, seats: 6, width: 120, height: 40 },
];

const initialSecondFloorWalls = [];

function App() {
  // Cостояния с localStorage для приятного UX
  const [floor, setFloor] = useState(() => Number(localStorage.getItem('floor')) || 1);
  const [editMode, setEditMode] = useState(() => JSON.parse(localStorage.getItem('editMode')) || false);

  const [firstFloorTables, setFirstFloorTables] = useState(initialFirstFloorTables);
  const [firstFloorWalls, setFirstFloorWalls] = useState(initialFirstFloorWalls);
  const [secondFloorTables, setSecondFloorTables] = useState(initialSecondFloorTables);
  const [secondFloorWalls, setSecondFloorWalls] = useState(initialSecondFloorWalls);

  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');

  useEffect(() => { localStorage.setItem('floor', floor); }, [floor]);
  useEffect(() => { localStorage.setItem('editMode', JSON.stringify(editMode)); }, [editMode]);

  const isBooked = () => false;

  const currentTables = floor === 1 ? firstFloorTables : secondFloorTables;
  const setCurrentTables = floor === 1 ? setFirstFloorTables : setSecondFloorTables;
  const currentWalls = floor === 1 ? firstFloorWalls : secondFloorWalls;
  const setCurrentWalls = floor === 1 ? setFirstFloorWalls : setSecondFloorWalls;

  const handleSaveDesigner = (newTables, newWalls) => {
    setCurrentTables(newTables);
    setCurrentWalls(newWalls);
    setEditMode(false);
    setToast('Схема успешно сохранена!');
    setTimeout(() => setToast(''), 2200);
  };

  return (
    <div className="rbr-bg">
      <div className="rbr-container">
        <div className="rbr-header">
          <span className="rbr-logo-box">
            <img className="rbr-logo-img" src={logo} alt="Logo" />
          </span>
          Rimini Table Designer
        </div>
        <div className="rbr-toolbar" style={{ marginBottom: 30 }}>
          <button
            className={mode === "designer" ? "selected" : ""}
            onClick={() => setMode("designer")}
          >
            🛠️ Редактор зала
          </button>
          <button
            className={mode === "layout" ? "selected" : ""}
            onClick={() => setMode("layout")}
          >
            👀 Просмотр рассадки
          </button>
        </div>
        {mode === "designer" ? (
          <RestaurantDesigner
            tables={tables}
            walls={walls}
            onSave={handleSave}
          />
        ) : (
          <RestaurantLayout
            tables={tables}
            walls={walls}
            selectedTableId={selectedTableId}
            onTableClick={handleTableClick}
          />
        )}
        <div className="rbr-footer">
          <b>Rimini Table Designer</b> · Демо рассадки и редактора столиков для ресторана
        </div>
      </div>
    </div>
  );
}

// SVG иконки (оптимизированы)
function FloorIcon() { return <svg width="18" height="18" viewBox="0 0 20 20"><rect x="2" y="13" width="16" height="5" rx="2.5" fill="#4267e7" opacity=".5"/></svg>; }
function FloorIconActive() { return <svg width="18" height="18" viewBox="0 0 20 20"><rect x="2" y="13" width="16" height="5" rx="2.5" fill="#4267e7"/></svg>; }
function EditIcon() { return <svg width="18" height="18" viewBox="0 0 20 20"><path d="M4 13.5V16h2.5l7.4-7.4-2.5-2.5L4 13.5z" fill="#4267e7"/><path d="M15.7 7.29a1 1 0 000-1.42l-2.54-2.54a1 1 0 00-1.42 0l-1.13 1.13 3.96 3.96 1.13-1.13z" fill="#4267e7"/></svg>; }
function EditDoneIcon() { return <svg width="18" height="18" viewBox="0 0 20 20"><rect x="2" y="15" width="16" height="3" rx="1.5" fill="#f2b434"/><path d="M7 12l2 2 4-4" stroke="#f2b434" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>; }
function TableIcon() { return <svg width="19" height="19" viewBox="0 0 20 20"><rect x="3" y="6" width="14" height="8" rx="3" fill="#4267e7"/><rect x="7" y="6" width="6" height="8" rx="1" fill="#fff" opacity=".7"/></svg>; }
function UsersIcon() { return <svg width="17" height="17" viewBox="0 0 20 20"><circle cx="7" cy="8" r="3" fill="#4267e7"/><circle cx="13" cy="10" r="2" fill="#4267e7" opacity=".6"/><rect x="2" y="13" width="10" height="4" rx="2" fill="#4267e7" opacity=".4"/><rect x="11" y="13" width="7" height="2.5" rx="1.2" fill="#4267e7" opacity=".2"/></svg>; }
function CloseIcon() { return <svg width="15" height="15" viewBox="0 0 20 20"><line x1="5" y1="5" x2="15" y2="15" stroke="#fff" strokeWidth="2"/><line x1="15" y1="5" x2="5" y2="15" stroke="#fff" strokeWidth="2"/></svg>; }

export default App;

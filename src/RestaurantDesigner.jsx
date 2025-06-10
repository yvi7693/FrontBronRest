import React, { useState } from 'react';

const defaultSize = { width: 80, height: 40 };

function RestaurantDesigner({ onSave }) {
  const [tables, setTables] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const handleFieldClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left - defaultSize.width / 2;
    const y = e.clientY - rect.top - defaultSize.height / 2;
    const newTable = {
      _id: Date.now().toString(),
      number: tables.length + 1,
      x,
      y,
      seats: 4,
      width: defaultSize.width,
      height: defaultSize.height,
      shape: 'rect'
    };
    setTables([...tables, newTable]);
    setSelectedId(newTable._id);
  };

  const handleTableDrag = (id, dx, dy) => {
    setTables(tables.map(t => t._id === id ? { ...t, x: t.x + dx, y: t.y + dy } : t));
  };

  const handleRemove = (id) => {
    setTables(tables.filter(t => t._id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleParamChange = (id, key, value) => {
    setTables(tables.map(t => t._id === id ? { ...t, [key]: value } : t));
  };

  const selectedTable = tables.find(t => t._id === selectedId);

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => onSave(tables)}>Сохранить рассадку</button>
      </div>
      <div
        style={{
          position: 'relative',
          width: 800,
          height: 600,
          border: '2px solid #ccc',
          margin: '0 auto',
          background: '#f9f9f9'
        }}
        onClick={e => {
          // Только если клик по полю, а не по столу
          if (e.target === e.currentTarget) handleFieldClick(e);
        }}
      >
        {tables.map(table => (
          <DraggableTable
            key={table._id}
            table={table}
            selected={selectedId === table._id}
            onSelect={() => setSelectedId(table._id)}
            onDrag={(dx, dy) => handleTableDrag(table._id, dx, dy)}
            onRemove={() => handleRemove(table._id)}
          />
        ))}
      </div>
      {selectedTable && (
        <div style={{ marginTop: 20, background: '#eee', padding: 10, borderRadius: 8, width: 350 }}>
          <b>Параметры стола №{selectedTable.number}</b>
          <div>
            <label>Номер: </label>
            <input
              type="number"
              value={selectedTable.number}
              onChange={e => handleParamChange(selectedTable._id, "number", Number(e.target.value))}
            />
          </div>
          <div>
            <label>Мест: </label>
            <input
              type="number"
              value={selectedTable.seats}
              onChange={e => handleParamChange(selectedTable._id, "seats", Number(e.target.value))}
            />
          </div>
          <div>
            <label>Форма: </label>
            <select
              value={selectedTable.shape}
              onChange={e => handleParamChange(selectedTable._id, "shape", e.target.value)}
            >
              <option value="rect">Прямоугольник</option>
              <option value="circle">Круг</option>
            </select>
          </div>
          <div>
            <label>Ширина: </label>
            <input
              type="number"
              value={selectedTable.width}
              onChange={e => handleParamChange(selectedTable._id, "width", Number(e.target.value))}
            />
          </div>
          <div>
            <label>Высота: </label>
            <input
              type="number"
              value={selectedTable.height}
              onChange={e => handleParamChange(selectedTable._id, "height", Number(e.target.value))}
            />
          </div>
          <button style={{ marginTop: 10, color: 'red' }} onClick={() => handleRemove(selectedTable._id)}>
            Удалить стол
          </button>
        </div>
      )}
    </div>
  );
}

function DraggableTable({ table, selected, onSelect, onDrag, onRemove }) {
  const [dragging, setDragging] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    setOrigin({ x: e.clientX, y: e.clientY });
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      onDrag(e.clientX - origin.x, e.clientY - origin.y);
      setOrigin({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => setDragging(false);

  React.useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line
  }, [dragging, origin]);

  return (
    <div
      onMouseDown={handleMouseDown}
      onClick={onSelect}
      style={{
        position: 'absolute',
        left: table.x,
        top: table.y,
        width: table.width,
        height: table.height,
        background: selected ? '#337ab7' : '#5cb85c',
        border: selected ? '3px solid #222' : '1px solid #222',
        borderRadius: table.shape === "circle" ? "50%" : 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 20,
        cursor: 'move',
        userSelect: 'none',
        zIndex: selected ? 2 : 1
      }}
      title={`Столик №${table.number}, мест: ${table.seats}`}
    >
      {table.number}
      {selected && (
        <span
          style={{
            position: 'absolute',
            top: -12,
            right: -12,
            background: '#fff',
            color: 'red',
            borderRadius: '50%',
            width: 24,
            height: 24,
            textAlign: 'center',
            lineHeight: '24px',
            fontWeight: 'bold',
            border: '1px solid #aaa',
            cursor: 'pointer'
          }}
          onClick={e => { e.stopPropagation(); onRemove(); }}
        >
          ×
        </span>
      )}
    </div>
  );
}

export default RestaurantDesigner;

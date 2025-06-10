import React, { useRef, useEffect, useState } from 'react';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;
const SHAPES = [
  { key: 'rect', label: 'Прямоугольник' },
  { key: 'circle', label: 'Круг' }
];

function drawGrid(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = '#f3e3ce';
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function RestaurantDesigner({ tables, walls, onSave }) {
  const [currentTables, setCurrentTables] = useState(tables);
  const [currentWalls, setCurrentWalls] = useState(walls || []);
  const [mode, setMode] = useState('table');
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [drawingWall, setDrawingWall] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedTableId, setSelectedTableId] = useState(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [currentTables, currentWalls, showGrid, drawingWall, mode, selectedTableId]);

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid
    if (showGrid) {
      drawGrid(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Walls
    ctx.save();
    ctx.strokeStyle = "#a6763c";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    currentWalls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    });
    if (drawingWall) {
      ctx.setLineDash([8, 5]);
      ctx.beginPath();
      ctx.moveTo(drawingWall.x1, drawingWall.y1);
      ctx.lineTo(drawingWall.x2, drawingWall.y2);
      ctx.strokeStyle = "#d4673c";
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // Tables
    currentTables.forEach(table => {
      ctx.save();
      ctx.shadowColor =
        table._id === selectedTableId
          ? "#a6763c99"
          : "#a6763c22";
      ctx.shadowBlur = table._id === selectedTableId ? 15 : 6;
      ctx.fillStyle = table._id === selectedTableId ? "#fff2d8" : "#fff";
      ctx.strokeStyle = "#a6763c";
      ctx.lineWidth = table._id === selectedTableId ? 4 : 3;
      ctx.beginPath();
      if (table.shape === 'circle') {
        ctx.arc(table.x + table.width / 2, table.y + table.height / 2, table.width / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(table.x, table.y, table.width, table.height);
        ctx.strokeRect(table.x, table.y, table.width, table.height);
      }
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#a6763c";
      ctx.font = '700 18px Montserrat, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        table.number,
        table.x + table.width / 2,
        table.y + table.height / 2
      );
      ctx.restore();
    });
  }

  // Helper: get table by coordinates
  function getTableAt(x, y) {
    for (const t of currentTables) {
      if (t.shape === "circle") {
        const dx = x - (t.x + t.width / 2);
        const dy = y - (t.y + t.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) <= t.width / 2) return t;
      } else {
        if (x >= t.x && x <= t.x + t.width && y >= t.y && y <= t.y + t.height) return t;
      }
    }
    return null;
  }

  // Helper: get wall by proximity to a point
  function getWallNear(x, y, threshold = 7) {
    for (let wall of currentWalls) {
      const { x1, y1, x2, y2 } = wall;
      const A = x - x1;
      const B = y - y1;
      const C = x2 - x1;
      const D = y2 - y1;
      const dot = A * C + B * D;
      const len_sq = C * C + D * D;
      let param = -1;
      if (len_sq !== 0) param = dot / len_sq;
      let xx, yy;
      if (param < 0) { xx = x1; yy = y1; }
      else if (param > 1) { xx = x2; yy = y2; }
      else { xx = x1 + param * C; yy = y1 + param * D; }
      const dx = x - xx, dy = y - yy;
      if (Math.sqrt(dx * dx + dy * dy) <= threshold) return wall;
    }
    return null;
  }

  // Mouse events
  function handleMouseDown(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (mode === 'table') {
      const table = getTableAt(x, y);
      if (table) {
        setDraggedId(table._id);
        setDragOffset({ x: x - table.x, y: y - table.y });
        setSelectedTableId(table._id);
      } else {
        setSelectedTableId(null);
      }
    }
    if (mode === 'wall') {
      setDrawingWall({ x1: x, y1: y, x2: x, y2: y });
      setSelectedTableId(null);
    }
  }

  function handleMouseMove(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (draggedId) {
      setCurrentTables(tables =>
        tables.map(t =>
          t._id === draggedId
            ? { ...t, x: x - dragOffset.x, y: y - dragOffset.y }
            : t
        )
      );
    }
    if (drawingWall) {
      setDrawingWall({ ...drawingWall, x2: x, y2: y });
    }
  }

  function handleMouseUp(e) {
    if (draggedId) setDraggedId(null);

    if (drawingWall) {
      if (
        drawingWall.x1 !== drawingWall.x2 ||
        drawingWall.y1 !== drawingWall.y2
      ) {
        setCurrentWalls(ws =>
          ws.concat({
            id: `w${Date.now()}`,
            ...drawingWall,
          })
        );
      }
      setDrawingWall(null);
    }
  }

  // Добавление нового столика
  function handleAddTable() {
    const maxNumber =
      currentTables.length > 0
        ? Math.max(...currentTables.map(t => t.number))
        : 0;
    setCurrentTables([
      ...currentTables,
      {
        _id: `${Date.now()}`,
        number: maxNumber + 1,
        x: 50,
        y: 50,
        seats: 4,
        width: 60,
        height: 60,
        shape: 'rect'
      },
    ]);
  }

  // Удаление столика по клику
  function handleDeleteTable() {
    setCurrentTables(ts => ts.slice(0, -1));
    setSelectedTableId(null);
  }

  // Удаление стенки по клику
  function handleDeleteWall() {
    setCurrentWalls(ws => ws.slice(0, -1));
  }

  function handleContextMenu(e) {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    if (mode === 'table') {
      const table = getTableAt(x, y);
      if (table) {
        setCurrentTables(tables =>
          tables.filter(t => t._id !== table._id)
        );
        setSelectedTableId(null);
        return;
      }
    }
    if (mode === 'wall') {
      const wall = getWallNear(x, y, 8);
      if (wall) {
        setCurrentWalls(ws => ws.filter(w => w.id !== wall.id));
        return;
      }
    }
  }

  function handleSave() {
    onSave(currentTables, currentWalls);
    setSelectedTableId(null);
  }

  function handleTableParam(id, param, value) {
    setCurrentTables(ts =>
      ts.map(t =>
        t._id === id
          ? { ...t, [param]: value }
          : t
      )
    );
  }

  function handleShapeChange(id, shape) {
    setCurrentTables(ts =>
      ts.map(t =>
        t._id === id
          ? shape === 'circle'
            ? { ...t, shape, height: t.width }
            : { ...t, shape }
          : t
      )
    );
  }

  const selectedTable = currentTables.find(t => t._id === selectedTableId);

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <div className="rbr-toolbar" style={{ justifyContent: "flex-start", marginBottom: 12, marginLeft: 8 }}>
        <button
          onClick={() => setMode('table')}
          className={mode === 'table' ? 'selected' : ''}
          title="Редактировать столы (T)"
        >
          🪑 Столы
        </button>
        <button
          onClick={() => setMode('wall')}
          className={mode === 'wall' ? 'selected' : ''}
          title="Редактировать стены (W)"
        >
          🧱 Стены
        </button>
        <button
          onClick={() => setShowGrid(g => !g)}
          title={showGrid ? 'Скрыть сетку' : 'Показать сетку'}
        >
          {showGrid ? '🟦 Сетка' : '⬜ Сетка'}
        </button>
        <button onClick={handleAddTable} title="Добавить стол">➕ Стол</button>
        <button onClick={handleDeleteTable} title="Удалить последний стол">🗑️ Стол</button>
        <button onClick={handleDeleteWall} title="Удалить последнюю стену">🗑️ Стена</button>
        <button onClick={handleSave} className="primary" style={{ marginLeft: 20 }}>💾 Сохранить</button>
      </div>
      <div className="rbr-canvas-block" style={{ background: "#fff9ee", boxShadow: "none", padding: 0 }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="rbr-canvas"
          style={{ background: '#fff9ee', touchAction: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={handleContextMenu}
        />
      </div>
      {selectedTable && (
        <div style={{
          background: "#fff9ee",
          border: "1.5px solid #f3e3ce",
          borderRadius: 12,
          margin: "20px auto 4px auto",
          maxWidth: 400,
          boxShadow: "0 2px 10px #a6763c12",
          padding: "18px 30px 14px 30px",
          position: "relative",
          textAlign: "left",
          color: "#a6763c"
        }}>
          <div style={{ fontWeight: 700, fontSize: "1.1em", marginBottom: 10 }}>
            🪑 Параметры столика №{selectedTable.number}
            <button
              onClick={() => setSelectedTableId(null)}
              style={{
                float: "right",
                border: "none",
                background: "none",
                fontSize: "1.3em",
                cursor: "pointer",
                color: "#a6763c"
              }}
              title="Закрыть"
            >×</button>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ marginRight: 8 }}>Номер:</label>
            <input
              type="number"
              value={selectedTable.number}
              min={1}
              style={{ width: 55 }}
              onChange={e => handleTableParam(selectedTable._id, 'number', Number(e.target.value))}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ marginRight: 8 }}>Мест:</label>
            <input
              type="number"
              value={selectedTable.seats}
              min={1}
              style={{ width: 55 }}
              onChange={e => handleTableParam(selectedTable._id, 'seats', Number(e.target.value))}
            />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ marginRight: 8 }}>Ширина:</label>
            <input
              type="number"
              value={selectedTable.width}
              min={10}
              max={300}
              style={{ width: 55 }}
              onChange={e => {
                handleTableParam(selectedTable._id, 'width', Number(e.target.value));
                if (selectedTable.shape === 'circle') handleTableParam(selectedTable._id, 'height', Number(e.target.value));
              }}
            />
          </div>
          {selectedTable.shape !== 'circle' && (
            <div style={{ marginBottom: 8 }}>
              <label style={{ marginRight: 8 }}>Высота:</label>
              <input
                type="number"
                value={selectedTable.height}
                min={10}
                max={300}
                style={{ width: 55 }}
                onChange={e => handleTableParam(selectedTable._id, 'height', Number(e.target.value))}
              />
            </div>
          )}
          <div style={{ marginBottom: 10 }}>
            <label style={{ marginRight: 8 }}>Форма:</label>
            <select
              value={selectedTable.shape || 'rect'}
              onChange={e => handleShapeChange(selectedTable._id, e.target.value)}
            >
              {SHAPES.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div style={{ marginTop: 10, color: '#a6763c99', fontSize: '0.97em' }}>
        <span style={{ marginRight: 18 }}>ЛКМ — переместить (стол), нарисовать (стену)</span>
        <span>ПКМ — удалить столик или стену (в выбранном режиме)</span>
      </div>
    </div>
  );
}

export default RestaurantDesigner;

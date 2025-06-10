import React, { useRef, useEffect, useState } from 'react';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

function drawGrid(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = '#eee';
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
  const [mode, setMode] = useState('table'); // 'table' | 'wall'
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [drawingWall, setDrawingWall] = useState(null);
  const [showGrid, setShowGrid] = useState(true);

  const canvasRef = useRef(null);

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [currentTables, currentWalls, showGrid, drawingWall]);

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    if (showGrid) {
      drawGrid(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    // Draw walls
    ctx.save();
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 5;
    currentWalls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    });
    // Draw preview wall
    if (drawingWall) {
      ctx.setLineDash([8, 5]);
      ctx.beginPath();
      ctx.moveTo(drawingWall.x1, drawingWall.y1);
      ctx.lineTo(drawingWall.x2, drawingWall.y2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // Draw tables
    currentTables.forEach(table => {
      ctx.save();
      ctx.fillStyle = 'lightblue';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (table.shape === 'circle') {
        ctx.arc(table.x + table.width / 2, table.y + table.height / 2, table.width / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillRect(table.x, table.y, table.width, table.height);
        ctx.strokeRect(table.x, table.y, table.width, table.height);
      }
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        table.number,
        table.x + (table.width / 2),
        table.y + (table.height / 2)
      );
      ctx.restore();
    });
  }

  // Helper: get table by coordinates
  function getTableAt(x, y) {
    return currentTables.find(
      t =>
        x >= t.x &&
        x <= t.x + t.width &&
        y >= t.y &&
        y <= t.y + t.height
    );
  }

  // Helper: get wall by proximity to a point
  function getWallNear(x, y, threshold = 7) {
    for (let wall of currentWalls) {
      // Line-point distance formula
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
      }
    }
    if (mode === 'wall') {
      setDrawingWall({ x1: x, y1: y, x2: x, y2: y });
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
      // Only add if wall length is not zero
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
      },
    ]);
  }

  // Удаление столика по клику
  function handleDeleteTable() {
    setCurrentTables(ts => ts.slice(0, -1));
  }

  // Удаление стенки по клику
  function handleDeleteWall() {
    setCurrentWalls(ws => ws.slice(0, -1));
  }

  // Удаление по canvas: ПКМ по столу или стенке
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

  // Сохранение результата
  function handleSave() {
    onSave(currentTables, currentWalls);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setMode('table')}
          style={{
            background: mode === 'table' ? '#337ab7' : '#eee',
            color: mode === 'table' ? '#fff' : '#222',
            marginRight: 8,
            padding: '6px 14px',
            border: '1px solid #337ab7',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Режим столов
        </button>
        <button
          onClick={() => setMode('wall')}
          style={{
            background: mode === 'wall' ? '#337ab7' : '#eee',
            color: mode === 'wall' ? '#fff' : '#222',
            marginRight: 8,
            padding: '6px 14px',
            border: '1px solid #337ab7',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Режим стен
        </button>
        <button
          onClick={() => setShowGrid(g => !g)}
          style={{
            background: showGrid ? '#f0ad4e' : '#eee',
            color: showGrid ? '#fff' : '#222',
            marginRight: 8,
            padding: '6px 14px',
            border: '1px solid #f0ad4e',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          {showGrid ? 'Скрыть сетку' : 'Показать сетку'}
        </button>
        <button
          onClick={handleAddTable}
          style={{
            marginRight: 8, padding: '6px 14px', borderRadius: 4, cursor: 'pointer'
          }}
        >
          Добавить стол
        </button>
        <button
          onClick={handleDeleteTable}
          style={{
            marginRight: 8, padding: '6px 14px', borderRadius: 4, cursor: 'pointer'
          }}
        >
          Удалить стол
        </button>
        <button
          onClick={handleDeleteWall}
          style={{
            marginRight: 8, padding: '6px 14px', borderRadius: 4, cursor: 'pointer'
          }}
        >
          Удалить стену
        </button>
        <button
          onClick={handleSave}
          style={{
            background: '#5cb85c',
            color: '#fff',
            marginLeft: 24,
            padding: '6px 24px',
            border: '1px solid #5cb85c',
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Сохранить схему
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '1px solid #ccc', background: '#fff' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      />
      <div style={{ marginTop: 10, color: '#888' }}>
        <div>ЛКМ — переместить (стол), нарисовать (стену)</div>
        <div>ПКМ — удалить столик или стену (в выбранном режиме)</div>
      </div>
    </div>
  );
}

export default RestaurantDesigner;

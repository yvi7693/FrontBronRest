import React, { useRef, useEffect } from 'react';

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

function RestaurantLayout({
  tables,
  walls = [],
  onTableClick,
  selectedTableId,
  isBooked,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    draw();
    // eslint-disable-next-line
  }, [tables, walls, selectedTableId]);

  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw walls
    ctx.save();
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 5;
    walls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    });
    ctx.restore();

    // Draw tables
    tables.forEach(table => {
      ctx.save();
      ctx.fillStyle =
        table._id === selectedTableId
          ? '#ffe066'
          : isBooked(table)
            ? '#aaa'
            : 'lightblue';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.beginPath();
      if (table.shape === 'circle') {
        ctx.arc(
          table.x + table.width / 2,
          table.y + table.height / 2,
          table.width / 2,
          0,
          2 * Math.PI
        );
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
        table.x + table.width / 2,
        table.y + table.height / 2
      );
      ctx.restore();
    });
  }

  function handleCanvasClick(e) {
    if (!onTableClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Поиск столика по координате клика
    const table = tables.find(
      t =>
        x >= t.x &&
        x <= t.x + t.width &&
        y >= t.y &&
        y <= t.y + t.height
    );
    if (table) {
      onTableClick(table._id);
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '1px solid #ccc', background: '#fff' }}
        onClick={handleCanvasClick}
      />
    </div>
  );
}

export default RestaurantLayout;

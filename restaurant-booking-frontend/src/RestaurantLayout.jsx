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

    // Walls
    ctx.save();
    ctx.strokeStyle = "#a6763c";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    walls.forEach(wall => {
      ctx.beginPath();
      ctx.moveTo(wall.x1, wall.y1);
      ctx.lineTo(wall.x2, wall.y2);
      ctx.stroke();
    });
    ctx.restore();

    // Tables
    tables.forEach(table => {
      ctx.save();
      ctx.shadowColor =
        table._id === selectedTableId
          ? "#a6763c99"
          : isBooked && isBooked(table)
          ? "#a6763c44"
          : "#a6763c22";
      ctx.shadowBlur = table._id === selectedTableId ? 15 : 6;
      ctx.fillStyle =
        table._id === selectedTableId
          ? "#fff2d8"
          : isBooked && isBooked(table)
          ? "#ede0cd"
          : "#fff";
      ctx.strokeStyle = "#a6763c";
      ctx.lineWidth = 3;
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

  function handleCanvasClick(e) {
    if (!onTableClick) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    const table = tables.find(
      t =>
        t.shape === 'circle'
          ? Math.sqrt(
              Math.pow(x - (t.x + t.width / 2), 2) +
                Math.pow(y - (t.y + t.height / 2), 2)
            ) <= t.width / 2
          : x >= t.x &&
            x <= t.x + t.width &&
            y >= t.y &&
            y <= t.y + t.height
    );
    if (table) {
      onTableClick(table._id);
    }
  }

  return (
    <div className="rbr-canvas-block" style={{ background: "#fff9ee", boxShadow: "none", padding: 0 }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="rbr-canvas"
        style={{ background: '#fff9ee', cursor: 'pointer', touchAction: "none" }}
        onClick={handleCanvasClick}
      />
    </div>
  );
}

export default RestaurantLayout;

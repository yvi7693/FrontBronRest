import React from 'react';

const RestaurantLayout = ({ tables, onTableClick, selectedTableId, isBooked }) => (
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
          width: 60,
          height: 60,
          background: isBooked(table._id) ? '#d9534f' : '#5cb85c',
          border: selectedTableId === table._id ? '3px solid #337ab7' : '1px solid #222',
          borderRadius: '50%',
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

export default RestaurantLayout;
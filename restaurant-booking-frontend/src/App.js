import React, { useState } from 'react';
import React, { useState } from 'react';
import RestaurantDesigner from './RestaurantDesigner';

function App() {
  const handleSave = (tables) => {
    // Например, вывести JSON в консоль или отправить на сервер
    console.log('Текущая схема столов:', tables);
    alert('Схема сохранена! (смотри консоль)');
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Визуальный редактор рассадки</h1>
      <RestaurantDesigner onSave={handleSave} />
    </div>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import { useState } from "react";

import Header from './components/common/Header';
import Categories from './components/categories';
import Slider from './pages/Slider';


export default function App() {
  
  return (
    <div className='bg-gray-100'>
      {
        <Routes>
          <Route path="/" element={<Header />} />
        </Routes>
      }
      <Categories />
      <Slider />
    </div>
  );
}


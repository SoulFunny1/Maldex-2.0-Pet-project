// App.jsx (Верно!)
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout'; // Если Layout.jsx находится в папке Layout

import Categories from './components/categories'; 
import Slider from './pages/Slider'; 
import Home from './pages/Home';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> 
        {/* Layout будет родительским компонентом (включает Header) */}
        
        <Route index element={<Home />} />           {/* http://вашсайт/ */}
        <Route index element={<Categories />} /> {/* http://вашсайт/categories */}
        <Route element={<Slider />} />     {/* http://вашсайт/slider-page */}
      </Route>
    </Routes>
  );
}
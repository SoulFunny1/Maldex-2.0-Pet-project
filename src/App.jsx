import { Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout'; 
import CategoriesPage from './components/categories'; 
import SliderPage from './pages/Slider'; 
import Home from './pages/Home';
import Admin from './components/AdminDashboard'; 

export default function App() {
    return (
        <Routes>
            {/* Layout выступает оберткой для всех основных страниц */}
            <Route path="/" element={<Layout />}> 
                
                {/* Основные страницы, рендерятся в <Outlet /> в Layout */}
                <Route index element={<Home />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="slider" element={<SliderPage />} />
                
                {/* Личный Кабинет */}
                <Route path="admin" element={<Admin />} />
            </Route>
        </Routes>
    );
}

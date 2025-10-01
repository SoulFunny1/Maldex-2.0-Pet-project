import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header'; // Импорт верный!
import Home from '../pages/Home';
import Slider from '../pages/Slider';
import Categories from '../components/categories';
import AllCategories from '../components/allCategories';

import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={`{${styles.container} bg-gray-100`}>
      
      {/* 👈 ДОБАВЬТЕ Header СЮДА! */}
      <Header /> 
      <Categories />
      <Slider />
      <AllCategories />

      
      {/* <Outlet /> — это "дырка", в которую react-router-dom 
        вставляет текущий дочерний компонент (Home, Categories, Slider)
      */}
      <main>
        <Outlet />
      </main>
      
      {/* Если будет Footer, он тоже пойдет здесь */}
    </div>
  );
}
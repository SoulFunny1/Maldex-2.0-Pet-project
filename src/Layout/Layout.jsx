import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Register from '../components/register';
import Login from '../components/login';
import Categories from '../components/categories';
import Slider from '../pages/Slider';
import AllCategories from '../components/allCategories';
import { useState, useEffect, useCallback } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import HelloUser from '../components/helloUser';
import ProductInHeader from '../components/ProductsInHeader';
import FAQ from '../components/common/FAQ';
import Footer from '../components/common/footer';
import ViewCategory from '../components/ViewCategories';
import Cart from '../components/korzina';
import axios from 'axios';


axios.defaults.withCredentials = true;

export default function Layout() {
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isViewCategoryOpen, setIsViewCategoryOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);



  const checkAuthStatus = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/me', {
        withCredentials: true
      });

      if (response.status === 200) {
        const userData = response.data;

        setIsLoggedIn(true);
        setIsAdmin(userData.role === 'admin');
        setUser(userData); // ← ПРАВИЛЬНО!

      } else {
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  }, []);



  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // После успешного входа


  // Выход
  const handleLogout = async () => {
    try {
      // ИСПРАВЛЕНИЕ: Добавлен протокол http://
      await axios.post('http://localhost:4000/api/users/logout');
      console.log('Выход успешен');
      // В реальном приложении здесь будет window.location.href = '/login';
      console.log('Вы успешно вышли из системы');
      window.location.reload();
    } catch (e) {
      console.error('Ошибка при выходе:', e);
      console.log('Ошибка при выходе из системы');
    }
  };

  // Клик по профилю


  const handleUserMenuClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (isAdmin) {
      setIsProfileModalOpen(true);
      setShowWelcome(false);
      return;
    }

    // Обычный пользователь
    setShowWelcome(true);
  };


  // Переключения между модалками
  const openLoginFromRegister = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  // Переход в админку
  const handleAdminPageClick = () => {
    setIsProfileModalOpen(false);
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(false);
    setIsAdmin(true);
    setShowWelcome(false);
    setIsProfileModalOpen(true);


  };

  // Клик по логотипу — возвращение на главную
  const allPagesClose = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(false);
    setIsProfileModalOpen(false);
    navigate('/');
    window.location.reload();
  };


  const helloUser = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(false);
    setIsProfileModalOpen(false);
    setIsAdmin(false);
    setShowWelcome(true);
  };

  const closeHelloUser = () => setShowWelcome(false);

  const closeViewCategory = () => setIsViewCategoryOpen(false);
  const openViewCategory = () => setIsViewCategoryOpen(true);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);



  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans">
        <div className="flex items-center space-x-3 p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-xl font-medium text-gray-700">Загрузка...</p>
        </div>
      </div>
    );
  }

  const isModalOpen = isRegisterModalOpen || isLoginModalOpen || isProfileModalOpen || isViewCategoryOpen || showWelcome;


  return (
    <div className="w-full min-h-screen bg-gray-100 font-sans">
      <Header
        openCart={openCart}
        helloUser={helloUser}
        allClose={allPagesClose}
        onAdminClick={handleAdminPageClick}
        openUserMenu={handleUserMenuClick}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
        isAdmin={isAdmin}
        isUser={user}
      />

      {!isModalOpen && (
        <div className="pb-10">
          <Categories />
          <Slider />
          <AllCategories openViewCategory={openViewCategory}/>
          <Outlet />
          <ProductInHeader />
          <FAQ />
          <Footer />

        </div>
      )}

      {/* Модалка регистрации */}
      {!isLoggedIn && isRegisterModalOpen && (
        <Register
          to="/register"
          onSwitchToLogin={openLoginFromRegister}
          open={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
        />
      )}

      {/* Модалка логина */}
      {!isLoggedIn && isLoginModalOpen && (
        <Login
          to="/login"
          open={isLoginModalOpen}
          onSwitchToLogin={openRegisterModal}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      {isLoggedIn && isProfileModalOpen && isAdmin && (
        <AdminDashboard
          isAdminPage={handleAdminPageClick}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
          onLogout={handleLogout}
        />

      )}





      {isLoggedIn && showWelcome && user && !isAdmin && (
        <HelloUser user={user} onLogout={handleLogout} onClose={closeHelloUser} />
      )}

      {/* Используйте его собственное состояние isViewCategoryOpen */}
      {isViewCategoryOpen && (
        <ViewCategory
          onClose={closeViewCategory}
        />
      )}

      {isCartOpen && (
        <Cart
          onClose={closeCart}
        />
      )}



    </div>
  );
}

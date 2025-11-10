import React, { useState, useEffect } from 'react';

// --- НАСТРОЙКИ БРЕНДА (ИЗМЕНИТЕ ЭТИ ПАРАМЕТРЫ) ---
const BRAND = {
    SITE_NAME: "MALEX FASHION",
    USER_NAME: "Измаилов Акбар",
    PHONE: "8 702 701 5075",
    MAIN_RED: "#EC1026", // Основной красный (как кнопка "Каталог")
    ACCENT_PINK: "#F1107E", // Акцентный розовый (как цена в корзине)
    LOADING_DURATION_MS: 3000,
};
// ----------------------------------------------------

// --- 1. Loader Component (Загрузка) ---
const Loader = () => (
    <div className="flex flex-col items-center justify-center p-8 transition-opacity duration-500">
        <div className="relative">
            {/* Спиннер в фирменном красном цвете */}
            <div 
                className="animate-spin rounded-full h-20 w-20 border-4 border-t-transparent"
                style={{ borderColor: BRAND.MAIN_RED, borderTopColor: 'transparent' }}
            ></div>
            {/* Фирменный значок (имитация логотипа) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-black" style={{ color: BRAND.MAIN_RED }}>
                M
            </div>
        </div>
        <p className="mt-6 text-xl font-medium text-white tracking-wider">
            Загрузка Портала Моды...
        </p>
    </div>
);

// --- 2. ГЛАВНЫЙ КОМПОНЕНТ: HelloUser (ЭПИЧЕСКОЕ ПРИВЕТСТВИЕ) ---
const HelloUser = ({ username, siteName, onStart, hellouser }) => {

    return (
        // Фон: глубокий, темный, с радиальным градиентом для эффекта "прожектора"
        <div className="fixed inset-0 flex items-center justify-center p-4 font-sans z-50 
                    bg-gray-950 overflow-hidden text-white"
            style={{ backgroundImage: 'radial-gradient(circle at center, #1f2937 0%, #000 100%)' }}
        >
            
            {/* Карточка Приветствия: Анимация "Появление" и пульсирующая рамка */}
            <div 
                className="max-w-xl w-full p-12 sm:p-16 bg-white text-gray-900 rounded-xl shadow-2xl 
                           transform opacity-0 animate-reveal-entry relative z-10 overflow-hidden"
                style={{ 
                    // Добавляем эффект пульсирующей рамки (смотрите CSS ниже)
                    boxShadow: '0 0 0 4px rgba(0,0,0,0)', // Базовый размер
                }}
            >
                
                <div className="text-center">
                    
                    {/* Главный Брендовый Логотип/Акцент */}
                    <h2 className="text-xl font-bold mb-2 uppercase tracking-widest text-gray-500">
                        {siteName}
                    </h2>
                    <h1 className="text-5xl sm:text-6xl font-extrabold mb-10 tracking-tight leading-tight">
                        <span style={{ color: BRAND.MAIN_RED }}>ДОБРО</span> ПОЖАЛОВАТЬ
                    </h1>
                    
                    {/* Анимированный Блок Подписи (Фокус на имени) */}
                    <div className="relative mb-12 py-4 border-y border-gray-200">
                        <p className="text-xl sm:text-3xl font-light text-gray-700 uppercase tracking-widest">
                            АВТОРИЗАЦИЯ УСПЕШНА
                        </p>
                        <div className="flex justify-center mt-3">
                             <span 
                                className="text-4xl sm:text-5xl font-serif font-black signature-reveal"
                                style={{ color: BRAND.ACCENT_PINK, animationDelay: '1.2s' }}
                            >
                                {username}
                            </span>
                        </div>
                    </div>


                    {/* Блок действий/преимуществ */}
                    <div className="text-left mb-10 space-y-3">
                        <p className="font-bold text-lg text-gray-800">
                            Ваш статус: <span className="text-green-600">PREMIUM-ACCESS</span>
                        </p>
                        {[
                            {icon: "👑", text: "Прямая линия с Izmailov Akbar"},
                            {icon: "💎", text: "Личный стилист и эксклюзивные подборки"},
                            {icon: "⚡", text: "Самая быстрая доставка"},
                        ].map((item, index) => (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-xl mr-3">{item.icon}</span>
                                <span className="font-medium text-gray-700">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Кнопка действия с эффектом "Прорыва" */}
                    <button 
                        className="w-full px-12 py-4 text-lg font-extrabold rounded-full 
                                   transition duration-300 transform relative overflow-hidden group shadow-lg"
                        style={{ backgroundColor: BRAND.MAIN_RED }}
                        onClick={onStart}
                    >
                        <span className="relative z-10 text-white group-hover:tracking-wider transition-all duration-300">
                            ОТКРЫТЬ ГЛАВНЫЙ КАТАЛОГ
                        </span>
                        {/* Эффект свечения (Hover glow) */}
                        <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    </button>
                    
                    {/* Контактная информация */}
                    <p className="text-sm mt-6 text-gray-500">
                        Личный номер для связи: <span className="font-semibold">{BRAND.PHONE}</span>
                    </p>

                </div>
            </div>
            
            {/* Встроенные стили и Keyframes для анимации */}
            <style jsx="true">{`
                /* 1. Анимация "Появление из темноты" (Reveal Entry) */
                @keyframes revealEntry {
                    0% { opacity: 0; transform: scale(0.95) translateY(20px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-reveal-entry {
                    animation: revealEntry 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
                    animation-fill-mode: both;
                    transform-style: preserve-3d;
                }
                
                /* 2. Анимация "Подписание" имени (Signature Reveal) */
                @keyframes signatureDraw {
                    0% {
                        clip-path: inset(0 100% 0 0);
                    }
                    100% {
                        clip-path: inset(0 0 0 0);
                    }
                }

                .signature-reveal {
                    display: inline-block;
                    clip-path: inset(0 100% 0 0); /* Начальное состояние: скрыто */
                    animation: signatureDraw 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    animation-delay: 1.5s; /* Задержка после появления карточки */
                }
            `}</style>
        </div>
    );
};

// --- 3. Main Application Component (Драйвер и Макет) ---
// Этот компонент симулирует окружение с Вашим заголовком
export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(BRAND.USER_NAME ? true : false);
    const [hasStarted, setHasStarted] = useState(false); 

    // Симуляция загрузки и аутентификации
    useEffect(() => {
        if (BRAND.USER_NAME && showWelcome) {
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, BRAND.LOADING_DURATION_MS);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
            setShowWelcome(false);
            setHasStarted(true);
        }
    }, [showWelcome]);

    const handleStartApp = ({  }) => {
        setShowWelcome(false);
        setHasStarted(true);
    };

    // --- Conditional Rendering ---
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start font-sans">
            
            {/* FULL SCREEN LOADING/WELCOME OVERLAY */}
            {(isLoading || showWelcome) && (
                <div className="fixed inset-0 flex items-center justify-center z-40 bg-gray-950 transition-opacity duration-300">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <HelloUser 
                            username={BRAND.USER_NAME} 
                            siteName={BRAND.SITE_NAME}
                            onStart={handleStartApp} 
                        />
                    )}
                </div>
            )}

            {/* MAIN CONTENT (Симуляция Вашего заголовка) */}
            {hasStarted && !isLoading && (
                <>
                    {/* Header Mockup */}
                    <header className="w-full">
                        <div className="bg-white px-10 pt-10 pb-4 rounded-b-2xl shadow-xl">
                            {/* Верхняя строка (Информация) */}
                            <div className="flex items-center gap-4 justify-between text-sm text-gray-600 mb-4">
                                <div className="flex gap-4">
                                    <span className="font-medium flex gap-2">📞 {BRAND.PHONE}</span>
                                    <span className="font-medium flex gap-2">📧 info@maldex.ru</span>
                                    <span className="font-medium flex gap-2">📍 Almaty</span>
                                </div>
                                <p className="font-medium">Мин. сумма заказа от 30 тыс рублей</p>
                                <div className="flex gap-4 text-sm">
                                    <p className="font-medium cursor-pointer hover:text-red-600">Доставка</p>
                                    <p className="font-medium cursor-pointer hover:text-red-600">Контакты</p>
                                </div>
                            </div>

                            {/* Нижняя строка (Основное меню) */}
                            <div className="flex items-center gap-6">
                                <h1 className="text-3xl font-black" style={{ color: BRAND.MAIN_RED }}>
                                    {BRAND.SITE_NAME}
                                </h1>

                                <button 
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl justify-center transition" 
                                    style={{ backgroundColor: BRAND.MAIN_RED, color: 'white' }}
                                >
                                    {/* Icon from previous example */}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /></svg>
                                    <p className="font-medium">Каталог</p>
                                </button>

                                <div className="flex-grow">
                                    <div className="flex items-stretch w-full border-2 rounded-lg overflow-hidden relative" style={{ borderColor: BRAND.MAIN_RED }}>
                                        <input
                                            type="text"
                                            placeholder="Поиск по 10 000 товарам..."
                                            className="flex-grow px-4 py-2 text-base outline-none bg-transparent"
                                        />
                                        <button className="text-white font-bold py-2 px-8 transition-colors duration-300" style={{ backgroundColor: BRAND.MAIN_RED }}>
                                            Найти
                                        </button>
                                    </div>
                                </div>

                                {/* Иконки справа */}
                                <div className="flex items-center gap-6 cursor-pointer text-sm text-gray-800">
                                    <div className="flex flex-col items-center hover:text-red-600 transition">
                                        <span className="text-2xl">❤️</span><p className="font-medium">Избранное</p>
                                    </div>
                                    <div className="flex flex-col items-center hover:text-red-600 transition">
                                        <span className="text-2xl">👤</span><p className="font-medium">{BRAND.USER_NAME}</p>
                                    </div>
                                    <div className="flex flex-col items-center hover:text-red-600 transition">
                                        <span className="text-2xl">🛒</span>
                                        <p className="font-medium" style={{ color: BRAND.ACCENT_PINK }}>14 619 ₽</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>
                    
                    {/* Main Content Area */}
                    <div className="max-w-7xl w-full p-10 mt-10 text-center">
                        <h2 className="text-3xl font-bold mb-4" style={{ color: BRAND.MAIN_RED }}>
                            Основной Раздел Магазина
                        </h2>
                        <p className="text-gray-600">
                            Здесь будут отображаться товары, коллекции и акции.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}
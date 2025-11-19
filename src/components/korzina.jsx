import React, { useState, useEffect, useCallback } from 'react';
// import { XIcon, PlusIcon, MinusIcon, Trash2, ShoppingBag } from 'lucide-react'; // Используем инлайн SVG для чистоты примера

const API_BASE_URL = 'http://localhost:4000/api/cart'; 
// ⚠️ Предполагается, что ваш сервер Express работает на localhost:4000
// и маршруты корзины доступны по /api/cart

// --- ИНЛАЙН SVG ЗАМЕНЫ ДЛЯ ИКОНОК ---
const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const PlusIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);
const MinusIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
);
const Trash2 = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M14 2h-4c-1 0-1 1-1 2h6c0-1 0-2-1-2"/>
    </svg>
);
const ShoppingBag = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
);
// --- КОНЕЦ ИНЛАЙН SVG ---

// --- ФОРМАТИРОВАНИЕ ДЕНЕГ ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', { 
        style: 'currency', 
        currency: 'RUB', 
        minimumFractionDigits: 0,
        maximumFractionDigits: 2 // Оставляем 2 знака после запятой для точности
    }).format(Number(amount));
};

// --- КОМПОНЕНТ КАРТОЧКИ ТОВАРА В КОРЗИНЕ ---
const CartItemCard = ({ item, onUpdateQuantity, onRemoveItem }) => {
    const { 
        productId, 
        name, 
        size, 
        color, 
        quantity, 
        unitPrice, 
        totalItemPrice, 
        imgUrl,
        mainArticul,
    } = item;

    const key = `${productId}-${size}-${color}`; // Уникальный ключ для CartItem (как в БД)

    // Обработчик изменения количества
    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity < 0) return; // Не допускаем отрицательное количество
        
        // Удаляем элемент, если количество становится 0
        if (newQuantity === 0) {
            onRemoveItem(productId, size, color);
        } else {
            onUpdateQuantity(productId, size, color, newQuantity);
        }
    };

    return (
        <div className="flex items-start bg-white p-4 sm:p-6 border-b border-gray-100 last:border-b-0 transition-shadow hover:shadow-md rounded-lg">
            
            {/* Изображение */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border">
                <img 
                    src={imgUrl} 
                    alt={name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/f0f0f0/999999?text=Нет+Фото"; }}
                />
            </div>

            {/* Детали */}
            <div className="flex-1 min-w-0 ml-4 sm:ml-6 flex flex-col justify-between h-full">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug truncate mb-1">
                    {name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">Артикул: {mainArticul}</p>
                
                {/* Варианты */}
                <div className="flex space-x-4 text-sm text-gray-700 font-medium mb-3">
                    <p className="border-r pr-4">Размер: <span className="text-red-600 font-extrabold">{size}</span></p>
                    <p>Цвет: <span className="text-red-600 font-extrabold">{color}</span></p>
                </div>

                {/* Цена */}
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                    <p className="text-xl font-black text-red-600">
                        {formatCurrency(totalItemPrice)}
                    </p>
                    <p className="text-sm text-gray-500">
                        ({formatCurrency(unitPrice)}/шт.)
                    </p>
                </div>
            </div>

            {/* Кнопки управления */}
            <div className="flex flex-col items-center ml-4 sm:ml-8 flex-shrink-0">
                
                {/* Счётчик */}
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden shadow-sm mb-4">
                    <button 
                        onClick={() => handleQuantityChange(-1)}
                        className="p-2 text-red-600 hover:bg-gray-100 active:bg-gray-200 transition"
                        aria-label="Уменьшить количество"
                    >
                        <MinusIcon />
                    </button>
                    <span className="w-8 text-center text-base font-semibold text-gray-800">
                        {quantity}
                    </span>
                    <button 
                        onClick={() => handleQuantityChange(1)}
                        className="p-2 text-red-600 hover:bg-gray-100 active:bg-gray-200 transition"
                        aria-label="Увеличить количество"
                    >
                        <PlusIcon />
                    </button>
                </div>
                
                {/* Удалить */}
                <button 
                    onClick={() => onRemoveItem(productId, size, color)}
                    className="flex items-center text-sm text-gray-500 hover:text-red-600 transition-colors mt-auto"
                    aria-label="Удалить товар"
                >
                    <Trash2 className="mr-1 w-4 h-4" />
                    Удалить
                </button>
            </div>
        </div>
    );
};

// --- ГЛАВНЫЙ КОМПОНЕНТ КОРЗИНЫ ---
const ShoppingCart = () => {
    const [cart, setCart] = useState({ items: [], totalSum: 0, totalItems: 0 });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(''); // Для сообщений об ошибках/успехе

    // 1. Загрузка корзины (GET)
    const fetchCart = useCallback(async () => {
        setLoading(true);
        setStatus('');
        try {
            // ⚠️ В реальном приложении нужно передать токен/сессию для авторизации
            const response = await fetch(API_BASE_URL, { 
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                 // Если статус 401/403 (Unauthorized/Forbidden), надо перенаправить на логин
                 if (response.status >= 400) {
                     throw new Error(`Ошибка загрузки: ${response.statusText}. Проверьте авторизацию.`);
                 }
            }

            const data = await response.json();
            setCart(data);
            setLoading(false);

        } catch (error) {
            console.error('Ошибка при загрузке корзины:', error);
            setStatus(`❌ Ошибка загрузки: ${error.message}`);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // 2. Обновление количества (PUT)
    const handleUpdateQuantity = async (productId, size, color, newQuantity) => {
        setStatus('');
        try {
            const response = await fetch(`${API_BASE_URL}/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    productId, 
                    size, 
                    color, 
                    newQuantity 
                }),
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }
            
            // Если успех, обновляем данные локально или перезагружаем корзину
            fetchCart(); 
            // setStatus('✅ Количество обновлено!');

        } catch (error) {
            console.error('Ошибка обновления количества:', error);
            setStatus(`❌ Не удалось обновить количество. ${error.message}`);
        }
    };

    // 3. Удаление товара (DELETE)
    const handleRemoveItem = async (productId, size, color) => {
        setStatus('');
        if (!window.confirm('Вы уверены, что хотите удалить этот товар из корзины?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/remove`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, size, color }),
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            // Перезагрузка после удаления
            fetchCart(); 
            setStatus('✅ Товар удален из корзины.');

        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            setStatus(`❌ Не удалось удалить товар. ${error.message}`);
        }
    };
    
    // 4. Очистка всей корзины (DELETE)
    const handleClearCart = async () => {
        setStatus('');
        if (!window.confirm('Вы уверены, что хотите очистить всю корзину?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/clear`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            setCart({ items: [], totalSum: 0, totalItems: 0 }); 
            setStatus('✅ Корзина полностью очищена.');

        } catch (error) {
            console.error('Ошибка очистки корзины:', error);
            setStatus(`❌ Не удалось очистить корзину. ${error.message}`);
        }
    }


    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[500px] text-2xl font-medium text-red-600 bg-white shadow-xl rounded-xl p-10">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-red-600 mr-3"></div>
                 Загрузка вашей корзины...
            </div>
        );
    }
    
    // Если корзина пуста
    if (cart.items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto my-10 p-8 text-center bg-white rounded-xl shadow-2xl">
                <ShoppingBag className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-black text-gray-900 mb-2">Ваша корзина пуста</h2>
                <p className="text-lg text-gray-600 mb-6">Похоже, вы еще ничего не добавили. Перейдите в каталог!</p>
                <button 
                    onClick={() => console.log("Переход в каталог")} // ➡️ Замените на логику перехода React Router
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 transition"
                >
                    Перейти к покупкам
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black text-gray-900 mb-8 flex items-center">
                    <ShoppingBag className="w-8 h-8 mr-3 text-red-600 fill-red-100" />
                    Ваша Корзина
                    <span className="text-red-600 ml-3">({cart.totalItems})</span>
                </h1>
                
                {status && (
                    <div className={`p-3 mb-4 rounded-xl font-bold ${status.startsWith('❌') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {status}
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* ЛЕВЫЙ БЛОК: Список товаров */}
                    <div className="lg:w-8/12 bg-white rounded-2xl shadow-xl overflow-hidden ring-1 ring-gray-100">
                        {cart.items.map((item) => (
                            <CartItemCard 
                                key={`${item.productId}-${item.size}-${item.color}`}
                                item={item}
                                onUpdateQuantity={handleUpdateQuantity}
                                onRemoveItem={handleRemoveItem}
                            />
                        ))}
                        <div className="p-4 sm:p-6 flex justify-end">
                            <button
                                onClick={handleClearCart}
                                className="flex items-center text-sm font-medium text-gray-500 hover:text-red-600 transition"
                            >
                                <Trash2 className="mr-1 w-4 h-4" />
                                Очистить всю корзину
                            </button>
                        </div>
                    </div>

                    {/* ПРАВЫЙ БЛОК: Суммарная панель */}
                    <div className="lg:w-4/12">
                        <div className="sticky top-10 bg-white p-6 rounded-2xl shadow-xl border-t-4 border-red-600">
                            <h2 className="text-2xl font-black text-gray-900 mb-4 pb-3 border-b border-gray-100">
                                Итого
                            </h2>

                            <div className="space-y-3 mb-6 text-gray-700">
                                <div className="flex justify-between text-base font-medium">
                                    <span>Товаров ({cart.totalItems})</span>
                                    <span>{formatCurrency(cart.totalSum)}</span>
                                </div>
                                <div className="flex justify-between text-base font-medium">
                                    <span>Скидка</span>
                                    <span className="text-green-600">{formatCurrency(0)}</span>
                                </div>
                                <div className="flex justify-between text-base font-medium">
                                    <span>Доставка</span>
                                    <span>По тарифам ТК</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-between pt-4 border-t-2 border-red-100">
                                <span className="text-xl font-black text-gray-900">К оплате:</span>
                                <span className="text-3xl font-extrabold text-red-600">
                                    {formatCurrency(cart.totalSum)}
                                </span>
                            </div>

                            <button
                                onClick={() => console.log("Переход к оформлению")} // ➡️ Логика оформления заказа
                                className="w-full mt-6 py-4 bg-red-600 text-white font-black text-lg 
                                           rounded-xl shadow-2xl shadow-red-300 transition hover:bg-red-700 active:scale-[0.99]"
                            >
                                Перейти к оформлению
                            </button>
                            
                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Оплата при получении или онлайн. Сроки доставки уточнит менеджер.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingCart;
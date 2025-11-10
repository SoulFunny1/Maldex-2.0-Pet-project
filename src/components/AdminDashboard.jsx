import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Настраиваем axios для автоматической отправки куки
axios.defaults.withCredentials = true;

// === ИКОНКИ (SVG) ===
const Icons = {
    // Товары (Boxes)
    Products: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z"/><path d="M3.3 7L12 12.5L20.7 7"/><path d="M12 22v-8.5"/></svg>),
    // Заказы (Shopping Cart)
    Orders: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>),
    // Выход
    LogOut: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
    // Редактирование
    Edit: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>),
    // Удаление
    Trash: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M15 2h3"/><line x1="12" y1="4" x2="12" y2="20"/></svg>),
    // Плюс (Добавить)
    Plus: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
};

// =======================================================
// === 1. МЕНЕДЖЕР ТОВАРОВ (ProductManager) ===
// =======================================================

// --- Модальное окно для создания/редактирования товара ---
const ProductFormModal = ({ isOpen, onClose, onSave, product, isSubmitting, error }) => {
    // Включаем поле 'img' для ссылки
    const [formData, setFormData] = useState({
        articul: '',
        price: '',
        color: '',
        description: '',
        img: '', // Поле для URL изображения
    });

    useEffect(() => {
        if (product) {
            // Если продукт существует, заполняем форму его данными
            setFormData({
                articul: product.articul || '',
                price: product.price || '',
                color: product.color || '',
                description: product.description || '',
                // Изображение - ожидаем, что бэкенд возвращает массив строк (URL-ов)
                img: Array.isArray(product.img) && product.img.length > 0 ? product.img[0] : '', 
            });
        } else {
            // Иначе, очищаем форму
            setFormData({ articul: '', price: '', color: '', description: '', img: '' });
        }
    }, [product]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
            
        const { price, img, ...rest } = formData;
        
        // Преобразуем цену в число, а URL изображения в массив из одной строки (для совместимости с API)
        const payload = {
            id: product ? product.id : undefined,
            ...rest,
            price: parseFloat(price),
            // Создаем массив [URL] только если URL не пуст
            img: img ? [img] : [],
        };

        onSave(payload);
    };
    
    // Новые стили для прозрачного и красивого фона
    const modalBgClass = "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md p-4";

    return (
        <div className={modalBgClass} onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg transform transition-all max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {product ? `Редактировать товар: ${product.articul}` : 'Создать новый товар'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
                </div>
                
                {error && (<div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-sm">Ошибка: {error}</div>)}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Артикул */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Артикул</label>
                        <input
                            type="text"
                            name="articul"
                            value={formData.articul}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
                        />
                    </div>
                    {/* Цена */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цена (руб.)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
                        />
                    </div>
                    {/* Цвет */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цвет</label>
                        <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
                        />
                    </div>
                    {/* Описание */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
                        />
                    </div>
                    {/* Изображение (URL) - ВОССТАНОВЛЕНО */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Изображения (ссылка)</label>
                        <input
                            type="url"
                            name="img"
                            value={formData.img}
                            onChange={handleChange}
                            placeholder="Например: https://example.com/image.jpg"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
                        />
                        {/* Предпросмотр изображения */}
                        {formData.img && (
                            <div className="mt-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                                <p className="text-xs text-gray-500 mb-2">Предпросмотр:</p>
                                <img 
                                    src={formData.img} 
                                    alt="Предпросмотр товара" 
                                    className="w-32 h-32 object-cover rounded-lg shadow-md" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/ccc/333?text=Ошибка"; }}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-white font-semibold py-3 rounded-lg transition-colors shadow-lg ${
                            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-red-500/50'
                        }`}
                    >
                        {isSubmitting ? 'Сохранение...' : (product ? 'Сохранить изменения' : 'Создать товар')}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Основной компонент менеджера товаров ---
const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null); 
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // ИСПРАВЛЕНИЕ: Добавлен протокол http://
    const PRODUCTS_API = 'http://localhost:4000/api/admin/products'; 

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(PRODUCTS_API);
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setProducts([]); 
            }
        } catch (err) {
            console.error('Ошибка при загрузке товаров:', err);
            setError(err.response?.data?.message || 'Не удалось загрузить список товаров. Проверьте маршрут: GET /api/admin/products');
            setProducts([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenCreate = () => {
        setCurrentProduct(null);
        setError(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setCurrentProduct(product);
        setError(null);
        setIsModalOpen(true);
    };

    const handleSaveProduct = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            // Внимание: В реальном приложении лучше использовать отдельные POST/PUT маршруты, 
            // а не один универсальный.
            const action = data.id ? 'update' : 'create';
            const response = await axios.post(`${PRODUCTS_API}/${action}`, data);

            if (action === 'create') {
                setProducts(prev => [response.data.product, ...prev]);
            } else {
                setProducts(prev => prev.map(p => (p.id === data.id ? response.data.product : p)));
            }
            
            setIsModalOpen(false); 

        } catch (err) {
            const message = err.response?.data?.message || 'Неизвестная ошибка при сохранении.';
            setError(message);
            console.error('Ошибка сохранения:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id, articul) => {
        // Замена alert/confirm на prompt для соответствия правилам среды Canvas
        const confirmDelete = prompt(`Вы уверены, что хотите удалить товар "${articul}" (ID: ${id})? Введите "УДАЛИТЬ" для подтверждения.`);
        
        if (confirmDelete !== 'УДАЛИТЬ') {
            return;
        }

        try {
            await axios.post(`${PRODUCTS_API}/delete`, { id });

            setProducts(prev => prev.filter(p => p.id !== id));
            console.log(`Товар "${articul}" успешно удален.`);

        } catch (err) {
            const message = err.response?.data?.message || 'Не удалось удалить товар.';
            setError(message);
            console.error('Ошибка удаления:', err);
        }
    };
    
    // Вспомогательная функция для отображения первой ссылки на изображение
    const getFirstImage = (imgArray) => {
        if (Array.isArray(imgArray) && imgArray.length > 0) {
            return imgArray[0];
        }
        // Заглушка, если нет изображения
        return "https://placehold.co/40x40/f1f5f9/94a3b8?text=NO"; 
    };

    if (loading) return <div className="p-10 text-center text-gray-500">Загрузка товаров...</div>;
    
    if (error && products.length === 0) {
        return (
            <div className="p-10 text-center bg-red-100 text-red-700 rounded-xl shadow-lg">
                {error}
                <button onClick={fetchProducts} className="ml-4 text-sm font-medium underline">Повторить попытку</button>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800">Список товаров ({products.length})</h3>
                <button 
                    onClick={handleOpenCreate}
                    className="flex items-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                    <Icons.Plus className="w-5 h-5 mr-2" /> Добавить товар
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            {/* Добавляем колонку Изображение */}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Изобр.</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Артикул</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Цвет</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(products) && products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                                {/* Отображаем изображение */}
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <img 
                                        src={getFirstImage(product.img)} 
                                        alt={product.articul} 
                                        className="w-10 h-10 object-cover rounded-md shadow-sm"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/f1f5f9/94a3b8?text=NO"; }}
                                    />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{product.articul}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{parseFloat(product.price).toFixed(2)} ₽</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.color || '-'}</td>
                                <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{product.description}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button 
                                        onClick={() => handleOpenEdit(product)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"
                                        title="Редактировать"
                                    >
                                        <Icons.Edit className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteProduct(product.id, product.articul)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition"
                                        title="Удалить"
                                    >
                                        <Icons.Trash className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                product={currentProduct}
                isSubmitting={isSubmitting}
                error={error}
            />
        </div>
    );
};


// =======================================================
// === 2. ОБЩИЕ КОМПОНЕНТЫ ДАШБОРДА ===
// =======================================================

const HeaderItem = ({ icon: Icon, title, isActive, onClick }) => (
    <div
        className={`flex items-center p-2 px-4 rounded-lg cursor-pointer transition-colors text-sm font-semibold whitespace-nowrap ${
            isActive 
                ? 'bg-red-600 text-white shadow-md' 
                : 'text-gray-600 hover:bg-red-100 hover:text-red-600'
        }`}
        onClick={onClick}
    >
        <Icon className="w-5 h-5 mr-2" />
        <span>{title}</span>
    </div>
);

const ContentArea = ({ activeTab }) => {
    let title = '';
    let content = null;

    switch (activeTab) {
        case 'products':
            title = 'Управление товарами (CRUD)';
            content = <ProductManager />; 
            break;
        case 'orders':
            title = 'Управление заказами';
            content = <OrdersSummary />;
            break;
        default:
            title = 'Добро пожаловать в Админ-панель';
            content = <div className="p-10 text-center text-gray-500">Выберите раздел в верхнем меню.</div>;
    }

    return (
        // Внутренний контейнер для отступов
        <div className="p-6 md:p-8 overflow-y-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">{title}</h1>
            {content}
        </div>
    );
};

// --- Заглушки для других вкладок ---
const OrdersSummary = () => <div className="p-10 bg-white rounded-xl shadow-lg text-gray-600">График заказов, сводка по доходам, статус доставки. (Требуется реализация)</div>;


// =======================================================
// === 3. ГЛАВНЫЙ КОМПОНЕНТ АДМИН-ПАНЕЛИ ===
// =======================================================

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('products'); 

    const sidebarMenu = [
        { key: 'products', title: 'Товары', icon: Icons.Products },
        { key: 'orders', title: 'Заказы', icon: Icons.Orders },
    ];

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

    return (
        // Общая колоночная раскладка, чтобы Header был сверху
        <div className="flex flex-col h-screen bg-gray-100 font-sans mt-10">
            
            {/* Верхний Header */}
            <header className="w-full bg-white shadow-lg p-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                
                {/* Логотип/Заголовок */}
                <div className="flex items-center min-w-[200px]">
                    <h2 className="text-2xl font-black text-red-600">
                        Admin <span className="text-gray-800">Panel</span>
                    </h2>
                </div>
                
                {/* Элементы навигации */}
                <nav className="flex space-x-2 flex-grow justify-center mx-4">
                    {sidebarMenu.map((item) => (
                        <HeaderItem
                            key={item.key}
                            icon={item.icon}
                            title={item.title}
                            isActive={activeTab === item.key}
                            onClick={() => setActiveTab(item.key)}
                        />
                    ))}
                </nav>

                {/* Кнопка Выхода */}
                <div className="min-w-[100px] flex justify-end">
                    <button 
                        className="flex items-center p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-sm font-semibold"
                        onClick={handleLogout}
                    >
                        <Icons.LogOut className="w-5 h-5" />
                        <span className="ml-2 hidden sm:inline">Выйти</span>
                    </button>
                </div>
            </header>

            {/* Основное содержимое (Content Area) */}
            <main className="flex-1 overflow-y-auto">
                <ContentArea activeTab={activeTab} />
            </main>
        </div>
    );
}
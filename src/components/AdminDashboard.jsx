import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Настраиваем axios для автоматической отправки куки
axios.defaults.withCredentials = true;
// Устанавливаем базовый URL для API (если требуется, иначе можно оставить пустым)
// axios.defaults.baseURL = 'http://localhost:4000'; 

// === ИКОНКИ (SVG) ===
const Icons = {
    // Пользователи (Users)
    Users: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 4 0 0 0-4-4H6a4 4 4 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 4 0 0 1 0 7.75"/></svg>),
    // Товары (Boxes)
    Products: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8z"/><path d="M3.3 7L12 12.5L20.7 7"/><path d="M12 22v-8.5"/></svg>),
    // Заказы (Shopping Cart)
    Orders: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>),
    // Статистика (Bar Chart)
    Stats: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>),
    // Настройки (Settings)
    Settings: (props) => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1-2 2h-.44a2 2 0 0 0-2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2 2v.44a2 2 0 0 1 2 2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1 2-2h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 1-2-2z"/><circle cx="12" cy="12" r="3"/></svg>),
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
// === 1. МЕНЕДЖЕР ПОЛЬЗОВАТЕЛЕЙ (UserManager) ===
// =======================================================

// --- Модальное окно для создания/редактирования пользователя ---
const UserFormModal = ({ isOpen, onClose, onSave, user, isSubmitting, error }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        status: 'active',
    });
    
    // Определяем, является ли это режимом редактирования (Update)
    const isUpdateMode = !!user;

    useEffect(() => {
        if (user) {
            // Режим редактирования
            setFormData({
                email: user.email || '',
                password: '', // Пароль не заполняем при редактировании
                status: user.status || 'active',
            });
        } else {
            // Режим создания
            setFormData({ email: '', password: '', status: 'active' });
        }
    }, [user]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // В режиме создания пароль обязателен.
        if (!isUpdateMode && !formData.password) {
            alert('Пароль обязателен для нового пользователя.');
            return;
        }

        // В режиме редактирования, если пароль не меняется, он не должен быть отправлен.
        const passwordToSend = isUpdateMode && !formData.password ? undefined : formData.password;

        const payload = {
            id: isUpdateMode ? user.id : undefined,
            email: formData.email,
            status: formData.status,
            ...(passwordToSend && { password: passwordToSend }) 
        };

        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isUpdateMode ? `Редактировать пользователя: ${user.email}` : 'Создать нового пользователя'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 text-3xl leading-none">&times;</button>
                </div>
                
                {error && (<div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-sm">Ошибка: {error}</div>)}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
                            disabled={isUpdateMode} // Запрещаем изменение email при редактировании
                        />
                    </div>
                    {/* Пароль */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Пароль ({isUpdateMode ? 'Оставьте пустым для сохранения старого' : 'Обязателен'})
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required={!isUpdateMode}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
                        />
                    </div>
                    {/* Статус */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm bg-white"
                        >
                            <option value="active">Активен</option>
                            <option value="inactive">Неактивен</option>
                            <option value="banned">Забанен</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-white font-semibold py-3 rounded-lg transition-colors shadow-lg ${
                            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-red-500/50'
                        }`}
                    >
                        {isSubmitting ? 'Сохранение...' : (isUpdateMode ? 'Сохранить изменения' : 'Создать пользователя')}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Основной компонент менеджера пользователей ---
const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // ИСПОЛЬЗУЕМ НОВЫЕ ОТНОСИТЕЛЬНЫЕ МАРШРУТЫ
    const ADMIN_USERS_API = '/api/admin/users'; 
    const MANAGE_USERS_API = '/api/admin/users/manage'; // POST для обновления
    const REGISTER_USER_API = '/api/users/register'; // POST для создания
    const DELETE_USERS_API = '/api/admin/users/delete'; // POST для удаления
    
    // 1. Получение пользователей
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(ADMIN_USERS_API);
            if (Array.isArray(response.data)) {
                 setUsers(response.data);
            } else {
                 setUsers([]); 
            }
        } catch (err) {
            console.error('Ошибка при загрузке пользователей:', err);
            setError(err.response?.data?.message || 'Не удалось загрузить список пользователей. Проверьте маршрут: GET /api/admin/users');
            setUsers([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Управление модалкой
    const handleOpenCreate = () => {
        setCurrentUser(null);
        setError(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (user) => {
        setCurrentUser(user);
        setError(null);
        setIsModalOpen(true);
    };

    // 3. Сохранение/Обновление пользователя
    const handleSaveUser = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const isUpdate = !!data.id;
            // Используем разные роуты для создания и обновления
            const endpoint = isUpdate ? MANAGE_USERS_API : REGISTER_USER_API;
            
            const response = await axios.post(endpoint, data);

            // Обновляем локальное состояние
            if (!isUpdate) {
                // Создание: бэкенд возвращает созданного пользователя
                setUsers(prev => [response.data, ...prev.filter(u => u.id)]); // Фильтруем, чтобы избежать дублирования, если бэкенд возвращает ID
            } else {
                // Обновление: бэкенд возвращает обновленного пользователя в response.data.user
                const updatedUser = response.data.user || data;
                setUsers(prev => prev.map(u => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
            }
            
            setIsModalOpen(false);

        } catch (err) {
            // Исправлена ошибка 404
            const message = err.response?.data?.message || err.message || 'Неизвестная ошибка при сохранении пользователя.';
            setError(message);
            console.error('Ошибка сохранения пользователя:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 4. Удаление пользователя
    const handleDeleteUser = async (id, email) => {
        const confirmDelete = prompt(`Вы уверены, что хотите удалить пользователя "${email}" (ID: ${id})? Введите "УДАЛИТЬ" для подтверждения.`);
        
        if (confirmDelete !== 'УДАЛИТЬ') {
            return;
        }

        try {
            // Используем новый роут DELETE_USERS_API
            await axios.post(DELETE_USERS_API, { id });

            setUsers(prev => prev.filter(u => u.id !== id));
            alert(`Пользователь "${email}" успешно удален.`);

        } catch (err) {
            const message = err.response?.data?.message || 'Не удалось удалить пользователя.';
            setError(message);
            alert(`Ошибка удаления: ${message}`);
            console.error('Ошибка удаления пользователя:', err);
        }
    };
    
    if (loading) return <div className="p-10 text-center text-gray-500">Загрузка пользователей...</div>;
    
    if (error && users.length === 0) {
        return (
            <div className="p-10 text-center bg-red-100 text-red-700 rounded-xl shadow-lg">
                {error}
                <button onClick={fetchUsers} className="ml-4 text-sm font-medium underline">Повторить попытку</button>
            </div>
        );
    }
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800">Список пользователей ({users.length})</h3>
                <button 
                    onClick={handleOpenCreate}
                    className="flex items-center bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors shadow-md"
                >
                    <Icons.Plus className="w-5 h-5 mr-2" /> Добавить пользователя
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                                        user.status === 'banned' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button 
                                        onClick={() => handleOpenEdit(user)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-100 transition"
                                        title="Редактировать"
                                    >
                                        <Icons.Edit className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteUser(user.id, user.email)}
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

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveUser}
                user={currentUser}
                isSubmitting={isSubmitting}
                error={error}
            />
        </div>
    );
};


// =======================================================
// === 2. МЕНЕДЖЕР ТОВАРОВ (ProductManager) ===
// =======================================================

// --- Модальное окно для создания/редактирования товара ---
const ProductFormModal = ({ isOpen, onClose, onSave, product, isSubmitting, error }) => {
    const [formData, setFormData] = useState({
        articul: '',
        price: '',
        color: '',
        description: '',
        img: '', // Изображения в виде строки с запятыми
    });

    useEffect(() => {
        if (product) {
            setFormData({
                articul: product.articul || '',
                price: product.price || '',
                color: product.color || '',
                description: product.description || '',
                img: Array.isArray(product.img) ? product.img.join(', ') : (product.img || ''),
            });
        } else {
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
        
        const imgArray = formData.img 
            ? formData.img.split(',').map(s => s.trim()).filter(s => s.length > 0) 
            : [];
            
        const payload = {
            id: product ? product.id : undefined,
            ...formData,
            price: parseFloat(formData.price),
            img: imgArray,
        };

        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                    {/* Изображения (URL, через запятую) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Изображения (URL через запятую)</label>
                        <input
                            type="text"
                            name="img"
                            value={formData.img}
                            onChange={handleChange}
                            placeholder="url1, url2, url3"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 shadow-sm"
                        />
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
    
    // Маршруты, предоставленные пользователем
    const PRODUCTS_API = '/api/admin/products'; 

    // 1. Получение товаров
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

    // 2. Управление модалкой
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

    // 3. Сохранение/Обновление товара (маршрут POST /api/admin/products/:action)
    const handleSaveProduct = async (data) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const action = data.id ? 'update' : 'create';
            const response = await axios.post(`${PRODUCTS_API}/${action}`, data);

            // Обновляем локальное состояние
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

    // 4. Удаление товара (маршрут POST /api/admin/products/delete)
    const handleDeleteProduct = async (id, articul) => {
        const confirmDelete = prompt(`Вы уверены, что хотите удалить товар "${articul}" (ID: ${id})? Введите "УДАЛИТЬ" для подтверждения.`);
        
        if (confirmDelete !== 'УДАЛИТЬ') {
            return;
        }

        try {
            await axios.post(`${PRODUCTS_API}/delete`, { id });

            setProducts(prev => prev.filter(p => p.id !== id));
            alert(`Товар "${articul}" успешно удален.`);

        } catch (err) {
            const message = err.response?.data?.message || 'Не удалось удалить товар.';
            setError(message);
            alert(`Ошибка удаления: ${message}`);
            console.error('Ошибка удаления:', err);
        }
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
// === 3. ОБЩИЕ КОМПОНЕНТЫ ДАШБОРДА ===
// =======================================================

const SidebarItem = ({ icon: Icon, title, isActive, onClick }) => (
    <div
        className={`flex items-center p-4 mx-2 my-1 rounded-lg cursor-pointer transition-colors ${
            isActive 
                ? 'bg-red-600 text-white shadow-lg' 
                : 'text-gray-600 hover:bg-gray-200 hover:text-red-600'
        }`}
        onClick={onClick}
    >
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-semibold">{title}</span>
    </div>
);

const ContentArea = ({ activeTab }) => {
    let title = '';
    let content = null;

    switch (activeTab) {
        case 'users':
            title = 'Управление пользователями (CRUD)';
            // ИСПОЛЬЗУЕМ НОВЫЙ КОМПОНЕНТ
            content = <UserManager />;
            break;
        case 'products':
            title = 'Управление товарами (CRUD)';
            content = <ProductManager />; 
            break;
        case 'orders':
            title = 'Управление заказами';
            content = <OrdersSummary />;
            break;
        case 'stats':
            title = 'Аналитика и статистика';
            content = <StatsChart />;
            break;
        case 'settings':
            title = 'Общие настройки системы';
            content = <SystemSettings />;
            break;
        default:
            title = 'Добро пожаловать в Админ-панель';
            content = <div className="p-10 text-center text-gray-500">Выберите раздел в боковом меню.</div>;
    }

    return (
        <div className="flex-1 p-6 md:p-8 bg-gray-50 overflow-auto">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-3">{title}</h1>
            {content}
        </div>
    );
};

// --- Заглушки для других вкладок ---
const OrdersSummary = () => <div className="p-10 bg-white rounded-xl shadow-lg text-gray-600">График заказов, сводка по доходам, статус доставки. (Требуется реализация)</div>;
const StatsChart = () => <div className="p-10 bg-white rounded-xl shadow-lg text-gray-600">Детализированные отчеты и графики по продажам. (Требуется реализация)</div>;
const SystemSettings = () => <div className="p-10 bg-white rounded-xl shadow-lg text-gray-600">Формы для изменения настроек сайта, API-ключей и прав доступа. (Требуется реализация)</div>;


// =======================================================
// === 4. ГЛАВНЫЙ КОМПОНЕНТ АДМИН-ПАНЕЛИ ===
// =======================================================

export default function AdminDashboard() {
    // По умолчанию открываем Товары
    const [activeTab, setActiveTab] = useState('products'); 

    const sidebarMenu = [
        { key: 'stats', title: 'Статистика', icon: Icons.Stats },
        { key: 'orders', title: 'Заказы', icon: Icons.Orders },
        { key: 'products', title: 'Товары', icon: Icons.Products },
        { key: 'users', title: 'Пользователи', icon: Icons.Users },
        { key: 'settings', title: 'Настройки', icon: Icons.Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Боковая панель (Sidebar) */}
            <aside className="w-64 bg-white shadow-xl flex flex-col pt-6 border-r border-gray-200">
                
                {/* Логотип/Заголовок */}
                <div className="px-4 mb-8">
                    <h2 className="text-2xl font-black text-red-600 border-b pb-2">
                        Admin <span className="text-gray-800">Panel</span>
                    </h2>
                </div>
                
                {/* Элементы меню */}
                <nav className="flex-1 space-y-2">
                    {sidebarMenu.map((item) => (
                        <SidebarItem
                            key={item.key}
                            icon={item.icon}
                            title={item.title}
                            isActive={activeTab === item.key}
                            onClick={() => setActiveTab(item.key)}
                        />
                    ))}
                </nav>

                {/* Нижняя часть (Выход) */}
                <div className="p-4 border-t border-gray-200">
                    <button 
                        className="flex items-center justify-center w-full p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        onClick={async () => {
                            try {
                                // Используем предоставленный роут /api/users/logout
                                await axios.post('/api/users/logout');
                                console.log('Выход успешен');
                                // Здесь должна быть логика перенаправления на страницу входа
                                alert('Вы успешно вышли из системы');
                            } catch (e) {
                                console.error('Ошибка при выходе:', e);
                                alert('Ошибка при выходе из системы');
                            }
                        }}
                    >
                        <Icons.LogOut className="w-5 h-5 mr-2" />
                        Выйти
                    </button>
                </div>
            </aside>

            {/* Основное содержимое (Content Area) */}
            <main className="flex-1 flex flex-col">
                <ContentArea activeTab={activeTab} />
            </main>
        </div>
    );
}
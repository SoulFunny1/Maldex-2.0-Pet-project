import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // 🟢 Импорт useParams для чтения параметра категории
// import axios from 'axios'; // Если вы предпочитаете axios, можно использовать его вместо fetch

// --- ИНЛАЙН SVG ЗАМЕНЫ ДЛЯ ИКОНОК ---
const HeartIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
);
const PlusIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
    </svg>
);
const XIcon = (props) => ( // Иконка "Закрыть" для модального окна
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
);
const StarIcon = ({ filled, className = "" }) => (
    <svg 
        className={`w-4 h-4 ${className}`}
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={filled ? "currentColor" : "none"} 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
);

// --- КОНСТАНТЫ API ---
const API_BASE_URL = 'http://localhost:4000';
const MAX_RETRIES = 5;
const INITIAL_BACKOFF_MS = 1000;

// --- ФОРМАТИРОВАНИЕ ДЕНЕГ ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(Number(amount));
};

// --- МАРКЕРЫ (NEW/HIT/SALE) ---
const Marker = ({ text, colorClass }) => (
    <span 
        className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wide 
        ${colorClass} shadow-md`}
    >
        {text}
    </span>
);

// --- КОМПОНЕНТ РЕЙТИНГА ---
const RatingDisplay = ({ rating, reviewCount, size = 'md' }) => {
    const filledStars = Math.round(rating);
    const starSize = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    return (
        <div className="flex items-center space-x-2 my-2">
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <StarIcon 
                        key={i} 
                        filled={i < filledStars} 
                        className={`${starSize} ${i < filledStars ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                ))}
            </div>
            <span className={`text-${size === 'lg' ? 'base' : 'xs'} text-gray-500 font-medium`}>
                {rating.toFixed(1)} ({reviewCount} отзыва)
            </span>
        </div>
    );
};

// --- 1. КОМПОНЕНТ КАРТОЧКИ ТОВАРА (ProductCard) ---
const ProductCard = ({ product, onSelectProduct }) => {
    const primaryImage = product.colorVariants[0]?.imgUrl || "https://placehold.co/250x250/f0f0f0/999999?text=Нет+Фото";
    const [selectedColor, setSelectedColor] = useState(product.colorVariants[0]);
    
    const isAvailable = product.stockCount > 0;
    const availabilityText = isAvailable ? 'В наличии' : 'Под заказ';
    const deliveryText = isAvailable ? '1-2 дня' : 'от 5 дней';
    const availabilityColor = isAvailable ? 'text-green-600' : 'text-gray-500';

    return (
        <div 
            className=" rounded-xl shadow-lg ring-1 ring-gray-100 hover:ring-red-300
                       transition-all duration-300 ease-in-out hover:shadow-xl hover:translate-y-[-3px] 
                       overflow-hidden cursor-pointer flex flex-col group bg-white"
            onClick={() => onSelectProduct(product)} // Клик открывает модальное окно
        >
            
            <div className="relative p-3 flex items-center justify-center min-h-[200px] overflow-hidden">
                
                {/* Маркеры */}
                <div className="absolute top-3 left-3 flex space-x-1 z-10">
                    {product.isNew && <Marker text="New" colorClass="bg-red-600 text-white" />}
                    {product.isHit && <Marker text="Hit" colorClass="bg-gray-800 text-white" />}
                </div>
                
                {/* Кнопка "В избранное" */}
                <button 
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-600 transition-all duration-300 
                               p-2 rounded-full bg-white/80 backdrop-blur-sm z-10 
                               hover:scale-110 active:scale-95" 
                    title="Добавить в избранное"
                    onClick={(e) => { e.stopPropagation(); /* Добавить логику избранного */ }}
                >
                    <HeartIcon fill="currentColor" className="opacity-80" />
                </button>
                
                <img 
                    src={primaryImage} 
                    alt={product.name} 
                    className="w-full h-auto max-h-[160px] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.1] transform"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/250x250/f0f0f0/999999?text=Нет+Фото"; }}
                />
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
                
                {/* Название */}
                <h3 className="text-xl font-extrabold text-gray-900 leading-snug min-h-[50px] max-h-[50px] overflow-hidden">
                    {product.name}
                </h3>
                
                {/* Рейтинг */}
                <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} />

                {/* Материал */}
                <div className="text-xs text-gray-600 mb-2 space-y-1">
                    {product.material && (
                        <p className="flex justify-between items-center">
                            <span className="text-gray-500">Материал:</span> 
                            <span className="font-medium truncate ml-2 text-gray-700">{product.material}</span>
                        </p>
                    )}
                </div>
                
                {/* Варианты цвета (Свотчи) */}
                <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xs text-gray-500">Варианты:</span>
                    {product.colorVariants.map((color) => (
                        <div
                            key={color.code}
                            // Предотвращаем открытие модального окна при выборе цвета
                            onClick={(e) => { e.stopPropagation(); setSelectedColor(color); }} 
                            className={`w-4 h-4 rounded-full border border-gray-200 cursor-pointer transition-all duration-200 shadow-sm transform hover:scale-125`}
                            style={{ 
                                backgroundColor: color.hex, 
                                boxShadow: selectedColor.code === color.code 
                                    ? '0 0 0 2px #fff, 0 0 0 4px #DC2626' 
                                    : 'none'
                            }}
                            title={color.name}
                        />
                    ))}
                </div>
                
                {/* Нижняя часть (Цена и Кнопка) */}
                <div className="mt-auto pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-end mb-3">
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 font-medium">Цена:</span>
                             <span className="text-3xl font-black text-red-600 tracking-tight">
                                 {formatCurrency(product.price)}
                            </span>
                        </div>
                        <div className="text-right">
                             <span className={`font-bold ${availabilityColor} text-sm whitespace-nowrap`}>
                                 {availabilityText}
                            </span>
                            <p className="text-xs text-gray-500 mt-0.5">Доставка: {deliveryText}</p>
                        </div>
                    </div>
                    <button 
                        className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl 
                                   bg-red-600 text-white font-bold text-base shadow-lg shadow-red-200
                                   transition-all duration-200 hover:bg-red-700 active:scale-[0.98]"
                        onClick={(e) => { e.stopPropagation(); /* Добавить в корзину */ }}
                        title="Добавить в корзину"
                    >
                        <PlusIcon className="w-4 h-4 mr-2" />
                        Добавить в корзину
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- 2. КОМПОНЕНТ МОДАЛЬНОГО ОКНА (ProductModal) ---
const ProductModal = ({ product, onClose }) => {
    if (!product) return null;
    
    // Сброс выбранного цвета при открытии нового продукта
    // Используем product.id для сброса state
    const [selectedColor, setSelectedColor] = useState(product.colorVariants[0]);
    useEffect(() => {
        setSelectedColor(product.colorVariants[0]);
    }, [product.id, product.colorVariants]);


    const isAvailable = product.stockCount > 0;
    const availabilityText = isAvailable ? 'В наличии' : 'Под заказ';
    const deliveryText = isAvailable ? '1-2 дня' : 'от 5 дней';
    const availabilityColor = isAvailable ? 'text-green-600' : 'text-gray-500';
    
    // Временные данные для детального описания, как на скриншоте
    const mockDetails = [
        { label: 'Вес брутто', value: '100 г.' },
        { label: 'Транспортная упаковка', value: '60 * 40 * 30 см' },
        { label: 'Объем упаковки', value: '0,091 м2' },
        { label: 'Количество в упаковке', value: '100 шт.' },
    ];
    
    // Временные данные для таблицы размеров
    const sizeData = [
        { size: 'S', avail: 564, order: 12 },
        { size: 'M', avail: 42242, order: 0 },
        { size: 'L', avail: 2, order: 244 },
        { size: 'XL', avail: 1535, order: 0 },
        { size: 'XXL', avail: 13425, order: 564 },
        { size: '3XL', avail: 564, order: 0 },
        { size: '4XL', avail: 564, order: 0 },
    ];

    return (
        <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex justify-center items-start overflow-y-auto p-4 sm:p-10 transition-opacity duration-300"
            onClick={onClose} // Закрытие по клику на фон
        >
            <div 
                className="w-full max-w-7xl bg-white rounded-xl shadow-2xl relative transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()} // Предотвращаем закрытие по клику внутри модального окна
            >
                <button 
                    className="absolute top-4 right-4 p-2 rounded-full bg-white text-gray-600 hover:text-red-600 z-10 shadow-md ring-1 ring-gray-200"
                    onClick={onClose}
                    title="Закрыть"
                >
                    <XIcon className="w-6 h-6"/>
                </button>
                
                <div className="p-6 sm:p-10 flex flex-col lg:flex-row gap-8">
                    
                    {/* ЛЕВЫЙ БЛОК: Изображение и Галерея */}
                    <div className="w-full lg:w-5/12">
                        <h1 className="text-xl font-semibold text-gray-800 mb-2 lg:hidden">{product.name}</h1>
                        <p className="text-sm text-gray-500 mb-4 lg:hidden">Артикул: {product.mainArticul}</p>
                        
                        {/* Основное изображение */}
                        <div className="relative rounded-lg p-6 mb-4 flex justify-center items-center bg-gray-50">
                             <img 
                                 src={selectedColor.imgUrl || product.colorVariants[0].imgUrl} 
                                 alt={product.name} 
                                 className="w-full max-h-[400px] object-contain"
                            />
                        </div>
                        
                        {/* Миниатюры */}
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                             {product.colorVariants.map((color) => (
                                 <div
                                     key={color.code}
                                     onClick={() => setSelectedColor(color)}
                                     className={`p-1 bg-white border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-red-600 flex-shrink-0`}
                                     style={{ 
                                         borderColor: selectedColor.code === color.code ? '#DC2626' : '#E5E7EB'
                                     }}
                                 >
                                     <img 
                                         src={color.imgUrl || "https://placehold.co/80x80"} 
                                         alt={color.name} 
                                         className="w-16 h-16 object-cover rounded-md" 
                                     />
                                 </div>
                             ))}
                        </div>
                    </div>
                    
                    {/* ПРАВЫЙ БЛОК: Характеристики и Форма заказа */}
                    <div className="w-full lg:w-7/12">
                        <h1 className="text-3xl font-black text-gray-900 mb-2 hidden lg:block">{product.name}</h1>
                        <p className="text-base text-gray-500 mb-2 hidden lg:block">Артикул: {product.mainArticul}</p>
                        
                        <div className="flex items-center justify-between border-b pb-4 mb-4">
                            <RatingDisplay rating={product.rating} reviewCount={product.reviewCount} size="lg"/>
                            <span className="text-3xl font-black text-red-600 tracking-tight">
                                {formatCurrency(product.price)}
                            </span>
                        </div>
                        
                        {/* Варианты цвета */}
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-base text-gray-700 font-semibold">Цвет: {selectedColor.name}</span>
                            {product.colorVariants.map((color) => (
                                <div
                                    key={color.code}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-6 h-6 rounded-full border border-gray-200 cursor-pointer transition-all duration-200 shadow-sm transform hover:scale-110`}
                                    style={{ 
                                        backgroundColor: color.hex, 
                                        boxShadow: selectedColor.code === color.code 
                                            ? '0 0 0 2px #fff, 0 0 0 4px #DC2626' 
                                            : '0 0 0 1px rgba(0,0,0,0.1)' 
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>

                        {/* Детали о товаре (по скриншоту) */}
                        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-3">О товаре</h3>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-6">
                            {mockDetails.map(detail => (
                                <p key={detail.label} className="flex justify-between">
                                    <span className="text-gray-500">{detail.label}:</span>
                                    <span className="font-semibold text-gray-700">{detail.value}</span>
                                </p>
                            ))}
                        </div>
                        
                        {/* Описание */}
                        <div className="mb-6">
                             <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-3">Описание</h3>
                             <p className="text-sm text-gray-700 leading-relaxed">
                                 {product.description || "Недорогая миниатюрная беспроводная колонка Chubby порадует владельца акуратным исполнением и высоким качеством материалов. Колонка обтянута акустической тканью популярной фактуры, имеет приятное soft-touch покрытие и демонстрирует хороший, особенно для столь компактного корпуса, звук. (Длинный текст для имитации скриншота)"}
                             </p>
                        </div>

                        {/* Таблица наличия и заказа (По скриншоту) */}
                        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-3">Наличие и Заказ</h3>
                        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6">
                            <div className="grid grid-cols-3 text-sm font-bold text-gray-600 border-b pb-2 mb-2">
                                <span>Размер</span>
                                <span className="text-center">Доступно</span>
                                <span className="text-right">Заказать</span>
                            </div>
                            {sizeData.map(item => (
                                <div key={item.size} className="grid grid-cols-3 text-sm py-1.5 border-b border-gray-200 last:border-b-0">
                                    <span className="font-semibold">{item.size}</span>
                                    <span className={`text-center font-mono ${item.avail > 0 ? 'text-green-700' : 'text-red-500'}`}>{item.avail}</span>
                                    <span className="text-right font-mono text-blue-600 underline cursor-pointer">{item.order}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Финальная кнопка */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
                             <div className="flex-1">
                                 <span className={`font-bold ${availabilityColor} text-lg block`}>Статус: {availabilityText}</span>
                                 <p className="text-sm text-gray-500">Срок поставки: {deliveryText}</p>
                            </div>
                            <button 
                                className="w-full sm:w-2/3 flex items-center justify-center px-6 py-3 rounded-xl 
                                           bg-red-600 text-white font-black text-lg shadow-xl shadow-red-300
                                           transition-all duration-200 hover:bg-red-700 active:scale-[0.98]"
                                title="Оформить заказ"
                            >
                                <PlusIcon className="w-5 h-5 mr-3" />
                                Добавить в корзину
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};


// --- 3. ГЛАВНЫЙ КОМПОНЕНТ СЕТКИ (ProductGridWithModal) ---
const ProductGridWithModal = () => {
    // 🟢 ИСПОЛЬЗУЕМ useParams() для извлечения имени категории из URL
    const { categoryName } = useParams();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); // Состояние для модального окна

    // Вспомогательная функция для форматирования данных из API
    const mapProductFromApi = (apiProduct) => {
        const productData = apiProduct.productData || {};
        const images = Array.isArray(productData.img) ? productData.img : [];
        const productColor = productData.color || 'Ассорти';
        const productMaterial = productData.material || 'Полимер';
        const productDescription = productData.description || '';
        
        const colorVariants = images.slice(0, 4).map((url, index) => ({
            code: `${apiProduct.mainArticul}-${index}`,
            hex: ['#DC2626', '#3B82F6', '#10B981', '#1F2937'][index % 4], 
            name: `${productColor} ${index + 1}`,
            imgUrl: url,
        }));
        
        if (colorVariants.length === 0) {
             colorVariants.push({
                 code: 'default',
                 hex: '#CCCCCC',
                 name: 'Стандарт',
                 imgUrl: 'https://placehold.co/250x250/f0f0f0/999999?text=Нет+Фото'
             });
        }
        
        const rating = (Math.random() * 1.5 + 3.5); // От 3.5 до 5.0
        const reviewCount = Math.floor(Math.random() * 500) + 50;

        return {
            id: apiProduct.id,
            mainArticul: apiProduct.mainArticul || 'N/A',
            name: apiProduct.name,
            price: apiProduct.price,
            stockCount: apiProduct.stock,
            material: productMaterial,
            description: productDescription,
            rating: rating,
            reviewCount: reviewCount,
            
            isNew: apiProduct.createdAt && (new Date() - new Date(apiProduct.createdAt)) < 7 * 24 * 60 * 60 * 1000, 
            isHit: apiProduct.stock > 500,
            colorVariants: colorVariants,
        };
    };

    // Функция для получения данных с бэкенда с экспоненциальной задержкой
    const fetchProducts = useCallback(async (retryCount = 0) => {
        setLoading(true);
        setError(null);
        
        // 🟢 ПРОБЛЕМНАЯ ЧАСТЬ: Формируем API_ENDPOINT
        if (!categoryName) {
            setLoading(false);
            setError("Ошибка: Имя категории не определено в URL. Проверьте ваш маршрут (Route path).");
            return;
        }

        const categoryEndpoint = `/api/admin/products/category/${categoryName}`;

        try {
            const response = await fetch(`${API_BASE_URL}${categoryEndpoint}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            // ... (дальнейшая логика повторных попыток) ...
            if (!response.ok) {
                if (retryCount < MAX_RETRIES) {
                    const delay = INITIAL_BACKOFF_MS * Math.pow(2, retryCount) + Math.random() * 500;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return fetchProducts(retryCount + 1);
                }
                // ❌ Строка, где раньше была ошибка 404
                throw new Error(`Ошибка HTTP: ${response.status} (${response.statusText})`);
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
                 throw new Error("Неверный формат данных: ожидался массив.");
            }

            const mappedProducts = data.map(mapProductFromApi);
            setProducts(mappedProducts);
            setLoading(false);

        } catch (err) {
            console.error("Ошибка при получении товаров с бэкенда:", err);
            setError(`Ошибка при загрузке данных: ${err.message}. Убедитесь, что ваш Express-сервер запущен на ${API_BASE_URL} и маршрут ${categoryEndpoint} доступен.`);
            setLoading(false);
        }
    }, [categoryName]); // 🟢 categoryName теперь в зависимостях

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);
    
    // Эффект для блокировки прокрутки при открытом модальном окне
    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedProduct]);

    if (error) {
        return (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl max-w-7xl mx-auto mt-10 shadow-xl border-t-4 border-red-400">
                <p className="text-2xl font-black mb-3">❌ Ошибка загрузки каталога</p>
                <p className="text-left whitespace-pre-wrap font-mono text-sm">
                    {error}
                </p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[500px] text-2xl font-medium text-red-600">
                 <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-red-600 mr-3"></div>
                 Загрузка товаров из категории **{categoryName}**...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white mx-30 rounded-2xl font-[Inter] p-4 sm:p-8 mt-10">
            <div className="max-w-9xl mx-auto">
                <h2 className="text-4xl font-black text-gray-900 mb-10 border-b-4 border-red-600 inline-block pb-1">
                    Каталог: {categoryName || 'Все товары'}
                </h2>
                
                {/* Сетка */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onSelectProduct={setSelectedProduct}
                        />
                    ))}
                </div>
                
                
            </div>
            
            {/* Модальное окно */}
            <ProductModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
            />
        </div>
    );
};


export default ProductGridWithModal;
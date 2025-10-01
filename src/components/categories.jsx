import React from 'react';

const categories = [
  { name: 'Наборы', icon: '📦' },
  { name: 'Идеи подарков', icon: '🎁' },
  { name: 'На праздники', icon: '🎁' },
  { name: 'Новинки', icon: '✨' },
  { name: 'Одежда', icon: '👕' },
  { name: 'Тренды сезона', icon: '🔥' },
  { name: 'Головные уборы', icon: '🧢' },
  { name: 'Наборы', icon: '📦' },
  { name: 'Электроника', icon: '💻' },
  { name: 'Бутылки', icon: '💧' },
  { name: 'Уникальный дизайн', icon: '🎨' },
];

const CategoryList = () => {
  return (
    <div className="flex justify-center  items-center">
      <div className="flex gap-13 p-4 scrollbar-hide lg:justify-center">
        {categories.map((category, index) => (
          <div key={index} className="w-[102px] flex flex-col items-center text-center cursor-pointer">
            {/* Блок с иконкой */}
            <div className="w-32 h-32 flex items-center justify-center p-2 mb-2 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
              <span className="text-4xl">{category.icon}</span>
            </div>
            {/* Текст категории под блоком */}
            <p className="text-sm text-gray-700 font-medium whitespace-nowrap  text-ellipsis">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
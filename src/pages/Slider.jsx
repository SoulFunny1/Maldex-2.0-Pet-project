import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Импортируем Autoplay
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const HomePageLayout = () => {
  return (
    <div className="flex mx-25 p-4 gap-4 h-[450px]">
      {/* Левая колонка: Swiper Slider */}
      <div className="flex-1 rounded-xl overflow-hidden shadow-lg relative bg-[#00B6BA] h-full">
        <Swiper
          // Добавляем Autoplay в modules
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: '.swiper-button-prev-custom',
            nextEl: '.swiper-button-next-custom',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
          }}
          // Настраиваем автовоспроизведение
          autoplay={{
            delay: 2000, // 10 секунд
            disableOnInteraction: false, // Продолжать автопрокрутку после взаимодействия пользователя
          }}
          loop={true}
          className="w-full h-full"
        >
          {/* ... Ваши четыре слайда ... */}
          <SwiperSlide>
            <div className="relative flex flex-col md:flex-row items-center justify-between h-full p-4 md:p-8 text-white bg-[#00B6BA]">
              {/* Пагинация */}
              <div className="absolute top-4 right-4 flex space-x-1 z-10 swiper-pagination-custom"></div>

              {/* Контент */}
              <div className="flex flex-col items-start text-left max-w-sm z-10 md:mr-8 mb-4 md:mb-0">
                <div className="border border-white px-2 py-1 rounded-lg text-xs font-semibold mb-2">
                  Корпоративные подарки
                </div>
                <h1 className="text-xl md:text-3xl lg:text-3xl font-bold mb-4 leading-tight">
                  Бизнес сувениры для брендов
                </h1>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white hover:text-teal-500 transition duration-300">
                    Подробнее
                  </button>
                  <button className="bg-white text-[#00B6BA] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-teal-100 transition duration-300 flex items-center justify-center">
                    Заказать
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Изображение */}
              <div className="relative w-full md:w-1/2 flex justify-center items-center h-full">
                <img src="./slider1.svg" alt="Бизнес сувенир - бутылка" className="w-full h-full object-contain" />
              </div>

              {/* Навигационные стрелки */}
              <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
                <button className="swiper-button-prev-custom w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm transition duration-300">
                  &larr;
                </button>
                <button className="swiper-button-next-custom w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm transition duration-300">
                  &rarr;
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Второй слайд */}
          <SwiperSlide>
            <div className="relative flex flex-col md:flex-row items-center justify-between h-full p-4 md:p-8 text-white bg-[#00B6BA]">
              <div className="absolute top-4 right-4 flex space-x-1 z-10 swiper-pagination-custom"></div>
              <div className="flex flex-col items-start text-left max-w-sm z-10 md:mr-8 mb-4 md:mb-0">
                <div className="border border-white px-2 py-1 rounded-lg text-xs font-semibold mb-2">
                  Корпоративные подарки
                </div>
                <h1 className="text-xl md:text-3xl lg:text-3xl font-bold mb-4 leading-tight">
                  ББизнес сувениры для брендов
                </h1>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white hover:text-teal-500 transition duration-300">
                    Подробнее
                  </button>
                  <button className="bg-white text-[#00B6BA] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-teal-100 transition duration-300 flex items-center justify-center">
                    Заказать
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="relative w-full md:w-1/2 flex justify-center items-center h-full">
                <img src="./slider1.svg" alt="Бизнес сувенир - бутылка" className="w-full h-full object-contain" />
              </div>
              <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
                <button className="swiper-button-prev-custom w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm transition duration-300">
                  &larr;
                </button>
                <button className="swiper-button-next-custom w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm transition duration-300">
                  &rarr;
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Третий слайд */}
          <SwiperSlide>
            <div className="relative flex flex-col md:flex-row items-center justify-between h-full p-4 md:p-8 text-white bg-[#00B6BA]">
              <div className="absolute top-4 right-4 flex space-x-1 z-10 swiper-pagination-custom"></div>
              <div className="flex flex-col items-start text-left max-w-sm z-10 md:mr-8 mb-4 md:mb-0">
                <div className="border border-white px-2 py-1 rounded-lg text-xs font-semibold mb-2">
                  Корпоративные подарки
                </div>
                <h1 className="text-xl md:text-3xl lg:text-3xl font-bold mb-4 leading-tight">
                  БББизнес сувениры для брендов
                </h1>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white hover:text-teal-500 transition duration-300">
                    Подробнее
                  </button>
                  <button className="bg-white text-[#00B6BA] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-teal-100 transition duration-300 flex items-center justify-center">
                    Заказать
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="relative w-full md:w-1/2 flex justify-center items-center h-full">
                <img src="./slider1.svg" alt="Бизнес сувенир - бутылка" className="w-full h-full object-contain" />
              </div>
              <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
                <button className="swiper-button-prev-custom w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm transition duration-300">
                  &larr;
                </button>
                <button className="swiper-button-next-custom w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm transition duration-300">
                  &rarr;
                </button>
              </div>
            </div>
          </SwiperSlide>

          {/* Четвертый слайд */}
          <SwiperSlide>
            <div className="relative flex flex-col md:flex-row items-center justify-between h-full p-4 md:p-8 text-white bg-[#00B6BA]">
              <div className="absolute top-4 right-4 flex space-x-1 z-10 swiper-pagination-custom"></div>
              <div className="flex flex-col items-start text-left max-w-sm z-10 md:mr-8 mb-4 md:mb-0">
                <div className="border border-white px-2 py-1 rounded-lg text-xs font-semibold mb-2">
                  Корпоративные подарки
                </div>
                <h1 className="text-xl md:text-3xl lg:text-3xl font-bold mb-4 leading-tight">
                  ББББизнес сувениры для брендов
                </h1>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="bg-transparent border-2 border-white text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white hover:text-teal-500 transition duration-300">
                    Подробнее
                  </button>
                  <button className="bg-white text-[#00B6BA] font-semibold py-2 px-4 rounded-lg text-sm hover:bg-teal-100 transition duration-300 flex items-center justify-center">
                    Заказать
                    <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="relative w-full md:w-1/2 flex justify-center items-center h-full">
                <img src="./slider1.svg" alt="Бизнес сувенир - бутылка" className="w-full h-full object-contain" />
              </div>
              <div className="absolute bottom-4 left-4 flex space-x-2 z-10">
                <button className="swiper-button-prev-custom w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm transition duration-300">
                  &larr;
                </button>
                <button className="swiper-button-next-custom w-8 h-8 bg-white bg-opacity-30 hover:bg-opacity-50 text-white rounded-full flex items-center justify-center text-sm transition duration-300">
                  &rarr;
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Правая колонка: Сетка изображений */}
      <div className="flex-1 grid grid-rows-[3fr_2fr] gap-4 p-4 h-full">
        {/* Верхнее большое изображение */}
        <div className="row-span-1 bg-white rounded-xl shadow-lg flex items-center justify-center p-2 overflow-hidden">
          <img src="./bottle.svg" alt="Бамбуковая бутылка" className="w-full h-full object-contain" />
        </div>

        {/* Нижняя сетка из 5 маленьких изображений */}
        <div className="row-span-1 grid grid-cols-5 gap-4 h-full">
          <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-1 overflow-hidden">
            <img src="./camera.svg" alt="Камера" className="w-full h-full object-contain" />
          </div>
          <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-1 overflow-hidden">
            <img src="./cap.svg" alt="Кепка" className="w-full h-full object-contain" />
          </div>
          <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-1 overflow-hidden">
            <img src="./book.svg" alt="Блокнот" className="w-full h-full object-contain" />
          </div>
          <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-1 overflow-hidden">
            <img src="./book.svg" alt="Блокнот" className="w-full h-full object-contain" />
          </div>
          <div className="bg-white rounded-xl shadow-lg flex items-center justify-center p-1 overflow-hidden">
            <img src="./image 384.svg" alt="Блокнот" className="w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePageLayout;
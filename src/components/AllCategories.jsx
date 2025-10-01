import { useState, useEffect } from "react";



export default function allCategories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/api/categories/')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error(error));
    }, []);
    return (

        <header className="mx-30 pb-10">
            <div className="grid grid-cols-5 gap-x-6 gap-y-4 p-5 bg-white rounded-2xl ">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="p-5 hover:bg-gray-50 rounded-lg transition duration-150 cursor-pointer"
                    >
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex flex-col justify-center items-center">
                                <div className="w-13 h-13 flex items-center justify-center">
                                        <img src={category.img} alt="" />
                                    
                                </div>
                                <p className="text-base text-gray-900 font-bold ">
                                    {category.name}
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-sm text-gray-500">
                                    {category.description || "Нет описания"}
                                </p>
                            </div>
                        </div>

                    </div>
                ))}

                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="p-5 hover:bg-gray-50 rounded-lg transition duration-150 cursor-pointer"
                    >
                        <div className="flex flex-col justify-center items-center">
                            <div className="flex flex-col justify-center items-center">
                                <div className="w-13 h-13 flex items-center justify-center">
                                        <img src={category.img} alt="" />
                                    
                                </div>
                                <p className="text-base text-gray-900 font-bold ">
                                    {category.name}
                                </p>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <p className="text-sm text-gray-500">
                                    {category.description || "Нет описания"}
                                </p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </header>
    )
}
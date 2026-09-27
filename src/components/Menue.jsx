import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Menu, LucideShoppingCart, User2, Import } from 'lucide-react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { addToCartAPI, openCart } from './cart/cartSlice'

const Menue = () => {
    const [fooditem, setFooditem] = useState([])
    const dispatch = useDispatch()
    const api=import.meta.env.VITE_API_URL

    async function getFood() {
        try {
            const response = await axios.get(`${api}/api/food`)
            setFooditem(response.data.saved_food);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getFood()
    }, [])

    const handleAddToCart = async (item) => {
        const result = await dispatch(addToCartAPI({
            name: item.name,
            price: item.price,
            img: item.image,
            qty: 1,
        }))

        if (addToCartAPI.fulfilled.match(result)) {
            dispatch(openCart())
            toast.success(`${item.name} added to cart`)
        } else {
            toast.error(result.payload || 'Could not add item to cart')
        }
    }

    return (
        <div className='my-4 p-2 menue'>
            <h1 className='text-gray-100 mb-2 md:mx-4 md:text-3xl font-light text-xl'>Explore Menu</h1>

            <div className="food-items p-1 box grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {fooditem.map((e, index) => {
                    return (
                        <div key={e._id || index} className="food-item flex flex-col justify-between border border-amber-700 bg-white/5 rounded-xl shadow-lg p-3">
                            <div>
                                <img
                                    className='h-40 w-full object-cover rounded-lg'
                                    src={`${e.image}?w=400&q=60&auto=format`}
                                    alt={e.name}
                                    loading='lazy'
                                    decoding='async'
                                />
                                <div className="food-desc-price italic my-2">
                                    <h1 className='name text-center font-semibold text-gray-100'>{e.name}</h1>
                                    <p className='desc text-center mx-2 font-light text-gray-300 text-sm mt-1'>{e.desc}</p>
                                    <h1 className='text-red-300 text-center text-lg font-semibold mt-2'>Rs {e.price}/-</h1>
                                </div>
                            </div>
                            <button
                                onClick={() => handleAddToCart(e)}
                                className='border cursor-pointer bg-orange-600 py-2 w-full text-white hover:bg-white hover:text-black border-gray-500 rounded-2xl mt-2 transition-colors'
                            >
                                Add to Cart
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Menue
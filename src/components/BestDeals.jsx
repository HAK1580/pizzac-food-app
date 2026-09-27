import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { addToCartAPI, openCart } from './cart/cartSlice'

const BestDeals = () => {
    const [deals, setDeals] = useState([])
    const dispatch = useDispatch()
    const api=import.meta.env.VITE_API_URL

    async function getDeals() {
        try {
            const response = await axios.get(`${api}/api/food/deals`)
            const valid_deals = (response.data.deals || []).filter(
                (deal) => deal.image_url && deal.description
            )
            setDeals(valid_deals)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getDeals()
    }, [])

    const handleAddToCart = async (item) => {
        const result = await dispatch(addToCartAPI({
            name: item.name,
            price: item.price,
            img: item.image_url,
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
        <div className='my-4 p-2 deals'>
            <h1 className='text-gray-100 mb-2 md:mx-4 md:text-3xl font-light text-xl'>Best Deals</h1>

            <div className="deal-items p-1 box grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {deals.map((e, index) => {
                    return (
                        <div key={e._id || index} className="deal-item relative flex flex-col justify-between border border-amber-700 bg-white/5 rounded-xl shadow-lg p-3">
                            {e.deal_number && (
                                <span className='absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full'>
                                    Deal {e.deal_number}
                                </span>
                            )}
                            <div>
                                <img
                                    className='h-40 w-full object-cover rounded-lg'
                                    src={`${e.image_url}?w=400&q=60&auto=format`}
                                    alt={e.name}
                                    loading='lazy'
                                    decoding='async'
                                />
                                <div className="deal-desc-price italic my-2">
                                    <h1 className='name text-center font-semibold text-gray-100'>{e.name}</h1>

                                    <ul className='flex flex-wrap justify-center gap-1 mx-2 mt-2'>
                                        {e.items?.map((item, i) => (
                                            <li key={i} className='not-italic text-xs text-gray-300 bg-white/10 px-2 py-0.5 rounded-full'>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    <h1 className='text-red-300 text-center text-lg font-semibold mt-2'>
                                        {e.currency} {e.price}/-
                                    </h1>
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

export default BestDeals
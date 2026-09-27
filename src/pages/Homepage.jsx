import React from 'react'
import Menue from '../components/Menue'
import BestDeals from '../components/BestDeals'

const Homepage = () => {
  return (
    <div>
      
      <div id='menu'>
      <BestDeals />
      </div>

        <Menue />
    </div>
  )
}

export default Homepage
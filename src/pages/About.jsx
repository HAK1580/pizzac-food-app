import React from 'react'
import { Flame, ShieldCheck, Heart, Award, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const navigate = useNavigate()

  const stats = [
    { label: 'Pizzas Baked Daily', value: '500+' },
    { label: 'Happy Customers', value: '15,000+' },
    { label: 'Fresh Ingredients', value: '100% Real' },
    { label: 'Fastest Delivery', value: '30 Mins' }
  ]

  const values = [
    {
      icon: <Flame size={26} className="text-amber-500" />,
      title: 'Traditional Wood-Fired Oven',
      description: 'Our hand-stretched dough is baked at high temperatures to achieve that perfect crispy, authentic crust.'
    },
    {
      icon: <ShieldCheck size={26} className="text-amber-500" />,
      title: 'Premium Quality Ingredients',
      description: 'We source 100% mozzarella cheese, rich vine-ripened tomatoes, and fresh herbs daily.'
    },
    {
      icon: <Heart size={26} className="text-amber-500" />,
      title: 'Crafted With Passion',
      description: 'Every recipe is created with love, ensuring bold flavors and consistent quality in every single bite.'
    },
    {
      icon: <Award size={26} className="text-amber-500" />,
      title: 'Hygiene & Food Safety',
      description: 'Our kitchen maintains top-tier hygiene standards so you can enjoy fresh, safe food with complete peace of mind.'
    }
  ]

  return (
    <div className="bg-white text-gray-800">
      {/* Hero / Banner Section */}
      <section className="relative bg-gradient-to-b from-amber-50/70 via-white to-white py-16 sm:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-500 font-bold tracking-wider uppercase text-sm bg-amber-100/60 px-4 py-1.5 rounded-full border border-amber-200">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mt-4 tracking-tight">
            Crafting the Perfect Slice for <span className="text-amber-500">Pizzac</span> Lovers
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-base sm:text-lg leading-relaxed">
            Welcome to Pizzac! What started as a passion for authentic wood-fired pizzas has turned into a daily celebration of handcrafted dough, rich sauces, and fresh toppings.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Image Container */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-amber-500/10">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                alt="Pizzac Kitchen Fresh Pizza"
                className="w-full h-[380px] sm:h-[450px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Experience Card Overlay */}
            <div className="absolute -bottom-6 -right-2 sm:bottom-6 sm:-right-6 bg-white p-5 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-amber-500 text-white rounded-xl font-bold text-xl">
                🍕
              </div>
              <div>
                <p className="font-extrabold text-gray-900 text-lg sm:text-xl">100% Fresh</p>
                <p className="text-xs sm:text-sm text-gray-500">Never Frozen Dough</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <span className="text-amber-600 font-semibold text-sm tracking-wide uppercase">
              Why Choose Pizzac?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              A Flavor Journey Baked to Perfection
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              At Pizzac, we believe a great pizza brings people together. From our signature stone-baked crusts to custom sauces made from scratch, we leave no detail behind. Whether you are craving classic Pepperoni or local special creations, every bite delivers pure satisfaction.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Our mission is simple: serve fast, piping hot, gourmet-quality pizzas without compromising on authentic taste or quality ingredients.
            </p>

            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all cursor-pointer text-sm sm:text-base"
            >
              <span>Explore Our Menu</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* Key Values Grid */}
      <section className="py-16 bg-gradient-to-b from-amber-50/40 to-white border-y border-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              What Sets Us Apart
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              We stick to core principles that make every single order memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-3 bg-amber-50 w-fit rounded-xl mb-4 border border-amber-100">
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-12 bg-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">{stat.value}</p>
                <p className="text-amber-100 text-xs sm:text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
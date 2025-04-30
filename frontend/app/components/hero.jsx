export default function Hero() {
   return (
      <section className="w-[95%]
      bg-blue-100
      py-20 px-3 rounded-2xl">

        {/* Hero container */}
        <div className="py-5
        flex
        
        xl:pb-8 xl:px-5
        
        2xl:pr-10 2xl:pb-10">
  
          {/* Hero Left Side */}
          <article className="flex flex-col justify-start gap-8
          sm:px-3
          md:w-1/2">

            {/* Hero Content */}
            <div className="w-[95%]
            flex flex-col justify-start gap-8
            sm:w-3/4
            md:w-full">

              {/* Hero Heading */}
              <h1 className="text-4xl font-bold text-left
              md:w-full">
                Discover, Create, and Share <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Amazing Blogs</span>
              </h1>

              {/* Hero Description */}
              <div className="text-xl
              md:w-full">
                <p>Join our community of writers and readers. Find inspiration, knowledge, and entertainment through thoughtful articles.</p>
              </div>

            </div>

            {/* Hero Buttons */}
            <div className="w-[95%]
            flex flex-col gap-4">

              <button className="bg-blue-500 hover:bg-blue-700
              text-white font-semibold text-left
              py-2 px-4 rounded
              w-4/5
              xxs:w-[300px]">Explore Blogs</button>

              <button className="bg-gray-100 hover:bg-slate-400 hover:text-white text-blue-500 font-semibold text-left
              py-2 px-4 rounded
              w-4/5
              xxs:w-[300px]">Join Now</button>

            </div>

            {/* Hero Round Ball */}
            <div className="w-[95%] h-80
            relative
            md:hidden">

              <div className="h-24 w-24 rounded-full
              bg-indigo-200
              absolute bottom-60 left-1/4
              animate-pulse
              transition-transform hover:translate-y-10 duration-500"></div>

              <div className="h-16 w-16 rounded-full
              absolute bottom-0 right-1/4 bg-amber-400
              animate-bounce"></div>

            </div>

          </article>

            {/* Hero Right Side */}
            <section className="hidden

            md:flex md:justify-end md:items-center
            md:w-1/2">
              <img className="w-4/5
              rounded-lg shadow-md
              shadow-slate-500/40
              origin-top-left rotate-6" 
              
              src="https://media.gettyimages.com/id/1160362024/photo/modern-white-office-desk-table-with-laptop-smartphone-and-blank-notebook-and-cup-of-coffee.jpg?s=1024x1024&w=gi&k=20&c=AA1MG-JCS728LfKG9T3yIudTNde9j_aRudXezDnuCEU=" alt="hero" />

            </section>

          </div>
        </section>
   )
}
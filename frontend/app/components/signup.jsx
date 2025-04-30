export default function Signup() {
   return (
      <section className="w-[95%] rounded-xl
      bg-gradient-to-r from-blue-600 to-purple-500">

        {/* Signup Container */}
        <div className="px-5 py-9 my-8
        text-center text-white 
        flex flex-col items-center gap-6">

          {/* Signup Content */}
          <div className="flex flex-col gap-3

          sm:w-[568px]">

            <h1 className="text-3xl font-bold">Ready to share your story?</h1>

            <div>
              <p>Join our community of writers and reader. Create an account to start sharing your knowledge and connect with others.</p>
            </div>

          </div>

          {/* Signup Button */}
          <div className="flex flex-col gap-4 items-center
          
          md:flex-row justify-center">
            
            <button className="w-[264px]
            border rounded-md p-2 bg-slate-50 text-blue-500 font-semibold">
              Sign Up Now
            </button>

            <button className="w-[264px]
            border rounded-md p-2 font-semibold">
              Explore Blogs
            </button>

          </div>
          

        </div>
      
      </section>
   )
}
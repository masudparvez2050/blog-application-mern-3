export default function Recent() {
   return (
      <section className="w-full
        flex flex-col items-center gap-7 py-8">

          {/* Recent Heading */}
          <div className="flex justify-between items-center w-[95%]">
            <h1 className="text-3xl font-bold">Recent Posts</h1>
            <p><a href="#" className="text-blue-600 font-semibold">View All &rarr;</a></p>

          </div>

          {/* Recent Error Message */}
          <div className="w-[95%] flex bg-red-50 ">
            <div className="border-l-4 border-red-600"></div>
            <p className="text-red-700 px-3 py-2">
              Error loading featured posts. Showing fallback content.</p>
          </div>


          {/* Recent Card */}
          <div className="w-full
          flex flex-col items-center gap-8

          md:flex-row md:justify-center md:px-6
          
          xl:justify-evenly">
            
            {/* Card 1 */}
            <div className="w-[95%]
            flex flex-col gap-3
            rounded-lg shadow-md shadow-slate-500
            pb-4
            hover:translate-x-2 hover:-translate-y-2 hover:opacity-90 hover:cursor-pointer
            transform-gpu 

            xxs:w-96">

              {/* Card 1 Image */}
              <div className="h-[180px] bg-cover rounded-t-lg
              bg-[url(https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)] bg-no-repeat">  
              </div>

              {/* Card 1 Content */}
              <div className="w-[95%] flex flex-col self-center gap-1
              
              xxs:px-1
              
              md:px-2">

                {/* Card 1 Content Tags */}
                <div className="flex flex-wrap gap-3">

                  <div className="                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">Database</p>
                  </div>

                  <div className="                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">Node.js</p>
                  </div>

                </div>

                {/* Card 1 Content Title */}
                <div>
                  <h2 className="text-xl font-bold">Introduction to MongoDB with Node.js</h2>
                </div>

                {/* Card 1 Content Description */}
                <div>
                  <p>Learn how to connect a Node.js application to MongoDB and perform CRUD operations.</p>
                </div>

                {/* Card 1 Content Author */}
                <div className="flex w-full">

                  {/* Card 1 Content Author: Image */}
                  <div className="h-16 
                  flex flex-0.3 justify-start items-center">

                    <div className="h-[45px] w-[45px] rounded-full
                    bg-gradient-to-r from-green-900 to-green-400"></ div>

                  </div>

                  {/* Card 1 Content Author: Name & Date */}
                  <div className="w-full h-16 
                  flex flex-1.7 flex-col justify-center
                  pl-3">

                    <div>
                      <p>Michael Brown</p>
                    </div>

                    <time datetime="2025-04-12">
                      April 12, 2025
                    </time>

                  </div>

                </div>
                
              </div>

            </div>

            {/* Card 2 */}
            <div className="w-[95%]
            flex flex-col gap-3
            rounded-lg shadow-md shadow-slate-500
            pb-4
            xxs:w-96">

              {/* Card 2 Image */}
              <div className="h-[180px] bg-no-repeat rounded-t-lg
              bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')]">  
              </div>

              {/* Card 2 Content */}
              <div className="w-[95%] flex flex-col self-center gap-1
              
              xxs:px-1
              
              md:px-2">

                {/* Card 2 Content Tags */}
                <div className="flex flex-wrap gap-3">

                  <div className="                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">Web Development</p>
                  </div>

                  <div className="                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">CSS</p>
                  </div>

                </div>

                {/* Card 2 Content Title */}
                <div>
                  <h2 className="text-xl font-bold">Building Responsive layouts with Tailwind CSS</h2>
                </div>

                {/* Card 2 Content Description */}
                <div>
                  <p>Discover how to create beautiful and responsive designs using Tailwind CSS utility classes.</p>
                </div>

                {/* Card 2 Content Author */}
                <div className="flex w-full">

                  {/* Card 2 Content Author: Image */}
                  <div className="h-16 
                  flex flex-0.3 justify-start items-center">
                    <div className="h-[45px] w-[45px] rounded-full
                    bg-gradient-to-r from-green-900 to-green-400"></ div>
                  </div>

                  {/* Card 2 Content Author: Name & Date */}
                  <div className="w-full h-16 
                  flex flex-1.7 flex-col justify-center
                  pl-3">
                    <div>
                      <p>Sarah Davis</p>
                    </div>
                    <time datetime="2025-04-10">
                      April 10, 2025
                    </time>
                  </div>
                </div>
                
              </div>

            </div>

            {/* Card 3 */}
            <div className="w-[95%]
            flex flex-col gap-3
            rounded-lg shadow-md shadow-slate-500
            pb-4
            xxs:w-96">

              {/* Card 3 Image */}
              <div className="h-[180px] bg-cover rounded-t-lg
              bg-[url(https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)] bg-no-repeat">  
              </div>

              {/* Card 3 Content */}
              <div className="w-[95%] flex flex-col self-center gap-1
              
              xxs:px-1
              
              md:px-2">

                {/* Card 3 Content Tags */}
                <div className="flex flex-wrap gap-3">

                  <div className="                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">JavaScript</p>
                  </div>

                  <div className="                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">Web Development</p>
                  </div>

                </div>

                {/* Card 3 Content Title */}
                <div>
                  <h2 className="text-xl font-bold">JavaScript Best Practices in 2025</h2>
                </div>

                {/* Card 3 Content Description */}
                <div>
                  <p>Stay up to date with the latest JavaScript best practices and coding patterns.</p>
                </div>

                {/* Card 3 Content Author */}
                <div className="flex w-full">

                  {/* Card 3 Content Author: Image */}
                  <div className="h-16 
                  flex flex-0.3 justify-start items-center">

                    <div className="h-[45px] w-[45px] rounded-full
                    bg-gradient-to-r from-green-900 to-green-400"></ div>
                  </div>

                  {/* Card 3 Content Author: Name & Date */}
                  <div className="w-full h-16 
                  flex flex-1.7 flex-col justify-center
                  pl-3">

                    <div>
                      <p>David Wilson</p>
                    </div>

                    <time datetime="2025-04-08">
                      April 08, 2025
                    </time>

                  </div>
                  
                </div>
                
              </div>

            </div>

          </div>

        </section>
   )
}
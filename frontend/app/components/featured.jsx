export default function Featured() {
   return (
      <section className=" w-full
        flex flex-col items-center gap-7 py-8">

          {/* Featured Heading */}
          <div className="flex justify-between items-center w-[95%]">
            <h1 className="text-3xl font-bold">Featured Posts</h1>
            <p><a href="#" className="text-blue-600 font-semibold">View All &rarr;</a></p>

          </div>

          {/* Featured Error Message */}
          <div className="w-[95%] flex bg-red-50">
            <div className="border-l-4 border-red-600"></div>
            <p className="text-red-700 px-3 py-2">
              Error loading featured posts. Showing fallback content.</p>
          </div>


          {/* Featured Card */}
          <div className="w-full
          flex flex-col items-center gap-10

          md:flex-row md:justify-center md:px-6
          
          xl:justify-evenly">
            
            {/* Card 1 */}
            <div className="w-[95%]
            flex flex-col gap-3
            rounded-lg shadow-md shadow-slate-500
            pb-4
            xxs:w-96">

              {/* Card 1 Image */}
              <div className="rounded-t-lg h-[180px] bg-cover bg-[url(https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)] bg-no-repeat bg-center">
              </div>

              {/* Card 1 Content */}
              <div className="w-[95%] flex flex-col self-center gap-1
              
              xxs:px-1
              
              md:px-2">

                {/* Card 1 Content Tags */}
                <div className="flex flex-wrap gap-3">

                  <div className="
                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">Web Development</p>
                  </div>

                  <div className="
                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">React</p>
                  </div>

                </div>

                {/* Card 1 Content Title */}
                <div>
                  <h2 className="text-xl font-bold">Getting Started with Next.js</h2>
                </div>

                {/* Card 1 Content Description */}
                <div>
                  <p>Learn the basics of Next.js and how to build modern web applications with React.</p>
                </div>

                {/* Card 1 Content Author */}
                <div className="flex w-full">

                  {/* Card 1 Content Author: Image */}
                  <div className="h-16 
                  flex flex-0.3 justify-start items-center">

                    <div className="h-[45px] w-[45px] rounded-full
                    bg-gradient-to-r from-green-900 to-green-400"></div>

                  </div>

                  {/* Card 1 Content Author: Name & Date */}
                  <div className="w-full h-16 
                  flex flex-1.7 flex-col justify-center
                  pl-3">

                    <div>
                      <p>John Doe</p>
                    </div>

                    <time datetime="2025-04-20">
                      April 20, 2025
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
              <div className="rounded-t-lg h-[180px] bg-cover bg-[url(https://images.unsplash.com/photo-1655720031554-a929595ffad7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)] bg-no-repeat bg-center">  
              </div>

              {/* Card 2 Content */}
              <div className="w-[95%] flex flex-col self-center gap-1
              
              xxs:px-1
              
              md:px-2">

                {/* Card 2 Content Tags */}
                <div className="flex flex-wrap gap-3">

                  <div className="
                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">AI</p>
                  </div>

                  <div className="
                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">Technology</p>
                  </div>

                </div>

                {/* Card 2 Content Title */}
                <div>
                  <h2 className="text-xl font-bold">The Future of AI in Content Creation</h2>
                </div>

                {/* Card 2 Content Description */}
                <div>
                  <p>Explore how artificial intelligence is transforming the way we create and consume content online.</p>
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
                      <p>Jane Smith</p>
                    </div>

                    <time datetime="2025-04-18">
                      April 18, 2025
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
              <div className="rounded-t-lg h-[180px] bg-cover bg-[url(https://images.unsplash.com/photo-1621839673705-6617adf9e890?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80)] bg-no-repeat bg-center">
              </div>

              {/* Card 3 Content */}
              <div className="w-[95%] flex flex-col self-center gap-1
              
              xxs:px-1
              
              md:px-2">

                {/* Card 3 Content Tags */}
                <div className="flex flex-wrap gap-3">

                  <div className="
                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">Web Development</p>
                  </div>

                  <div className="
                  rounded-full px-1 
                  bg-blue-100">
                    <p className="text-blue-800">CSS</p>
                  </div>

                </div>

                {/* Card 3 Content Title */}
                <div>
                  <h2 className="text-xl font-bold">Mastering CSS Grid Layout</h2>
                </div>

                {/* Card 3 Content Description */}
                <div>
                  <p>A comprehensive guide to using CSS Grid for complex and responsive web layouts.</p>
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
                      <p>Alex johnson</p>
                    </div>

                    <time datetime="2025-04-15">
                      April 15, 2025
                    </time>

                  </div>

                </div>
                
              </div>

            </div>

          </div>

        </section>
   )
}
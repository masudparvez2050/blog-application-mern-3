export default function Contact() {
   return (
      <section className="w-full
        flex justify-center">

          {/* Contact Container */}
          <div className="w-[95%] border-b-2
          flex flex-col gap-8
          py-8
          
          md:flex-row md:justify-start md:gap-6">

            {/* Contact BlogApp */}
            <div className="flex flex-col gap-2
            
            md:flex-[1.6]
            md:pr-6">
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-pink-600">BlogApp</h3>
              <p>A modern blog platform for readers and writers. Share your thoughts, read interesting, and connect with writers.</p>
            </div>

            {/* Contact Quick Links */}
            <div className="flex flex-col gap-2
            
            md:flex-[0.8]">
              <h4 className="font-semibold">QUICK LINKS</h4>
              <ul>
                <li><a href="#">All Blogs</a></li>
                <li><a href="#">Write a Blog</a></li>
                <li><a href="#">Dashboard</a></li>
              </ul>
            </div>

            {/* Contact Legal */}
            <div className="flex flex-col gap-2
            
            md:flex-[0.8]">
              <h4 className="font-semibold">LEGAL</h4>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>

          </div>

        </section>
   )
}
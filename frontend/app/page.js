import Header from './components/header'
import Hero from './components/hero'
import Featured from './components/featured'
import Recent from './components/recent'
import Signup from './components/signup'
import Contact from './components/contact'
import Footer from './components/footer'

export default function Home() {
  return <main className="min-h-screen
          bg-white
          bg-gradient-to-b from-slate-50 to-slate-100">
    {/* Header Section */}
    <Header />

      {/* Main Area */}
      <main className="mx-auto px-2
      flex flex-col gap-10 items-center
      
      2xl:max-w-screen-2xl">

        {/* Hero Section */}
        <Hero />

        {/* Featured Section */}
        <Featured />
        
        {/* Recent Section */}
        <Recent />
        
        {/* Sign Up Section */}
        <Signup />

        {/* Contact Section */}
        <Contact />
        
        {/* Footer Section */}
        <Footer />
        
      </main>

  </main>
}
export default function Header() {
   return (
      <header className="h-20
      bg-indigo-50
      mb-10 my-1">

        {/* Header Container */}
        <div className="w-[95%] h-full 
        flex
        mx-auto px-3
        
        2xl:max-w-[1460px]">

          {/* Header Logo */}
          <div className="h-full w-2/4
          flex items-center">

            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              BlogApp
            </p>

          </div>

          {/* Header Navigation Bar */}
          <div className="h-full w-2/4
          flex justify-end items-center">
            

            <i className="fa-solid fa-bars text-xl"></i>

          </div>

        </div>

      </header>
   )
}
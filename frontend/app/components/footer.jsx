export default function Footer() {
   return (
      <footer className="w-full py-8
        bg-slate-50
        flex flex-col items-center gap-2">

          <div className="flex gap-4">

            <a className="hover:text-[#1877F2]"
            href="#"><i class="fa-brands fa-facebook"></i></a>

            <a className="hover:text-[#1DA1F2]"
            href="#"><i class="fa-brands fa-twitter"></i></a>
            
            <a className="hover:text-[#cea5fb]"
            href="#"><i class="fa-brands fa-github"></i></a>
          </div>

          <div className="text-slate-500 font-semibold">
            &copy; 2025 BlogApp. All rights reserved.
          </div>

        </footer>
   )
}
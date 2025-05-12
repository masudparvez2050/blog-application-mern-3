"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloationgButton from "./FloationgButton";
import Toast from "./Toast";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.includes("admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        {children}
        {!isAdmin && <FloationgButton />}
      </main>
      {!isAdmin && <Footer />}
      <Toast />
    </>
  );
}

import Link from "next/link";
import { useRouter } from "next/router"; // 1. Router import kiya
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter(); // 2. Router initialize kiya

  // 3. Check karo ki abhi hum kis page par hain
  // Agar URL mein "/login" hai, to isLoginPage true hoga
  const isLoginPage = router.pathname.startsWith("/login");
  
  // Agar URL mein "/register" hai, to isRegisterPage true hoga
  const isRegisterPage = router.pathname.startsWith("/register");

  return (
    <header className="flex justify-between items-center p-4 bg-black text-white">
      <Link href="/" className="font-bold text-xl">
        Journal
      </Link>
      
      <nav className="space-x-6 hidden md:block">
        <Link href="/teaching" className="hover:text-gray-300">Teaching</Link>
        <Link href="/training" className="hover:text-gray-300">Training</Link>
        <Link href="/research" className="hover:text-gray-300">Research</Link>
      </nav>

      {user ? (
        /* Agar User Logged In hai */
        <div className="flex items-center space-x-4">
          <span className="text-sm">Welcome, {user.name}</span>
          <button 
            onClick={logout} 
            className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        /* Agar User Logged Out hai */
        <div className="flex items-center space-x-4">
          
          {/* LOGIN BUTTON: Sirf tab dikhega jab hum Login page par NAHI hain */}
          {!isLoginPage && (
            <Link href="/login/student">
              <span className="cursor-pointer hover:text-gray-300">Login</span>
            </Link>
          )}

          {/* SIGN UP BUTTON: Sirf tab dikhega jab hum Register page par NAHI hain */}
          {!isRegisterPage && (
            <Link href="/register/student">
              <span className="bg-white text-black px-4 py-2 rounded font-medium hover:bg-gray-200 transition cursor-pointer">
                Sign Up
              </span>
            </Link>
          )}
          
        </div>
      )}
    </header>
  );
}
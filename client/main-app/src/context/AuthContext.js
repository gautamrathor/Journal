import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Loading state true rakho taaki pehle check kare phir UI dikhaye
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    // Ye code ab sirf browser me chalega
    const checkUser = () => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData && userData !== "undefined") {
          setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
      } catch (error) {
        console.error("Error reading auth data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false); // Checking khatam
      }
    };

    checkUser();
  }, []); // Empty dependency array = Sirf first load par chalega

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login/student"); // Logout ke baad redirect
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Jab tak loading hai, kuch mat dikhao ya spinner dikhao */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
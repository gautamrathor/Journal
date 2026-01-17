import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { register } from "@/services/apiService";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { user } = useAuth(); // Sirf user check karne ke liye
  const { role } = router.query;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // 1. Agar user pehle se logged in hai, to dashboard bhej do
  useEffect(() => {
    if (user) {
      router.push(`/${user.role}/dashboard`);
    }
  }, [user, router]);

  // 2. Invalid Role Check
  useEffect(() => {
    if (role && role !== "student" && role !== "tutor") {
      router.push("/");
    }
  }, [role, router]);

  // Input Handle karne ka common function
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      // API Call: role bhi bhejna zaroori hai
      const response = await register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        role: role // URL se role liya (student/tutor)
      });

      if (response.data.success) {
        toast.success("Account Created Successfully!", { id: toastId });
        
        // IMPORTANT: Logic for Tutor vs Student
        if (role === "tutor") {
          // Tutor ko approval chahiye, so login mat karao directly
          toast("Please wait for Admin approval before logging in.", {
             icon: '⏳',
             duration: 5000 
          });
          setTimeout(() => router.push("/login/tutor"), 3000);
        } else {
          // Student direct login page par ja sakta hai
          setTimeout(() => router.push("/login/student"), 2000);
        }
      }
    } catch (err) {
      console.error("Register Error:", err);
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const displayRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Toaster position="top-center" />
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
          <p className="text-gray-500">
            Join as a <span className="font-semibold text-blue-600">{displayRole}</span>
          </p>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-4">
          
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-2 rounded-lg text-white font-semibold shadow-md transition-all duration-200 ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href={`/login/${role}`}>
            <span className="text-blue-600 font-medium hover:underline cursor-pointer">Login here</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
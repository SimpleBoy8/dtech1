import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [isSignup, setIsSignup] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isSignup ? "/auth/signup" : "/auth/login";
      const payload = isSignup
        ? form
        : { email: form.email, password: form.password };

      const res = await API.post(endpoint, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="flex justify-between p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold">DTECH</h1>
        <div className="space-x-4">
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <section className="grid md:grid-cols-2 min-h-[90vh]">
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-5xl font-bold mb-4">Modern Digital Solutions</h2>
          <p className="text-gray-300 mb-6">
            Build premium web apps, dashboards, and real-time communication systems.
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-xl w-fit">
            Explore Services
          </button>
        </div>

        <div className="flex items-center justify-center p-10">
          <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
          >
            <h3 className="text-2xl font-bold mb-6">
              {isSignup ? "Create Account" : "Login"}
            </h3>

            {isSignup && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 mb-4 rounded bg-zinc-800"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded bg-zinc-800"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 rounded bg-zinc-800"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <button className="w-full bg-white text-black py-3 rounded-xl font-semibold">
              {isSignup ? "Sign Up" : "Login"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-400">
              {isSignup ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => setIsSignup(!isSignup)}
                className="ml-2 text-white underline"
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Home;
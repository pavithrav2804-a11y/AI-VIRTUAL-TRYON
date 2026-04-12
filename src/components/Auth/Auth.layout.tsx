import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A]">

      <div className="flex min-h-screen">

        {/* LEFT SIDE (Image + Gradient Overlay) */}
        <div className="hidden md:flex w-1/2 relative overflow-hidden">

          {/* IMAGE */}
          <img
            src="./src/assets/login-bg.png"
            alt="AI Wardrobe"
            className="absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-500 hover:scale-105"
          />

          {/* GRADIENT OVERLAY (black → purple right to left) */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-purple-900/40 to-transparent"></div>

          {/* TEXT */}
          <div className="absolute bottom-50 left-10 text-white z-10 max-w-sm">
            <h2 className="text-3xl font-bold">
              AI Powered Styling
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              Discover outfits based on your skin tone, body type & trends.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6">
          <Outlet />
        </div>

      </div>
    </div>
  )
}

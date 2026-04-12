import { Separator } from "../ui/separator"
import Feature from "./Feature"
import Footer from "./Footer"

export default function Home() {
  return (
    <div className="relative">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/hero-bg.png"
          alt="hero"
          className="w-full h-full object-cover"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#0F172A]/80 to-purple-900/60"></div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto flex flex-col gap-8">

          {/* HEADING */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Try Clothes
            </h1>

            <h2 className="text-white text-3xl sm:text-4xl font-extrabold mt-2">
              Virtually with AI
            </h2>
          </div>

          {/* DESCRIPTION */}
          <div className="max-w-2xl">
            <p className="text-gray-300 mt-4 text-sm sm:text-base leading-relaxed">
              Experience the future of fashion with our AI-powered virtual try-on.
              See how clothes fit and look on you without stepping into a store.
            </p>

            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              Upload any outfit. See it on yourself instantly. Discover AI-curated
              accessories and styles matched to your body type, skin tone, and aesthetic.
            </p>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="border border-gray-400 text-white px-5 py-2.5 rounded-lg hover:bg-white/10 transition">
              Learn More
            </button>

            <button className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-lg hover:opacity-90 transition">
              Try Now
            </button>
          </div>

          <Separator className="bg-white/20" />

        </div>
      </div>

      {/* FEATURES */}
      <div className="relative z-10">
        <Feature />
      </div>

      <Separator className="bg-white/10" />

      {/* FOOTER */}
      <Footer />

    </div>
  )
}

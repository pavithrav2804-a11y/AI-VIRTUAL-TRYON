import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)

  return (
    <div className="w-full flex items-center justify-center">

      <Card className="w-full max-w-md sm:max-w-lg p-5 sm:p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl">

        {/* HEADER */}
        <div className="mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {isSignup
              ? "Start your AI wardrobe journey"
              : "Login to continue"}
          </p>
        </div>

        {/* TOGGLE */}
        <div className="flex mb-5 bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setIsSignup(false)}
            className={`w-1/2 py-2 text-sm sm:text-base rounded-lg font-medium transition ${
              !isSignup
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                : "text-gray-400"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsSignup(true)}
            className={`w-1/2 py-2 text-sm sm:text-base rounded-lg font-medium transition ${
              isSignup
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                : "text-gray-400"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <form className="space-y-4">

          {/* NAME */}
          {isSignup && (
            <div>
              <Label className="text-gray-300 text-sm">Name</Label>
              <Input
                placeholder="Enter your name"
                className="mt-1 bg-gray-900 border border-gray-700 text-white focus:border-purple-500"
              />
            </div>
          )}

          {/* EMAIL */}
          <div>
            <Label className="text-gray-300 text-sm">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email"
              className="mt-1 bg-gray-900 border border-gray-700 text-white focus:border-purple-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <Label className="text-gray-300 text-sm">Password</Label>
            <Input
              type="password"
              placeholder="Enter your password"
              className="mt-1 bg-gray-900 border border-gray-700 text-white focus:border-purple-500"
            />
          </div>

          {/* BUTTON */}
          <Button className="w-full mt-4 py-2.5 sm:py-3 sm:max-w-full sm:w-40 sm:justify-center sm:flex text-white font-semibold rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90 transition">
            {isSignup ? "Create Account" : "Login"}
          </Button>

          {/* FOOTER */}
          <p className="text-center text-gray-400 text-xs sm:text-sm mt-4">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="ml-2 underline text-purple-400 cursor-pointer hover:underline"
            >
              {isSignup ? "Login" : "Sign Up"}
            </span>
          </p>
        </form>

      </Card>
    </div>
  )
}

import { Button } from "../ui/button"

// import {useNavigate }from "react-router-dom"
export default function Navbar() {
    // const navigate = useNavigate()
    return(<>
    <div className=" sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        <h1 className="text-white font-bold text-xl">Aura Outify</h1>
        <div className="hidden md:flex space-x-8 text-gray-300">
            <a href="#" className="hover:text-white transition">Features</a>
            <a href="#" className="hover:text-white transition">Pricing</a>
            <a href="#" className="hover:text-white transition">About</a>
        </div>
        <div className="flex gap-4" >        
            <Button variant="outline" onClick={()=>navigate('/login')}>Log In</Button>
            <Button variant="default" className=" border border-white shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-purple-600 px-4 py-2 rounded-lg" onClick={()=>navigate('/signup')}>Start Try-on</Button>
        </div>
    </div>
    </div>
    </>)
}
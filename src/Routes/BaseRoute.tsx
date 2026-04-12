import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AuthLayout from "../components/Auth/Auth.layout"
import Login from "../components/Auth/Login.auth"
import Home from "@/components/Dashboard/Home"
import DashboardLayout from "@/components/App-Dashboard/dashlayout"
import Dashboard from "@/components/App-Dashboard/section"
import Wardrobe from "@/components/App-Dashboard/wardrobe"
import Accessories from "@/components/App-Dashboard/accesories"
import Trends from "@/components/App-Dashboard/trends"
import Upload from "@/components/App-Dashboard/uploader"
import Settings from "@/components/App-Dashboard/settings"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route index element={<Login />} />       
          <Route path="login" element={<Login />} />
        </Route>

        <Route path="/home" element={<Home />} /> 

        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="wardrobe" element={<Wardrobe />} />
          <Route path="accessories" element={<Accessories />} />
          <Route path="trends" element={<Trends />} />
          <Route path="upload" element={<Upload />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#020617]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto lg:pl-64">
        <Outlet />
      </div>

    </div>
  )
}

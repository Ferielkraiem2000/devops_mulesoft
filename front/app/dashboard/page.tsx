"use client";
import ProfileModal from "@/components/profileModal";
import axios from "axios";
import { ChevronRight, ChevronLeft } from "lucide-react";
import React, { useState } from "react";
import { FaHome, FaBoxOpen, FaCog, FaSearch, FaUser, FaSignOutAlt, FaUserCircle, FaUsersCog } from "react-icons/fa";
import Swal from "sweetalert2";

export default function DashboardPage() {
    const [openProfile, setOpenProfile] = useState(false);
    const [user, setUser] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
  const handleProfileClick = async () => {
    try {
      const token = localStorage.getItem("token");  

  
      if (!token) {
        console.error("Token not found, redirecting to login...");
        return;
      }
  
      const response = await axios.get("http://localhost:4000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,  
        },
      });
  
      console.log("User Profile:", response.data);

      setUser(response.data);

      setOpenProfile(true);
  
    } catch (error) {
      console.error("Error fetching user profile:", error);
  

    }
  };


  const handleCloseProfile = () => {
    setOpenProfile(false);
  };
   function confirmLogout(handleLogout:any) {
        Swal.fire({
          title: "Êtes-vous sûr(e) de vouloir vous déconnecter ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Oui",
          cancelButtonText: "Non",
          customClass: {
            popup: "swal-custom-size", 
          },
        }).then((result) => {
          if (result.isConfirmed) {
            handleLogout(); 
          } else {
            console.log("Déconnexion annulée");
          }
        });
      }
      
      const handleLogout = () => {
        localStorage.removeItem("token"); 
        window.location.href = "/signin";
      };
  return (
    <div className="flex min-h-screen bg-gray-100 flex-col">
    <div className="flex">
{/* Sidebar */}
<div
className={`${
  isCollapsed ? "w-16" : "w-64"
} bg-gray-600 text-white h-screen transition-all duration-300 flex flex-col justify-between`}
>
{/* Top Section */}
<div>
  <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
    {!isCollapsed }
    <button
      onClick={() => setIsCollapsed(!isCollapsed)}
      className="text-gray-300 hover:text-white focus:outline-none"
    >
      {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
    </button>
  </div>

  {/* Sidebar Content */}
  <div className="p-4 space-y-6">
            <div className="flex items-center">
              <a href="/dashboard" className="flex items-center space-x-4 text-white hover:text-blue-500">
                <FaHome className="text-2xl" />             
              {!isCollapsed && <span className="ml-4">Accueil</span>}
              </a>
            </div>
    <div className="flex items-center">
      <a href="/orders"  className="flex items-center space-x-4 text-white hover:text-blue-500">
        <FaBoxOpen className="text-2xl" />
      
      {!isCollapsed && <span className="ml-4">Commandes</span>}</a>
    </div>
    {/* <div className="flex items-center">
    
        <FaCog className="text-white hover:text-blue-500 text-2xl" />
      {!isCollapsed && <span className="ml-4">Vos commandes</span>}
    </div> */}
        <div className="flex items-center">
          <a href="/users" className="flex items-center space-x-4 text-white hover:text-blue-500">
            <FaUsersCog className="text-2xl" />
            {!isCollapsed && <span className="ml-4">Clients</span>}
          </a>
        </div>    
  </div>
</div>

{/* Bottom Section */}
        <div className="p-4 space-y-4">
  <div className="flex items-center">
    <button
      className="flex items-center space-x-4 text-white hover:text-blue-500 focus:outline-none"
      onClick={handleProfileClick}
    >
      <FaUserCircle className="text-2xl" />
      {!isCollapsed && <span>Profil</span>}
    </button>
  </div>
  <div className="flex items-center">
    <button
      className="flex items-center space-x-4 text-white hover:text-red-500 focus:outline-none"
      onClick={() => confirmLogout(handleLogout)}
    >
      <FaSignOutAlt className="text-2xl" />
      {!isCollapsed && <span>Déconnexion</span>}
    </button>
  </div>
</div>
{user && (
<ProfileModal open={openProfile} onClose={handleCloseProfile} user={user} />
)}
</div>
</div>
</div>
    
  );
}

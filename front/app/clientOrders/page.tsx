"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaClipboardList,
  FaHome,
  FaSearch,
  FaShoppingCart,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { ChevronLeft, ChevronRight, Folder } from "lucide-react";
import ProfileModal from "@/components/profileModal";
import Swal from "sweetalert2";
import { Link } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const clientOrders = () => {
  
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  let [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredOrders = orders.filter((order) =>
    Object.values(order).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);
  const [openProfile, setOpenProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const customerId = localStorage.getItem("customerId");

    const fetchClientOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/client-orders/${customerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.orders) {
          setOrders(response.data.orders);
        } else {
          setError("Aucune commande trouvée pour ce client.");
        }
      } catch (err: any) {
        setError(err.message || "Une erreur s'est produite lors du chargement des commandes.");
      }
    };

    if (customerId) {
      fetchClientOrders();
    } else {
      setError("Aucun ID client trouvé.");
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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
        localStorage.removeItem("token"); // Supprime le token du localStorage
        window.location.href = "/signin"; // Redirige vers la page de connexion
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
              <a href="/configDownloader" className="flex items-center space-x-4 text-white hover:text-blue-500">
                <FaHome className="text-2xl" />             
              {!isCollapsed && <span className="ml-4">Accueil</span>}
              </a>
            </div>
            <div className="flex items-center">
    <a href="/bookOrder" className="flex items-center space-x-4 text-white hover:text-blue-500">
      <FaShoppingCart className="text-2xl" />
      {!isCollapsed && <span>Commander pipeline</span>}
    </a>
  </div>
            <div className="flex items-center">
              <a href="/clientOrders" className="flex items-center space-x-4 text-white hover:text-blue-500">
                <FaClipboardList className="text-2xl" />
        
              {!isCollapsed && <span className="ml-4">Commandes</span>}
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
        

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-6">
            {/* Search Section */}
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold" style={{ color: "black" }}>
                Commandes
              </h1>
              <div className="relative">
                <FaSearch className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 pl-10"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3 border" style={{ color: "black" }}>Outil CI/CD</th>
                    <th className="p-3 border" style={{ color: "black" }}>Type d'hébergement</th>
                    <th className="p-3 border" style={{ color: "black" }}>Outil de monitoring</th>
                    <th className="p-3 border" style={{ color: "black" }}>Outil d'hébergement des JARs</th>
                    <th className="p-3 border" style={{ color: "black" }}>Statut</th>
                    <th className="p-3 border" style={{ color: "black" }}>Dépôt</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrders.length > 0 ? (
                    currentOrders.map((order: any, index: number) => (
                      <tr
                      key={index}
                      className={`hover:bg-gray-100 ${
                          order.status === "annulée" ? "bg-red-100" : ""
                      }`}
                  >
                        <td className="p-3 border text-gray-500">{order.versioningTool || "Non choisi"}</td>
                        <td className="p-3 border text-gray-500">{order.hostingType || "Non choisi"}</td>
                        <td className="p-3 border text-gray-500">{order.monitoringTool || "Non choisi"}</td>
                        <td className="p-3 border text-gray-500">{order.hostingJarTool || "Non choisi"}</td>
                        <td className="p-3 border text-gray-500 w-40 whitespace-nowrap text-center">
  <span
    className={`py-1 px-3 rounded inline-block ${
      order.status === "en attente"
        ? "bg-yellow-500 text-white"
        : order.status === "annulée"
        ? "bg-red-500 text-white"
        : "bg-green-500 text-white"
    }`}
  >
    {order.status}
  </span>
</td>


{order.repo && order.versioningTool &&order.hostingType && order.monitoringTool && order.hostingJarTool && (
  <td className="p-3 border text-gray-500">
    <a 
      href={order.repo} 
      download 
      className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md transition-all max-w-[250px] truncate"
      title={`Télécharger le fichier ZIP: ${order.versioningTool}/${order.hostingType}/${order.monitoringTool}/${order.hostingJarTool}`}
    >
      <Folder className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">
        {`${order.versioningTool}/${order.hostingType}/${order.monitoringTool}/${order.hostingJarTool}`}
      </span>
    </a>
  </td>
)}
{order.repo && order.versioningTool &&order.hostingType && !order.monitoringTool && !order.hostingJarTool && (
  <td className="p-3 border text-gray-500">
    <a 
      href={order.repo} 
      download 
      className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md transition-all max-w-[250px] truncate"
      title={`Télécharger le fichier ZIP: ${order.versioningTool}/${order.hostingType}`}
    >
      <Folder className="w-5 h-5 flex-shrink-0" />
      <span className="truncate">
        {`${order.versioningTool}/${order.hostingType}`}
      </span>
    </a>
  </td>
)}




{!order.repo && order.status !== "annulée" && (
  <td className="p-3 border text-gray-500">La commande n'a pas encore été acceptée</td>
)}
{!order.repo && order.status== "annulée" && (
  <td className="bg-red-100 text-gray-100 cursor-not-allowed"></td>
)}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-3 border text-center">
                        Aucune commande trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <div className="mt-4 flex justify-center space-x-2 items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default clientOrders;

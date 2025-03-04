"use client"
import ProfileModal from "@/components/profileModal";
import { Typography } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaBoxOpen,
  FaCog,
  FaSearch,
  FaUser,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
  FaUsersCog,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconInfoCircle } from '@tabler/icons-react';
import { FaFileArchive } from "react-icons/fa";
import ReactDOMServer from "react-dom/server"; 

function showAlertWithLink(repoUrl:any) {
  Swal.fire({
    title: "Commande Acceptée!",
    html: `Dossier avec config: <a href="${repoUrl}" target="_blank" style="color: blue; text-decoration: underline;">${repoUrl}</a>`,
    icon: "success",
    confirmButtonText: "OK",
  });
}
const OrdersPage = () =>  {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders: any = await getOrders();
      setOrders(fetchedOrders);
      setFilteredOrders(fetchedOrders);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) =>
      Object.values(order).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, orders]);

  const getCustomerName = async (customerId:any) => {
    try {
      console.log("id",customerId)
      const response = await axios.get(
        `http://localhost:4000/customer/${customerId}`
      );
      return response.data.customerName;
    } catch (error) {
      console.error("Error fetching customer name:", error);
      return "N/A";
    }
  };
  const getOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/orders"
      );
      const ordersWithCustomerNames = await Promise.all(
        response.data
        .filter((order:any) => order.status !== "annulée")
        .map(async (order:any) => {          
          const customerName = await getCustomerName(order.customerId);
          return { ...order, customerName };
        })
      );
      console.log(ordersWithCustomerNames);
      
      return ordersWithCustomerNames;
    } catch (error) {
      console.error("Error getting orders:", error);
      return [];
    }
  };
 
  // const handleAcceptOrder = async (orderId: string) => {
  //   setLoadingOrderId(orderId);
  //   try {
  //     const response = await axios.post(`http://localhost:4000/accept-order/${orderId}`);
  //     if (response.status === 200) {
  //       const updatedOrders: any = orders.map((o:any) =>
  //           o._id === orderId ? { ...o, status: "acceptée" } : o
  //       ); 
  //       setOrders(updatedOrders);
  //       setFilteredOrders(updatedOrders);   
  //     }
       
  //     console.log("Order accepted:", response.data);
  //     showAlertWithLink(`${response.data.repoUrl}`);
  //     // alert(`Order accepted! Repository URL: ${response.data.repoUrl}`);
  //   } catch (error) {
  //     console.error("Error accepting order:", error);
  //     alert("Error accepting order. Please try again.");
  //   } finally {
  //     setLoadingOrderId(null); 
  //   }
  // };
  
  // const handleAcceptOrder = async (orderId: string) => {
  //   setLoadingOrderId(orderId);
  //   try {
  //     const downloadUrl = `http://localhost:4000/get-config/${orderId}`;
  
  //     // Render JSX as HTML for SweetAlert
  //     const alertContent = ReactDOMServer.renderToString(
  //       <a
  //         href={downloadUrl}
  //         target="_blank"
  //         rel="noopener noreferrer"
  //         className="flex items-center space-x-3 text-blue-600 hover:text-blue-800"
  //       >
  //         <FaFileArchive className="text-yellow-500 text-4xl" />
  //         <span>Click to download configuration</span>
  //       </a>
  //     );
  
  //     // Show SweetAlert with clickable compressed folder icon
  //     Swal.fire({
  //       title: "Download Configuration",
  //       html: alertContent,
  //       showConfirmButton: false,
  //       allowOutsideClick: true,
  //     });
      
  //   } catch (error) {
  //     console.error("Error accepting order:", error);
  //     Swal.fire("Error", "Error accepting order. Please try again.", "error");
  //   } finally {
  //     setLoadingOrderId(null);
  //   }
  // };
  

  const handleAcceptOrder = async (orderId: string) => {
    setLoadingOrderId(orderId);
    try {
      const response = await fetch(`http://localhost:4000/get-config/${orderId}`);
      if (response.status === 200) {
        const updatedOrders: any = orders.map((o:any) =>
            o._id === orderId ? { ...o, status: "acceptée" } : o
        ); 
        setOrders(updatedOrders);
        setFilteredOrders(updatedOrders);   
      }
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to get configuration");
      }
  
      const downloadUrl = data.repo; 
  
      if (!downloadUrl) {
        throw new Error("No ZIP file available");
      }
  
      const alertContent = ReactDOMServer.renderToString(
        <div className="flex flex-col items-center space-y-2">
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-blue-600 hover:text-blue-800"
          >
            <FaFileArchive className="text-yellow-500 text-4xl" />
            <span className="text-lg font-semibold"> Cliquez pour télécharger la configuration. </span>
          </a>
        </div>
      );
  
      // Show SweetAlert with the returned ZIP file link
      Swal.fire({
        title: "Commande acceptée",
        html: alertContent,
        showConfirmButton: false,
        showCloseButton: true, // ✅ Ajoute la croix en haut à droite
        allowOutsideClick: true,
        customClass: { popup: "p-6" },
      });
    } catch (error:any) {
      console.error("Error accepting order:", error);
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoadingOrderId(null);
    }
  };
  
  function confirmDelete(handleCancelOrder:any,order: any) {
          Swal.fire({
            title: "Êtes-vous sûr(e) de vouloir annuler cette commande ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
            customClass: {
              popup: "swal-custom-size", 
            },
          }).then((result) => {
            if (result.isConfirmed) {
              handleCancelOrder(order); 
            } else {
              console.log("Suppression annulée");
            }
          });
        }
  const handleCancelOrder = async (order: any) => {
        try {
            const response = await axios.put(
                `http://localhost:4000/cancel-order/${order._id}`
            );
            if (response.status === 200) {
                const updatedOrders: any = orders.map((o:any) =>
                    o._id === order._id ? { ...o, status: "annulée" } : o
                );

                Swal.fire({
                  title: "Commande annulée avec succès !",
                  icon: "success",
                  confirmButtonText: "OK",
                  customClass: {
                    popup: "swal-custom-size",
                  },
        }).then((result) => {
          if (result.isConfirmed) {
            setOrders(updatedOrders);
            setFilteredOrders(updatedOrders);   
            window.location.reload();          
        } else {
            // console.log("Déconnexion annulée");
          }
        });;         

      }
        } catch (error) {
            console.error("Erreur lors de l'annulation de la commande :", error);
        }
    
};


  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
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
    const handleClientHover = async (client: any) => {
      try {
        Swal.fire({
          title: "Identifiants du Client",
          html: `<p><strong>Nom :</strong> ${client.name}</p><p><strong>Email :</strong> ${client.workEmail}</p><p><strong>Nom de l'Entreprise :</strong> ${client.companyName}</p><p><strong>Numéro de Téléphone :</strong> ${client.phoneNumber}</p>`,
          icon: "info",
          confirmButtonText: "Fermer",
          customClass: {
            popup: "swal-custom-size",
          },
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des identifiants du client :", error);
      }
    };
    
  
    return (
      <div className="flex min-h-screen bg-gray-100 flex-col ">
      <div className="flex h-screen">
<div
  className={`${
    isCollapsed ? "w-16" : "w-64"
  } bg-gray-600 text-white h-screen transition-all duration-300 flex flex-col justify-between`}
>
  <div>
    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700 ">
      {!isCollapsed }
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-gray-300 hover:text-white focus:outline-none"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>

    <div className="p-4 space-y-6 ">
            <div className="flex items-center">
              <a href="/dahsboard" className="flex items-center space-x-4 text-white hover:text-blue-500">
                <FaHome className="text-2xl" />             
              {!isCollapsed && <span className="ml-4">Accueil</span>}
              </a>
            </div>
      <div className="flex items-center ">
        <a href="/orders" className="flex items-center space-x-4 text-white hover:text-blue-500">
          <FaBoxOpen className="text-2xl" />
       
        {!isCollapsed && <span className="ml-4">Commandes</span>} </a>
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
                <th className="p-3 border" style={{ color: "black" }}>
                    Nom du Client
                  </th>
                  <th className="p-3 border" style={{ color: "black" }}>
                    Outil CI/CD
                  </th>
                  <th className="p-3 border" style={{ color: "black" }}>
                    Type d'hébergement
                  </th>
                  <th className="p-3 border" style={{ color: "black" }}>
                    Outil de monitoring
                  </th>
                  <th className="p-3 border" style={{ color: "black" }}>
                    Outil d'hébergement des JARs
                  </th>
                  <th className="p-3 border" style={{ color: "black" }}>
                    Décision
                  </th>
                  <th className="p-3 border" style={{ color: "black" }}>
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-100">
<td
  className="p-3 border text-gray-500 flex items-center space-x-2"
  style={{ cursor: "pointer", height: "72px" }}  
>
  <span>{order.customerId.name || "N/A"}</span>
  <IconInfoCircle
    className="text-gray-400 hover:text-blue-600"
    style={{ fontSize: "10px" }}
    onClick={() => handleClientHover(order.customerId)}
  />
</td>

                      <td className="p-3 border text-gray-500">
                        {order.versioningTool || "Non choisi"}
                      </td>
                      <td className="p-3 border text-gray-500">
                        {order.hostingType || "Non choisi"}
                      </td>
                      <td className="p-3 border text-gray-500">
                        {order.monitoringTool || "Non choisi"}
                      </td>
                      <td className="p-3 border text-gray-500">
                        {order.hostingJarTool || "Non choisi"}
                      </td>
                      <td className="p-3 border text-gray-500">
                        <div className="flex space-x-2">
                          {/* <button
                            onClick={() => handleAcceptOrder(order._id)}
                            className="bg-green-500 text-white py-1 px-3 rounded flex items-center"
                          >
                            <FaCheck className="mr-2" />
                          </button> */}
                      {/* <button
                            onClick={() => handleAcceptOrder(order)}
                            className={`${
                              order.status === "acceptée"
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-green-500"
                            } text-white py-1 px-3 rounded flex items-center`}                            disabled={order.status === "acceptée"}
                          >
                            {loading ? (
                              <FaSpinner className="animate-spin mr-2" />
                            ) : (
                              <FaCheck className="mr-2" />
                            )}
                            {loading ? "Loading..." : ""}
                          </button> */}
                                        <button
                onClick={() => handleAcceptOrder(order._id)}
                className={`${
                  order.status === "acceptée"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500"
                } text-white py-1 px-3 rounded flex items-center disabled:cursor-not-allowed`}
                disabled={order.status === "acceptée" || loadingOrderId === order._id} // Disable while loading
              >
                {loadingOrderId === order._id ? ( // Show spinner only for the specific order
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaCheck className="mr-2" />
                )}
                {/* {loadingOrderId === order._id ? "Loading..." : ""} */}
              </button>
                          <button
                            onClick={() => confirmDelete( handleCancelOrder,order)}
                            className={`${
                              order.status === "acceptée"
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-red-500"
                            } text-white py-1 px-3 rounded flex items-center disabled:cursor-not-allowed`}                            disabled={order.status === "acceptée" || loadingOrderId === order._id} // Disable while loading

                          >
                            <FaTimes className="mr-2" />
                          </button>
                        </div>
                      </td>
                      <td className="p-3 border text-gray-500 w-40 whitespace-nowrap text-center">
                        <span
                          className={`py-1 px-3 rounded inline-block ${
                            order.status === "en attente"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-3 border text-center">
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
      className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
      className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
    >
      &gt; 
    </button>
  </div>
) }
            </div>
          </div>
        </div>
      </div>
  );
}

export default OrdersPage;
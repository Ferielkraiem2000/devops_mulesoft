"use client"
import { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner, FaExclamationTriangle, FaBoxOpen, FaHome, FaSignOutAlt, FaUserCircle, FaUsersCog, FaTrash } from "react-icons/fa";
import ProfileModal from "@/components/profileModal";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Swal from "sweetalert2";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    axios.get("http://localhost:4000/users") 
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  }, []);

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
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout(); 
      }
    });
  }

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/signin";
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);


  const handleDeleteUser = (user: any) => {
    Swal.fire({
      title: "Êtes-vous sûr(e) de vouloir supprimer ce client ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",            
      customClass: {
        popup: "swal-custom-size", 
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Sending DELETE request to server
        console.log("userId",user._id);
        
        axios.delete(`http://localhost:4000/users/${user._id}`)
          .then(() => {
            // Update state to remove the deleted user
            setUsers((prevUsers) => prevUsers.filter((u:any) => u._id !== user._id));
            Swal.fire({
                title: "Supprimé!",
                text: "L'utilisateur a été supprimé.",
                icon: "success",
                customClass: { popup: "swal-custom-size" },
              });})
          .catch((error) => {
            // In case of an error, show an error message
            Swal.fire("Erreur", "Échec de la suppression", "error");
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
          });
      }
    });
  };
  
return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isCollapsed ? "w-16" : "w-64"} bg-gray-600 text-white h-screen transition-all duration-300 flex flex-col justify-between`}>
        <div>
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-300 hover:text-white">
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
          <div className="p-4 space-y-6">
            <a href="/" className="flex items-center space-x-4 text-white hover:text-blue-500">
              <FaHome className="text-2xl" /> {!isCollapsed && <span>Accueil</span>}
            </a>
            <a href="/orders" className="flex items-center space-x-4 text-white hover:text-blue-500">
              <FaBoxOpen className="text-2xl" /> {!isCollapsed && <span>Commandes</span>}
            </a>
            <a href="/users" className="flex items-center space-x-4 text-white hover:text-blue-500">
              <FaUsersCog className="text-2xl" /> {!isCollapsed && <span>Clients</span>}
            </a>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <button className="flex items-center space-x-4 text-white hover:text-blue-500" onClick={handleProfileClick}>
            <FaUserCircle className="text-2xl" /> {!isCollapsed && <span>Profil</span>}
          </button>
          <button className="flex items-center space-x-4 text-white hover:text-red-500" onClick={() => confirmLogout(handleLogout)}>
            <FaSignOutAlt className="text-2xl" /> {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </div>
      {/* Main Content */}
     <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-500">Clients</h1>
        {loading && (
          <div className="flex items-center space-x-2 text-blue-500">
            <FaSpinner className="animate-spin" /> <span>Chargement...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center text-red-500">
            <FaExclamationTriangle className="mr-2" /> {error}
          </div>
        )}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentUsers.map((user:any) => (
              <div key={user._id} className="bg-white p-4 rounded-lg shadow border flex justify-between items-center">
                <div>
                  <h2 className="text-lg text-gray-700 font-bold">{user.name}</h2>
                  <p className="text-gray-600">🏢 {user.companyName}</p>                  
                  <p className="text-gray-600">📞 {user.phoneNumber}</p>
                  <p className="text-gray-600">✉️ <a href={`mailto:${user.workEmail}`} className="text-blue-500">{user.workEmail}</a></p>                
                </div>
                <button 
        onClick={() => handleDeleteUser(user)} 
        className="text-red-500 hover:text-red-700 self-start"
      >
        <FaTrash />
      </button>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-center space-x-2 items-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-gray-400 px-3 py-1 rounded disabled:opacity-35"
          >
            &lt;
          </button>
          {/* <span>Page {currentPage} / {Math.ceil(users.length / usersPerPage)}</span> */}
          {Array.from({ length: Math.ceil(users.length/usersPerPage) }, (_, index) => index + 1).map((page) => (
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
  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(users.length / usersPerPage)))}
  disabled={currentPage === Math.ceil(users.length / usersPerPage)}
  className="bg-gray-400 px-3 py-1 rounded disabled:opacity-35 disabled:cursor-not-allowed"
>
  &gt; 
</button>

          
        </div>
      </div>
      {user && <ProfileModal open={openProfile} onClose={handleCloseProfile} user={user} />}
    </div>
  );
};

export default UsersPage;

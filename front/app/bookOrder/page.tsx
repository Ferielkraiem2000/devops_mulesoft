"use client";
import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaHome, FaShoppingCart, FaBell, FaUserCircle, FaSignOutAlt, FaClipboardList } from "react-icons/fa";
import { SiGithub, SiGitlab, SiBitbucket } from "react-icons/si";
import { FaMicrosoft } from "react-icons/fa";
import { MdCloud } from "react-icons/md";
import { FaServer } from "react-icons/fa";
import { GiChart } from "react-icons/gi";
import { FaChartLine } from "react-icons/fa";
import { FaDog, FaSearch, FaArrowRight, FaArrowLeft, } from "react-icons/fa";
import { SiJfrog } from "react-icons/si";
import { FaBox } from "react-icons/fa";
import { Box, Typography, Button, Stepper, Step, StepLabel, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import ProfileModal from "@/components/profileModal";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { jwtDecode } from "jwt-decode";


const AppForm = () => {
    // useEffect(() => {
    //     const handleError = (error: any) => {
    //       if (error?.response?.status === 400) {
    //         console.error("Unauthorized access, redirecting to login...");
    //         localStorage.removeItem("token");
    //         window.location.href = "/signin";
    //       }
    //     };
      
    //     return () => {
    //     };
    //   }, []);

    const steps = [
        {
            id: 1,
            step: "Choisir l'outil de versioning",
            options: [
                { label: "Gitlab", icon: <SiGitlab /> },
                { label: "Bitbucket", icon: <SiBitbucket /> },
                { label: "AzureDevOps", icon: <FaMicrosoft /> },
                { label: "Github", icon: <SiGithub /> },

            ],
        },
        {
            id: 2,
            step: "Choisir le type d'hébergement",
            options: [
                { label: "Cloudhub2.0", icon: <MdCloud /> },
                { label: "On-Premises", icon: <FaServer /> },
            ],
        },
        {
            id: 3,
            step: "Choisir l'outil de monitoring",
            options: [
                { label: "Grafana", icon: <GiChart /> },
                { label: "ELK", icon: <FaChartLine /> },
                { label: "Datadog", icon: <FaDog /> },
                { label: "Splunk", icon: <FaSearch /> },
            ],
        },
        {
            id: 4,
            step: "Choisir l'outil d'hébergement du jar",
            options: [
                { label: "Jfrog", icon: <SiJfrog /> },
                { label: "Nexus", icon: <FaBox /> },
            ],
        },
    ];

    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<string[]>(Array(steps.length).fill(""));
    const [openPopup, setOpenPopup] = useState(false);
    let previous=false;
    let next=false;
    const handleOptionChange = (stepIndex: number, option: string) => {
        const updatedSelections = [...selectedOptions];
        updatedSelections[stepIndex] = option;
        setSelectedOptions(updatedSelections);
    };

    const handleNext = () => {
         if (currentStepIndex === 0 && selectedOptions[currentStepIndex] || currentStepIndex === 1 && selectedOptions[currentStepIndex]) {
            setCurrentStepIndex((prev) => prev + 1);
    }
    else{
      setCurrentStepIndex((prev) => prev + 1);
    }
    };

    const handleBack = () => {
        setCurrentStepIndex((prev) => prev - 1);
    };

    // const handleSubmit = async () => {
    //     const dataToSend = {
    //         versioningTool: selectedOptions[0],
    //         hostingType: selectedOptions[1],
    //         monitoringTool: selectedOptions[2],
    //         hostingJarTool: selectedOptions[3],
    //         status: "en attente",
    //     };

    //     try {
    //         const response = await axios.post("https://app-back-deploy.vercel.app/save-order", dataToSend);
    //         console.log(response.data);
    //         setOrderDetails(dataToSend);
    //         setOpenPopup(true);
    //     } catch (error) {
    //         console.error("Error saving order:", error);
    //     }
    // };
    const handleSubmit = async () => {
        const customerId = localStorage.getItem("customerId");  
        console.log("customerId:", customerId);
        const dataToSend:any = {
            versioningTool: selectedOptions[0],
            hostingType: selectedOptions[1],
            // monitoringTool: selectedOptions[2],
            // hostingJarTool: selectedOptions[3],
            status: "en attente",
            customerId: customerId,
        };
        if (selectedOptions[2]) dataToSend.monitoringTool = selectedOptions[2];
        if (selectedOptions[3]) dataToSend.hostingJarTool = selectedOptions[3];
        try {
            
            const response = await axios.post("http://localhost:4000/save-order", dataToSend);
            console.log(response.data);
            setOrderDetails(dataToSend);
            setOpenPopup(true);
        } catch (error) {
            console.error("Error saving order:", error);
        }
    };
    
    const handleClosePopup = () => {
        previous=true;
        next=true;
        setOpenPopup(false);
        window.location.href="/clientOrders"
    };
    const currentStep = steps[currentStepIndex];
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
      
        } catch (error:any) {
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
      const [isExpanded, setIsExpanded] = useState(false);

  // Toggle sidebar state
  const toggleSidebar = () => setIsExpanded(!isExpanded);

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
              <a href="/configDownloader"  className="flex items-center space-x-4 text-white hover:text-blue-500">
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
        {/* <div className="p-4 space-y-4">
          <div className="flex items-center">
            <FaUserCircle
              className="text-white hover:text-blue-500 text-2xl cursor-pointer"
              onClick={handleProfileClick}
            />
            {!isCollapsed && <span className="ml-4">Profil</span>}
          </div>
          <div className="flex items-center">
            <FaSignOutAlt
              className="text-white hover:text-red-500 text-2xl cursor-pointer"
              onClick={() => confirmLogout(handleLogout)}
            />
            {!isCollapsed && <span className="ml-4">Déconnexion</span>}
          </div>
        </div> */}
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
      <Box
                    sx={{
                        margin: "auto",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "block",
                        backgroundColor: "white",
                        boxShadow: 3,
                        padding: 3,
                    }}
                >
                    <Stepper activeStep={currentStepIndex} alternativeLabel>
                        {steps.map((label, index) => (
                            <Step key={label.id}>
                                <StepLabel>
                                    {label.step}
                                    <div style={{ fontSize: "0.8rem", color: "gray" }}>
                                        {selectedOptions[index] || "Non sélectionné"}
                                    </div>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Box sx={{ marginTop: 3 }}>
                        <Typography variant="h5" gutterBottom style={{ color: "gray" }}>
                            {currentStep.step}
                        </Typography>
                        <div>
                            {currentStep.options.map((option, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleOptionChange(currentStepIndex, option.label)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                        margin: "10px 0",
                                        padding: "10px",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        color: selectedOptions[currentStepIndex] === option.label ? "blue" : "black",
                                        backgroundColor: selectedOptions[currentStepIndex] === option.label ? "#cce7ff" : "#fff",
                                    }}
                                >
                                    <div
                                        style={{
                                            marginRight: "10px",
                                            color: selectedOptions[currentStepIndex] === option.label ? "#007bff" : "#000",
                                        }}
                                    >
                                        {option.icon}
                                    </div>
                                    <span>{option.label}</span>
                                </div>
                            ))}
                        </div>
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                            <Button variant="contained" disabled={currentStepIndex === 0 || !!orderDetails} onClick={handleBack}>
                                Précédent
                            </Button>
                            {currentStepIndex === steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    // disabled={!selectedOptions[currentStepIndex] || !!orderDetails}
                                >
                                    Soumettre
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    disabled={currentStepIndex === 0 && !selectedOptions[currentStepIndex] || currentStepIndex === 1 && !selectedOptions[currentStepIndex]}
                                >
                                    Suivant
                                </Button>
                            )}
                        </Box>
                    </Box>
                    <Dialog open={openPopup} onClose={handleClosePopup}>
    <DialogTitle
        sx={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1c6ed6',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #e0e0e0',
            paddingBottom: '10px',
        }}
    >
        <FaCheckCircle style={{ color: '#1c6ed6', marginRight: '8px', fontSize: '1.8rem' }} />
        Commande Soumise
    </DialogTitle>
    <DialogContent
        sx={{
            padding: '24px',
            backgroundColor: '#f9fbfd',
            borderRadius: '8px',
            color: '#333',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
            lineHeight: 1.8,
        }}
    >
        <Typography
            variant="body1"
            sx={{
                marginBottom: '16px',
                color: '#495057',
                fontSize: '1rem',
            }}
        >
            Votre commande a été soumise avec succès et est maintenant en attente
            d'approbation de l'administrateur.
        </Typography>
        <Typography
            variant="h6"
            sx={{
                fontWeight: 'bold',
                color: '#0056b3',
                marginBottom: '12px',
                fontSize: '1.1rem',
            }}
        >
            Détails de la commande :
        </Typography>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px', fontSize: '0.95rem' }}>
            <li style={{ marginBottom: '8px' }}>
                <strong>Outil de versioning</strong> : {orderDetails?.versioningTool || 'Non sélectionné'}
            </li>
            <li style={{ marginBottom: '8px' }}>
                <strong>Type d&apos;hébergement</strong> : {orderDetails?.hostingType || 'Non sélectionné'}
            </li>
            <li style={{ marginBottom: '8px' }}>
                <strong>Outil de surveillance</strong> : {orderDetails?.monitoringTool || 'Non sélectionné'}
            </li>
            <li style={{ marginBottom: '8px' }}>
                <strong>Outil d&apos;hébergement du jar</strong> : {orderDetails?.hostingJarTool || 'Non sélectionné'}
            </li>
        </ul>
    </DialogContent>
    <DialogActions
        sx={{
            justifyContent: 'center',
            padding: '16px',
        }}
    >
        <Button
            onClick={handleClosePopup}
            sx={{
                backgroundColor: '#007bff',
                color: '#fff',
                fontSize: '1rem',
                padding: '8px 16px',
                textTransform: 'none',
                borderRadius: '24px',
                '&:hover': {
                    backgroundColor: '#0056b3',
                },
            }}
        >
            Fermer
        </Button>
    </DialogActions>
</Dialog>

                </Box>

    </div>
            {/* <div className="flex flex-1">
   */}

                {/* <div className="w-20 bg-white shadow-md p-4 flex flex-col items-center">
                <div className="mb-6" >
    <a href="/">
        <FaHome className="text-gray-700 hover:text-blue-500 text-2xl" />
    </a>
</div>

                    <div className="mb-6" >
                    <a href="/bookOrder">
                            <FaShoppingCart className="text-gray-700 hover:text-blue-500 text-2xl" />
                        </a>
                    </div>
                    <div className="mb-6" >
                       <a href="/clientOrders"><FaClipboardList className="text-gray-700 hover:text-blue-500 text-2xl" /></a>
       </div>
                </div>  */}

            </div>
        // </div>
        
    );
};

export default AppForm;
function setError(arg0: string) {
    throw new Error("Function not implemented.");
}


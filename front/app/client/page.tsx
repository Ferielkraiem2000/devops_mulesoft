// "use client";
// import React, { useEffect } from "react";
// import { FaClipboardList, FaHome, FaShoppingCart} from "react-icons/fa";


// export default function ClientPage() {
//     useEffect(() => {
//       // if (window.location.pathname === "/client") {
//       //   window.location.replace("/bookOrder");
//       // }
//     }, []);
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-20 bg-white shadow-md p-4 flex flex-col items-center">
//         <div className="mb-6">
//           <FaHome className="text-gray-700 hover:text-blue-500 text-2xl" />
//         </div>
//         {/* <div className="mb-6">
//           <FaBoxOpen className="text-gray-700 hover:text-blue-500 text-2xl" />
//         </div> */}
//         <div className="mb-6">
//           <a href="/bookOrder"><FaShoppingCart className="text-gray-700 hover:text-blue-500 text-2xl" /></a>
//         </div>
//         <div className="mb-6">
//         <a href="/ClientOrders"><FaClipboardList className="text-gray-700 hover:text-blue-500 text-2xl" /></a>
//         </div>

//       </div>


//     </div>
//   );
// }


// const checkTokenExpiration = () => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded: any = jwtDecode(token);
//         const currentTime = Date.now() / 1000;
//         console.log("exp",currentTime);
        
//         if (decoded.exp < currentTime) {
//           alert("Votre session est expirée"); 
//           localStorage.removeItem("token"); 
//           window.location.href = "/signin"; 
//         }
//       } catch (error) {
//         console.error("Error decoding token", error);
//         localStorage.removeItem("token");
//         window.location.href = "/signin";
//       }
//     }
//   };
  
// useEffect(() => {
//     checkTokenExpiration();
// }, []);
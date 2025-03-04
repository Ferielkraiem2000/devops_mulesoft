import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

export const checkTokenExpiration = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000; 

      if (decoded.exp < currentTime) {
        Swal.fire({
            title: "Session Expirée",
            html: `Votre session a expiré. Cliquez sur le lien pour vous reconnecter: <a href="/signin" style="color: blue; text-decoration: underline;">Reconnexion</a>`,
            icon: "error",
            confirmButtonText: "OK",
            customClass: {
              popup: "swal-custom-size", 
            },
          });
        localStorage.removeItem("token"); 
        // window.location.href = ""; 
      }
    } catch (error) {
      console.error("Error decoding token", error);
      localStorage.removeItem("token");
      window.location.href = "/signin";
    }
  }
};

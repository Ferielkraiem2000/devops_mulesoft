// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   TextField,
//   CircularProgress,
//   Snackbar,
//   IconButton,
//   Divider,
//   Grid,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import axios from "axios";

// interface ProfileModalProps {
//   open: boolean;
//   onClose: () => void;
//   user: { name: string; workEmail: string };
// }

// const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, user }) => {
//   const [newName, setNewName] = useState(user.name);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setNewName(user.name);
//       setNewPassword('');
//       setCurrentPassword('');
//       setConfirmPassword('');
//     }
//   }, [open, user]);

//   const handleUpdate = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       console.log("newPwd :", newPassword);
//       await axios.put(
//         'http://localhost:4000/update-profile',
//         { name: newName, password: newPassword },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSnackbarMessage('Profil mis à jour avec succès !');
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du profil:', error);
//       setSnackbarMessage("Une erreur est survenue. Veuillez réessayer.");
//     } finally {
//       setLoading(false);
//       setSnackbarOpen(true);
//     }
//   };

//   return (
//     <>
//       <Dialog 
//         open={open} 
//         onClose={onClose} 
//         fullWidth 
//         maxWidth="sm"
//         sx={{ borderRadius: "12px", boxShadow: "0px 4px 12px rgba(0,0,0,0.2)" }}
//       >
//         <DialogTitle sx={{ 
//           fontWeight: "bold", 
//           textAlign: "center", 
//           backgroundColor: "#f4f6f8", 
//           padding: "16px", 
//           borderBottom: "1px solid #ddd" 
//         }}>
//           Profil
//         </DialogTitle>
        
//         <DialogContent sx={{ padding: "24px" }}>
//           {/* Email */}
//           <Typography variant="body1" sx={{ mb: 2 }}>
//             <strong>Nom actuel :</strong> {user.name}
//           </Typography>
//           <Typography variant="body1" sx={{ mb: 2 }}>
//             <strong>Email :</strong> {user.workEmail}
//           </Typography>

//           <Divider sx={{ my: 2 }} />

//           {/* Modifier le nom */}
//           <Typography variant="h6" sx={{ mb: 1 }}>Modifier le nom</Typography>
//           <TextField
//             label="Nouveau nom"
//             fullWidth
//             value={newName}
//             onChange={(e) => setNewName(e.target.value)}
//             margin="normal"
//             sx={{ 
//               backgroundColor: "#f9f9f9", 
//               borderRadius: "8px",
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { borderColor: "#ccc" },
//                 "&:hover fieldset": { borderColor: "#888" },
//                 "&.Mui-focused fieldset": { borderColor: "#1976d2" }
//               }
//             }}
//           />

//           <Divider sx={{ my: 2 }} />

//           <Typography variant="h6" sx={{ mb: 1 }}>Modifier le mot de passe</Typography>

//           <Grid container spacing={2}>
//             {[{ label: "Mot de passe actuel", value: currentPassword, setter: setCurrentPassword, show: showCurrentPassword, toggle: setShowCurrentPassword },
//               { label: "Nouveau mot de passe", value: newPassword, setter: setNewPassword, show: showNewPassword, toggle: setShowNewPassword },
//               { label: "Confirmer le mot de passe", value: confirmPassword, setter: setConfirmPassword, show: showConfirmPassword, toggle: setShowConfirmPassword }]
//               .map(({ label, value, setter, show, toggle }, index) => (
//                 <Grid item xs={12} key={index}>
//                   <TextField
//                     label={label}
//                     type={show ? "text" : "password"}
//                     fullWidth
//                     value={value}
//                     onChange={(e) => setter(e.target.value)}
//                     margin="normal"
//                     sx={{ 
//                       backgroundColor: "#f9f9f9", 
//                       borderRadius: "8px",
//                       "& .MuiOutlinedInput-root": {
//                         "& fieldset": { borderColor: "#ccc" },
//                         "&:hover fieldset": { borderColor: "#888" },
//                         "&.Mui-focused fieldset": { borderColor: "#1976d2" }
//                       }
//                     }}
//                     InputProps={{
//                       endAdornment: (
//                         <IconButton onClick={() => toggle(!show)}>
//                           {show ? <VisibilityOff /> : <Visibility />}
//                         </IconButton>
//                       ),
//                     }}
//                   />
//                 </Grid>
//             ))}
//           </Grid>
//         </DialogContent>

//         {/* Actions */}
//         <DialogActions sx={{ 
//           justifyContent: "space-between", 
//           padding: "16px", 
//           backgroundColor: "#f4f6f8",
//           borderTop: "1px solid #ddd" 
//         }}>
//           <Button 
//             onClick={onClose} 
//             variant="outlined" 
//             sx={{ 
//               borderRadius: "8px", 
//               textTransform: "none", 
//               "&:hover": { backgroundColor: "#e0e0e0" }
//             }}
//           >
//             Fermer
//           </Button>
//           <Button 
//             onClick={handleUpdate} 
//             variant="contained" 
//             disabled={loading || (newName === user.name && newPassword === "")}
//             sx={{ 
//               borderRadius: "8px", 
//               textTransform: "none", 
//               backgroundColor: "#1976d2", 
//               "&:hover": { backgroundColor: "#1565c0" }
//             }}
//           >
//             {loading ? <CircularProgress size={24} color="inherit" /> : "Mettre à jour"}
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Snackbar
//         open={snackbarOpen}
//         autoHideDuration={4000}
//         onClose={() => setSnackbarOpen(false)}
//         message={snackbarMessage}
//       />
//     </>
//   );
// };

// export default ProfileModal;

// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Typography,
//   TextField,
//   Snackbar,
//   IconButton,
//   Divider,
//   Grid,
//   Collapse,
// } from "@mui/material";
// import { Visibility, VisibilityOff, ExpandMore, ExpandLess } from "@mui/icons-material";
// import axios from "axios";

// interface ProfileModalProps {
//   open: boolean;
//   onClose: () => void;
//   user: { name: string; workEmail: string };
// }

// const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, user }) => {
//   const [newName, setNewName] = useState(user.name);
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState("");
//   const [snackbarOpen, setSnackbarOpen] = useState(false);
//   const [openNameSection, setOpenNameSection] = useState(false);
//   const [openPasswordSection, setOpenPasswordSection] = useState(false);
//   const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
//   const [passwordError, setPasswordError] = useState("");
//   const [isPasswordUpdateDisabled, setIsPasswordUpdateDisabled] = useState(false);
//   const [showPasswordSectionTitle, setShowPasswordSectionTitle] = useState(false);

//   useEffect(() => {
//     if (open) {
//       setNewName(user.name);
//       setNewPassword('');
//       setCurrentPassword('');
//       setConfirmPassword('');
//       setShowPasswordConfirmation(false);
//       setOpenPasswordSection(false);
//       setPasswordError("");
//       setIsPasswordUpdateDisabled(false);
//       setShowPasswordSectionTitle(false); 
//     }
//   }, [open, user]);

//   const validatePassword = () => {
//     if (newPassword !== confirmPassword) {
//       setPasswordError("Les mots de passe ne correspondent pas.");
//       return false;
//     }
//     if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
//       setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
//       return false;
//     }
//     setPasswordError("");
//     return true;
//   };

//   const handleUpdateName = async () => {
//     setLoading(true);
//     try {
//         const token = localStorage.getItem('token');
//         await axios.put(
//             'http://localhost:4000/update-name',
//             { name: newName },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setShowPasswordConfirmation(true)
//         setSnackbarMessage('Nom mis à jour avec succès !');
//         setSnackbarOpen(true);
        
//     } catch (error) {
//         setSnackbarMessage("Une erreur est survenue. Veuillez réessayer.");
//         setSnackbarOpen(true);
//     } finally {
//         setLoading(false);
//     }
//   };

//   const handleUpdatePwd = async () => {
//     if (!validatePassword()) return;
//     setLoading(true);
//     try {
//         const token = localStorage.getItem('token');
//         await axios.put(
//             'http://localhost:4000/update-password',
//             { password: newPassword },
//             { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setSnackbarMessage('Mot de passe mis à jour avec succès !');
//         setSnackbarOpen(true);
//     } catch (error) {
//         setSnackbarMessage("Une erreur est survenue. Veuillez réessayer.");
//         setSnackbarOpen(true);
//     } finally {
//         setLoading(false);
//     }
//   };

//   const handlePasswordUpdateChoice = (choice: string) => {
//     if (choice === "oui") {
//       setShowPasswordConfirmation(false);
//       setOpenPasswordSection(true);
//       setShowPasswordSectionTitle(true);  
//     } else {
//       setIsPasswordUpdateDisabled(true);
//       setShowPasswordConfirmation(false);
//     }
//   };

//   return (
//     <>
//       <Dialog 
//         open={open} 
//         onClose={onClose} 
//         fullWidth 
//         maxWidth="sm"
//       >
//         <DialogTitle>Profil</DialogTitle>
//         <DialogContent>
//           <Typography variant="body1"><strong>Email :</strong> {user.workEmail}</Typography>
//           <Divider sx={{ my: 2 }} />

//           <Typography variant="h6" onClick={() => setOpenNameSection(!openNameSection)}>
//             Modifier le nom {openNameSection ? <ExpandLess /> : <ExpandMore />}
//           </Typography>
//           <Collapse in={openNameSection}>
//             <TextField
//               label="Nouveau nom"
//               fullWidth
//               value={newName}
//               onChange={(e) => setNewName(e.target.value)}
//               margin="normal"
//               disabled={showPasswordConfirmation || openPasswordSection}
//             />
//             <Button onClick={handleUpdateName} variant="contained" sx={{ mt: 2 }} disabled={newName === user.name || showPasswordConfirmation || openPasswordSection}>Mettre à jour le nom</Button>
//           </Collapse>
          
//           {showPasswordConfirmation && (
//             <Typography sx={{ mt: 2 }}>Voulez-vous mettre à jour votre mot de passe ?</Typography>
//           )}
//           {showPasswordConfirmation && !isPasswordUpdateDisabled && (
//             <>
//   <Button onClick={() => handlePasswordUpdateChoice("oui")} variant="contained" sx={{ mt: 1 }}>Oui</Button>
//   <Button onClick={() => handlePasswordUpdateChoice("non")} variant="contained" sx={{ mt: 1, ml: 2 }} disabled={isPasswordUpdateDisabled}>Non</Button>
// </>

//           )}

//           {showPasswordSectionTitle && (
//             <Typography variant="h6" sx={{ mt: 3 }}>
//               Modifier le mot de passe
//             </Typography>
//           )}

//           <Collapse in={openPasswordSection}>
//             <Grid container spacing={2}>
//               {[{ label: "Mot de passe actuel", value: currentPassword, setter: setCurrentPassword, show: showCurrentPassword, toggle: setShowCurrentPassword },
//                 { label: "Nouveau mot de passe", value: newPassword, setter: setNewPassword, show: showNewPassword, toggle: setShowNewPassword },
//                 { label: "Confirmer le mot de passe", value: confirmPassword, setter: setConfirmPassword, show: showConfirmPassword, toggle: setShowConfirmPassword }].map(({ label, value, setter, show, toggle }, index) => (
//                   <Grid item xs={12} key={index}>
//                     <TextField
//                       label={label}
//                       type={show ? "text" : "password"}
//                       fullWidth
//                       value={value}
//                       onChange={(e) => setter(e.target.value)}
//                       margin="normal"
//                       error={!!passwordError && (label === "Nouveau mot de passe" || label === "Confirmer le mot de passe")}
//                       helperText={label === "Nouveau mot de passe" || label === "Confirmer le mot de passe" ? passwordError : ""}
//                       InputProps={{
//                         endAdornment: (
//                           <IconButton onClick={() => toggle(!show)}>
//                             {show ? <VisibilityOff /> : <Visibility />}
//                           </IconButton>
//                         ),
//                       }}
//                     />
//                   </Grid>
//               ))}
//             </Grid>
//             <Button onClick={handleUpdatePwd} variant="contained" sx={{ mt: 2 }} disabled={newPassword === ""|| snackbarOpen}>Mettre à jour le mot de passe</Button>
//           </Collapse>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose} variant="outlined">Fermer</Button>
//         </DialogActions>
//       </Dialog>
//       <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
//     </>
//   );
// };

// export default ProfileModal;
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Snackbar,
  IconButton,
  Divider,
  Grid,
  Collapse,
} from "@mui/material";
import { Visibility, VisibilityOff, ExpandMore, ExpandLess } from "@mui/icons-material";
import axios from "axios";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: { name: string; workEmail: string };
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, user }) => {
  const [newName, setNewName] = useState(user.name);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openNameSection, setOpenNameSection] = useState(false);
  const [openPasswordSection, setOpenPasswordSection] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordUpdateDisabled, setIsPasswordUpdateDisabled] = useState(false);
  const [showPasswordSectionTitle, setShowPasswordSectionTitle] = useState(false);

  useEffect(() => {
    if (open) {
      setNewName(user.name);
      setNewPassword('');
      setCurrentPassword('');
      setConfirmPassword('');
      setShowPasswordConfirmation(false);
      setOpenPasswordSection(false);
      setPasswordError("");
      setIsPasswordUpdateDisabled(false);
      setShowPasswordSectionTitle(false); 
    }
  }, [open, user]);

  const validatePassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas.");
      return false;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleUpdateName = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
          'http://localhost:4000/update-name',
          { name: newName },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowPasswordConfirmation(true)
      setSnackbarMessage('Nom mis à jour avec succès !');
      setSnackbarOpen(true);
      
    } catch (error) {
      setSnackbarMessage("Une erreur est survenue. Veuillez réessayer.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePwd = async () => {
    if (!validatePassword()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
          'http://localhost:4000/update-password',
          { password: newPassword },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      setSnackbarMessage('Mot de passe mis à jour avec succès !');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Une erreur est survenue. Veuillez réessayer.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdateChoice = (choice: string) => {
    if (choice === "oui") {
      setShowPasswordConfirmation(false);
      setOpenPasswordSection(true);
      setShowPasswordSectionTitle(true);  
    } else {
      setIsPasswordUpdateDisabled(true);
      setShowPasswordConfirmation(false);
    }
  };

  const handleClose = () => {
    onClose(); // Close the dialog
    // Reset states to clear the form when closed
    setNewName(user.name);
    setNewPassword('');
    setCurrentPassword('');
    setConfirmPassword('');
    setShowPasswordConfirmation(false);
    setOpenPasswordSection(false);
    setPasswordError("");
    setIsPasswordUpdateDisabled(false);
    setShowPasswordSectionTitle(false); 
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleClose} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>Profil</DialogTitle>
        <DialogContent>
          <Typography variant="body1"><strong>Email :</strong> {user.workEmail}</Typography>
          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" onClick={() => setOpenNameSection(!openNameSection)}>
            Modifier le nom {openNameSection ? <ExpandLess /> : <ExpandMore />}
          </Typography>
          <Collapse in={openNameSection}>
            <TextField
              label="Nouveau nom"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              margin="normal"
              disabled={showPasswordConfirmation || openPasswordSection}
            />
            <Button onClick={handleUpdateName} variant="contained"   
              sx={{
                mt: 2,
                padding: "6px 12px",  
                borderRadius: "20px",  
                fontSize: "0.875rem"}}
              disabled={newName === user.name || showPasswordConfirmation || openPasswordSection || isPasswordUpdateDisabled}>Mettre à jour le nom</Button>
          </Collapse>
          
          {showPasswordConfirmation && (
            <Typography sx={{ mt: 2 }}>Voulez-vous mettre à jour votre mot de passe ?</Typography>
          )}
          {showPasswordConfirmation && !isPasswordUpdateDisabled && (
            <>
              <Button onClick={() => handlePasswordUpdateChoice("oui")} variant="contained" sx={{ mt: 1 }}>Oui</Button>
              <Button onClick={() => handlePasswordUpdateChoice("non")} variant="contained" sx={{ mt: 1, ml: 2 }} disabled={isPasswordUpdateDisabled}>Non</Button>
            </>
          )}

          {showPasswordSectionTitle && (
            <Typography variant="h6" sx={{ mt: 3 }}>
              Modifier le mot de passe
            </Typography>
          )}

          <Collapse in={openPasswordSection}>
            <Grid container spacing={2}>
              {[{ label: "Mot de passe actuel", value: currentPassword, setter: setCurrentPassword, show: showCurrentPassword, toggle: setShowCurrentPassword },
                { label: "Nouveau mot de passe", value: newPassword, setter: setNewPassword, show: showNewPassword, toggle: setShowNewPassword },
                { label: "Confirmer le mot de passe", value: confirmPassword, setter: setConfirmPassword, show: showConfirmPassword, toggle: setShowConfirmPassword }].map(({ label, value, setter, show, toggle }, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label={label}
                      type={show ? "text" : "password"}
                      fullWidth
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      margin="normal"
                      error={!!passwordError && (label === "Nouveau mot de passe" || label === "Confirmer le mot de passe")}
                      helperText={label === "Nouveau mot de passe" || label === "Confirmer le mot de passe" ? passwordError : ""}
                      InputProps={{
                        endAdornment: (
                          <IconButton onClick={() => toggle(!show)}>
                            {show ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
              ))}
            </Grid>
            <Button onClick={handleUpdatePwd} variant="contained"               
            sx={{
                mt: 2,
                padding: "6px 12px",  
                borderRadius: "20px",  
                fontSize: "0.875rem"}}
            disabled={newPassword === ""|| snackbarOpen}>Mettre à jour le mot de passe</Button>
          </Collapse>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{borderRadius: "20px"}}
          variant="outlined">Fermer</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
    </>
  );
};

export default ProfileModal;

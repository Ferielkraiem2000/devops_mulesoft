"use client"; 
import { useEffect, useState } from "react";
import Link from "next/link";


const metadata = {
  title: "Sign In - Open PRO",
  description: "Page description",
};

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 
 
  let customerId=""


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");
  
    try {
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workEmail: email,
          password: password,
        }),
      });
  
      const data = await response.json();
       if (!response.ok) {
        setError(data.message || "An error occurred");
      } else {
        const token = data.token;
        
        if (token) {
          localStorage.setItem('token', token);
          console.log(token);
          const profileResponse = await fetch("http://localhost:4000/profile", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,  
            },
          });

          const profileData = await profileResponse.json();
          customerId=profileData._id;
          localStorage.setItem('customerId', customerId);
          console.log("ud",customerId);
          
          if (!profileResponse.ok) {
            setError(profileData.message || "Error fetching profile");
          } else {
            console.log("User profile fetched:", profileData);
            if (email === "admin@admin.com") {
              window.location.href = "/dashboard";
            } else {
              window.location.href = "/bookOrder";
            }
          }
        }
        setSuccessMessage("Connexion réussie !");
        console.log("Sign in successful:", data);
      }
    } catch (err) {
      setError("Erreur serveur, veuillez réessayer.");
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
            Bienvenue à nouveau
            </h1>
          </div>
          {/* Contact form */}
          <form className="mx-auto max-w-[400px]" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  className="mb-1 block text-sm font-medium text-indigo-200/65"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input w-full"
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <label
                    className="block text-sm font-medium text-indigo-200/65"
                    htmlFor="password"
                  >
                Mot de passe
                  </label>
                  <Link
                    className="text-sm text-gray-600 hover:underline"
                    href="/reset-password"
                  >
                    Mot de passe oublié ?
                    </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  className="form-input w-full"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-6 space-y-5">
              <button
                type="submit"
                className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
              {error && (
                <div className="text-center text-sm text-red-500 mt-2">{error}</div>
              )}
              {successMessage && (
                <div className="text-center text-sm text-green-500 mt-2">{successMessage}</div> // Success message displayed here
              )}
              {/* <div className="flex items-center gap-3 text-center text-sm italic text-gray-600 before:h-px before:flex-1 before:bg-gradient-to-r before:from-transparent before:via-gray-400/25 after:h-px after:flex-1 after:bg-gradient-to-r after:from-transparent after:via-gray-400/25">
                or
              </div>
              <button className="btn relative w-full bg-gradient-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_right,theme(colors.gray.800),theme(colors.gray.700),theme(colors.gray.800))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-[length:100%_150%]">
                Sign In with Google
              </button> */}
            </div>
          </form>
          {/* Bottom link */}
          <div className="mt-6 text-center text-sm text-indigo-200/65">
          Vous n'avez pas de compte ?{" "}
          <Link className="font-medium text-indigo-500" href="/signup">
          S'inscrire
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

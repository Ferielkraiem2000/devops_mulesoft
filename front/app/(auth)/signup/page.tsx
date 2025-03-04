"use client";
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';  // Import the necessary styles

const metadata = {
  title: "Sign Up - Open PRO",
  description: "Page description",
};

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    phoneNumber: "",
    workEmail: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handlePhoneChange = (value: any) => {
    setFormData({
      ...formData,
      phoneNumber: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.name || !formData.companyName || !formData.workEmail || !formData.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/signup", formData);
      window.location.href = "/signin";
      setSuccessMessage(response.data.message);
      setErrorMessage("");
    } catch (error) {
      // Handle error here
    }
  };

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="pb-12 text-center">
            <h1 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,theme(colors.gray.200),theme(colors.indigo.200),theme(colors.gray.50),theme(colors.indigo.300),theme(colors.gray.200))] bg-[length:200%_auto] bg-clip-text font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Créer un compte
            </h1>
          </div>

          {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-center">{successMessage}</div>}

          <form className="mx-auto max-w-[400px]" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="name">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  className="form-input w-full"
                  placeholder="Votre nom complet"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="companyName">
                  Nom de l'entreprise <span className="text-red-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  className="form-input w-full"
                  placeholder="Le nom de votre entreprise"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="phoneNumber">
                  Numéro de téléphone <span className="text-red-500">*</span>
                </label>
                <PhoneInput
                  id="phoneNumber"
                  international
                  defaultCountry="TN"
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  className="form-input w-full"
                  placeholder="Votre numéro"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-indigo-200/65" htmlFor="workEmail">
                  Email professionnel<span className="text-red-500">*</span>
                </label>
                <input
                  id="workEmail"
                  type="email"
                  className="form-input w-full"
                  placeholder="Votre email professionnel"
                  value={formData.workEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-200/65" htmlFor="password">
                  Mot de passe <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input w-full"
                  placeholder="Mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mt-6 space-y-5">
              <button
                className="btn w-full bg-gradient-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_theme(colors.white/.16)] hover:bg-[length:100%_150%]"
                type="submit"
              >
                S'inscrire
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-indigo-200/65">
            Vous avez déjà un compte ?{" "}
            <Link className="font-medium text-indigo-500" href="/signin">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

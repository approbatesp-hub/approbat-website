import { useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  BsPerson,
  BsTelephone,
  BsShieldLock,
  BsCheckCircle,
} from "react-icons/bs";
import { IoMailOutline, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

import ConfirmationModal from "../components/ConfirmationModal";
import supabase from "../../supase-client";

const EnregistrezVous = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const numberTrim = phoneNumber.trim();
    e.preventDefault();
    if (!fullName || !email || !password || !numberTrim || !confirmedPassword) {
      return toast.error("Tous les champs sont obligatoires");
    } else if (password !== confirmedPassword) {
      return toast.error("Pas de correspondance : Mot de passe");
    } else if (password.length < 8) {
      return toast.error("Le mot de passe doit contenir au moins 8 caractères");
    }
    if (!/^[0-9]{10}$/.test(numberTrim)) {
      return toast.error("Numéro de téléphone invalide");
    }

    try {
      setShowModal(true); // show modal with data
    } catch (error) {
      console.error("Error creating user:", error.message);
      toast.error("Erreur lors de la création du compte");
    }
  };

  const handleConfirm = async () => {
    setShowModal(false);
    const numberTrim = phoneNumber.trim();
    const toastId = toast.loading("Création du profil...");

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      toast.dismiss(toastId);
      console.log(error);
      toast.error("Impossible d’envoyer l’OTP. Réessayez.");
      return;
    }

    // Redirect user to OTP page
    setTimeout(() => {
      toast.dismiss(toastId);
      toast.success("Un code a été envoyé à votre adresse email !");
      navigate("/verify-otp", {
        state: { email, fullName, numberTrim, password },
      });
    }, 1000);
  };

  return (
    <div className=" flex items-center justify-center pt-[140px] pb-[50px] md:py-[120px] px-4">
      <div className="max-w-3xl w-full border border-[#E5E7EB] rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}

        {/* Form Container */}
        <div className="">
          <div className="text-center mb-8 bg-gradient-to-r from-orange-500 to-red-500  ">
            <div className="flex  items-center justify-center space-x-2 ">
              <h3 className="text-2xl font-bold text-white mb-2 mt-5 ">
                Créer un compte
              </h3>
            </div>
            <p className=" text-center text-white pb-3">
              Veuillez renseigner des informations correctes svp !
            </p>
          </div>
          <div className="px-10 py-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grid Layout for larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom Complet
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BsPerson className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:border-transparent transition-all duration-200"
                      placeholder="Votre nom complet"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoMailOutline className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:border-transparent transition-all duration-200"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BsShieldLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      required
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:border-transparent transition-all duration-200"
                      placeholder="Créez un mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <IoEyeOutline className="h-5 w-5" />
                      ) : (
                        <IoEyeOffOutline className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmedPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BsCheckCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmedPassword"
                      name="confirmedPassword"
                      value={confirmedPassword}
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      onChange={(e) => setConfirmedPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                    focus:border-transparent transition-all duration-200"
                      placeholder="Confirmez le mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <IoEyeOutline className="h-5 w-5" />
                      ) : (
                        <IoEyeOffOutline className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <BsTelephone className="text-orange-500" />
                  Votre numéro actif
                </label>
                <div className="relative">
                  <div className="absolute bg-orange rounded-l-md text-white flex inset-y-0 left-0 pl-3 items-center pointer-events-none pr-2 gap-1">
                    <BsTelephone className="h-4 w-4 " />
                    <span className="text-[14px] font-medium ">+225</span>
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    type="tel"
                    required
                    className="block w-full pl-[80px] pr-3 py-3 border border-gray-300 rounded-lg 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                  focus:border-transparent transition-all duration-200"
                    placeholder="XX XX XX XX"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full hoverBtn cursor-pointer text-white py-3 px-4 
              rounded-lg font-medium 
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
              transition-all duration-200 transform hover:-translate-y-0.5 
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Création du compte...
                  </div>
                ) : (
                  "Créer mon compte"
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-200 mb-3">
                <p className="text-gray-600">
                  Vous avez déjà un compte ?{" "}
                  <a
                    href="/connexion"
                    className="font-medium text-orange hover:text-orange-500 transition-colors duration-200 underline"
                  >
                    Se connecter
                  </a>
                </p>
              </div>
            </form>
          </div>
          <ConfirmationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
            data={{
              "Nom Complet": fullName.toUpperCase(),
              Email: email.toLowerCase(),
              "Numéro de téléphone": phoneNumber,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EnregistrezVous;

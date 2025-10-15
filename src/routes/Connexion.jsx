import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { IoMailOutline, IoLockClosed } from "react-icons/io5";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { connexion, restoreFav } from "../redux/espremium";
import supabase from "../../supase-client";

const Connexion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwoldRevealed, setPasswoldRevealed] = useState(false);
  const [passwordType, setPasswordType] = useState("password");

  function showHidePassword() {
    setPasswordType(passwoldRevealed ? "password" : "text");
    setPasswoldRevealed(!passwoldRevealed);
  }

  const signIn = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Connexion en cours...");
    if (!email || !password) {
      return toast.error("Tous les champs sont obligatoires");
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.dismiss(toastId);
      return toast.error("Erreur de connexion");
    } else {
      const { data } = await supabase
        .from("Users")
        .select("*")
        .eq("email", email)
        .single();
      if (data) {
        dispatch(connexion(data));
        dispatch(restoreFav(data.favoris));
        toast.dismiss(toastId);
        toast.success("Connexion réussie !");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Utilisateur non trouvé");
        toast.dismiss(toastId);
      }
    }
  };

  return (
    <div className=" flex items-center justify-center pt-[140px] pb-[50px] md:py-[120px] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden">
        {/* Header */}

        {/* Form Container */}
        <div className="">
          <div className="text-center mb-4 lg:mb-8 bg-gradient-to-r from-orange-500 to-red-500 p-2 md:p-4  ">
            <h3 className="text-xl md:text-2xl font-bold text-white lg:mt-5 mt-2 mb-1 lg:mb-3 ">
              Bienvenue chez Approbat
            </h3>
            <p className="text-white text-sm md:text-base">
              Saisissez vos informations pour accéder à votre compte
            </p>
          </div>
          <div className="px-4 lg:px-8  ">
            <form onSubmit={signIn} className="space-y-6">
              {/* Email Field */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border placeholder:text-sm lg:placeholder:text-base border-gray-300 rounded-lg 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                           focus:border-transparent transition-all duration-200"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mot de passe
                  </label>
                  <Link
                    to="/mdpoublie"
                    className="text-sm text-orange hover:text-orange-500 transition-colors duration-200"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoLockClosed className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={passwordType}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500  placeholder:text-sm lg:placeholder:text-base
                           focus:border-transparent transition-all duration-200"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={showHidePassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 
                           transition-colors duration-200"
                  >
                    {passwoldRevealed ? (
                      <IoMdEyeOff className="h-5 w-5" />
                    ) : (
                      <IoMdEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 lg:py-3 px-4 
                       rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 
                       focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                       transition-all duration-200 transform hover:-translate-y-0.5 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                Se Connecter
              </button>

              {/* Divider */}
              <div className="relative flex items-center ">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">
                  ou
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Register Link */}
              <div className="text-center mb-3">
                <p className="text-gray-600">
                  Vous n'avez pas de compte ?{" "}
                  <Link
                    to="/enregistrer"
                    className="font-medium text-orange hover:text-orange-500 
                           transition-colors duration-200 underline"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connexion;

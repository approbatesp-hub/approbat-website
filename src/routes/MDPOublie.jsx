import React, { useState } from "react";
import { Link } from "react-router";
import { IoMailOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import supabase from "../../supase-client"; // Make sure path is correct

const MDPOublie = () => {
  const [email, setEmail] = useState("");
  const [emailEnvoye, setEmailEnvoye] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Veuillez entrer votre adresse email.");
    }

    const toastId = toast.loading("Envoi en cours…");

    // Supabase password reset flow
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    toast.dismiss(toastId);

    if (error) {
      toast.error("Erreur Impossible d’envoyer l’email.");

      console.log(error);
    } else {
      setEmailEnvoye(true);
      toast.success(
        "Email de réinitialisation envoyé ! Vérifiez votre boîte de réception."
      );
    }
  };

  return (
    <div className="flex items-center justify-center pt-[140px] pb-[50px] md:py-[120px] px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="text-center mb-4 lg:mb-8 bg-gradient-to-r from-orange-500 to-red-500 p-2 lg:p-4">
          <h3 className="text-xl md:text-2xl font-bold text-white lg:mt-5 mt-2 mb-1 lg:mb-3 ">
            Mot de Passe Oublié ?
          </h3>
          <p className="text-white text-sm md:text-base">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg 
                           placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-sm md:placeholder:text-base
                           focus:border-transparent transition-all duration-200"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={emailEnvoye}
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 lg:py-3 px-4 
                       rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 
                       focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                       transition-all duration-200 transform hover:-translate-y-0.5 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailEnvoye ? "Lien envoyé" : "Envoyer le lien"}
            </button>

            {/* Back to Login */}
            <div className="text-center lg:mt-4">
              <Link
                to="/connexion"
                className="text-sm text-orange-500 hover:text-orange-700 font-medium transition-colors duration-200"
              >
                ← Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MDPOublie;

// pucy bpoy zlzk ymwe
// zfus ocnf ymlt ncrr
// aoms fiag gcsv pigp

import React, { useState } from "react";
import { useNavigate } from "react-router"; // Use react-router-dom for clarity
import toast from "react-hot-toast";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { IoLockClosed } from "react-icons/io5";
import supabase from "../../supase-client";
// Import lock and eye icons
// import supabase from "../../supase-client"; // Uncomment this when using the component

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordRevealed, setPasswordRevealed] = useState(false);

  const navigate = useNavigate();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Vérification cohérente (choisis min 8 caractères ici)
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      if (error.message === "Auth session missing!") {
        toast.error("Session expirée. Veuillez demander un nouveau lien.");
      } else if (
        error.message ===
        "New password should be different from the old password."
      ) {
        toast.error(
          "Le nouveau mot de passe ne peut pas être identique à l'ancien."
        );
      } else {
        console.log(error);
        toast.error("Erreur lors de la mise à jour du mot de passe.");
      }
      setLoading(false);
      return;
    }

    toast.success("Votre mot de passe a été mis à jour avec succès !");
    setLoading(false);

    setTimeout(() => {
      navigate("/connexion"); // Redirect to login
    }, 1500);
  };

  const showHidePassword = () => {
    setPasswordRevealed(!passwordRevealed);
  };

  const passwordType = passwordRevealed ? "text" : "password";

  return (
    <div className="flex items-center justify-center pt-[140px] pb-[50px] md:py-[120px] px-4 h-full  ">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="text-center bg-gradient-to-r from-orange-500 to-red-500 p-4">
          <h3 className="text-2xl font-bold text-white mt-5 mb-3">
            Définir un Nouveau Mot de Passe
          </h3>
          <p className="text-white text-sm">
            Veuillez saisir votre nouveau mot de passe.
          </p>
        </div>

        {/* Form Container */}
        <div className="px-8 py-8">
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                Nouveau Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={passwordType}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                            focus:border-transparent transition-all duration-200"
                  placeholder="Minimum 8 caractères"
                />
                <button
                  type="button"
                  onClick={showHidePassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 
                            transition-colors duration-200"
                >
                  {passwordRevealed ? (
                    <IoMdEyeOff className="h-5 w-5" />
                  ) : (
                    <IoMdEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Mirroring New Password) */}
            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmer le Mot de Passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={passwordType} // Shares the reveal state with the first input
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg 
                            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 
                            focus:border-transparent transition-all duration-200"
                  placeholder="Confirmez votre nouveau mot de passe"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 
                        rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 
                        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 
                        transition-all duration-200 transform hover:-translate-y-0.5 
                        disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Mise à jour..." : "Mettre à Jour le Mot de Passe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;

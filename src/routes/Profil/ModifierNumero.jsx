import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { connexion } from "../../redux/espremium";
import { FiSmartphone, FiCheck, FiUser } from "react-icons/fi";
import supabase from "../../../supase-client";

const ModifierNumero = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const [numero, setNumero] = useState(userInfo?.numero || "");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  async function changeNumero(e) {
    e.preventDefault();

    let numberTrim = numero.trim();
    if (!numero) {
      return toast.error("Champ vide ❌");
    } else if (!/^[0-9]{10}$/.test(numberTrim)) {
      return toast.error("Vérifiez votre numéro !");
    } else if (numberTrim === userInfo.numero) {
      return toast.error("Numéro inchangé");
    } else {
      try {
        const toastId = toast.loading("Changement en cours");
        const { error } = await supabase
          .from("Users")
          .update({ numero })
          .eq("id", userInfo.id);

        if (error) throw error;
        toast.dismiss(toastId);
        dispatch(connexion({ ...userInfo, numero }));
        toast.success("Numéro changé avec succès ✅");
      } catch (error) {
        toast.dismiss(toastId);
        toast.error(error.message);
      }
    }
  }

  return (
    <div className="max-w-md mx-auto md:p-3">
      {/* Header */}
      <div className="text-center mb-3 md:mb-5 lg:mb-8">
        <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-4">
          <FiSmartphone className="text-xl md:text-2xl text-blue-600" />
        </div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
          Modifier le numéro de téléphone
        </h1>
        <p className="text-gray-600 hidden md:block">
          Associez un nouveau numéro à votre profil
        </p>
      </div>

      {/* Current Info */}

      <form onSubmit={changeNumero} className="space-y-4 md:space-y-6">
        {/* Phone Input */}
        <div className="space-y-2">
          <label
            htmlFor="numero"
            className="block text-sm font-medium text-gray-700"
          >
            Nouveau numéro de téléphone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 font-medium">+225</span>
            </div>
            <input
              id="numero"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              type="tel"
              placeholder="Saisissez votre nouveau numéro"
              className="block w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       placeholder-gray-400 transition-colors text-sm md:text-base"
              maxLength={10}
            />
          </div>
          <p className="text-xs text-gray-500">
            Format: 10 chiffres sans le préfixe +225
          </p>
        </div>

        {/* Current Number Display */}
        {userInfo?.numero && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3  ">
            <p className="text-sm text-blue-800 font-medium">
              Numéro actuel:{" "}
              <span className="font-semibold">+225 {userInfo.numero}</span>
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !numero}
          className="w-full bg-gradient-to-r  from-orange-500 to-orange-600 text-white 
                   py-2 md:py-3 px-3 md:px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 
                   disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
                   transition-all duration-200 flex items-center justify-center gap-2
                   shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Modification en cours...
            </>
          ) : (
            <div className=" flex gap-2 items-center ">
              <FiCheck className="text-lg" />
              <span className="text-nowrap">Confirmer la modification</span>
            </div>
          )}
        </button>

        {/* Security Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg mt-6 p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-yellow-600 text-sm">!</span>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">
                Important
              </p>
              <p className="text-xs text-yellow-700">
                Ce numéro sera utilisé pour les communications importantes
                concernant vos commandes. Assurez-vous qu'il est correct et
                actif.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ModifierNumero;

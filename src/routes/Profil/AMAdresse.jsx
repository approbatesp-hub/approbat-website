import { Link } from "react-router";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FiMapPin, FiHome, FiNavigation, FiSave } from "react-icons/fi";
import { communesAbidjan } from "../../utils/constants";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { connexion } from "../../redux/espremium";
import toast from "react-hot-toast";
import supabase from "../../../supase-client";

const AMAdresse = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  let communeDefaut = {
    value: userInfo?.adresse?.commune,
    label: userInfo?.adresse?.commune,
  };

  let districtDefaut = {
    value: userInfo?.adresse?.district,
    label: userInfo?.adresse?.district,
  };

  const [adresse, setAdresse] = useState(userInfo?.adresse?.adresse || "");
  const [district, setDistrict] = useState(
    districtDefaut.value ? districtDefaut : ""
  );
  const [commune, setCommune] = useState(
    communeDefaut.value ? communeDefaut : ""
  );

  async function applyChange(e) {
    e.preventDefault();

    if (!adresse || !district || !commune) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }

    let adresseClient = {
      district: district.label,
      commune: commune.label,
      adresse: adresse,
    };

    try {
      const toastId = toast.loading("Mis à jour en cours ");
      const { error } = await supabase
        .from("Users")
        .update({ adresse: adresseClient })
        .eq("id", userInfo.id);

      if (error) throw error;

      dispatch(
        connexion({
          ...userInfo,
          adresse: adresseClient,
        })
      );
      toast.dismiss(toastId);
      toast.success("Adresse modifiée avec succès ✅");
      setDistrict("");
      setCommune("");
      setAdresse("");
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  }

  const choixDistrict = ["District Autonome d'Abidjan"];
  const options1 = choixDistrict.map((el) => ({ value: el, label: el }));
  const options2 = communesAbidjan.map((el) => ({
    value: el.commune,
    label: el.commune,
  }));

  const isFormValid = district && commune && adresse.trim();

  return (
    <div className="min-h-full flex flex-col items-center justify-center md:p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/profil/adresse"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FaArrowCircleLeft className="text-2xl text-amber-500" />
        </Link>
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-3">
            Modifier l'adresse de livraison
          </h1>
          <p className="text-gray-600 mt-1">
            Mettez à jour vos informations d'adresse pour des livraisons
            précises
          </p>
        </div>
      </div>

      {/* Current Address Preview */}
      {userInfo?.adresse?.district && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 md:p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FiHome className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Adresse actuelle
              </p>
              <p className="text-blue-800 text-sm">
                {userInfo.adresse.district}, {userInfo.adresse.commune},{" "}
                {userInfo.adresse.adresse}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="md:max-w-2xl">
        <form onSubmit={applyChange} className=" space-y-3 md:space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-6">
            {/* District Selection */}
            <div className="space-y-2 mb-6">
              <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiNavigation className="text-gray-400" />
                District
              </label>
              <Select
                value={district}
                onChange={setDistrict}
                options={options1}
                placeholder="Sélectionnez votre district"
                className="react-select-container"
                classNamePrefix="react-select"
                isSearchable={false}
              />
            </div>

            {/* Commune Selection */}
            <div className="space-y-2 mb-6">
              <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="text-gray-400">🏙️</span>
                Commune
              </label>
              <Select
                value={commune}
                onChange={setCommune}
                options={options2}
                placeholder="Sélectionnez votre commune"
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label className=" text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiMapPin className="text-gray-400" />
                Adresse exacte
              </label>
              <textarea
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Ex: Rue des Commerce, Immeuble ABC, Appartement 12..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                          focus:border-transparent resize-none
                         placeholder-gray-400 transition-colors min-h-[100px]"
                rows={3}
              />
              <p className="text-xs text-gray-500">
                Soyez le plus précis possible pour une livraison sans problème
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link
              to="/profil/adresse"
              className="px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-lg 
                       hover:bg-gray-50 transition-colors font-medium text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="flex items-center justify-center gap-2 bg-amber-500 text-white 
                       px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-amber-600 
                       disabled:bg-gray-400 disabled:cursor-not-allowed
                       transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <div className=" flex gap-2 items-center ">
                  <FiSave className="text-lg" />
                  <span className="text-nowrap">Enregistrer</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AMAdresse;

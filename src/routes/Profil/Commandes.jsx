import { NavLink } from "react-router";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";
import ZeroPurchase from "../../assets/Images/animation/ZeroPurchase.json";
import Aloading from "../../assets/Images/animation/ALoading.json";
import Lottie from "lottie-react";
import { useQuery } from "@tanstack/react-query";
import CommandesCardEN from "../../components/CommandesCardEN";
import { useSelector } from "react-redux";
import { recuperCommandesEnCours } from "../../utils/hooks";
import Logo from "../../assets/Images/logo-no-bg.png";
const Commandes = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const {
    data: allCommandes,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["CommandesEnCours"],
    queryFn: () => recuperCommandesEnCours(userInfo.id),
    enabled: true,
  });

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-2xl text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h3>
          <p className="text-gray-600">
            Impossible de charger vos commandes. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full md:p-6">
      {/* Header */}
      <div className=" mb-4 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <FiPackage className="text-orange-500" />
          Mes Commandes
        </h1>
        <p className="text-gray-600">
          Suivez l'état de vos commandes en temps réel
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-6  ">
        <div className="flex bg space-x-1">
          <NavLink
            to="/profil/commandes"
            end
            className={({ isActive }) => `
              flex justify-center items-center w-full gap-2 px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <FiClock className="" />
            <span className="text-nowrap">En Cours</span>
            {allCommandes?.length > 0 && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                {allCommandes.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/profil/commandes/okay"
            end
            className={({ isActive }) => `
              flex items-center justify-center w-full gap-2 px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-green-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <FiCheckCircle className="text-lg" />
            Livrées
          </NavLink>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center md:min-h-[400px]">
          <Lottie animationData={Aloading} loop className="w-32" />
          <p className="text-gray-600 mt-4">Chargement de vos commandes...</p>
        </div>
      ) : allCommandes?.length > 0 ? (
        <div className="space-y-4">
          <CommandesCardEN allCommandes={allCommandes} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center md:min-h-[400px]  text-center">
          <div className="w-48 ">
            <Lottie animationData={ZeroPurchase} loop />
          </div>

          <h3 className=" text-lg md:text-xl font-semibold text-gray-900 mb-2">
            Aucune commande en cours
          </h3>
          <p className="text-gray-600 max-w-md mb-6">
            Vous n'avez pas de commande en cours de traitement.{" "}
            <span className="hidden md:inline">
              Parcourez notre catalogue et faites votre première commande !
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default Commandes;

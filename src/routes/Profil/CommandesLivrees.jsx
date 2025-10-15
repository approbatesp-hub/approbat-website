import { NavLink } from "react-router";
import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiAward,
} from "react-icons/fi";
import ZeroPurchase from "../../assets/Images/animation/ZeroPurchase.json";
import Aloading from "../../assets/Images/animation/ALoading.json";
import Lottie from "lottie-react";
import { recuperCommandesLivre } from "../../utils/hooks";
import { useQuery } from "@tanstack/react-query";
import CommandesCardLI from "../../components/CommandesCardLI";
import { useSelector } from "react-redux";

const CommandesLivrees = () => {
  const { userInfo } = useSelector((state) => state.projet);
  const {
    data: allCommandes,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["CommandesLivrees"],
    queryFn: () => recuperCommandesLivre(userInfo.id),
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
            Impossible de charger vos commandes livrées. Veuillez réessayer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-3 mb-2">
          <FiCheckCircle className="text-green-500" />
          Commandes Livrées
        </h1>
        <p className="text-gray-600">
          Retrouvez l'historique de vos commandes complétées
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className=" rounded-xl shadow-sm border border-gray-200 p-1 mb-6 flex items-center ">
        <div className="flex w-full flex-1 space-x-1">
          <NavLink
            to="/profil/commandes"
            end
            className={({ isActive }) => `
              flex w-full justify-center items-center gap-2  px-4 md:px-6 py-3 rounded-lg font-medium  transition-all duration-200
              ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <FiClock className="text-lg" />
            <span className="text-nowrap">En Cours</span>
          </NavLink>

          <NavLink
            to="/profil/commandes/okay"
            end
            className={({ isActive }) => `
              flex w-full  justify-center items-center gap-2 px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-green-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <FiCheckCircle className="text-lg" />
            Livrées
            {allCommandes?.length > 0 && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
                {allCommandes.length}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center md:min-h-[400px]">
          <Lottie animationData={Aloading} loop className="w-32" />
          <p className="text-gray-600 mt-4">
            Chargement de vos commandes livrées...
          </p>
        </div>
      ) : allCommandes?.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4"></div>
          <CommandesCardLI allCommandes={allCommandes} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center md:min-h-[400px] text-center">
          <div className="w-48 ">
            <Lottie animationData={ZeroPurchase} loop />
          </div>

          <h3 className="text-lg md:text-xl  font-semibold text-gray-900 mb-2">
            Aucune commande livrée
          </h3>
          <p className="text-gray-600 max-w-md mb-6">
            Vous n'avez pas encore de commande livrée.{" "}
            <span className="hidden md:inline">
              Vos commandes terminées apparaitront ici une fois livrées.
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CommandesLivrees;

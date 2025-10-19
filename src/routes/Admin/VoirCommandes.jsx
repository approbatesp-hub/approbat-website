import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import { FaFilePdf } from "react-icons/fa6";

import Lottie from "lottie-react";
import Pagination from "rc-pagination";
import ZeroPurchase from "../../assets/Images/animation/EmptyOrder.json";
import Aloading from "../../assets/Images/animation/ALoading.json";
import { useState } from "react";
import { recuperCommandes } from "../../utils/hooks";

import Logo from "../../assets/Images/logo-no-bg.png";
import { generateOrderPDF } from "../../utils/hookPDF";
import supabase from "../../../supase-client";
import toast from "react-hot-toast";

const VoirCommandes = () => {
  const formatNumberWithDots = (number) =>
    number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const {
    data: allCommandes = [],
    error,
    isLoading,
    refetch: refreshCommands,
  } = useQuery({
    queryKey: ["allCommandes"],
    queryFn: recuperCommandes,
    staleTime: 5 * 60 * 1000,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = allCommandes.slice(startIdx, startIdx + pageSize);

  async function changeState(e, id) {
    try {
      const { error } = await supabase
        .from("Orders") // or "Orders" if that's your table name
        .update({ status: e.target.value })
        .eq("id", id);

      if (error) throw error;

      toast.success("Statut mis à jour ✅");
      refreshCommands();
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (error) {
    return (
      <div className="text-center py-12 text-amber-500">
        Erreur: Impossible de charger les commandes.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Lottie animationData={Aloading} loop className="w-32" />
      </div>
    );
  }

  if (currentItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <Lottie animationData={ZeroPurchase} loop className="w-48 md:w-64" />
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-2">
          Aucune commande trouvée
        </h3>
        <p className="text-gray-600 max-w-md">
          Il n'y a aucune commande dans le système pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5  h-full flex-col flex">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Toutes les commandes
        </h1>
        <p className="text-gray-600 mt-2">
          {currentItems.length} commandes passées
        </p>
        <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-2"></div>
      </div>

      {/* Orders Table */}
      <div className="bg-white  rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto ">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-br from-bleu2 to-bleu3 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
                  Client
                </th>
                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                  Montant
                </th>
                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Impression
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((el) => (
                <tr key={el.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden lg:table-cell capitalize">
                    {el.idClient.nomComplet}
                  </td>
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {format(new Date(el.created_at), "dd/MM/yy", {
                      locale: frCA,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden md:table-cell">
                    {formatNumberWithDots(el.montantTotal)} Fcfa
                  </td>
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                    <select
                      className={` cursor-pointer  border-bleu4 rounded-md p-2 outline-none  text-[12px] md:text-[16px]   ${
                        el.status === "livre"
                          ? "bg-green-500 border-none text-white"
                          : ""
                      } `}
                      onChange={(e) => changeState(e, el.id)}
                      value={el.status}
                    >
                      <option value="en cours">En cours</option>
                      <option value="livre">Livré</option>
                    </select>
                  </td>
                  <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm   ">
                    <button
                      onClick={() => generateOrderPDF(el, Logo)}
                      className="text-amber-500 hover:text-amber-600 transition-colors "
                      title="Télécharger PDF"
                    >
                      <FaFilePdf className="text-2xl" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="w-full  mt-auto">
        <div className="w-full flex justify-center ">
          <Pagination
            current={currentPage}
            total={allCommandes.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showLessItems
            className="rc-pagination"
          />
        </div>
      </div>
    </div>
  );
};

export default VoirCommandes;

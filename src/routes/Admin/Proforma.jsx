import React, { useState } from "react";
import { recuperFactures } from "../../utils/hooks";
import { useQuery } from "@tanstack/react-query";
import { FaFilePdf, FaDeleteLeft } from "react-icons/fa6";
import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import Lottie from "lottie-react";
import Pagination from "rc-pagination";
import ZeroPurchase from "../../assets/Images/animation/EmptyOrder.json";
import Aloading from "../../assets/Images/animation/ALoading.json";

import toast from "react-hot-toast";
import Logo from "../../assets/Images/logo-no-bg.png";
import { generateFacturePDF } from "../../utils/hookPDF"; // We'll create this function

const Proforma = () => {
  const formatNumberWithDots = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const {
    data: allFactures,
    error,
    isLoading,
    refetch: refreshFactures,
  } = useQuery({
    queryKey: ["allFactures"],
    queryFn: recuperFactures,
    enabled: true,
    staleTime: 5 * 60 * 1000,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = allFactures?.slice(startIdx, endIdx);

  async function deleteFacture(id) {}

  // Function to generate PDF using html2canvas and jsPDF (same as VoirCommandes)
  const handleGeneratePDF = (facture) => {
    generateFacturePDF(facture, Logo);
  };

  if (error) {
    return (
      <section className="flex justify-center items-center h-full">
        <p>Une erreur s'est produite lors de la récupération des données</p>
      </section>
    );
  }

  return (
    <div className="h-full flex flex-col bg-  ">
      <div className="mb-5">
        <h1 className=" text-xl md:text-2xl font-bold text-gray-800">
          Voir les factures{" "}
        </h1>
        <p className="text-gray-600 mt-2">
          {currentItems?.length}{" "}
          {currentItems?.length > 1 ? `factures générées` : `facture générée`}
        </p>
        <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-2"></div>
      </div>

      {/* Empty State */}
      {!isLoading && currentItems?.length === 0 && (
        <div className="h-full flex flex-col justify-center items-center mt-5">
          <p className="uppercase text-center mt-2 font-medium text-base lg:text-[20px] font-sans2">
            Aucune Facture pour le moment.
          </p>
          <Lottie
            animationData={ZeroPurchase}
            loop={true}
            className="w-[300px]"
          />
        </div>
      )}

      {
        isLoading ? (
          <div className="flex items-center h-full w-full justify-center">
            <Lottie
              animationData={Aloading}
              loop={true}
              className="w-[200px]"
            />
          </div>
        ) : (
          currentItems?.length > 0 && (
            <div className="h-full  ">
              {/* Modern Table Design similar to VoirCommandes */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-br from-bleu2 to-bleu3 text-white">
                      <tr>
                        <th className="px-2 md:px-6 bg- py-3 text-left text-xs font-medium uppercase tracking-wider">
                          N°
                        </th>
                        <th className="px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider hidden lg:table-cell">
                          Montant Total
                        </th>

                        <th className="px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Impression
                        </th>
                        <th className="px-2 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          Supprimer
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems?.map((el, i) => (
                        <tr key={el.id} className="hover:bg-gray-50">
                          <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {i + 1}
                          </td>
                          <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {format(new Date(el.created_at), "dd/MM/yy", {
                              locale: frCA,
                            })}
                          </td>
                          <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                            {formatNumberWithDots(el.montantTotal)} Fcfa
                          </td>

                          <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleGeneratePDF(el)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Télécharger PDF"
                            >
                              <FaFilePdf className="text-2xl" />
                            </button>
                          </td>
                          <td className="px-2 md:px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => deleteFacture(el.id)}
                              className="text-gray-500 hover:text-red-500 transition-colors"
                              title="Supprimer facture"
                            >
                              <FaDeleteLeft className="text-2xl" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
            </div>
          )
        )

        // <div className="h-full flex flex-col justify-center items-center mt-5">
        //   <p className="uppercase text-center mt-2 font-medium text-base lg:text-[20px] font-sans2">
        //     Aucune Facture pour le moment.
        //   </p>
        //   <Lottie
        //     animationData={ZeroPurchase}
        //     loop={true}
        //     className="w-[300px]"
        //   />
        // </div>
      }
      <div className="w-full flex justify-center  mt-auto">
        <Pagination
          current={currentPage}
          total={allFactures?.length}
          pageSize={pageSize}
          onChange={onPageChange}
          showLessItems
          className="rc-pagination"
        />
      </div>
    </div>
  );
};

export default Proforma;

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { recuperUtilisateurs } from "../../utils/hooks";
import Aloading from "../../assets/Images/animation/ALoading.json";
import ZeroPurchase from "../../assets/Images/animation/EmptyOrder.json";
import { MdAdminPanelSettings, MdRemoveModerator } from "react-icons/md";
import { FiUser, FiShield, FiMail, FiCalendar } from "react-icons/fi";
import Lottie from "lottie-react";
import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import toast from "react-hot-toast";
import Pagination from "rc-pagination/lib/Pagination";
import supabase from "../../../supase-client";
import "rc-pagination/assets/index.css"; // 👈 ADD THIS

const Utilisateurs = () => {
  const {
    data: allUsers,
    error,
    isLoading,
    refetch: refreshUsers,
  } = useQuery({
    queryKey: ["allUtilisateurs"],
    queryFn: recuperUtilisateurs,
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
  const currentItems = allUsers?.slice(startIdx, endIdx);

  async function updateAdmin(id) {
    try {
      const { error } = await supabase
        .from("Users")
        .update({ role: "admin" })
        .eq("id", id);

      if (error) throw error;

      toast.success("Nouveau Administrateur Ajouté");
      refreshUsers(); // your existing function to reload users
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function removeAdmin(id) {
    try {
      const { error } = await supabase
        .from("Users")
        .update({ role: "client" })
        .eq("id", id);

      if (error) throw error;

      toast.error("Role d'Administrateur retiré ❌");
      refreshUsers();
    } catch (error) {
      toast.error(error.message);
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-red-600">
          <p>Une erreur s'est produite lors de la récupération des données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full  ">
      <div className="">
        {/* Header */}
        <div className="mb-6">
          <h1 className=" text-xl md:text-2xl font-bold text-gray-900">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-600 mt-2">
            {currentItems?.length}{" "}
            {currentItems?.length > 1 ? `utilisateurs` : `utilisateur`}
          </p>
          <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-2"></div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center h-screen -mt-[20vh] ">
            <Lottie
              animationData={Aloading}
              loop={true}
              className="w-[200px] "
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && currentItems?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <Lottie
              animationData={ZeroPurchase}
              loop={true}
              className="w-64 mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucun utilisateur
            </h3>
            <p className="text-gray-500">
              Aucun utilisateur n'est enregistré pour le moment
            </p>
          </div>
        )}

        {/* Users Table */}
        {!isLoading && currentItems?.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className=" bg-gradient-to-br from-bleu2 to-bleu3 border-b border-[#b2b4b7] ">
                  <tr className="rounded-xl">
                    <th className="text-left text-xs uppercase p-2 lg:p-4  font-semibold text-white">
                      Utilisateur
                    </th>
                    <th className="text-left p-2 lg:p-4 font-semibold text-xs uppercase text-white hidden lg:table-cell">
                      Email
                    </th>
                    <th className="text-left p-2 lg:p-4  font-semibold text-xs uppercase text-white">
                      Rôle
                    </th>
                    <th className="text-left p-2 lg:p-4  font-semibold text-xs uppercase text-white hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-left p-2 lg:p-4  font-semibold text-xs uppercase text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentItems.map((user) => (
                    <tr key={user.id} className=" transition-colors">
                      {/* User Info */}
                      <td className="p-2 md:p-4 ">
                        <div className="flex items-center space-x-3">
                          <div className=" hidden w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full lg:flex items-center justify-center">
                            <FiUser className="text-white text-lg" />
                          </div>
                          <div>
                            <p className="font-medium text-xs  text-gray-900 capitalize">
                              {user.nomComplet}
                            </p>
                            <p className="text-xs  text-gray-500 md:hidden">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="p-2 md:p-4  hidden lg:table-cell">
                        <div className="flex items-center space-x-2 text-xs  text-gray-600">
                          <FiMail className="text-gray-400" />
                          <span>{user.email}</span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="p-2 md:p-4 ">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            user.role === "administrateur"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          <FiShield className=" hidden md:block mr-1" />
                          <span className="block md:hidden uppercase">
                            {user.role.slice(0, 2)}.
                          </span>
                          <span className="hidden md:block">{user.role}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-2 lg:p-4  hidden md:table-cell">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <FiCalendar className="text-gray-400" />
                          <span>
                            {format(user.created_at, "dd/MM/yy", {
                              locale: frCA,
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-2 lg:p-4 ">
                        {user.role === "client" ? (
                          <button
                            onClick={() => updateAdmin(user.id)}
                            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors cursor-pointer"
                            title="Ajouter comme Admin"
                          >
                            <MdAdminPanelSettings className="text-xl" />
                            <span className="hidden sm:inline">Promouvoir</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => removeAdmin(user.id)}
                            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                            title="Retirer comme Admin"
                          >
                            <MdRemoveModerator className="text-xl" />
                            <span className="hidden sm:inline">
                              Rétrograder
                            </span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {/* {allUsers?.length > pageSize && (
            <div className="border-t px-6 py-4">
              <div className="flex justify-center">
                <Pagination
                  current={currentPage}
                  total={allUsers.length}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  className="flex space-x-2"
                />
              </div>
            </div>
          )} */}
          </div>
        )}
      </div>

      <div className=" w-full mt-auto ">
        <div className="w-full flex justify-center    ">
          <Pagination
            current={currentPage}
            total={allUsers?.length || 0}
            pageSize={pageSize}
            onChange={onPageChange}
            showLessItems
            showTitle={false}
            className="rc-pagination"
          />
        </div>
      </div>
    </div>
  );
};

export default Utilisateurs;

import { format } from "date-fns";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { FiCalendar, FiTag, FiPercent, FiTrash2 } from "react-icons/fi";
import { compareAsc } from "date-fns";
import { startOfTomorrow } from "date-fns";
import { getCoupons } from "../../utils/hooks";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../../supase-client";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import Lottie from "lottie-react";
import Aloading from "../../assets/Images/animation/ALoading.json";

const Coupons = () => {
  const [nom, setNom] = useState("");
  const [reduction, setReduction] = useState("");
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(startOfTomorrow());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const {
    data: coupons = [],
    isLoading,
    error,
    refetch: refreshCoupons,
  } = useQuery({
    queryKey: ["allCoupons"],
    queryFn: getCoupons,
    staleTime: 5 * 60 * 1000,
  });

  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = coupons?.slice(startIdx, startIdx + pageSize);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Création en cours...");

    if (compareAsc(dateFin, dateDebut) !== 1) {
      toast.dismiss(toastId);
      return toast.error("La date de fin doit être après la date de début");
    }

    if (!nom || !reduction) {
      toast.dismiss(toastId);
      return toast.error("Veuillez remplir tous les champs");
    }

    if (Number(reduction) < 1 || Number(reduction) > 100) {
      toast.dismiss(toastId);
      return toast.error("La réduction doit être entre 1 et 100%");
    }

    try {
      const { error } = await supabase.from("Coupons").insert([
        {
          nom: nom.toUpperCase(),
          dateDebut: dateDebut.toISOString(),
          dateFin: dateFin.toISOString(),
          reduction: Number(reduction),
        },
      ]);

      if (error) {
        if (error.message.includes("duplicate key value violates unique")) {
          toast.dismiss(toastId);
          return toast.error("Ce coupon existe déjà");
        }
        toast.dismiss(toastId);
        return toast.error("Erreur lors de la création du coupon");
      }

      toast.dismiss(toastId);
      toast.success(`Coupon ${nom} créé avec succès`);
      setNom("");
      setReduction("");
      refreshCoupons();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const toastId = toast.loading("Suppression en cours...");
      const { error } = await supabase.from("Coupons").delete().eq("id", id);

      if (error) throw error;

      toast.dismiss(toastId);
      toast.success("Coupon supprimé");
      refreshCoupons();
    } catch (error) {
      toast.error(error.message);
    }
  };

  {
    /* Loading State */
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-amber-600">
          <p>Erreur lors de la récupération des coupons</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" space-y-2 ">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Gestion des Coupons
        </h1>
        <p className="text-gray-600 mt-2">
          {currentItems.length}{" "}
          {currentItems.length > 1 ? `coupons crées` : `coupon crée`}
        </p>
        <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-2"></div>
      </div>
      <div className=" space-y-4 ">
        {/* Create Coupon Form */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0f0f0] p-3 lg:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Créer un nouveau coupon
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Code Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code du coupon
              </label>
              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="EXEMPLE20"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Reduction Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pourcentage de réduction
              </label>
              <div className="relative">
                <FiPercent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={reduction}
                  onChange={(e) => setReduction(e.target.value)}
                  placeholder="20"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <DatePicker
                  selected={dateDebut}
                  onChange={setDateDebut}
                  minDate={new Date()}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            {/* Date End */}
            <div className="w-full ">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <div className="relative flex  w-full  ">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <DatePicker
                  selected={dateFin}
                  onChange={setDateFin}
                  minDate={startOfTomorrow()}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors cursor-pointer"
              >
                Créer le coupon
              </button>
            </div>
          </form>
        </div>

        {/* Coupons List */}
        <div className="bg-white rounded-xl shadow-sm border border-[#f0f0f0]">
          <div className="p-6 border-b border-[#c1bcbc] ">
            <h3 className="text-lg font-semibold text-gray-900">
              Liste des coupons
            </h3>
          </div>

          {currentItems.length === 0 && isLoading ? (
            <div className="flex items-center justify-center  ">
              <Lottie
                animationData={Aloading}
                loop={true}
                className="w-[150px] "
              />
            </div>
          ) : currentItems.length === 0 && !isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <FiTag className="mx-auto text-4xl text-gray-300 mb-3" />
              <p>Aucun coupon créé pour le moment</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-[#c1bcbc]">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Code
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Réduction
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700 hidden md:table-cell">
                        Début
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700 hidden md:table-cell">
                        Fin
                      </th>
                      <th className="text-left p-3 font-semibold text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentItems.map((coupon) => (
                      <tr
                        key={coupon.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 font-mono font-semibold text-blue-600">
                          {coupon.nom}
                        </td>
                        <td className="p-3">
                          <span className="bg-amber-300 text-blue-600 px-2 py-1 rounded-full text-sm font-medium">
                            {coupon.reduction}%
                          </span>
                        </td>
                        <td className="p-3 hidden md:table-cell text-gray-600">
                          {format(new Date(coupon.dateDebut), "dd/MM/yyyy")}
                        </td>
                        <td className="p-3 hidden md:table-cell text-gray-600">
                          {format(new Date(coupon.dateFin), "dd/MM/yyyy")}
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => deleteCoupon(coupon.id)}
                            className="text-amber-500 hover:bg-amber-600 p-1 rounded-md  cursor-pointer hover:text-white transition-colors"
                            title="Supprimer le coupon"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {coupons.length > pageSize && (
                <div className="border-t border-[#c1bcbc] px-6 py-4">
                  <Pagination
                    current={currentPage}
                    total={coupons?.length}
                    pageSize={pageSize}
                    onChange={setCurrentPage}
                    showLessItems
                    className="flex justify-center"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;

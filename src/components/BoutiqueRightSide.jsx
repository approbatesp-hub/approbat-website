// src/components/BoutiqueRightSide.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { ImHeart } from "react-icons/im";
import { CgHeart } from "react-icons/cg";
import { RiMenuFold3Fill } from "react-icons/ri";
import { formatNumberWithDots } from "../utils/constants";
import { sendProductInfo } from "../redux/espremium";
import { addOrRemoveToFav } from "../utils/queries";
import Partner1 from "../assets/Images/Partenaires/sibm.png";
import Partner2 from "../assets/Images/Partenaires/sotaci.png";
import Partner3 from "../assets/Images/Partenaires/sotici.png";

const BoutiqueRightSide = ({ produits, openDrawer }) => {
  const partners = [
    { logo: Partner1, name: "SIBM" },
    { logo: Partner2, name: "SOTACI" },
    { logo: Partner3, name: "SOTICI" },
  ];

  const dispatch = useDispatch();
  const { userInfo, favorites } = useSelector((state) => state.projet);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || 1
  );
  const [pageSize] = useState(20);

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = startIdx + pageSize;
  const currentItems = produits?.slice(startIdx, endIdx);
  const navigate = useNavigate();

  function navigateProduct(produit) {
    const slug = produit.nom.toLowerCase().split(" ").join("_");
    dispatch(sendProductInfo(produit));
    navigate(`/produit/${slug}`, {
      state: { produit: produit, produits: produits },
    });
  }

  return (
    <div className="h-full   flex flex-col border border-[#E5E5E5] rounded-xl">
      <div className="flex gap-2 md:gap-0    flex-col md:flex-row md:justify-between md:items-center p-3 px-8 border-b border-[#E5E5E5]">
        <div className="flex   items-center justify-between border-b border-[#E5E5E5] md:border-none pb-2">
          <h3 className="font-semibold text-[18px]">Nos articles</h3>
          <RiMenuFold3Fill
            className="md:hidden text-amber-500 font-semibold text-[25px]"
            onClick={() => openDrawer()}
          />
        </div>
        <p className="text-[14px]  ">
          {produits?.length || 0}{" "}
          {produits?.length === 1 ? "produit trouvé" : "produits trouvés"}
        </p>
      </div>

      <div className="relative h-full">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5  gap-[10px] p-3 md:gap-[20px] md:p-5 mb-[60px]">
          {currentItems?.map((produit) => (
            <div
              onClick={() => navigateProduct(produit)}
              key={produit.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-md"
            >
              {/* Product Image + Badges */}
              <div className="relative overflow-hidden">
                {/* ✅ IMPROVED: Partner badge (top-left) */}
                {produit?.fournisseur &&
                  produit?.fournisseur !== "aucun" &&
                  partners.find(
                    (el) => el.name === produit?.fournisseur.toUpperCase()
                  ) && (
                    <div className="absolute top-2 left-2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden border-2 border-white shadow-sm">
                      <img
                        src={
                          partners.find(
                            (el) =>
                              el.name === produit?.fournisseur.toUpperCase()
                          )?.logo
                        }
                        alt={produit.fournisseur}
                        className="w-full h-full object-contain bg-white"
                      />
                    </div>
                  )}

                <div className="h-[120px] md:h-[140px] lg:h-[160px]  w-full relative overflow-hidden">
                  <img
                    className="w-full h-full rounded-t-xl object-cover transition-transform duration-500 group-hover:scale-105"
                    src={produit.images[0]}
                    alt={produit.nom}
                  />

                  {/* Favorite Button (top-right) */}
                  <div
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all duration-300 group  hover:text-white hover:scale-110"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents navigation on heart click
                      addOrRemoveToFav(e, produit, userInfo, dispatch);
                    }}
                  >
                    {favorites?.length > 0 &&
                    favorites?.find((res) => res.id === produit?.id) ? (
                      <ImHeart className="text-lg text-amber-500 " />
                    ) : (
                      <CgHeart className="text-lg text-gray-600" />
                    )}
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className=" flex flex-col flex-between p-2 gap-2  md:p-4 min-h-[calc(100%-120px)] md:min-h-[calc(100%-140px)]">
                <div className="">
                  <h3 className="font-medium capitalize text-gray-900  line-clamp-2">
                    {produit.nom.length > 30
                      ? `${produit.nom.slice(0, 29)}...`
                      : produit.nom}
                  </h3>
                  {produit?.fournisseur !== "aucun" && (
                    <span className="text-gray-900 text-xs uppercase font-medium">
                      {produit?.fournisseur}
                    </span>
                  )}
                </div>
                <div
                  className="   mt-auto lg:mt-0
                 "
                >
                  <div className="">
                    <p className="md:text-lg font-bold text-amber-500">
                      {formatNumberWithDots(produit.prixReference)} Fcfa
                    </p>
                    <div className="hidden md:flex items-center text-sm text-gray-500 my-1">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                      Min: {produit.quantiteMinimale}
                    </div>
                    <button className="bg-gray-100 inline-block w-full  text-gray-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-200">
                      Voir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="absolute w-full bottom-2">
          <div className="w-full flex border-t pt-3 border-gray-200 justify-center my-1">
            <Pagination
              style={{ fontWeight: "normal" }}
              current={currentPage}
              total={produits?.length || 0}
              pageSize={pageSize}
              onChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoutiqueRightSide;

// pages/Search.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import Lottie from "lottie-react";
import Aloading from "../assets/Images/animation/ALoading.json"; // ✅ your loader
import Nothing from "../assets/Images/animation/NOFOUND1.json";
import { formatNumberWithDots } from "../utils/constants";
import Partner1 from "../assets/Images/Partenaires/sibm.png";
import Partner2 from "../assets/Images/Partenaires/sotaci.png";
import Partner3 from "../assets/Images/Partenaires/sotici.png";
import { useDispatch, useSelector } from "react-redux";
import { addOrRemoveToFav } from "../utils/queries";
import { ImHeart } from "react-icons/im";
import { CgHeart } from "react-icons/cg";
import { sendProductInfo } from "../redux/espremium";
import { useQuery } from "@tanstack/react-query";
import supabase from "../../supase-client";

const Search = () => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("q")?.trim() || "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favorites, approbatProducts, userInfo } = useSelector(
    (state) => state.projet
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // 🔹 Fetch products with React Query
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchProducts", searchTerm],
    queryFn: async () => {
      let query = supabase.from("Products").select("*").eq("enStock", true);

      if (searchTerm) {
        // Search in `nom` and `description` (case-insensitive partial match)
        query = query.or(
          `nom.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    keepPreviousData: true, // smooth UX when changing search
  });

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = products.slice(startIdx, startIdx + pageSize);

  const partners = [
    { logo: Partner1, name: "SIBM" },
    { logo: Partner2, name: "SOTACI" },
    { logo: Partner3, name: "SOTICI" },
  ];

  const navigateProduct = (produit) => {
    const slug = produit.nom.toLowerCase().replace(/\s+/g, "_");
    dispatch(sendProductInfo(produit));
    navigate(`/produit/${slug}`, {
      state: { produit, produits: approbatProducts },
    });
  };

  // 🔹 Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Lottie animationData={Aloading} loop className="w-[150px]" />
      </div>
    );
  }

  // 🔹 Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <p>Erreur lors de la recherche</p>
        <p className="text-sm mt-2">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="md:max-w-[90%] flex flex-col flex-1 mx-auto pt-[140px] pb-[60px] md:py-[120px] px-4">
      {/* Header */}
      <div className="bg-white border border-[#E5E5E5] rounded-xl p-2 mb-4">
        <div className="text-center">
          <h1 className="text-lg text-gray-800">
            {products.length}{" "}
            {products.length > 1 ? "articles trouvés" : "article trouvé"}
          </h1>
        </div>
      </div>

      {/* Empty State */}
      {currentItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Lottie animationData={Nothing} loop className="w-64 md:w-80" />
          <p className="mt-6 text-gray-600 text-lg font-medium">
            Aucun article ne correspond à votre recherche.
          </p>
        </div>
      )}

      {/* Product Grid */}
      {currentItems.length > 0 && (
        <div className="border border-[#E5E5E5] rounded-xl p-3 md:p-6 bg-white">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[10px] md:gap-[20px] mb-[60px]">
            {currentItems.map((produit) => {
              const partner = partners.find(
                (p) => p.name === produit?.fournisseur?.toUpperCase()
              );
              return (
                <div
                  key={produit.id}
                  onClick={() => navigateProduct(produit)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-md"
                >
                  {/* Product Image + Badge */}
                  <div className="relative overflow-hidden">
                    {produit?.fournisseur &&
                      produit?.fournisseur !== "aucun" &&
                      partner && (
                        <div className="absolute top-2 left-2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden border-2 border-white shadow-sm">
                          <img
                            src={partner.logo}
                            alt={produit.fournisseur}
                            className="w-full h-full object-contain bg-white"
                          />
                        </div>
                      )}

                    <div className="h-[120px] md:h-[160px] w-full relative overflow-hidden">
                      <img
                        src={produit.images?.[0] || "/fallback.jpg"}
                        alt={produit.nom}
                        className="w-full h-full rounded-t-xl object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/fallback.jpg";
                        }}
                      />
                      <div
                        className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:bg-[#f0701e] hover:text-white hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          addOrRemoveToFav(e, produit, userInfo, dispatch);
                        }}
                      >
                        {favorites?.some((fav) => fav.id === produit.id) ? (
                          <ImHeart className="text-lg text-red-500" />
                        ) : (
                          <CgHeart className="text-lg text-gray-600" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col flex-between p-2 gap-2 md:p-4 min-h-[calc(100%-120px)]">
                    <div>
                      <h3 className="font-medium capitalize text-gray-900 line-clamp-2">
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

                    <div className="mt-auto md:mt-0">
                      <p className="md:text-lg font-bold text-orange-600">
                        {formatNumberWithDots(produit.prixReference)} Fcfa
                      </p>
                      <div className="hidden md:flex items-center text-sm text-gray-500 mt-1">
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
                      <button className="bg-gray-100 inline-block w-full text-gray-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-200">
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="w-full flex justify-center mt-4">
            <Pagination
              current={currentPage}
              total={products.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showLessItems
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;

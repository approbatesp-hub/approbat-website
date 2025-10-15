import { MdDeleteForever } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import Lottie from "lottie-react";
import Nothing from "../../assets/Images/animation/NOFOUND1.json";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { formatNumberWithDots } from "../../utils/constants";
import {
  keepProducts,
  removeToFav,
  sendProductInfo,
} from "../../redux/espremium";
import { recupererProduits } from "../../utils/hooks";
import toast from "react-hot-toast";
import supabase from "../../../supase-client";
import NoProduct from "../../assets/Images/noProduct.png";
import { useEffect, useState } from "react";
const ListeEnvies = () => {
  const dispatch = useDispatch();
  const { userInfo, approbatProducts, favorites } = useSelector(
    (state) => state.projet
  );
  const navigate = useNavigate();
  const [finalFavs, setFinalFavs] = useState([]);
  async function RemoveToFav(produit) {
    try {
      const toastId = toast.loading("Suppression en cours");
      const { data: userObject, error: fetchError } = await supabase
        .from("Users")
        .select("*")
        .eq("id", userInfo.id)
        .single();

      if (fetchError) throw fetchError;

      const favoris = userObject.favoris || [];
      const updatedFavoris = favoris.filter((fav) => fav.id !== produit.id);

      const { error: updateError } = await supabase
        .from("Users")
        .update({ favoris: updatedFavoris })
        .eq("id", userInfo.id);

      if (updateError) throw updateError;
      dispatch(removeToFav(produit));
      toast.dismiss(toastId);
      toast.error("Produit retiré des favoris ❌");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function navigateProduct(produit) {
    const slug = produit.nom.toLowerCase().split(" ").join("_");
    if (!approbatProducts.length > 0) {
      const data = await recupererProduits(100, 1000000, dispatch);
      dispatch(sendProductInfo(produit));
      dispatch(keepProducts(data));
      navigate(`/produit/${slug}`, {
        state: { produit: produit, produits: data },
      });
    } else {
      dispatch(sendProductInfo(produit));
      navigate(`/produit/${slug}`, {
        state: { produit: produit, produits: approbatProducts },
      });
    }
  }

  async function buildFinalFavs(favorites = [], approbatProducts = []) {
    // Build a Map of live products by ID for O(1) lookup
    if (!approbatProducts.length > 0) {
      const data = await recupererProduits(100, 1000000, dispatch);

      dispatch(keepProducts(data));
      const liveMap = new Map(data?.map((p) => [p.id, p]));
      return favorites.map((fav) => {
        const id = fav.id;
        const live = liveMap.get(id);
        if (live) {
          return { ...live, status: "available" };
        }
        return {
          ...fav,
          status: "deleted",
          deletedNotice: "This product is no longer available",
        };
      });
    } else {
      const liveMap = new Map(approbatProducts?.map((p) => [p.id, p]));

      return favorites.map((fav) => {
        // Extract ID — fav is an object with `id`
        const id = fav.id;

        // If live product exists, use it
        const live = liveMap.get(id);
        if (live) {
          return { ...live, status: "available" };
        }

        // Otherwise, mark as deleted but preserve cached info (like `nom`)
        return {
          ...fav, // keeps `id`, `nom`, `images`, etc.
          status: "deleted",
          deletedNotice: "This product is no longer available",
        };
      });
    }
  }
  useEffect(() => {
    const loadFinalFavs = async () => {
      const result = await buildFinalFavs(favorites, approbatProducts);
      setFinalFavs(result);
      console.log(result);
    };

    loadFinalFavs();
  }, [favorites, approbatProducts]);

  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-48 h-48 md:w-64 md:h-64">
          <Lottie animationData={Nothing} loop />
        </div>
        <h2 className=" text-2xl font-bold text-gray-800 mt-6 mb-3">
          Votre liste d'envies est vide
        </h2>
        <p className="text-gray-600 max-w-md mb-8 leading-relaxed">
          Ajoutez vos produits préférés pour les retrouver facilement.
        </p>
        <Link
          to="/boutique"
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <IoIosArrowBack className="text-lg" />
          Retourner faire vos achats
        </Link>
      </div>
    );
  }

  return (
    <div className=" space-y-3 md:space-y-8 bg-">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-nowrap text-xl lg:text-2xl font-bold text-gray-900">
          Votre liste d'envies
          <span className="ml-2 font-normal text-gray-500 text-base md:text-lg">
            ({favorites.length})
          </span>
        </h1>
      </div>

      {/* Wishlist Items */}
      <div className="space-y-5">
        {finalFavs.length > 0 &&
          finalFavs.map((product) => (
            <div
              key={product.id}
              className={
                product.status === "available"
                  ? "bg-white rounded-xl border border-gray-200 p-2 lg:p-5 flex flex-col md:flex-row items-start md:items-center md:gap-2 lg:gap-5 transition-colors"
                  : "bg-gray-50 rounded-xl border border-gray-100   p-2 lg:p-5 flex flex-col md:flex-row items-start md:items-center md:gap-2 lg:gap-5"
              }
            >
              <div className="flex-shrink-0 bg">
                {product.status === "available" ? (
                  <img
                    src={product.images[0]}
                    alt={product.nom}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                  />
                ) : (
                  <img
                    src={NoProduct}
                    alt={product.nom}
                    className="w-20 h-20 object-cover  rounded-xl    "
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 w-full">
                {product.status === "available" ? (
                  <h3 className="font-semibold text-gray-900 text-lg capitalize line-clamp-2">
                    {product.nom}
                  </h3>
                ) : (
                  <h3 className="font-medium text-gray-400 text-lg capitalize line-clamp-2">
                    {product.nom}
                  </h3>
                )}
                {product.status === "available" ? (
                  <p className="text-xl font-bold text-orange-600 mt-1 text-nowrap">
                    {formatNumberWithDots(product.prixReference)} FCFA
                  </p>
                ) : (
                  <p className="text-lg text-gray-500 mt-1 text-nowrap">
                    {formatNumberWithDots(product.prixReference)} FCFA
                  </p>
                )}
              </div>

              <div className="flex md:flex-col lg:flex-row items-center mt-2 md:mt-0 md:gap-3 w-full md:w-auto">
                {product.status === "available" ? (
                  <button
                    onClick={() => navigateProduct(product)}
                    className="flex-1 sm:flex-none order-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Acheter
                  </button>
                ) : (
                  <span className="text-gray-500">Indisponible</span>
                )}
                <button
                  onClick={() => RemoveToFav(product)}
                  className="flex order-1 items-center justify-center gap-2 text-red-500  font-medium transition-colors whitespace-nowrap py-2 px-4 rounded-lg  hover:border-red-300 hover:bg-red-400 hover:text-white "
                >
                  <MdDeleteForever className="text-xl" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListeEnvies;

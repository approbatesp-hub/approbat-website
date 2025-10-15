import { useLocation } from "react-router";
import Select from "react-select";
import { useEffect, useState } from "react";
import { CgHeart } from "react-icons/cg";
import { ImHeart } from "react-icons/im";
import { HiMiniPlus, HiMiniMinus } from "react-icons/hi2";
import Commentaires from "../components/Commentaires";
import VoirPlus from "../components/VoirPlus";
import { useDispatch, useSelector } from "react-redux";
import DevisButton from "../components/DevisButton";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { formatNumberWithDots } from "../utils/constants";
import toast from "react-hot-toast";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeToCart,
} from "../redux/espremium";
import { addOrRemoveToFav } from "../utils/queries";
import { IoIosWarning } from "react-icons/io";

const Star = (
  <path d="M62 25.154H39.082L32 3l-7.082 22.154H2l18.541 13.693L13.459 61L32 47.309L50.541 61l-7.082-22.152L62 25.154z" />
);

const customStyles = {
  itemShapes: Star,
  boxBorderWidth: 2,
  activeFillColor: ["#FEE2E2", "#FFEDD5", "#FEF9C3", "#ECFCCB", "#D1FAE5"],
  activeBoxColor: ["#da1600", "#db711a", "#dcb000", "#61bb00", "#009664"],
  activeBoxBorderColor: ["#c41400", "#d05e00", "#cca300", "#498d00", "#00724c"],
  inactiveFillColor: "white",
  inactiveBoxColor: "#dddddd",
  inactiveBoxBorderColor: "#a8a8a8",
};

const Produit = () => {
  const { cart, userInfo, productDetails, favorites } = useSelector(
    (state) => state.projet
  );

  const [produit, setProduit] = useState(productDetails || {});
  const location = useLocation();
  const [allProduits, setAllProduits] = useState(
    location.state?.produits || []
  );

  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const [prix, setPrix] = useState(0);
  const [type, setType] = useState("");
  const [options, setOptions] = useState([]);

  // ✅ State for cart status
  const [isInCart, setIsInCart] = useState(false);
  const [currentCartItem, setCurrentCartItem] = useState(null);

  // Sync product data
  useEffect(() => {
    const newProduit = productDetails;
    if (newProduit) {
      setProduit(newProduit);
      const minQty = Number(newProduit.quantiteMinimale) || 1;
      setQuantite(minQty);
      setPrix(Number(newProduit.prixReference) || 0);
      setType("");
      setOptions(
        newProduit.types?.map((t) => ({ value: t.type, label: t.type })) || []
      );
      setSelectedImage(0);
    }
    if (location.state?.produits) {
      setAllProduits(location.state.produits);
    }
  }, [location.state?.produits, productDetails]);

  // ✅ CRITICAL: Determine if current product (with/without type) is in cart
  useEffect(() => {
    if (!produit?.id) {
      setIsInCart(false);
      setCurrentCartItem(null);
      return;
    }

    let matchingItem = null;

    if (produit.types?.length > 0 && type?.value) {
      // Product has types → match by id + type
      matchingItem = cart.find(
        (item) => item.id === produit.id && item.type === type.value
      );
    } else {
      // No types → match by id only
      matchingItem = cart.find((item) => item.id === produit.id);
    }

    if (matchingItem) {
      setIsInCart(true);
      setCurrentCartItem(matchingItem);
      setQuantite(matchingItem.quantite);
    } else {
      setIsInCart(false);
      setCurrentCartItem(null);
      setQuantite(Number(produit.quantiteMinimale) || 1);
    }
  }, [cart, produit?.id, type?.value, produit?.types]); // ✅ Covers all cases

  // Update price when type changes
  useEffect(() => {
    if (produit.types?.length > 0 && type?.value) {
      const foundType = produit.types.find((t) => t.type === type.value);
      if (foundType) {
        setPrix(Number(foundType.prix));
      }
    } else if (produit.types?.length === 0 || !produit.types) {
      // Use prixReference if no types
      setPrix(Number(produit.prixReference) || 0);
    }
  }, [type?.value, produit]);

  // Compute rating
  useEffect(() => {
    const validNotes =
      produit?.commentaires?.filter(
        (i) => typeof i.note === "number" && !isNaN(i.note)
      ) || [];
    const avisNote =
      validNotes.length > 0
        ? Math.round(
            validNotes.reduce((acc, i) => acc + i.note, 0) / validNotes.length
          )
        : 0;
    setRating(avisNote);
  }, [produit?.commentaires]);

  const minQty = Number(produit.quantiteMinimale) || 1;

  const addToCartFn = () => {
    // For products with types, require selection
    if (produit?.types?.length > 0 && !type?.value) {
      toast.error("Veuillez sélectionner un type");
      return;
    }

    if (quantite < minQty) {
      toast.custom(
        <p className="p-2 border bg-[#363636] text-white rounded-md flex items-center gap-3">
          <IoIosWarning className="text-yellow-500 text-[24px]" />
          <span>Quantité minimale exigée ({minQty})</span>
        </p>
      );
      setQuantite(minQty);
      return;
    }

    const itemToAdd = {
      id: produit.id,
      images: produit.images,
      nom: produit.nom,
      prix: prix,
      quantite: quantite,
      quantiteMinimale: produit.quantiteMinimale,
      categorie: produit.categorie,
      type: produit.types?.length > 0 ? type.value : "", // empty string if no type
      livraisonGratuite: produit.livraisonGratuite,
      fournisseur: produit.fournisseur,
    };

    dispatch(addToCart(itemToAdd));
    toast.success(`${produit.nom} ajouté au panier`);
  };

  const handleDecrease = () => {
    if (!currentCartItem) return;

    if (currentCartItem.quantite <= minQty) {
      toast.success("Article retiré");
      if (produit.types?.length > 0 && type?.value) {
        dispatch(removeToCart({ produit, type: type.value }));
      } else {
        dispatch(removeToCart({ produit }));
      }
      setIsInCart(false);
      setCurrentCartItem(null);
      setQuantite(minQty);
    } else {
      toast.success("Vous avez retiré un produit");
      setQuantite((prev) => prev - 1);
      if (produit.types?.length > 0 && type?.value) {
        dispatch(decreaseQuantity({ produit, type: type.value }));
      } else {
        dispatch(decreaseQuantity({ produit }));
      }
    }
  };

  const handleIncrease = () => {
    setQuantite((prev) => prev + 1);
    if (produit.types?.length > 0 && type?.value) {
      dispatch(increaseQuantity({ produit, type: type.value }));
    } else {
      dispatch(increaseQuantity({ produit }));
    }
    toast.success("Vous avez ajouté un produit");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className=" mx-auto m pt-32 pb-16">
        <div className=" md:max-w-[80%] xl:max-w-[65%] mx-auto overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
            {/* LEFT SIDE - Images - COMPLETELY REDESIGNED */}
            <div className="flex-1 ">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Thumbnails Column - Vertical on desktop */}
                {produit.images?.length > 0 && (
                  <div className="hidden lg:flex flex-col gap-3 order-2 lg:order-1">
                    {produit.images.map((image, index) => (
                      <button
                        key={index}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                          selectedImage === index
                            ? "border-orange-500 shadow-md scale-105"
                            : "border-gray-200 hover:border-orange-300"
                        }`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Image Container */}
                <div className="flex-1 order-1 lg:order-2">
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="relative  overflow-hidden">
                      <div className="rounded-xl h-[280px] md:h-[500px] lg:h-[400px] xl:h-[500px] overflow-hidden relative">
                        <Zoom>
                          <img
                            src={produit?.images?.[selectedImage] || ""}
                            className="h-[500px] w-full object-cover rounded-lg"
                            alt={produit?.nom || "Produit"}
                          />
                          <span className="hoverBtn capitalize text-white text-[14px] px-2 rounded-full absolute top-2 left-2">
                            {produit?.fournisseur || "—"}
                          </span>
                        </Zoom>
                      </div>
                      {/* Badges */}

                      {/* Image Counter */}
                      {produit.images?.length > 0 && (
                        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
                          {selectedImage + 1} / {produit.images.length}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Horizontal Thumbnails for Mobile */}
                  {produit.images?.length > 0 && (
                    <div className="flex lg:hidden gap-3 mt-4 overflow-x-auto pb-2 hide-scrollbar">
                      {produit.images.map((image, index) => (
                        <button
                          key={index}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                            selectedImage === index
                              ? "border-orange-500 shadow-md scale-105"
                              : "border-gray-200 hover:border-orange-300"
                          }`}
                          onClick={() => setSelectedImage(index)}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Image Navigation Buttons */}
                  {produit.images?.length > 1 && (
                    <div className="flex justify-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev > 0 ? prev - 1 : produit.images.length - 1
                          )
                        }
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        ← Précédent
                      </button>
                      <button
                        onClick={() =>
                          setSelectedImage((prev) =>
                            prev < produit.images.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                      >
                        Suivant →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Product Info */}
            <div className="flex-1 ">
              {/* Header with Favorite */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full border border-blue-200">
                    En stock
                  </span>
                  {produit?.livraisonGratuite && (
                    <span className="px-3 py-1.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full border border-green-200">
                      Livraison gratuite
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) =>
                    addOrRemoveToFav(e, produit, userInfo, dispatch)
                  }
                  className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 shadow-sm"
                >
                  {favorites?.find((res) => res.id === produit?.id) ? (
                    <ImHeart className="text-xl text-red-500" />
                  ) : (
                    <CgHeart className="text-xl text-gray-600" />
                  )}
                </button>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {produit?.nom || "Nom du produit"}
              </h1>

              {/* Category */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Catégorie:
                </span>
                <span className="text-sm uppercase bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                  {produit?.categorie || "—"}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-2">
                  <Rating
                    readOnly
                    style={{ maxWidth: 120 }}
                    value={rating}
                    itemStyles={customStyles}
                    radius="large"
                    spaceBetween="small"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    {rating}/5
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <p className="text-sm text-gray-600">
                  {produit?.commentaires?.length || 0} avis
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">
                  {produit?.description || "Aucune description disponible."}
                </p>
              </div>

              {/* Type Selector */}
              {produit?.types?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Sélectionnez un type
                    </label>
                    <span className="text-xs text-orange-600 font-medium">
                      * Prix ajustable
                    </span>
                  </div>
                  <Select
                    value={type}
                    onChange={setType}
                    options={options}
                    placeholder="Choisir un type..."
                    className="text-sm"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: state.isFocused ? "#f97316" : "#d1d5db",
                        borderRadius: "0.75rem",
                        padding: "4px 8px",
                        boxShadow: state.isFocused
                          ? "0 0 0 3px rgb(253 186 116 / 0.3)"
                          : "none",
                        "&:hover": { borderColor: "#f97316" },
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected
                          ? "#f97316"
                          : state.isFocused
                          ? "#fed7aa"
                          : "white",
                        color: state.isSelected ? "white" : "#374151",
                      }),
                    }}
                  />
                </div>
              )}

              {/* Price Section */}
              <div className="mb-6 p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-between w-full ">
                    <p className="text-sm text-gray-600 mb-1 font-medium">
                      Prix unitaire
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {formatNumberWithDots(prix)} Fcfa
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Quantité
                  </label>
                  <span className="text-xs text-gray-500 font-medium">
                    Minimum: {minQty} unité{minQty > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex gap-3">
                  {/* Quantity Controls */}
                  {isInCart && (
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <button
                        className="w-12 h-12 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={handleDecrease}
                      >
                        <HiMiniMinus />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-800">
                        {currentCartItem?.quantite || quantite}
                      </span>
                      <button
                        className="w-12 h-12 flex items-center justify-center text-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={handleIncrease}
                      >
                        <HiMiniPlus />
                      </button>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    className={`flex-1 h-12 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg ${
                      isInCart
                        ? "bg-green-500 hover:bg-green-600 shadow-green-200"
                        : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-200 hover:shadow-xl hover:shadow-orange-300"
                    }`}
                    onClick={addToCartFn}
                  >
                    {isInCart ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>✓ Déjà au panier</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>🛒 Ajouter au panier</span>
                      </div>
                    )}
                  </button>
                </div>

                {/* Cart Status */}
                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isInCart ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {isInCart
                      ? `${currentCartItem?.quantite} produit${
                          currentCartItem?.quantite > 1 ? "s" : ""
                        } dans votre panier`
                      : `Commencez par ${minQty} unité${
                          minQty > 1 ? "s" : ""
                        } minimum`}
                  </p>
                </div>
              </div>

              {/* Devis Button */}
            </div>
          </div>
        </div>

        {/* Additional Components */}
        <div className="mt-8">
          <VoirPlus
            produit={produit}
            setProduit={setProduit}
            allProduits={allProduits}
          />
        </div>

        <div className="mt-8">
          <Commentaires
            produit={produit}
            setProduit={setProduit}
            allProduits={allProduits}
          />
        </div>
      </div>
    </div>
  );
};

export default Produit;

import { IoCloseCircle } from "react-icons/io5";
import { IoIosWarning } from "react-icons/io";
import Select from "react-select";
import {
  adresseLivraisonGravier,
  adresseLivraisonSable,
  formatNumberWithDots,
  selectStyles,
} from "../utils/constants";
import { addToCart, removeToCart } from "../redux/espremium";
import { useDispatch } from "react-redux";

const GravierModal = ({
  isModalOpen,
  setIsModalOpen,
  type,
  produit,
  setPrix,
  setType,
  options,
  commune,
  setCommune,
  communeOptions,
  quantite,
  setQuantite,
}) => {
  if (!isModalOpen) return null;

  // 🚚 Quantity options based on product
  const quantityMap = {
    gravier: [20, 30, 50],
    sable: [1, 2, 3, 4],
  };

  const quantityOptions = quantityMap[produit.nom].map((el) => ({
    value: el,
    label: produit.nom === "gravier" ? `${el} Tonnes` : `${el} Benne`,
  }));
  const dispatch = useDispatch();

  // 🧮 Compute price based on commune + quantite
  const source =
    produit.nom === "gravier" ? adresseLivraisonGravier : adresseLivraisonSable;

  const prix = source.find(
    (el) => el.lieu.toLowerCase() === commune?.value?.toLowerCase()
  )?.prix?.[quantite?.value];

  const isDeliverable = Boolean(prix);

  // 🛒 Add to cart
  const addToCartFn = () => {
    const itemToAdd = {
      id: produit.id,
      images: produit.images,
      nom: produit.nom,
      prix,
      quantite: quantite?.value || 0, // FIX HERE
      quantiteMinimale: produit?.nom === "gravier" ? 20 : 1,
      categorie: produit.categorie,
      type: produit.types?.length > 0 ? type.value : "",
      livraisonGratuite: produit.livraisonGratuite,
      fournisseur: produit.fournisseur,
    };

    dispatch(removeToCart({ produit, type: type.value }));
    dispatch(addToCart(itemToAdd));
  };

  const confirmFn = () => {
    setIsModalOpen(false);
    setPrix(prix);
    addToCartFn();
  };

  return (
    <div className="fixed before:backdrop-blur-sm before:absolute before:top-0 before:w-full before:h-full before:bg-black/50 inset-0 z-100 flex items-center justify-center">
      <div className="  mx-10 w-[600px] bg-white p-8 rounded-lg border border-gray-200 relative">
        <IoCloseCircle
          className="cursor-pointer text-4xl text-amber-500 absolute top-4 right-4 hover:scale-110"
          onClick={() => setIsModalOpen(false)}
        />

        {/* Type Selection */}
        {options?.length > 0 && (
          <div className="mb-6">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Sélectionnez un type
            </label>
            <Select
              value={type}
              onChange={setType}
              options={options}
              placeholder="Choisir un type..."
              styles={selectStyles}
            />
          </div>
        )}

        {/* Commune */}
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Précisez votre adresse de livraison
        </label>
        <Select
          value={commune}
          onChange={setCommune}
          options={communeOptions}
          placeholder="Sélectionnez une commune"
          styles={selectStyles}
        />

        {/* Quantity */}
        {commune && (
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              {produit.nom === "gravier"
                ? "Précisez la quantité"
                : "Précisez le nombre de benne"}
            </span>
            <Select
              value={quantite} // YOU FORGOT THIS IN ORIGINAL CODE
              onChange={setQuantite}
              options={quantityOptions}
              placeholder="Sélectionnez une quantité"
              styles={selectStyles}
            />
          </div>
        )}

        {/* Price Section */}
        {commune && quantite?.value && (
          <div className="space-y-4 animate-fadeIn mt-6">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              {isDeliverable ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-bold">Prix total :</span>
                  <p className="text-lg lg:text-2xl font-bold text-amber-600">
                    {formatNumberWithDots(prix)} Fcfa
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IoIosWarning className="text-red-500 w-6 h-6" />
                  </div>
                  <p className="font-semibold text-gray-800">
                    Livraison indisponible
                  </p>
                  <p className="text-sm text-gray-600">
                    Nous ne livrons pas dans cette zone pour le moment
                  </p>
                </div>
              )}
            </div>

            {/* Info */}
            <div
              className={`p-3 rounded-lg text-sm border ${
                isDeliverable
                  ? "bg-blue-50 text-blue-700 border-blue-100"
                  : "bg-gray-50 text-gray-600 border-gray-100"
              }`}
            >
              Le prix est ajusté automatiquement selon votre zone et quantité
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-6 border-t border-gray-100 mt-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
          >
            Annuler
          </button>

          {isDeliverable && (
            <button
              onClick={confirmFn}
              className="flex-1 px-4 py-3 text-white font-medium bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-lg shadow-sm hover:shadow-md"
            >
              Confirmer
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GravierModal;

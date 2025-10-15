// import ImgContact from "../assets/Images/cartPage.jpg";
import ImgCadi from "../assets/Images/cadi.jpg";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import {
  decreaseQuantity,
  increaseQuantity,
  removeToCart,
  resetAll,
  updateQuantity,
} from "../redux/espremium";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router"; // Use react-router-dom for Link
import Lottie from "lottie-react";
import Empty from "../assets/Images/animation/NOFOUND1.json";
import { IoIosArrowBack, IoIosWarning } from "react-icons/io";
import { useEffect, useState } from "react";
import { formatNumberWithDots } from "../utils/constants";
import { MdOutlineDelete } from "react-icons/md";
import { HiMiniPlus, HiMiniMinus } from "react-icons/hi2";

// Define a consistent color variable for primary actions (assuming 'orange3' is your primary color)
const PRIMARY_COLOR = "bg-orange-500 hover:bg-orange-600";
const TEXT_COLOR = "text-orange-500";

const Cart = () => {
  const { cart, userInfo } = useSelector((state) => state.projet);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    console.log(cart);
    let prix = cart.reduce((acc, i) => acc + i.prix * i.quantite, 0);
    setTotal(prix);
  }, [cart]);

  // const changeQuantité = (e, produit) => {
  //   console.log(e, produit);
  //   // Ensure the input is a number and not negative
  //   const updatedQuantite = Math.max(1, parseInt(e.target.value) || 1);
  //   dispatch(updateQuantity({ updatedQuantite, produit }));
  // };

  function goToCheckout() {
    if (!userInfo) {
      toast.error("Veuillez vous connecter !");
      navigate("/connexion");
    } else if (userInfo && !userInfo.emailVerified) {
      toast.error("Vérifiez votre email ! ");
      navigate("/");
    } else if (
      cart.find((el) => Number(el.quantite) < Number(el.quantiteMinimale))
    ) {
      toast.custom(
        <p className="p-2 border bg-gray-800 text-white rounded-md flex items-center gap-3 shadow-lg">
          <span>
            <IoIosWarning className="text-yellow-400 text-xl" />
          </span>
          <span>Quantité(s) minimale(s) non respectée(s) !</span>
        </p>
      );
      const elementsToUpdate = cart.filter(
        (el) => Number(el.quantite) < Number(el.quantiteMinimale)
      );
      elementsToUpdate.forEach((el) => {
        const updatedQuantite = el.quantiteMinimale;
        dispatch(updateQuantity({ updatedQuantite, produit: el }));
      });
    } else {
      navigate("/checkout", {
        state: { commande: { cart, total } },
      });
    }
  }

  return (
    <div>
      {/* HEADER SECTION - Modernized Background Image */}
      <div className="relative overflow-hidden">
        <img
          src={ImgCadi}
          className="object-cover h-[210px] md:h-64 w-full brightness-75"
          alt="Shopping Cart Background"
        />
        <div className="absolute pt-[100px] inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center">
          <p className="text-white  text-xl md:text-4xl uppercase font-bold tracking-wider">
            Votre Panier
          </p>
        </div>
      </div>
      {/* END HEADER SECTION */}

      {cart.length > 0 ? (
        <div className="md:max-w-[90%] mx-auto px-4 py-5 md:py-10 flex flex-col xl:flex-row gap-8">
          {/* LEFT SIDE - CART ITEMS */}
          <div className="xl:flex-[2] bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <h3 className="font-bold text-xl md:text-2xl text-gray-800">
                Résumé des achats
              </h3>
              <button
                className="flex cursor-pointer items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-medium py-2 px-2 md:px-4 rounded-lg text-sm"
                onClick={() => {
                  dispatch(resetAll());
                  toast.success("Panier vidé avec succès");
                }}
              >
                <span>Vider le Panier</span>
                <MdDelete className="text-xl" />
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {cart.map((el, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-1 md:gap-4 py-2 px-5 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } transition-shadow duration-300 hover:shadow-md`}
                >
                  <div className="flex items-center gap-4 flex-1 ">
                    {/* Product Image */}
                    <img
                      src={el?.images[0]}
                      className="md:w-[100px] md:h-[100px] h-[90px] w-[90px] object-cover rounded border border-gray-200 shadow-sm flex-shrink-0"
                      alt={el.nom}
                    />
                    {/* Product Details */}
                    <div className="flex flex-col gap-1">
                      <span className="capitalize font-semibold text-lg text-gray-800">
                        {el.nom}
                      </span>
                      <span className="uppercase text-xs text-gray-500">
                        {el.categorie}
                      </span>
                      <p className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 ">
                          Type/Qualité :{" "}
                        </span>
                        {el.type && el.type !== "undefined" && (
                          <span className="font-medium text-xs text-gray-500">
                            {el.type}
                          </span>
                        )}
                      </p>
                      <p className="text-xs  text-gray-500 capitalize">
                        <span>
                          Quantité minimale :{" "}
                          <span className="font-medium">
                            {el.quantiteMinimale}
                          </span>
                        </span>
                      </p>
                      <p className="flex gap-2 items-center text-sm text-gray-600">
                        <span className=" text-nowrap">Prix Unitaire : </span>
                        <span className="font-bold text-nowrap text-gray-800 text-base">
                          {formatNumberWithDots(el.prix)} Fcfa
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* L'AUTRE PARTIE */}
                  <div className="flex  items-center justify-between w-full md:w-auto md:gap-8 mt-2 md:mt-0 ">
                    <div
                      className="flex gap-1 md:gap-2  cursor-pointer  items-center"
                      onClick={() => {
                        dispatch(removeToCart({ produit: el, type: el.type }));
                        toast.error("Article retiré");
                      }}
                    >
                      <MdOutlineDelete
                        className="text-2xl text-orange-500 hover:text-orange-400  transition-colors duration-300"
                        title="Retirer l'article"
                      />
                      <span className="md:text-lg text-orange-500 hover:text-orange-400 transition-colors duration-300  ">
                        Supprimer
                      </span>
                    </div>
                    {/* Quantity and Unit Price */}
                    <div className="flex flex-col gap-2 items-start">
                      <p className="flex items-center gap-[20px] md:gap-[30px] ">
                        <button
                          disabled={el.quantite === el.quantiteMinimale}
                          onClick={() =>
                            dispatch(
                              decreaseQuantity({ produit: el, type: el.type })
                            )
                          }
                          className=" disabled:bg-gray-400 bg-orange-500 cursor-pointer px-1 rounded py-1 text-white "
                        >
                          <HiMiniMinus className="text-xl" />
                        </button>
                        <span>{el.quantite} </span>
                        <button
                          onClick={() =>
                            dispatch(
                              increaseQuantity({ produit: el, type: el.type })
                            )
                          }
                          className="bg-orange-500 cursor-pointer px-1 rounded py-1 text-white"
                        >
                          <HiMiniPlus className="text-2xl" />
                        </button>
                      </p>
                    </div>

                    {/* Subtotal and Delete */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* END LEFT SIDE - CART ITEMS */}

          {/* RIGHT SIDE - SUMMARY */}
          <div className="xl:flex-[1] flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 p-6 self-stretch">
            <h3 className="font-bold text-xl md:text-2xl mb-5 text-gray-800 border-b pb-3">
              Récapitulatif de la commande
            </h3>

            {/* Shipping Info */}
            <div className="mb-6 border-b pb-5">
              <p className="font-semibold md:text-lg text-gray-800">
                Expédition
              </p>
              <p className="text-sm text-gray-500 italic mt-1 leading-snug">
                Les frais de livraison exacts seront calculés après la
                validation de votre commande, en fonction des articles et de
                l&apos;adresse finale.
              </p>
            </div>

            {/* Total */}
            <div className="mt-5 mb-3 pt-3 border-t-2 border-dashed border-gray-200">
              <div className="flex items-center justify-between">
                <p className="font-bold text-xl text-gray-800">Total :</p>
                <p
                  className={`font-extrabold text-2xl md:text-3xl ${TEXT_COLOR} text-nowrap`}
                >
                  {formatNumberWithDots(total)} Fcfa
                </p>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className={`w-full cursor-pointer md:mt-auto  text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg ${PRIMARY_COLOR} transform hover:scale-[1.01]`}
              onClick={goToCheckout}
            >
              Valider et Payer
            </button>
          </div>
          {/* END RIGHT SIDE - SUMMARY */}
        </div>
      ) : (
        /* EMPTY CART STATE - Improved */
        <div className="h-full py120 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center bg-white p-10 rounded-xl  max-w-lg mx-auto">
            <p className="mb-4 font-extrabold text-xl md:text-2xl text-gray-700 text-center">
              Votre panier est vide 😔
            </p>
            <p className="text-base text-gray-500 mb-6 text-center">
              Il semble que vous n'ayez encore rien ajouté. Parcourez notre
              boutique pour trouver votre bonheur !
            </p>
            <Lottie
              animationData={Empty}
              loop={true}
              className="w-50 md:w-64 h-auto"
            />
            <Link
              to="/boutique"
              className={`flex items-center gap-2 mt-8 ${PRIMARY_COLOR} text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md`}
            >
              <IoIosArrowBack className="text-xl" />
              <span>Retourner à la boutique</span>
            </Link>
          </div>
        </div>
        /* END EMPTY CART STATE */
      )}
    </div>
  );
};

export default Cart;

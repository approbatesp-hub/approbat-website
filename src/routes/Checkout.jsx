import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router"; // Corrected import
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { isWithinInterval } from "date-fns";
import emailjs from "@emailjs/browser";

// Assuming these are correctly imported from your project structure
import Logo from "../assets/Images/logo-no-bg.png";
import { communesAbidjan } from "../utils/constants";
import { connexion, resetAll } from "../redux/espremium";

// Icons
import { GiTakeMyMoney } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import supabase from "../../supase-client";

// --- Main Checkout Component ---
const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get order and user info from state
  const commande = location.state?.commande;

  const { userInfo } = useSelector((state) => state.projet);

  // State for form fields
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState("");
  const [newTotal, setNewTotal] = useState("");

  const [adresse, setAdresse] = useState(userInfo?.adresse?.adresse || "");
  const [district, setDistrict] = useState(
    userInfo?.adresse?.district
      ? { value: userInfo.adresse.district, label: userInfo.adresse.district }
      : null
  );
  const [commune, setCommune] = useState(
    userInfo?.adresse?.commune
      ? { value: userInfo.adresse.commune, label: userInfo.adresse.commune }
      : null
  );

  // Redirect if no order data is present
  useEffect(() => {
    if (!location.state) {
      navigate("/cart");
    }
  }, [location, navigate]);

  // --- Helper Functions & Data ---

  // Formats a number with dots (e.g., 10000 -> 10.000)
  const formatNumberWithDots = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Options for the district and commune select inputs
  const districtOptions = [
    {
      value: "District Autonome d'Abidjan",
      label: "District Autonome d'Abidjan",
    },
  ];
  const communeOptions = communesAbidjan.map((el) => ({
    value: el.commune,
    label: el.commune,
  }));

  // Custom styling for react-select components
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#d1d5db", // gray-300
      minHeight: "42px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9ca3af", // gray-400
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#FF7A00"
        : state.isFocused
        ? "#fdece0"
        : "white",
      color: state.isSelected ? "white" : "black",
    }),
  };

  // --- Event Handlers (Your logic goes here) ---
  const appliquerCoupon = async (e) => {
    e.preventDefault();

    if (!coupon) {
      toast.error("Champ vide");
      return;
    }

    if (newTotal) {
      toast.error("Coupon déjà appliqué ❌");
      return;
    }

    // get coupon from Supabase
    const { data: coupons, error } = await supabase
      .from("Coupons")
      .select("*")
      .eq("nom", coupon.trim().toUpperCase())
      .limit(1);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (coupons && coupons.length > 0) {
      const couponData = coupons[0];
      const currentDate = new Date();

      if (
        isWithinInterval(currentDate, {
          start: new Date(couponData.dateDebut),
          end: new Date(couponData.dateFin),
        })
      ) {
        toast.success("Coupon appliqué ✅");

        let calcul =
          Number(commande?.total) -
          Number(Math.round(commande?.total * couponData.reduction) / 100);

        // Round UP to the nearest multiple of 5
        let roundedCalcul = Math.ceil(calcul / 5) * 5;

        setNewTotal(roundedCalcul);
        setCouponApplied(couponData.reduction);
        setCoupon("");
      } else {
        toast.error("Coupon invalide ⏳");
      }
    } else {
      toast.error("Ce coupon n'existe pas ❌");
    }
  };

  async function validerCommande(e) {
    e.preventDefault();
    const toastId = toast.loading("veuillez patienter svp");
    if (userInfo.role === "admin") {
      const data = {
        articlesAchetes: commande.cart,
        montantTotal: Number(newTotal ? newTotal : commande.total),
      };

      const { error } = await supabase.from("Factures").insert(data);

      if (error) {
        toast.dismiss(toastId);
        toast.error("Erreur survenue. Veuillez réessayer svp ");
        return;
      }
      toast.dismiss(toastId);
      toast.success("Facture Prête ✅");
      dispatch(resetAll());
      navigate("/admin/proforma");
      return;
    }

    if (!adresse || !district || !commune) {
      toast.error("Tous les champs sont obligatoires !");
      return;
    }

    let adresseClient = {
      district: district.label,
      commune: commune.label,
      adresse: adresse,
    };

    // let infosClient = {
    //   nomComplet: userInfo.nomComplet,
    //   numero: userInfo.numero,
    //   adresseClient,
    // };

    const data = {
      idClient: userInfo.id,
      articlesAchetes: commande.cart,
      // infosClient,
      // createdAt: new Date().toISOString(),
      status: "en cours",
      montantTotal: newTotal ? newTotal : commande.total,
      couponApplique: couponApplied ? true : false,
    };

    const idArticlesAchetesNew = commande.cart.map((el) => el.id);

    try {
      // Get current user row
      const { data: userRow, error: userError } = await supabase
        .from("Users")
        .select("*")
        .eq("id", userInfo.id)
        .single();

      if (userError) throw userError;

      const idArticlesAchetes = userRow?.idArticlesAchetes || [];
      const mergedArray = [
        ...new Set([...idArticlesAchetesNew, ...idArticlesAchetes]),
      ];

      // Update user with new purchased articles + address
      const { error: updateError } = await supabase
        .from("Users")
        .update({
          idArticlesAchetes: mergedArray,
          adresse: adresseClient,
        })
        .eq("id", userInfo.id);

      if (updateError) throw updateError;

      dispatch(
        connexion({
          ...userInfo,
          adresse: adresseClient,
          idArticlesAchetes: mergedArray,
        })
      );

      // Insert new order
      const { error: orderError } = await supabase.from("Orders").insert(data);
      if (orderError) {
        throw orderError;
      }

      Swal.fire({
        title: "Commande Validée",
        text: "Merci pour votre achat ! 🙏🏿",
        icon: "success",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const templateParams = {
            user_email: userInfo.email,
          };

          const templateId = "template_rc7v9dt";
          const serviceID = "service_neppp7k";
          const publicKEY = "68pXeZCvBI2EfIOS_";

          emailjs.send(serviceID, templateId, templateParams, publicKEY).then(
            () => {
              console.log("Nouvelle commande envoyée par mail");
            },
            (error) => {
              console.log("FAILED...", error);
            }
          );
          navigate("/profil/commandes");
        }
      });

      dispatch(resetAll());
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("Erreur survenue. Veuillez réessayer svp ");
    }
  }

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden min-h-screen bg-gray-50 font-sans">
      {/* --- LEFT SIDE: Customer Information --- */}
      <div className=" order-2 md:order-1 w-full lg:w-3/5 xl:w-1/2 p-6 lg:p-8 bg-white">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="mb-2 flex flex-col items-center">
            <img src={Logo} className="w-22 " alt="Approbat Logo" />
            <h1 className="text-3xl font-bold text-gray-800">
              Approbat Services
            </h1>
            <p className="text-gray-500 my-2 ">
              Finalisez votre commande en remplissant les informations
              ci-dessous.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={validerCommande} className="space-y-2">
            {/* Contact Section */}
            <div className="my-[20px]">
              <h3 className="text-xl  font-semibold text-gray-700 mb-4 border-b pb-2">
                Informations de contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="nomComplet"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Nom complet
                  </label>
                  <input
                    id="nomComplet"
                    type="text"
                    value={userInfo.nomComplet.toUpperCase()}
                    readOnly
                    className="w-full  px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                </div>
                <div>
                  <label
                    htmlFor="numero"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Numéro de téléphone
                  </label>
                  <input
                    id="numero"
                    type="tel"
                    value={userInfo.numero}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address Section */}
            <div className="my-[40px]">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Adresse de livraison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    District
                  </label>
                  <Select
                    id="district"
                    value={district}
                    onChange={setDistrict}
                    options={districtOptions}
                    placeholder="Sélectionnez un district"
                    styles={selectStyles}
                  />
                </div>
                <div>
                  <label
                    htmlFor="commune"
                    className="block text-sm font-medium text-gray-600 mb-1"
                  >
                    Commune
                  </label>
                  <Select
                    id="commune"
                    value={commune}
                    onChange={setCommune}
                    options={communeOptions}
                    placeholder="Sélectionnez une commune"
                    styles={selectStyles}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="adresse"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Adresse détaillée (Rue, Bâtiment, etc.)
                </label>
                <input
                  id="adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Ex: Rue des jardins, porte 123"
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className=" my-[40px] ">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                Option de paiement
              </h3>
              <div className="p-4 border-2 border-amber-500 rounded-lg bg-amber-50">
                <div className="flex items-center gap-4">
                  <GiTakeMyMoney className="text-3xl text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-800">
                      Paiement cash à la livraison
                    </p>
                    <p className="text-sm text-gray-600">
                      Livraison sous 48h après validation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-0 md:pt-4 pb-5 md:pb-0">
              <Link
                to="/cart"
                className="flex items-center gap-2 text-amber-600 hover:text-amber-800 font-medium transition-colors"
              >
                <IoIosArrowBack />
                <span>Retour au panier</span>
              </Link>
              <button
                type="submit"
                className="w-full sm:w-auto bg-amber-500 text-white font-bold py-3 px-8 rounded-md hover:bg-amber-600 transition-all duration-300 uppercase shadow-lg"
              >
                {userInfo.role === "administrateur"
                  ? "Valider Proforma"
                  : "Valider la commande"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* --- RIGHT SIDE: Order Summary --- */}
      <div className=" order-1 md:order-2 w-full lg:w-2/5 xl:w-1/2 p-6 lg:p-12 bg-gray-100 lg:border-l border-gray-200">
        <div className="max-w-xl mx-auto">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Résumé de la commande
          </h3>

          {/* Cart Items */}
          <div className="space-y-4   pr-2">
            {commande?.cart.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 pb-2 border-b"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.images[0]}
                    alt={item.nom}
                    className="w-14 h-14 object-cover rounded-md shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.nom}</p>

                    {item.type && item.type !== "undefined" && (
                      <p className="text-sm text-gray-500">
                        <span>Type/Qualité : </span>
                        {item.type}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Quantité: {item.quantite}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-900 text-right whitespace-nowrap">
                  {formatNumberWithDots(item.prix * item.quantite)} Fcfa
                </p>
              </div>
            ))}
          </div>

          {/* Coupon Form */}
          <form
            onSubmit={appliquerCoupon}
            className="flex items-center gap-3 my-6"
          >
            <input
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Code promo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
            />
            <button
              type="submit"
              className="bg-gray-900 cursor-pointer text-white font-semibold py-2 px-6 rounded-md hover:bg-gray-700 transition-colors"
            >
              Appliquer
            </button>
          </form>

          {/* Totals Section */}
          <div className="space-y-3 py-4 border-t border-b">
            {couponApplied && (
              <div className="flex justify-between text-green-600">
                <span>Réduction ({couponApplied}%)</span>
                <span>
                  -{formatNumberWithDots(commande?.total - newTotal)} Fcfa
                </span>
              </div>
            )}
            <div className="flex justify-between font-medium text-gray-600">
              <span>Sous-total</span>
              <span>{formatNumberWithDots(commande?.total)} Fcfa</span>
            </div>
            <p className="text-sm text-gray-500 italic text-right">
              Les frais de livraison seront confirmés par téléphone.
            </p>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-amber-500">
              {couponApplied
                ? formatNumberWithDots(newTotal)
                : formatNumberWithDots(commande?.total)}{" "}
              Fcfa
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

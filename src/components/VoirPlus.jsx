import { useRef } from "react";
import { useNavigate } from "react-router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi";
import { formatNumberWithDots } from "../utils/constants";
import "swiper/css";
import { sendProductInfo } from "../redux/espremium";
import { useDispatch, useSelector } from "react-redux";
import Partner1 from "../assets/Images/Partenaires/sibm.png";
import Partner2 from "../assets/Images/Partenaires/sotaci.png";
import Partner3 from "../assets/Images/Partenaires/sotici.png";

const VoirPlus = ({ allProduits }) => {
  // console.log("Tous kes proid", allProduits);
  const dispatch = useDispatch();
  const produit = useSelector((state) => state.projet.productDetails);
  const allOtherProducts = allProduits?.filter(
    (el) =>
      el.categorie === produit.categorie &&
      el.sousCategorie === produit.sousCategorie &&
      el.id !== produit.id
  );
  // console.log(allOtherProducts);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const navigate = useNavigate();

  function navigateProduct(produit) {
    const slug = produit.nom.toLowerCase().replace(/\s+/g, "_");

    dispatch(sendProductInfo(produit));

    navigate(`/produit/${slug}`, {
      state: {
        produit,
        produits: allProduits,
      },
    });
  }

  const partners = [
    { logo: Partner1, name: "SIBM" },
    { logo: Partner2, name: "SOTACI" },
    { logo: Partner3, name: "SOTICI" },
  ];
  // console.log(allOtherProducts);
  // if (!allOtherProducts || allOtherProducts.length === 0) {
  //   return (
  //     <div className=" border-t border-gray-200 ">
  //       <div className=" ">
  //         <p className=" text-[16px] md:text-[18px] text-center my-4  ">
  //           Aucune recommandation pour le moment.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (allOtherProducts?.length > 0) {
    return (
      <div className=" ">
        {allOtherProducts <= 0 ? (
          ""
        ) : (
          <p className=" mt-16 p-5 px-10 font-medium text-[24px] my-2 border-t border-b border-gray-200">
            Vous pourriez aussi aimer
          </p>
        )}
        {/* SWIPER */}
        {allOtherProducts?.length > 0 && (
          <div className="  mx-auto max-w-[95%] md:max-w-[85%] mt-10  mb-14 md:mb-7  ">
            <div className="relative ">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                spaceBetween={10}
                breakpoints={{
                  // when window width is >= 320px
                  320: {
                    slidesPerView: 2,
                  },
                  // when window width is >= 640px
                  640: {
                    slidesPerView: 2,
                  },
                  // when window width is >= 768px
                  768: {
                    slidesPerView: 3,
                  },
                  // when window width is >= 1024px
                  1024: {
                    slidesPerView: 4,
                  },
                  // when window width is >= 1200px
                  1300: {
                    slidesPerView: 6,
                  },
                }}
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => {
                  // Ensure swiper updates its navigation buttons
                  setTimeout(() => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                    swiper.navigation.destroy();
                    swiper.navigation.init();
                    swiper.navigation.update();
                  });
                }}
              >
                {allOtherProducts?.map((produit, index) => (
                  <SwiperSlide className="relative slide-item" key={index}>
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
                            (el) =>
                              el.name === produit?.fournisseur.toUpperCase()
                          ) && (
                            <div className="absolute items-center gap-1 top-2 left-2 z-10 flex ">
                              <div className=" w-8 h-8 md:w-10 md:h-10 rounded-md overflow-hidden border-2 border-white shadow-sm">
                                <img
                                  src={
                                    partners.find(
                                      (el) =>
                                        el.name ===
                                        produit?.fournisseur.toUpperCase()
                                    )?.logo
                                  }
                                  alt={produit.fournisseur}
                                  className="w-full h-full object-contain bg-white"
                                />
                              </div>
                              <span className="text-[10px] md:text-[13px] text-shadow-md text-white font-bold px-1">
                                {produit?.fournisseur.toUpperCase()}
                              </span>
                            </div>
                          )}

                        <div className="h-[120px] md:h-[160px] w-full relative overflow-hidden">
                          <img
                            className="w-full h-full rounded-t-xl object-cover transition-transform duration-500 group-hover:scale-105"
                            src={produit.images[0]}
                            alt={produit.nom}
                          />

                          {/* Favorite Button (top-right) */}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className=" flex flex-col flex-between p-2 gap-2  md:p-4 min-h-[calc(100%-120px)] ">
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
                          className="   mt-auto md:mt-0
                 "
                        >
                          <div>
                            <p className="md:text-lg font-bold text-amber-500">
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
                            <button className="bg-gray-100 inline-block w-full  text-gray-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 hover:bg-gray-200">
                              Voir
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div>{allOtherProducts <= 0 && ""}</div>
              {/* Navigation buttons */}
              <div
                className=" absolute
           -bottom-[45px] flex left-1/2 -translate-x-1/2 justify-between   "
              >
                <button
                  ref={prevRef}
                  className="arrowStyle  bg-amber-600 mr-[10px]  "
                >
                  <HiArrowLeft className="text-sm" />
                </button>
                <button
                  ref={nextRef}
                  className="arrowStyle ml-[10px] bg-amber-600 "
                >
                  <HiArrowRight className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};
export default VoirPlus;

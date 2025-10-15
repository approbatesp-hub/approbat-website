import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { usePreviousLocation } from "../utils/LocationContext";

import BoutiqueLeftSide from "../components/BoutiqueLeftSide";
import BoutiqueRightSide from "../components/BoutiqueRightSide";
import Lottie from "lottie-react";
import Aloading from "../assets/Images/animation/ALoading.json";
import Nothing from "../assets/Images/animation/NOFOUND1.json";
import { RiMenuFold3Fill } from "react-icons/ri";
import { toast } from "react-hot-toast";
import { recupererProduits } from "../utils/hooks";
import { keepProducts } from "../redux/espremium";

const Boutique = () => {
  const dispatch = useDispatch();
  const prevLocation = usePreviousLocation();

  // -------------------------------
  // 🔹 Initialize filters conditionally based on where user came from
  // -------------------------------
  const getInitialCategory = () => {
    if (prevLocation?.pathname?.startsWith("/produit/")) {
      return (
        JSON.parse(localStorage.getItem("catSelectionner")) ||
        JSON.parse(localStorage.getItem("catSelectionner2")) ||
        ""
      );
    }
    return ""; // reset if coming from anywhere else
  };

  const getInitialPriceRange = () => {
    if (prevLocation?.pathname?.startsWith("/produit/")) {
      const min = JSON.parse(localStorage.getItem("minPrice")) || 100;
      return [min, 1000000];
    }
    return [100, 1000000]; // default full range
  };

  const [categorieSelectionner, setCategorieSelectionner] =
    useState(getInitialCategory);
  const [priceRange, setPriceRange] = useState(getInitialPriceRange);
  const [appliedPriceRange, setAppliedPriceRange] =
    useState(getInitialPriceRange);
  const [resetBtn, setResetBtn] = useState(false);
  const [openCat, setOpenCat] = useState(false);

  // -------------------------------
  // 🔹 React Query: Fetch products
  // -------------------------------
  const {
    data: allProducts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: recupererProduits,
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onSuccess: (data) => {
      dispatch(keepProducts(data));
    },
  });

  // -------------------------------
  // 🔹 Filter products (memoized)
  // -------------------------------
  const filteredProduits = useMemo(() => {
    if (!allProducts?.length) return [];

    const [min, max] = appliedPriceRange;
    return allProducts.filter((p) => {
      const inCategory =
        !categorieSelectionner ||
        p.sousCategorie?.toLowerCase() === categorieSelectionner.toLowerCase();

      const inPrice = p.prixReference >= min && p.prixReference <= max;
      return inCategory && inPrice;
    });
  }, [allProducts, categorieSelectionner, appliedPriceRange]);

  // -------------------------------
  // 🔹 Persist filters to localStorage (always — safe to keep)
  // -------------------------------
  useEffect(() => {
    localStorage.setItem(
      "catSelectionner",
      JSON.stringify(categorieSelectionner)
    );
  }, [categorieSelectionner]);

  useEffect(() => {
    localStorage.setItem("minPrice", JSON.stringify(appliedPriceRange[0]));
  }, [appliedPriceRange]);

  // -------------------------------
  // 🔹 Reset filters
  // -------------------------------
  useEffect(() => {
    if (resetBtn) {
      setCategorieSelectionner("");
      setPriceRange([100, 1000000]);
      setAppliedPriceRange([100, 1000000]);
      localStorage.removeItem("catSelectionner");
      localStorage.removeItem("minPrice");
      setResetBtn(false);
    }
  }, [resetBtn]);

  // -------------------------------
  // 🔹 Drawer control
  // -------------------------------
  const openDrawer = () => setOpenCat(true);
  const closeDrawer = () => setOpenCat(false);

  // -------------------------------
  // 🔹 Error handling
  // -------------------------------
  useEffect(() => {
    if (isError) toast.error(error.message);
  }, [isError]);

  // -------------------------------
  // 🔹 Render
  // -------------------------------
  return (
    <div className="h-full p-3 md:p-10 md:flex gap-6 pt-[140px] pb-[50px] md:py-[120px]">
      <div className="max-w-[300px] min-h-full">
        <BoutiqueLeftSide
          openDrawer={openDrawer}
          openCat={openCat}
          closeDrawer={closeDrawer}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categorieSelectionner={categorieSelectionner}
          setCategorieSelectionner={setCategorieSelectionner}
          setResetBtn={setResetBtn}
          resetBtn={resetBtn}
          onApplyFilters={() => {
            setAppliedPriceRange(priceRange);
          }}
        />
      </div>

      {isLoading ? (
        <div className="flex  h-full  rounded-md items-center justify-center w-full">
          <Lottie
            animationData={Aloading}
            loop
            className="w-[100px] lg:w-[200px]"
          />
        </div>
      ) : filteredProduits.length > 0 ? (
        <div className="w-full">
          <BoutiqueRightSide
            openDrawer={openDrawer}
            produits={filteredProduits}
          />
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex gap-2 rounded-lg mb-2 border flex-col md:flex-row md:justify-between md:items-center p-3 px-8 border-b border-[#E5E5E5]">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] md:border-none pb-2">
              <h3 className="font-semibold text-[18px]">Nos articles</h3>
              <RiMenuFold3Fill
                className="md:hidden text-orange3 font-semibold text-[25px]"
                onClick={openDrawer}
              />
            </div>
            <p className="text-[14px]">
              {filteredProduits.length}{" "}
              {filteredProduits.length > 1 ? "produits" : "produit"}
            </p>
          </div>

          <div className="flex h-full flex-col items-center justify-center border border-[#E5E5E5] rounded-md p-6 shadow-sm">
            <p className="text-bleu4 text-center text-sm md:text-lg font-medium mb-4">
              Aucun produit trouvé pour cette catégorie <br />
              <span className="text-orange3">
                {categorieSelectionner?.replace(/^GO_/, "").replace(/^SO_/, "")}
              </span>
            </p>
            <Lottie
              animationData={Nothing}
              loop
              className="w-[200px] lg:w-[400px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Boutique;

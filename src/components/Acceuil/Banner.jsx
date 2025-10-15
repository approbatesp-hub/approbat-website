// src/components/Banner.jsx

import { useNavigate } from "react-router";
import ImgBanner from "../../assets/Images/bannerImg3.jpg";
const Banner = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative w-full h-[400px] md:h-[500px] lg:h-[550px] xl:h-[600px] overflow-hidden before:absolute before:bg-black before:inset-0 before:opacity-50  "
      style={{
        backgroundImage: `url(${ImgBanner})`, // use the imported variable
        backgroundSize: "cover",
        backgroundPosition: "50% 20%", // Adjust to your needs
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0  flex items-center justify-center mt-[120px] lg:mt-12">
        <div className="text-center text-white px-4 ">
          <h1 className="text-2xl md:text-[40px] lg:text-6xl font-bold mb-2 md:mb-4 drop-shadow-lg max-w-[100%] md:max-w-[80%] lg:max-w-[65%] xl:max-w-[55%] mx-auto leading-[1.2] ">
            Construisez l’avenir avec les meilleurs matériaux
          </h1>
          <p className="text-lg md:text-xl mb-3 md:mb-6 drop-shadow-md">
            Livraison rapide • Qualité professionnelle • Prix compétitifs
          </p>
          <button
            onClick={() => navigate("/boutique")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg transform hover:scale-105"
          >
            Découvrir nos produits
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;

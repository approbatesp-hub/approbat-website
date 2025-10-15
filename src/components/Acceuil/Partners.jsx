// src/components/Partners.jsx

import React from "react";
import Partner1 from "../../assets/Images/Partenaires/sibm.png";
import Partner2 from "../../assets/Images/Partenaires/sotaci.png";
import Partner3 from "../../assets/Images/Partenaires/sotici.png";

const Partners = () => {
  const partners = [
    {
      logo: Partner1,
      name: "SIBM",
    },
    {
      logo: Partner2,
      name: "SOTACI",
    },
    {
      logo: Partner3,
      name: "SOTICI",
    },
  ];

  return (
    <div className="py-10 md:py-16 px-[10px] md:px-0 bg-gradient-to-b from-white to-[#f9fbfe] overflow-hidden ">
      <div className="mx-auto  max-w-[85%] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16  space-y-3 lg:space-y-5">
          <span className="inline-block px-5 py-2 text-sm font-semibold text-white rounded-full mb-5 bg-gradient-to-r from-[#088acc] to-[#21a2d9] shadow-md ">
            Partenariats Officiels
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Notre Réseau de Confiance
          </h3>
          <p className="mt-4 md:text-lg text-gray-600 leading-relaxed md:max-w-[90%] mx-auto ">
            Nous collaborons avec des entreprises leaders du secteur de la
            construction.
            <span className="hidden md:inline">
              {" "}
              Chaque produit que nous livrons provient de partenaires certifiés,
              pour garantir durabilité, sécurité et confiance.
            </span>
          </p>
        </div>

        {/* Partner Cards */}
        <div className="flex  justify-center items-center gap-6 md:gap-8 ">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group transition-transform duration-500 hover:scale-110"
            >
              <div className="rounded-2xl p-4 sm:p-6 bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 w-[100px] h-[100px] md:w-52 md:h-36 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={`Logo partenaire ${partner.name}`}
                  className="w-full h-full object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-center text-sm font-semibold text-gray-700">
                {partner.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partners;

// src/components/WhyWorkingWithUs.jsx

import React from "react";
import { FaLock, FaTruck, FaHeadset } from "react-icons/fa";

const WhyWorkingWithUs = () => {
  const benefits = [
    {
      icon: <FaLock className="text-white text-2xl" />,
      title: "Paiement sécurisé",
      desc: "Règlement à la livraison — zéro risque.",
      color: "#FE9900", // orange
    },
    {
      icon: <FaTruck className="text-white text-2xl" />,
      title: "Livraison rapide",
      desc: "Sous 48h partout en Côte d’Ivoire.",
      color: "#088acc", // bleu2
    },
    {
      icon: <FaHeadset className="text-white text-2xl" />,
      title: "Support technique",
      desc: "Assistance immédiate par des experts.",
      color: "#2f4858", // bleu4
    },
  ];

  return (
    <div className=" py-10 md:py-16 bg-gradient-to-b px-[10px]  md:px-0 from-white to-[#f8fbfe] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header – Centered with presence */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Pourquoi nous choisir ?
          </h3>
          <p className="text-gray-600 mt-5 md:text-lg">
            Chaque collaboration est une promesse de performance, de sécurité et
            de transparence.
          </p>
        </div>

        {/* Dynamic Card Layout */}
        <div className="relative">
          {/* Decorative background shape */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#f0f9ff] opacity-40 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-[#fff2ec] opacity-40 blur-3xl"></div>

          <div className="grid grid-cols-1  md:grid-cols-3 gap-4 lg:gap-8 relative z-10">
            {benefits.map((item, index) => (
              <div key={index}>
                <div
                  className="bg-white relative rounded-2xl p-4 lg:p-8 h-full border border-gray-100 shadow-lg hover:shadow-xl transition-shadow"
                  style={{
                    boxShadow: `0 10px 30px -10px ${item.color}20`,
                  }}
                >
                  {/* Icon Badge */}
                  <div
                    className=" w-14 h-14 lg:w-16 lg:h-16 rounded-xl flex items-center justify-center mb-6 shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}cc)`,
                    }}
                  >
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-bold text-[#2f4858] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>

                  {/* Accent underline on hover */}
                  <div
                    className="mt-4 w-0 h-0.5 group-hover:w-12 transition-all duration-300"
                    style={{ backgroundColor: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyWorkingWithUs;

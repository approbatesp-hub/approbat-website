// src/components/FAQ.jsx

import React, { useState } from "react";
import { Link } from "react-router";

const faqData = [
  {
    question: "La livraison est-elle gratuite ou payante ?",
    answer:
      "Certains articles bénéficient d’une livraison gratuite dans le district d’Abidjan, à condition que la quantité minimale indiquée soit respectée. Les produits concernés portent la mention **« livraison gratuite »**. Pour les autres commandes, les frais de livraison sont calculés en fonction du volume et de la destination. Le montant exact vous sera communiqué par téléphone lors de la validation de votre panier.",
  },
  {
    question: "Quelle est votre politique de remboursement et de retour ?",
    answer:
      "Une fois les matériaux livrés et réceptionnés, aucun remboursement n’est possible. Toutefois, nous assurons le remplacement gratuit de tout produit présentant un défaut de fabrication ou un problème de conformité, après vérification par notre équipe.",
  },
  {
    question:
      "Comment obtenir un devis personnalisé ou des conseils techniques ?",
    answer:
      "Vous pouvez nous contacter directement par téléphone ou par e-mail via la page **Contact** de notre site. Chaque fiche produit comporte également un bouton **WhatsApp** vous permettant de demander un devis instantané ou de poser vos questions pour un traitement plus rapide.",
  },
  {
    question: "Quelle garantie offrez-vous sur la qualité de vos matériaux ?",
    answer:
      "Nous travaillons uniquement avec des partenaires et fournisseurs certifiés (comme **SIBM, SOTACI, SOTICI**) afin de vous fournir des matériaux respectant les normes locales et internationales du BTP. Tous nos produits font l’objet d’un contrôle qualité strict avant expédition pour garantir votre satisfaction.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-10 md:py-16 px-[10px] md:px-0 bg-gradient-to-b from-white to-[#f9fbfe]">
      <div className="md:max-w-[85%] lg:max-w-[70%] xl:max-w-[60%] max-w-[95%] mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
            Questions fréquentes
          </h3>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto md:text-lg">
            Trouvez rapidement les réponses aux questions les plus posées par
            nos clients professionnels du BTP.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 ">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md  transition-all "
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center bg-white focus:outline-none group"
                onClick={() => toggleQuestion(index)}
              >
                <h3 className="font-semibold text-[#2f4858] md:text-lg group-hover:text-[#088acc] transition-colors">
                  {faq.question}
                </h3>
                <svg
                  className={`w-5 h-5 text-[#2f4858] transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`px-6 transition-all duration-500 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100 py-5"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer.split("**").map((part, i) =>
                    i % 2 === 1 ? (
                      <span key={i} className="font-semibold text-[#2f4858]">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 md:mt-16 text-center p-5 md:p-8 bg-blue-50 rounded-xl border-l-4 border-blue-400 shadow-inner">
          <p className="text-base md:text-xl text-nowrap font-semibold text-gray-800 mb-4 ">
            Votre question n'est pas dans la liste ?
          </p>
          <Link
            to={"/contact"}
            className="inline-flex text-sm md:text-base items-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-blue-600/30"
          >
            Contacter notre Support Technique
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

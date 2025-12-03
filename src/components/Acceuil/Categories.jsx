// src/components/Categories.jsx
import GrosOeuvreImg from "../../assets/Images/grosOeuvre2.jpg";
import FinitionsImg from "../../assets/Images/finitions1.jpg";
import ElectriciteImg from "../../assets/Images/electricite2.jpg";
import MenuiserieImg from "../../assets/Images/menuiserie3.jpg";
import { useNavigate } from "react-router";

const Categories = () => {
  const navigate = useNavigate();

  const mainCategories = [
    {
      title: "Gros Œuvre",
      description: "Matériaux pour la structure et la solidité du bâtiment",
      subcategories: [
        "Ciment",
        "Granulat",
        "Acier",
        "Bois de coffrage",
        "Agglos industriels",
        "Tôle de couverture",
        "Étanchéité",
      ],
      image: GrosOeuvreImg,
    },
    {
      title: "Travaux Techniques",
      description: "Installations nécessaires au fonctionnement du bâtiment",
      subcategories: [
        "Électricité",
        "Plomberie (évacuation et alimentation)",
        "Accessoires techniques",
      ],
      image: ElectriciteImg,
    },
    {
      title: "Finitions Intérieures",
      description: "Revêtements et aménagements pour un rendu esthétique",
      subcategories: [
        "Carrelage / Carreaux",
        "Peinture (huile et à eau)",
        "Placo / Plâtre",
        "Lambris",
        "Accessoires décoratifs",
      ],
      image: FinitionsImg,
    },
    {
      title: "Menuiserie & Fermetures",
      description: "Ouvertures, équipements et aménagements intérieurs",
      subcategories: [
        "Portes",
        "Menuiserie aluminium",
        "Meubles (lit, fauteuil, etc.)",
        "Sanitaires",
        "Ferronnerie (portail, garde-corps…)",
      ],
      image: MenuiserieImg,
    },
  ];

  return (
    <div className="py-10 md:py-16 bg-gradient-to-b px-[10px] md:px-0 from-white to-[#f9fbfe]">
      <div className="xl:max-w-[80%]   lg:max-w-[100%]  mx-auto px-4 sm:px-6 lg:px-10 xl:px-8">
        {/* Header – Clean & Confident */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#f0f9ff] text-[#088acc] text-sm font-medium px-4 py-2 rounded-full mb-6 border border-[#d1e8ff]">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Solutions Complètes BTP
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-5">
            Tout pour votre chantier{" "}
          </h3>

          <p className=" md:max-w-[90%] mx-auto text-gray-600 md:text-lg leading-relaxed">
            Des matériaux de construction aux finitions, nous couvrons
            l’ensemble de vos besoins avec des produits certifiés et un
            accompagnement expert.
          </p>
        </div>

        {/* 4 Cards – Minimalist Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-8 mx-auto">
          {mainCategories.map((category, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl  shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex h-full flex-col lg:flex-row items-start gap-3 ">
                {/* Text Content */}
                <div className="flex-1 p-2 pl-5 pb-4 flex flex-col  h-full justify-between">
                  <h3 className="text-xl font-bold text-[#2f4858] mb-1">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 lg:mb-4">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.subcategories.slice(0, 4).map((sub, i) => (
                      <span
                        key={i}
                        className="bg-[#f0f9ff] text-[#088acc] text-xs px-2.5 py-1 rounded-full font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 4 && (
                      <span className="text-gray-500 text-xs">
                        +{category.subcategories.length - 4}
                      </span>
                    )}
                  </div>

                  <button
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#088acc] hover:text-[#077ab8] transition-colors"
                    onClick={() => navigate("/boutique")}
                  >
                    Explorer la catégorie
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Image */}
                <div className="w-full lg:w-[240px] h-[210px] md:h-[230px] lg:h-full xl:h-full flex-shrink-0 rounded-bl-xl rounded-br-xl lg:rounded-bl-[0px] lg:rounded-r-xl overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Bar – Subtle & Effective */}
        <div className="mt-8 md:mt-16 bg-[#f8fbfe] rounded-2xl p-6 border border-[#e2f0ff] max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-[#2f4858]">21+</div>
              <div className="text-gray-600 text-sm">
                Catégories de produits
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2f4858]">300+</div>
              <div className="text-gray-600 text-sm">
                Références disponibles
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2f4858]">+10</div>
              <div className="text-gray-600 text-sm">ans d'expérience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;

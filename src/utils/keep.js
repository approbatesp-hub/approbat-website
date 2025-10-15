// Combine and deduplicate categories
//   const allCategories = [...new Set([...sousCategories1, ...sousCategories2])];
//   const featuredCategories = allCategories.slice(0, 8);

//   // Partner placeholders (replace with real logos)
//   const partners = Array.from({ length: 5 }, (_, i) => ({
//     id: i + 1,
//     name: `Partner ${i + 1}`,
//     // Use actual logo URLs later
//   }));

//  <section className="py-16 bg-gradient-to-b from-white to-gray-50">
//         <div className="container mx-auto px-4">
//           <p className="text-center text-bleu4 font-medium mb-12">
//             Faites confiance à des leaders du secteur
//           </p>
//           <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
//             {partners.map((partner) => (
//               <div
//                 key={partner.id}
//                 className="h-12 w-32 opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 flex items-center justify-center"
//               >
//                 <div className="text-gray-400 font-bold text-lg">
//                   LOGO {partner.id}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

{
  /* Categories Showcase */
}
//   <section className="py-20 bg-white">
//     <div className="container mx-auto px-4">
//       <div className="text-center max-w-2xl mx-auto mb-16">
//         <h2 className="text-3xl md:text-4xl font-bold text-bleu4 mb-4">
//           Tout pour votre chantier
//         </h2>
//         <p className="text-gray-600">
//           Découvrez nos catégories phares, soigneusement sélectionnées pour
//           répondre à tous vos besoins de construction.
//         </p>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//         {featuredCategories.map((category, idx) => (
//           <div
//             key={idx}
//             className="group relative bg-gray-50 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-transparent hover:border-bleu/20"
//           >
//             <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-bleu to-bleu3 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-7 w-7 text-white"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
//                 />
//               </svg>
//             </div>
//             <h3 className="font-semibold text-bleu4 group-hover:text-bleu transition-colors">
//               {category}
//             </h3>
//             <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange/5 to-bleu/5 opacity-0 group-hover:opacity-100 transition-opacity" />
//           </div>
//         ))}
//       </div>

//       <div className="text-center mt-16">
//         <button className="inline-flex items-center gap-2 px-8 py-4 bg-bleu hover:bg-bleu2 text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-bleu/20">
//           Voir toutes les catégories
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </button>
//       </div>
//     </div>
//   </section>

{
  /* Value Proposition */
}
//   <section className="py-20 bg-gradient-to-br from-bleu/5 to-orange/5">
//     <div className="container mx-auto px-4">
//       <div className="max-w-4xl mx-auto text-center mb-16">
//         <h2 className="text-3xl md:text-4xl font-bold text-bleu4 mb-4">
//           Pourquoi choisir nos matériaux ?
//         </h2>
//         <p className="text-gray-600">
//           Nous combinons qualité, rapidité et expertise pour faire de votre
//           projet une réussite.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-3 gap-8">
//         {[
//           {
//             title: "Qualité Certifiée",
//             desc: "Tous nos produits répondent aux normes européennes les plus strictes.",
//             icon: (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                 />
//               </svg>
//             ),
//           },
//           {
//             title: "Livraison Express",
//             desc: "Commandez avant 12h, livré le lendemain dans toute la région.",
//             icon: (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path d="M12 14l9-5-9-5-9 5 9 5z" />
//                 <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
//                 />
//               </svg>
//             ),
//           },
//           {
//             title: "Support Technique",
//             desc: "Nos ingénieurs vous accompagnent gratuitement dans le choix des matériaux.",
//             icon: (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-8 w-8"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
//                 />
//               </svg>
//             ),
//           },
//         ].map((item, i) => (
//           <div
//             key={i}
//             className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
//           >
//             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bleu to-orange flex items-center justify-center text-white mb-6 mx-auto">
//               {item.icon}
//             </div>
//             <h3 className="text-xl font-bold text-bleu4 mb-3">
//               {item.title}
//             </h3>
//             <p className="text-gray-600">{item.desc}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>

{
  /* Final CTA */
}
//   <section className="py-24 bg-gradient-to-r from-bleu to-bleu3">
//     <div className="container mx-auto px-4 text-center">
//       <h2 className="text-3xl md:text-5xl font-bold text-white max-w-3xl mx-auto mb-6">
//         Prêt à transformer vos plans en réalité ?
//       </h2>
//       <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
//         Rejoignez plus de 5 000 professionnels qui nous font confiance
//         chaque année.
//       </p>
//       <button className="group relative px-10 py-5 bg-white text-bleu font-bold text-lg rounded-full overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
//         <span className="relative z-10 flex items-center gap-2">
//           Accéder à la boutique
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5"
//             viewBox="0 0 20 20"
//             fill="currentColor"
//           >
//             <path
//               fillRule="evenodd"
//               d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </span>
//         <div className="absolute inset-0 bg-gradient-to-r from-orange to-orange3 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
//       </button>
//     </div>
//   </section>

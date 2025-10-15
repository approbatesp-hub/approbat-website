export const categories = ["Gros oeuvre", "Second oeuvre"];

// Option A: Prefixed strings (simplest fix)
export const sousCategories1 = [
  "GO_Ciment",
  "GO_Granulat",
  "GO_Acier",
  "GO_Bois coffrage",
  "GO_Électricité",
  "GO_Plomberie (évacuation et alimentation)",
  "GO_Agglos industriel",
  "GO_Etancheité",
  "GO_Tôle",
  "GO_Accessoires",
];

export const sousCategories2 = [
  "SO_Carreaux",
  "SO_Peinture (huile et à eau)",
  "SO_Placo ",
  "SO_Portes",
  "SO_menuiserie aluminium ",
  "SO_Meuble (lit -fauteuil ...)",
  "SO_Appareils électriques ",
  "SO_Sanitaires",
  "SO_Lambris",
  "SO_Ferronnerie (portail,garde corps...)",
  "SO_Accessoires",
];

export const fournisseurs = ["SOTICI", "SOTACI", "SIBM", "AUCUN"];

export const communesAbidjan = [
  { commune: "Abobo" },
  { commune: "Adjamé" },
  { commune: "Anyama" },
  { commune: "Assinie" },
  { commune: "Attécoubé" },
  { commune: "Bingerville" },
  { commune: "Brofodoume" },
  { commune: "Cocody" },
  { commune: "Grand-Bassam" },
  { commune: "Koumassi" },
  { commune: "Marcory" },
  { commune: "Plateau" },
  { commune: "Port-Bouët" },
  { commune: "Treichville" },
  { commune: "Songon" },
  { commune: "Yopougon" },
];

export function formatNumberWithDots(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

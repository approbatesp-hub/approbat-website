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
  { commune: "Adiaké" },
  { commune: "Adjamé" },
  { commune: "Anyama" },
  { commune: "Assinie" },
  { commune: "Attécoubé" },
  { commune: "Bingerville" },
  { commune: "Brofodoume" },
  { commune: "Cocody" },
  { commune: "Ébimpé" },
  { commune: "Grand-Bassam" },
  { commune: "Koumassi" },
  { commune: "Marcory" },
  { commune: "Plateau" },
  { commune: "Port-Bouët" },
  { commune: "Treichville" },
  { commune: "Songon" },
  { commune: "Yopougon" },
];

export const adresseLivraisonGravier = [
  {
    lieu: "Yopougon",
    prix: {
      20: 201000,
      30: 274000,
      50: 420000,
    },
  },
  {
    lieu: "Songon",
    prix: {
      20: 201000,
      30: 274000,
      50: 420000,
    },
  },
  {
    lieu: "Adjamé",
    prix: {
      20: 206000,
      30: 279000,
      50: 430000,
    },
  },
  {
    lieu: "Cocody",
    prix: {
      20: 211000,
      30: 289000,
      50: 435000,
    },
  },
  {
    lieu: "KOUMASSI",
    prix: {
      20: 211000,
      30: 284000,
      50: 440000,
    },
  },
  {
    lieu: "Marcory",
    prix: {
      20: 211000,
      30: 284000,
      50: 440000,
    },
  },
  {
    lieu: "Treichville",
    prix: {
      20: 211000,
      30: 284000,
      50: 440000,
    },
  },
  {
    lieu: "Anyama",
    prix: {
      20: 211000,
      30: 284000,
      50: 420000,
    },
  },
  {
    lieu: "Ébimpé",
    prix: {
      20: 211000,
      30: 284000,
      50: 420000,
    },
  },
  {
    lieu: "Bingerville",
    prix: {
      20: 221000,
      30: 294000,
      50: 450000,
    },
  },
  {
    lieu: "Bassam",
    prix: {
      20: 221000,
      30: 294000,
      50: 440000,
    },
  },
  {
    lieu: "Port-Bouët",
    prix: {
      20: 291000,
      30: 384000,
      50: 550000,
    },
  },
  {
    lieu: "Assinie",
    prix: {
      20: 291000,
      30: 384000,
      50: 550000,
    },
  },
  {
    lieu: "Adiaké",
    prix: {
      20: 291000,
      30: 384000,
      50: 550000,
    },
  },
];

export const adresseLivraisonSable = [
  {
    lieu: "Yopougon",
    prix: {
      1: 75000,
      2: 150000,
      3: 225000,
      4: 300000,
    },
  },
  {
    lieu: "Treichville",
    prix: {
      1: 75000,
      2: 150000,
      3: 225000,
      4: 300000,
    },
  },
  {
    lieu: "Port-Bouët",
    prix: {
      1: 75000,
      2: 150000,
      3: 225000,
      4: 300000,
    },
  },
  {
    lieu: "Marcory",
    prix: {
      1: 75000,
      2: 150000,
      3: 225000,
      4: 300000,
    },
  },
  {
    lieu: "Koumassi",
    prix: {
      1: 75000,
      2: 150000,
      3: 225000,
      4: 300000,
    },
  },
  {
    lieu: "Bingerville",
    prix: {
      1: 80000,
      2: 160000,
      3: 240000,
      4: 320000,
    },
  },
  {
    lieu: "Anyama",
    prix: {
      1: 90000,
      2: 180000,
      3: 270000,
      4: 360000,
    },
  },
  {
    lieu: "Abobo",
    prix: {
      1: 85000,
      2: 170000,
      3: 255000,
      4: 340000,
    },
  },
  {
    lieu: "Cocody",
    prix: {
      1: 85000,
      2: 170000,
      3: 255000,
      4: 340000,
    },
  },
  {
    lieu: "Bassam",
    prix: {
      1: 70000,
      2: 140000,
      3: 210000,
      4: 280000,
    },
  },
  {
    lieu: "Songon",
    prix: {
      1: 70000,
      2: 140000,
      3: 210000,
      4: 280000,
    },
  },

  {
    lieu: "Ébimpé",
    prix: {
      1: 90000,
      2: 180000,
      3: 270000,
      4: 360000,
    },
  },
];

export function formatNumberWithDots(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export const selectStyles = {
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

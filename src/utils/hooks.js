import { toast } from "react-hot-toast";
import supabase from "../../supase-client";
import { keepProducts } from "../redux/espremium";
import { useLocation } from "react-router";
import { useEffect, useRef } from "react";

export async function recuperCommandes() {
  try {
    const { data, error } = await supabase
      .from("Orders") // your main table
      .select(
        `
        *,              
        idClient (      
          id, 
          nomComplet, 
          numero, 
          email, adresse
        )
      `
      )
      .order("created_at", { ascending: false }); // order by date
    console.log(data);
    if (error) throw error;

    return data; // already includes joined user data
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    return [];
  }
}

export async function recuperUtilisateurs() {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("*")
      .eq("emailVerified", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Supabase already returns rows with their `id` if you have a PK
    return data;
  } catch (error) {
    console.log(error);
    toast.error(error.message);
    return [];
  }
}

export const getCoupons = async () => {
  try {
    const { data, error } = await supabase
      .from("Coupons")
      .select("*")
      .order("created_at", { ascending: false }); // "asc" = true

    if (error) throw error;

    return data;
  } catch (error) {
    toast.error(error.message);
    return [];
  }
};

export const recupererProduit = async (nomP) => {
  try {
    const { data, error } = await supabase
      .from("Products")
      .select("*")
      .eq("enStock", true);

    if (error) throw error;

    const normalizeString = (str) =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    return data.filter((prod) =>
      normalizeString(prod.nom).includes(normalizeString(nomP))
    );
  } catch (error) {
    toast.error(error.message);
    return [];
  }
};

export async function recupererProduitsAdmin() {
  try {
    const { data, error } = await supabase
      .from("Products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    toast.error(error.message);
    return [];
  }
}

// 🔹 Get all products within price range
export async function recupererProduits() {
  const { data, error } = await supabase
    .from("Products")
    .select("*")
    .eq("enStock", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// 🔹 Get products by category + price range
export async function recupererProduitsParCategorie(
  categorie,
  minPrice = 100,
  maxPrice = 1000000
) {
  try {
    console.log("SOMEONE IS CALLING YOU");
    const { data, error } = await supabase
      .from("Products")
      .select("*")
      .eq("sousCategorie", categorie.toLowerCase())
      .gte("prixReference", minPrice)
      .lte("prixReference", maxPrice)
      .eq("enStock", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    localStorage.setItem("produits", JSON.stringify(data));
    return data;
  } catch (error) {
    toast.error(error.message);
    return [];
  }
}

export async function recupererProduitsFav(clientId) {
  try {
    // Récupérer tous les produits
    const { data, error } = await supabase.from("Product").select("*");

    if (error) throw error;

    // Filtrer ceux où le client est dans favoris
    const realData = data.filter((produit) =>
      (produit.favoris || []).includes(clientId.id)
    );

    return realData;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

export async function recuperCommandesEnCours(id) {
  try {
    const { data, error } = await supabase
      .from("Orders")
      .select("*")
      .eq("status", "en cours")
      .eq("idClient", id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    toast.error(error.message);
    return [];
  }
}

export async function recuperCommandesLivre(id) {
  try {
    const { data, error } = await supabase
      .from("Orders")
      .select("*")
      .eq("status", "livre")
      .eq("idClient", id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    toast.error(error.message);
    return [];
  }
}

export async function recuperFactures() {
  try {
    const { data, error } = await supabase
      .from("Factures") // table name
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
  } catch (error) {
    toast.error(error.message);
    return [];
  }
}

export function usePreviousLocation() {
  const location = useLocation();
  const prevLocationRef = useRef();

  useEffect(() => {
    // Before updating, the current location becomes "previous"
    prevLocationRef.current = location;
  }, [location]);

  // Return the value from BEFORE the current location
  // So we actually need to store the old one BEFORE updating
  // But we can't do that in the same effect...

  // ❌ This still returns the CURRENT location as "previous" after first nav
}

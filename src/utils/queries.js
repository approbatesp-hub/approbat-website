import toast from "react-hot-toast";
import supabase from "../../supase-client";
import { addToFav, removeToFav } from "../redux/espremium";

export async function recupererProduitClient({ request }) {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("q")?.trim();

  try {
    let query = supabase.from("Products").select("*").eq("enStock", true);

    if (searchTerm) {
      // Search in `nom` and `description` (case-insensitive, partial match)
      query = query.or(
        `nom.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Search loader error:", error);
    return [];
  }
}

export async function addOrRemoveToFav(e, product, userInfo, dispatch) {
  e.stopPropagation();

  if (!userInfo) {
    toast.error("Veuillez vous connectez svp !");
    return;
  }

  if (userInfo && !userInfo.emailVerified) {
    toast.error("Veuillez vérifiez votre compte svp!");
    return;
  }

  try {
    // 1. Récupérer les infos de l'utilisateur actuel
    const { data: userObject, error: fetchError } = await supabase
      .from("Users")
      .select("*")
      .eq("id", userInfo.id)
      .single();

    if (fetchError) throw fetchError;

    const favoris = userObject.favoris || [];

    // 2. Vérifier si le produit est déjà en favoris
    const itemExists = favoris.find((el) => el.id === product.id);

    let updatedFavoris;

    if (itemExists) {
      // Supprimer l'utilisateur
      updatedFavoris = favoris.filter((fav) => fav.id !== product.id);

      const { error: updateError } = await supabase
        .from("Users")
        .update({ favoris: updatedFavoris })
        .eq("id", userInfo.id);

      if (updateError) throw updateError;
      dispatch(removeToFav(product));
      toast.error("Produit retiré des favoris ❌");
    } else {
      // Ajouter l'utilisateur
      updatedFavoris = [...favoris, product];

      const { error: updateError } = await supabase
        .from("Users")
        .update({ favoris: updatedFavoris })
        .eq("id", userInfo.id);

      if (updateError) throw updateError;
      console.log(product);
      dispatch(addToFav(product));
      toast.success("Produit ajouté aux favoris ✅");
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
}

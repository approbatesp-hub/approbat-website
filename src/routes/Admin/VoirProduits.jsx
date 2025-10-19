import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // <-- added useQueryClient
import { recupererProduitsAdmin } from "../../utils/hooks";
import Lottie from "lottie-react";
import Aloading from "../../assets/Images/animation/ALoading.json";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiRefreshCw,
  FiEdit,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiPackage,
} from "react-icons/fi";

import Swal from "sweetalert2";
import supabase from "../../../supase-client";

const VoirProduits = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // <-- query client for cache updates

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const [isCollapsed] = useOutletContext();

  // 1) Query server ONCE and cache for 5 minutes
  const {
    data: allProducts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allProductsAdmin"],
    queryFn: recupererProduitsAdmin,
  });

  // 2) Local copy (single source of truth for UI interactions)
  const [products, setProducts] = useState([]);

  // 3) Sync local products with query result whenever it changes (including empty array)
  useEffect(() => {
    setProducts(allProducts ?? []); // <- IMPORTANT: always set, even if [] (fixes stale local state)
  }, [allProducts]);

  // Normalize for accent-insensitive search
  const normalizeString = (str) =>
    (str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // 4) Local filtering (no extra server calls)
  const filteredProducts = searchTerm
    ? products.filter((p) =>
        normalizeString(p.nom).includes(normalizeString(searchTerm))
      )
    : products;

  // 5) Pagination
  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = filteredProducts.slice(startIdx, startIdx + pageSize);

  // Ensure current page stays valid when number of items changes
  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredProducts.length / pageSize)
    );
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredProducts.length, currentPage, pageSize]);

  const handleSearch = () => {
    setCurrentPage(1); // reset to first page for search results
  };

  const handleReset = () => {
    setSearchTerm("");
    setCurrentPage(1);
    // products already from cache, no server refetch needed
  };

  const handleEdit = (product) => {
    navigate(`/admin/modifier/${product.id}`, { state: { product: product } });
  };

  // Update product visibility on server AND update local + react-query cache
  function handleVisibility(id, isVisible) {
    const config = isVisible
      ? {
          title: "Ce produit n'est plus en stock ?",
          text: "Après confirmation, il ne sera plus visible sur le site",
          confirmText: "Oui, Je confirme!",
          successMsg: "Le produit n'est plus en stock",
          updateValue: false,
          toastType: "error",
        }
      : {
          title: "Ce produit est-il de nouveau en stock ?",
          text: "Après confirmation, il sera visible sur le site",
          confirmText: "Oui, Je confirme!",
          successMsg: "Le produit est à nouveau en stock",
          updateValue: true,
          toastType: "success",
        };

    Swal.fire({
      title: config.title,
      text: config.text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: config.confirmText,
      cancelButtonText: "J'annule",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error: dbError } = await supabase
            .from("Products")
            .update({ enStock: config.updateValue })
            .eq("id", id);

          if (dbError) throw dbError;

          // 1) Update local state immediately so UI is instant
          setProducts((prev) =>
            prev.map((p) =>
              p.id === id ? { ...p, enStock: config.updateValue } : p
            )
          );

          // 2) Update React Query cache for 'allProductsAdmin' so cache remains consistent across mounts
          queryClient.setQueryData(["allProductsAdmin"], (old = []) =>
            old.map((p) =>
              p.id === id ? { ...p, enStock: config.updateValue } : p
            )
          );

          toast[config.toastType](config.successMsg);
        } catch (error) {
          toast.error(error.message);
        }
      }
    });
  }

  // Delete product: remove from DB, storage, local state and react-query cache
  function handleDelete(product) {
    Swal.fire({
      title: "Voulez-vous supprimer ce produit?",
      text: "Pas de chemin arrière après!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je le supprime!",
      cancelButtonText: "J'annule",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const toastId = toast.loading("Suppression en cours...");
        try {
          // 1. Delete product from DB
          const { error: dbError } = await supabase
            .from("Products")
            .delete()
            .eq("id", product.id);
          if (dbError) throw dbError;

          // 2. Delete images from storage if any
          if (product.images?.length) {
            const filePaths = product.images.map((url) => {
              // extract the path used when uploading to storage
              const path = url.split("approbatesBucket/")[1];
              return decodeURIComponent(path);
            });

            const { error: storageError } = await supabase.storage
              .from("approbatesBucket")
              .remove(filePaths);
            if (storageError) throw storageError;
          }

          // 3. Update local state (remove product)
          setProducts((prev) => prev.filter((p) => p.id !== product.id));

          // 4. Update React Query cache to keep it consistent across navigation
          queryClient.setQueryData(["allProductsAdmin"], (old = []) =>
            old.filter((p) => p.id !== product.id)
          );

          toast.dismiss(toastId);
          toast.success("Produit supprimé avec succès 😊");
        } catch (error) {
          console.log(error);
          toast.dismiss(toastId);
          toast.error(error.message);
        }
      }
    });
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-amber-600">
          <p>Erreur lors du chargement des produits</p>
        </div>
      </div>
    );
  }

  return (
    /* ---------- UI: left unchanged ---------- */
    <div className="h-full flex flex-col  bg-gray-50 ">
      {/* Header */}
      <div className="  ">
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Gestion des Produits
          </h1>
          <p className="text-gray-600">
            {filteredProducts.length} produits au total
          </p>
          <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-2"></div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-6 mb-6">
          <div
            className={`flex flex-col ${
              isCollapsed
                ? "sm:flex-row lg:flex-row"
                : "sm:flex-col lg:flex-row"
            } gap-2 md:gap-4`}
          >
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 md:gap-3">
              <button
                onClick={handleSearch}
                className="bg-blue-600 flex-1 text-white px-1 md:px-6  py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiSearch className="text-lg" />
                Rechercher
              </button>
              <button
                onClick={handleReset}
                className="border border-gray-300 flex-1 text-gray-700 px-1 md:px-6 py-2 md:py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 md:gap-2 cursor-pointer"
              >
                <FiRefreshCw className="text-lg" />
                <span className="hidden lg:inline">Réinitialiser</span>{" "}
                <span className="inline lg:hidden">Réinit.</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Lottie animationData={Aloading} loop className="w-32" />
          </div>
        ) : currentItems.length > 0 ? (
          <div className="h-full ">
            <div
              className={`grid grid-cols-2 ${
                isCollapsed ? "sm:grid-cols-4" : "sm:grid-cols-3"
              } lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-6 mb-8`}
            >
              {currentItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onVisibility={handleVisibility}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
      <div className="w-full mt-auto">
        <div className="w-full flex justify-center">
          <Pagination
            current={currentPage}
            total={filteredProducts.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showLessItems
            className="rc-pagination"
          />
        </div>
      </div>
      {/* Pagination */}
    </div>
  );
};

// ProductCard & EmptyState unchanged (kept exactly as in your file)
const ProductCard = ({ product, onEdit, onVisibility, onDelete }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ">
    <div className="relative">
      <img
        src={product.images[0]}
        alt={product.nom}
        className="w-full h-[100px] md:h-[120px] object-cover rounded-t-lg"
      />
      <div className="absolute top-3 right-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.enStock
              ? "bg-green-100 text-green-800"
              : "bg-amber-100 text-amber-800"
          }`}
        >
          {product.enStock ? "En stock" : "Hors stock"}
        </span>
      </div>
    </div>

    <div className="py-2 flex flex-col justify-between px-4 min-h-[calc(100%-100px)] md:min-h-[calc(100%-120px)]  ">
      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 capitalize">
        {product.nom}
      </h3>
      <p className="text-lg font-bold text-blue-600 md:mb-2">
        {product.prixReference} Fcfa
      </p>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title="Modifier"
          >
            <FiEdit className="text-lg" />
          </button>
          <button
            onClick={() => onVisibility(product.id, product.enStock)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              product.enStock
                ? "text-green-600 hover:bg-green-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            title={product.enStock ? "Masquer" : "Afficher"}
          >
            {product.enStock ? (
              <FiEye className="text-lg" />
            ) : (
              <FiEyeOff className="text-lg" />
            )}
          </button>
        </div>
        <button
          onClick={() => onDelete(product)}
          className="p-2 text-amber-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          title="Supprimer"
        >
          <FiTrash2 className="text-lg" />
        </button>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FiPackage className="text-3xl text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      Aucun produit trouvé
    </h3>
    <p className="text-gray-600">Commencez par ajouter votre premier produit</p>
  </div>
);

export default VoirProduits;

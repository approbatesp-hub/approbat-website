// src/components/admin/Articles.jsx
import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import Aloading from "../../assets/Images/animation/ALoading.json";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

// Icons
import { FiTrash2, FiFileText } from "react-icons/fi";
import { recupererArticlesAdmin } from "../../utils/hooks";
import supabase from "../../../supase-client";

const Articles = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCollapsed] = useOutletContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const {
    data: allBlogs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allBlogsAdmin"],
    queryFn: recupererArticlesAdmin,
  });

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setBlogs(allBlogs ?? []);
  }, [allBlogs]);

  const normalizeString = (str) =>
    (str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredBlogs = searchTerm
    ? blogs.filter((blog) =>
        normalizeString(blog.title).includes(normalizeString(searchTerm))
      )
    : blogs;

  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = filteredBlogs.slice(startIdx, startIdx + pageSize);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / pageSize));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredBlogs.length, currentPage, pageSize]);

  const handleDelete = (blog) => {
    Swal.fire({
      title: "Supprimer cet article ?",
      text: "Cette action est irréversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const toastId = toast.loading("Suppression en cours…");

        try {
          // 1. Delete from DB
          const { error: dbError } = await supabase
            .from("Blogs")
            .delete()
            .eq("id", blog.id);

          if (dbError) throw dbError;

          // 2. Delete image from storage (if it's from your bucket)
          if (blog.mainImage?.includes("approbatesBucket")) {
            const filePath = blog.mainImage.split("approbatesBucket/")[1];
            if (filePath) {
              await supabase.storage
                .from("approbatesBucket")
                .remove([decodeURIComponent(filePath)]);
            }
          }

          // 3. Update local & cache
          setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
          queryClient.setQueryData(["allBlogsAdmin"], (old = []) =>
            old.filter((b) => b.id !== blog.id)
          );

          toast.dismiss(toastId);
          toast.success("Article supprimé avec succès !");
        } catch (err) {
          console.error(err);
          toast.dismiss(toastId);
          toast.error("Erreur lors de la suppression.");
        }
      }
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-amber-600">Erreur: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 w-full ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Gestion des Articles
        </h1>
        <p className="text-gray-600">{filteredBlogs.length} articles</p>
        <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-2"></div>
      </div>

      {/* Blogs Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Lottie animationData={Aloading} loop className="w-24" />
        </div>
      ) : currentItems.length > 0 ? (
        <div className="flex-1 flex flex-col h-full rounded-lg  ">
          <div
            className={`grid   grid-cols-1 ${
              isCollapsed ? "md:grid-cols-3 " : "md:grid-cols-2 "
            }lg:grid-cols-5 gap-5 mb-8`}
          >
            {currentItems.map((blog) => (
              <BlogCard key={blog.id} blog={blog} onDelete={handleDelete} />
            ))}
          </div>
          {/* Pagination */}
          <div className=" w-full mt-auto pt-4">
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                total={filteredBlogs.length}
                pageSize={pageSize}
                onChange={setCurrentPage}
                showLessItems
                className="rc-pagination"
              />
            </div>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

// Blog Card Component
const BlogCard = ({ blog, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      {blog.mainImage ? (
        <div className="h-30 overflow-hidden">
          <img
            src={blog.mainImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-40 bg-gray-100 flex items-center justify-center">
          <FiFileText className="text-4xl text-gray-400" />
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {blog.content
            .replace(/[#*_`]/g, "")
            .split("\n")
            .filter(Boolean)[0] || "Aucun contenu"}
        </p>

        <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex ml-auto gap-2">
            <button
              onClick={() => onDelete(blog)}
              className="p-2 flex items-center text-white px-4 font-medium gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 duration-300 transition-all rounded-lg"
              title="Supprimer"
            >
              <span>Supprimer</span>
              <FiTrash2 />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <FiFileText className="text-3xl text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun article</h3>
    <p className="text-gray-600">Commencez par créer votre premier article.</p>
  </div>
);

export default Articles;

// src/pages/Blog.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";
import Aloading from "../assets/Images/animation/ALoading.json";
import {
  FiSearch,
  FiFileText,
  FiCalendar,
  FiClock,
  FiArrowRight,
} from "react-icons/fi";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { recupererArticlesAdmin } from "../utils/hooks";

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["allBlogsPublic"],
    queryFn: recupererArticlesAdmin,
    staleTime: 60 * 60 * 1000,
  });

  const normalizeString = (str) =>
    (str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filteredArticles = useMemo(() => {
    if (!searchTerm) return articles;
    return articles.filter(
      (a) =>
        normalizeString(a.title).includes(normalizeString(searchTerm)) ||
        normalizeString(a.content).includes(normalizeString(searchTerm))
    );
  }, [articles, searchTerm]);

  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = filteredArticles.slice(startIdx, startIdx + pageSize);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const calculateReadingTime = (content) => {
    const words = content.trim().split(/\s+/).length;
    return `${Math.max(1, Math.ceil(words / 200))} min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50/10 pt-36 md:pt-30 pb-10 ">
      {/* Hero */}
      <div className="text-center mb-10 px-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-blue-950 mb-4 tracking-tight">
          Notre Blog
        </h1>
        <p className="lg:text-lg text-gray-600 max-w-2xl mx-auto mb-5 ">
          Découvrez nos conseils, tendances et inspirations pour vos projets.
        </p>

        {/* Search Bar */}
        <div className="max-w-[80%] md:max-w-[60%] lg:max-w-[40%] mx-auto relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un article..."
            className="w-full placeholder:text-sm py-2 md:py-3 md:placeholder:text-base pl-12 pr-6  bg-white border border-gray-200 rounded-2xl text-gray-800 focus:outline-none focus:ring-3 focus:ring-amber-500/20 focus:border-amber-500 shadow-md transition-all duration-200"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <main className="max-w-[85%] mx-auto  mt-6">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="text-center">
              <Lottie
                animationData={Aloading}
                loop
                className="w-24 mx-auto mb-6"
              />
              <p className="text-gray-600 text-lg">
                Chargement des articles...
              </p>
            </div>
          </div>
        ) : currentItems.length > 0 ? (
          <>
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-14">
              {currentItems.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  formatDate={formatDate}
                  calculateReadingTime={calculateReadingTime}
                  onClick={() => {
                    navigate(`/blog/${article.id}`, { state: { article } });
                    localStorage.setItem(
                      "selectedArticle",
                      JSON.stringify(article)
                    );
                  }}
                />
              ))}
            </div>

            {/* Pagination */}
            {filteredArticles.length > pageSize && (
              <div className="flex justify-center mt-8">
                <div className="bg-white rounded-2xl shadow-md border border-gray-200/70 p-4 min-w-[300px]">
                  <Pagination
                    current={currentPage}
                    total={filteredArticles.length}
                    pageSize={pageSize}
                    onChange={(page) => setCurrentPage(page)}
                    showLessItems
                    className="rc-pagination"
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            searchTerm={searchTerm}
            onClear={() => setSearchTerm("")}
          />
        )}
      </main>
    </div>
  );
};

// Article Card – Refined for elegance & consistency
const ArticleCard = ({
  article,
  formatDate,
  calculateReadingTime,
  onClick,
}) => {
  const firstParagraph =
    article.content
      .replace(/[#*\[\]()>`]/g, "")
      .split(/\n{2,}/)
      .find((p) => p.trim()) || "";

  return (
    <article
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      {/* Image */}
      <div className="h-40 overflow-hidden bg-gray-50">
        {article.mainImage ? (
          <img
            src={article.mainImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
            <FiFileText size={40} />
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        {/* Metadata */}
        <div className="flex  justify-between flex-wrap gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1.5  font-medium">
            <FiCalendar size={12} />
            {formatDate(article.created_at)}
          </span>
          <span className="flex items-center gap-1.5   px-2.5 font-medium">
            <FiClock size={12} />
            {calculateReadingTime(article.content)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl capitalize font-bold text-blue-950 mb-2 line-clamp-2 transition-colors leading-tight">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-1 line-clamp-3">
          {firstParagraph.substring(0, 140)}...
        </p>

        {/* Read More */}
        <div className="mt-auto ">
          <span className="text-amber-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all text-sm">
            Lire l'article
            <FiArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
};

// Empty State – More engaging
const EmptyState = ({ searchTerm, onClear }) => (
  <div className="text-center py-20">
    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <FiFileText className="text-3xl text-blue-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      {searchTerm ? "Aucun résultat trouvé" : "Aucun article publié"}
    </h3>
    <p className="text-gray-600 max-w-md mx-auto mb-8 px-4">
      {searchTerm
        ? `Aucun article ne correspond à votre recherche : "${searchTerm}".`
        : "De nouveaux contenus seront bientôt disponibles. Revenez plus tard !"}
    </p>
    {searchTerm && (
      <button
        onClick={onClear}
        className="text-amber-500 font-semibold hover:text-amber-800 flex items-center gap-2 mx-auto"
      >
        ← Effacer la recherche
      </button>
    )}
  </div>
);

export default Blog;

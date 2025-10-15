import React, { useState } from "react";
import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import Pagination from "rc-pagination";
import Logo from "../assets/Images/logo-img.png";

const CommandesCardLI = ({ allCommandes }) => {
  function formatNumberWithDots(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const startIdx = (currentPage - 1) * pageSize;
  const currentItems = allCommandes?.slice(startIdx, startIdx + pageSize) || [];

  return (
    <div className="space-y-6">
      {currentItems.map((el, i) => (
        <div
          key={el.id}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Order Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {el.articlesAchetes.length}{" "}
                  {el.articlesAchetes.length > 1 ? "articles" : "article"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Livrée le{" "}
                  {format(new Date(el.created_at), "d MMMM yyyy", {
                    locale: frCA,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-green-600">
                  {formatNumberWithDots(el.montantTotal)} Fcfa
                </p>
                <p className="text-xs text-gray-500 mt-1">ID: {el.id}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-5">
            <h4 className="text-sm font-medium text-gray-700 uppercase mb-4 hidden md:block">
              {el.articlesAchetes.length > 1 ? "Articles" : "Article"} dans
              votre commande
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {el.articlesAchetes.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <img
                    src={item.images?.[0]}
                    onError={(e) => {
                      e.currentTarget.onerror = null; // Prevent infinite loop
                      e.currentTarget.src = Logo; // Fallback to your logo
                    }}
                    alt={item.nom}
                    className="w-20 h-20 object-cover rounded-lg border
                  border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-gray-900 line-clamp-2">
                      {item.nom}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">
                      Quantité:{" "}
                      <span className="font-medium">{item.quantite}</span>
                    </p>
                    {item.type && item.type !== "undefined" && (
                      <p className="text-sm text-gray-600 mt-1">
                        Type: <span className="font-medium">{item.type}</span>
                      </p>
                    )}
                    <div className="mt-2 inline-block">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Livré
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {allCommandes?.length > pageSize && (
        <div className="mt-8 flex justify-center">
          <Pagination
            current={currentPage}
            total={allCommandes.length}
            pageSize={pageSize}
            onChange={setCurrentPage}
            showLessItems
            className="rc-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default CommandesCardLI;

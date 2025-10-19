import { useLocation, useNavigate } from "react-router";
import { FiArrowLeft, FiCalendar, FiClock, FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";

const BlogID = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const article = state?.article;

  if (!article) {
    return (
      <div className="pt-[140px] pb-20 bg-gradient-to-b from-slate-50 to-blue-50/20 text-center">
        <p className="text-gray-600">Article non trouvé.</p>
        <button
          onClick={() => navigate("/blog")}
          className="mt-4 text-amber-600 font-medium"
        >
          Retour au blog
        </button>
      </div>
    );
  }

  const words = article.content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  const formattedDate = new Date(
    article.createdAt || Date.now()
  ).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ✅ Your original renderFormattedParagraph — untouched!
  const renderFormattedParagraph = (text, index) => {
    if (!text.trim()) return null;

    let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");
    formattedText = formattedText.replace(
      /`(.*?)`/g,
      "<code class='inline-code'>$1</code>"
    );

    if (text.startsWith("### ")) {
      return (
        <h4
          key={index}
          className="text-xl font-semibold capitalize text-gray-800 mt-8 mb-5 tracking-tight pl-4 border-l-3 border-amber-400 transform transition-all duration-500 "
          dangerouslySetInnerHTML={{
            __html: formattedText.replace(/^### /, ""),
          }}
        />
      );
    } else if (text.startsWith("## ")) {
      return (
        <h3
          key={index}
          className="text-2xl font-bold text-gray-900 mt-12 capitalize mb-5 tracking-tight relative 
                     before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-20 before:h-1 before:bg-gradient-to-r before:from-amber-400 before:to-amber-500 before:rounded-full"
          dangerouslySetInnerHTML={{
            __html: formattedText.replace(/^## /, ""),
          }}
        />
      );
    } else if (text.startsWith("# ")) {
      return (
        <h3
          key={index}
          className="text-3xl capitalize font-bold text-gray-900 mt-12 mb-5 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text  relative inline-block"
          dangerouslySetInnerHTML={{ __html: formattedText.replace(/^# /, "") }}
        />
      );
    }

    return (
      <p
        key={index}
        className={`mb-4 text-[17px] text-gray-700 leading-relaxed transition-all duration-500  ${
          index === 0
            ? "first-letter:text-7xl first-letter:font-bold first-letter:text-amber-500 first-letter:uppercase first-letter:mr-4 first-letter:float-left first-letter:leading-none first-letter:mt-3 first-letter:font-serif first-letter:drop-shadow-sm"
            : ""
        }`}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  };

  // ✅ NEW: Lightweight block splitter (only for lists & tables)
  const splitIntoBlocks = (content) => {
    const lines = content.split("\n");
    const blocks = [];
    let buffer = [];
    let inList = false;
    let inTable = false;

    const flush = () => {
      if (buffer.length > 0) {
        blocks.push(buffer.join("\n"));
        buffer = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      const isUnordered = /^(\*|-)\s/.test(trimmed);
      const isOrdered = /^\d+\.\s/.test(trimmed);
      const isTableLine =
        trimmed.includes("|") && trimmed.split("|").length > 2;
      const isListItem = isUnordered || isOrdered;

      const isListLine = isListItem;
      const isTable = isTableLine;

      if (isListLine) {
        if (!inList || inTable) {
          flush();
          inList = true;
          inTable = false;
        }
        buffer.push(line);
      } else if (isTable) {
        if (!inTable || inList) {
          flush();
          inTable = true;
          inList = false;
        }
        buffer.push(line);
      } else {
        if (inList || inTable || trimmed === "") {
          flush();
          inList = false;
          inTable = false;
        }
        if (trimmed !== "") {
          buffer.push(line);
        } else {
          flush();
        }
      }
    }
    flush();
    return blocks;
  };

  // ✅ Render a block: if it's a list or table, handle it; else use your original function
  const renderBlock = (block, index) => {
    const lines = block.split("\n").filter((l) => l.trim() !== "");
    if (lines.length === 0) return null;

    // Check if it's a list
    if (lines.every((l) => /^(\*|-|\d+\.)\s/.test(l.trim()))) {
      const isOrdered = lines[0].trim().match(/^\d+\./);
      if (isOrdered) {
        return (
          <ol
            key={index}
            className="list-decimal list-inside mb-5 pl-5 space-y-2 text-[17px] text-gray-700"
          >
            {lines.map((l, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: l
                    .replace(/^\d+\.\s+/, "")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                }}
              />
            ))}
          </ol>
        );
      } else {
        return (
          <ul
            key={index}
            className="list-disc list-inside mb-5 pl-5 space-y-2 text-[17px] text-gray-700"
          >
            {lines.map((l, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{
                  __html: l
                    .replace(/^(\*|-)\s+/, "")
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>"),
                }}
              />
            ))}
          </ul>
        );
      }
    }

    // Check if it's a table
    if (lines.every((l) => l.includes("|")) && lines.length >= 2) {
      const rows = lines.map((l) =>
        l
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c !== "")
      );
      if (rows[0].length < 2) return renderFormattedParagraph(block, index);

      const headers = rows[0];
      const body = rows.slice(1);

      return (
        <div key={index} className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((h, i) => (
                  <th
                    key={i}
                    className="border border-gray-300 px-3 py-2 text-left font-semibold text-gray-800"
                  >
                    {h
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\*(.*?)\*/g, "<em>$1</em>")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr
                  key={ri}
                  className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border border-gray-300 px-3 py-2 text-gray-700"
                    >
                      {cell
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Otherwise, it's a regular paragraph (or heading) → use your original function
    return renderFormattedParagraph(block, index);
  };

  const blocks = splitIntoBlocks(article.content);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Lien copié !", {
      icon: "🔗",
      style: {
        borderRadius: "12px",
        background: "#4f46e5",
        color: "#fff",
      },
    });
  };

  return (
    <div className="pt-[140px] pb-20 bg-gradient-to-b from-slate-50 to-blue-50/20">
      <article className="md:max-w-[90%] lg:max-w-[45%] mx-auto px-6 sm:px-6 lg:px-8">
        {article.mainImage && (
          <div className="relative rounded-2xl overflow-hidden shadow-lg mb-5">
            <img
              src={article.mainImage}
              alt={article.title}
              className="w-full h-64 md:h-72 lg:h-84 object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-3">
              <span className="bg-white backdrop-blur-sm text-amber-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <FiCalendar size={14} />
                {formattedDate}
              </span>
              <span className="bg-white backdrop-blur-sm text-amber-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <FiClock size={14} />
                {readingTime} min
              </span>
            </div>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center text-balance capitalize leading-tight">
          {article.title}
        </h1>

        <div className="prose prose-gray max-w-none font-serif text-lg">
          {blocks.map(renderBlock)}
        </div>

        <div className="mt-6 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <button
              onClick={copyLink}
              className="group flex items-center gap-2 px-5 py-3 bg-gray-50  border border-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
            >
              <FiShare2
                className="group-hover:rotate-12 transition-transform"
                size={18}
              />
              Copier le lien
            </button>
          </div>

          <button
            onClick={() => navigate("/blog")}
            className="group flex items-center gap-2 text-amber-500 font-semibold hover:text-amber-600 transition-colors duration-200"
          >
            <span>Explorer tous les articles</span>
            <FiArrowLeft className="ml-1 group-hover:-translate-x-1 transition-transform rotate-180" />
          </button>
        </div>
      </article>
    </div>
  );
};

export default BlogID;

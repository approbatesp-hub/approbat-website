import { useLocation, useNavigate } from "react-router";
import { FiArrowLeft, FiCalendar, FiClock, FiShare2 } from "react-icons/fi";
import toast from "react-hot-toast";

const BlogID = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const article = state?.article;

  // Reading time
  const words = article.content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  // Format date
  const formattedDate = new Date(
    article.createdAt || Date.now()
  ).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Process content to handle lists and tables
  const processContent = () => {
    const lines = article.content.split("\n");
    const elements = [];
    let currentList = null;
    let currentOrderedList = null;
    let currentTable = null;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        if (currentList) {
          elements.push(renderList(currentList, "unordered"));
          currentList = null;
        }
        if (currentOrderedList) {
          elements.push(renderList(currentOrderedList, "ordered"));
          currentOrderedList = null;
        }
        if (currentTable) {
          elements.push(renderTable(currentTable));
          currentTable = null;
        }
        return;
      }

      // Handle unordered lists (starting with - or *)
      if (trimmedLine.match(/^[-*]\s/)) {
        const listItem = trimmedLine.replace(/^[-*]\s/, "");
        if (!currentList) currentList = [];
        currentList.push(processText(listItem));
        return;
      }

      // Handle ordered lists (starting with numbers)
      if (trimmedLine.match(/^\d+\.\s/)) {
        const listItem = trimmedLine.replace(/^\d+\.\s/, "");
        if (!currentOrderedList) currentOrderedList = [];
        currentOrderedList.push(processText(listItem));
        return;
      }

      // Handle tables (lines containing |)
      if (trimmedLine.includes("|")) {
        if (!currentTable) currentTable = [];
        currentTable.push(trimmedLine);
        return;
      }

      // Close any open lists or tables before processing regular content
      if (currentList) {
        elements.push(renderList(currentList, "unordered"));
        currentList = null;
      }
      if (currentOrderedList) {
        elements.push(renderList(currentOrderedList, "ordered"));
        currentOrderedList = null;
      }
      if (currentTable) {
        elements.push(renderTable(currentTable));
        currentTable = null;
      }

      // Process regular content (headings and paragraphs)
      elements.push(renderFormattedContent(trimmedLine, index));
    });

    // Close any remaining lists or tables
    if (currentList) {
      elements.push(renderList(currentList, "unordered"));
    }
    if (currentOrderedList) {
      elements.push(renderList(currentOrderedList, "ordered"));
    }
    if (currentTable) {
      elements.push(renderTable(currentTable));
    }

    return elements;
  };

  // Process text for formatting (bold, italic, code)
  const processText = (text) => {
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    formattedText = formattedText.replace(/\*(.*?)\*/g, "<em>$1</em>");
    formattedText = formattedText.replace(
      /`(.*?)`/g,
      "<code class='inline-code'>$1</code>"
    );
    return formattedText;
  };

  // Render lists
  const renderList = (items, type) => {
    const ListComponent = type === "ordered" ? "ol" : "ul";
    const listClass =
      type === "ordered"
        ? "list-decimal ml-6 my-4 space-y-2"
        : "list-disc ml-6 my-4 space-y-2";

    return (
      <ListComponent
        key={`list-${Date.now()}-${Math.random()}`}
        className={listClass}
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="text-[17px] text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ListComponent>
    );
  };

  // Render tables
  const renderTable = (tableLines) => {
    if (tableLines.length === 0) return null;

    // Check if there's a header separator
    const hasHeaderSeparator = tableLines.some((line) =>
      line
        .replace(/\|/g, "")
        .trim()
        .match(/^:?-+:?$/)
    );

    let headerRow = 0;
    if (hasHeaderSeparator && tableLines.length > 1) {
      headerRow = 0;
    }

    return (
      <div
        key={`table-${Date.now()}-${Math.random()}`}
        className="my-6 overflow-x-auto"
      >
        <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <tbody>
            {tableLines.map((line, rowIndex) => {
              // Skip header separator lines
              if (
                line
                  .replace(/\|/g, "")
                  .trim()
                  .match(/^:?-+:?$/)
              ) {
                return null;
              }

              const cells = line
                .split("|")
                .filter((cell) => cell.trim() !== "");
              const isHeader = rowIndex === headerRow && hasHeaderSeparator;

              return (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  {cells.map((cell, cellIndex) => {
                    const processedCell = processText(cell.trim());

                    return isHeader ? (
                      <th
                        key={cellIndex}
                        className="border border-gray-300 px-4 py-3 bg-gray-100 font-semibold text-gray-900 text-left"
                        dangerouslySetInnerHTML={{ __html: processedCell }}
                      />
                    ) : (
                      <td
                        key={cellIndex}
                        className="border border-gray-300 px-4 py-3 text-gray-700"
                        dangerouslySetInnerHTML={{ __html: processedCell }}
                      />
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Render formatted content (headings and paragraphs)
  const renderFormattedContent = (text, index) => {
    const formattedText = processText(text);

    // Headings with improved styling
    if (text.startsWith("### ")) {
      return (
        <h4
          key={index}
          className="text-xl font-semibold text-gray-800 mt-8 mb-5 tracking-tight pl-4 border-l-3 border-amber-400 transform transition-all duration-500"
          dangerouslySetInnerHTML={{
            __html: formattedText.replace(/^### /, ""),
          }}
        />
      );
    } else if (text.startsWith("## ")) {
      return (
        <h3
          key={index}
          className="text-2xl font-bold text-gray-900 mt-8 mb-5 tracking-tight relative 
                     before:content-[''] before:absolute before:left-0 before:bottom-0 before:w-20 before:h-1 before:bg-gradient-to-r before:from-amber-400 before:to-amber-500 before:rounded-full"
          dangerouslySetInnerHTML={{
            __html: formattedText.replace(/^## /, ""),
          }}
        />
      );
    } else if (text.startsWith("# ")) {
      return (
        <h2
          key={index}
          className="text-3xl font-bold text-gray-900 mt-8 mb-5 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text relative inline-block"
          dangerouslySetInnerHTML={{ __html: formattedText.replace(/^# /, "") }}
        />
      );
    }

    // Regular paragraph with enhanced styling
    return (
      <p
        key={index}
        className={`mb-4 text-[17px] text-gray-700 leading-relaxed transition-all duration-500 ${
          index === 0
            ? "first-letter:text-7xl first-letter:font-bold first-letter:text-amber-500 first-letter:uppercase first-letter:mr-4 first-letter:float-left first-letter:leading-none first-letter:mt-3 first-letter:font-serif first-letter:drop-shadow-sm"
            : ""
        }`}
        dangerouslySetInnerHTML={{ __html: formattedText }}
      />
    );
  };

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
        {/* Hero Image with Overlay */}
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

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center text-balance capitalize leading-tight">
          {article.title}
        </h1>

        {/* Content */}
        <div className="prose prose-gray max-w-none font-serif text-lg">
          {processContent()}
        </div>

        {/* Action Footer */}
        <div className="mt-6 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <button
              onClick={copyLink}
              className="group flex items-center gap-2 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-700 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
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

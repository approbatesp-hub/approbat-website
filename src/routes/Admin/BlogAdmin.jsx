// src/components/BlogEditor.jsx
import React, { useRef, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { BsFillCloudUploadFill, BsCheckCircle } from "react-icons/bs";
import { FiTrash2, FiEdit3, FiImage } from "react-icons/fi";
import Resizer from "react-image-file-resizer";
import toast from "react-hot-toast";
import supabase from "../../../supase-client";

const BlogAdmin = () => {
  const editorRef = useRef();
  const [title, setTitle] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [loader, setLoader] = useState(false);

  const envoyerBlog = async () => {
    const content = editorRef.current.getInstance().getMarkdown();
    if (!title.trim() || !mainImage || !content.trim()) {
      toast.error("Veuillez remplir tous les champs avant de publier.");
      return;
    }

    const toastId = toast.loading("Enregistrement de l'article...");
    try {
      const { error } = await supabase.from("Blogs").insert([
        {
          title,
          mainImage: mainImage,
          content,
        },
      ]);

      if (error) throw error;

      toast.success("Article enregistré avec succès !");
      setTitle("");
      setMainImage(null);
      editorRef.current.getInstance().setMarkdown("");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'enregistrement de l'article.");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleResetBody = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser le contenu ?")) {
      editorRef.current.getInstance().setMarkdown("");
    }
  };

  async function handleImageUpload(e) {
    setLoader(true);

    const imageFile = e.target.files[0];
    if (!imageFile) {
      setLoader(false);
      return;
    }

    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!validTypes.includes(imageFile.type)) {
      toast.error("Seuls les formats PNG, JPEG et WEBP sont acceptés.");
      setLoader(false);
      return;
    }

    try {
      const resizedImage = await resizeFile(imageFile);
      const fileName = `blog-${Date.now()}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("approbatesBucket")
        .upload(fileName, resizedImage);

      if (uploadError) {
        toast.error("Erreur lors du téléchargement de l'image.");
        setLoader(false);
        return;
      }

      const { data } = supabase.storage
        .from("approbatesBucket")
        .getPublicUrl(fileName);

      setMainImage(data?.publicUrl);
      console.log("DATA", data);
      toast.success("Image téléchargée avec succès.");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Une erreur inattendue s'est produite.");
    } finally {
      setLoader(false);
    }
  }

  const removeImage = async (url) => {
    const toastId = toast.loading("Suppression en cours...");
    const fileName = url.split("/").pop();
    const { error } = await supabase.storage
      .from("approbatesBucket")
      .remove([fileName]);

    if (error) {
      toast.dismiss(toastId);
      toast.error("Erreur lors de la suppression de l'image.");
    } else {
      toast.dismiss(toastId);

      toast.success("Image supprimée avec succès.");
      setMainImage(null); // Remove the preview after deleting
    }
  };

  const resizeFile = (file) =>
    new Promise((resolve, reject) => {
      const outputFormat = file.type === "image/png" ? "PNG" : "JPEG";
      const outputMimeType =
        file.type === "image/png" ? "image/png" : "image/jpeg";

      Resizer.imageFileResizer(
        file,
        500,
        500,
        outputFormat,
        90,
        0,
        (uri) => {
          fetch(uri)
            .then((res) => res.blob())
            .then((blob) => {
              const resizedFile = new File([blob], file.name, {
                type: outputMimeType,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            })
            .catch(reject);
        },
        "base64",
        500,
        500
      );
    });

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-gray-50 to-blue-50/30  md:p-2 lg:p-6">
      <div className="max-w-8xl mx-auto">
        {/* Header élégant */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-sm border border-gray-200/60 mb-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Création d'Articles
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Rédigez votre contenu avec une interface moderne et intuitive.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {" "}
          {/* ✅ Fixed: added "8" to mb- */}
          {/* Colonne Éditeur - 2/3 */}
          <div className="xl:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden h-full flex flex-col">
              <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">
                    Contenu de l'article
                  </h3>
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                    <FiEdit3 className="text-blue-500" />
                    <span>Édition en temps réel</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-[500px]">
                <Editor
                  ref={editorRef}
                  initialValue="<p>Commencez à écrire ici...</p>"
                  language="fr"
                  initialEditType="wysiwyg"
                  hideModeSwitch={true}
                  useCommandShortcut={true}
                  height="100%"
                  toolbarItems={[
                    ["heading", "bold", "italic", "strike"],
                    ["hr", "quote"],
                    ["ul", "ol", "task", "indent", "outdent"],
                    ["table", "link"],
                  ]}
                />
              </div>
            </div>
          </div>
          {/* Colonne Métadonnées - 1/3 */}
          <div className="space-y-6 order-2 lg:order-1">
            {/* Action Buttons */}

            {/* Titre */}
            <div className="bg-white  rounded-2xl shadow-lg border border-gray-200/60 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-lg">T</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Titre de l'article
                  </h3>
                  <p className="text-sm text-gray-500">Maximum 60 caractères</p>
                </div>
              </div>

              <div
                className={`relative transition-all duration-200 ${
                  isTitleFocused ? "transform scale-[1.02]" : ""
                }`}
              >
                <input
                  type="text"
                  placeholder="Ex: Comment choisir le bon gravier..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setIsTitleFocused(true)}
                  onBlur={() => setIsTitleFocused(false)}
                  className={`w-full px-4 py-4 border-2 rounded-xl transition-all duration-200 focus:outline-none text-lg font-medium placeholder-gray-400 ${
                    isTitleFocused
                      ? "border-blue-500 shadow-lg shadow-blue-500/10"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <div className="flex justify-between items-center mt-3">
                  <div
                    className={`text-sm ${
                      title.length > 60 ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {title.length}/60
                  </div>
                  {title && title.length <= 60 && (
                    <BsCheckCircle className="text-green-500 text-lg" />
                  )}
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiImage className="text-purple-600 text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Image Principale
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {!mainImage ? (
                  loader ? (
                    // ✅ Inline loader (no SimpleLoader needed)
                    <div className="flex justify-center items-center h-42">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <label className="block cursor-pointer group">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 group-hover:border-purple-400 group-hover:bg-purple-50/50 group-hover:scale-[1.02]">
                        <BsFillCloudUploadFill className="text-4xl text-gray-400 mb-3 mx-auto group-hover:text-purple-500 transition-colors" />
                        <p className="font-medium text-gray-600 mb-2 group-hover:text-purple-700">
                          Cliquer pour uploader
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, WEBP • Max 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleImageUpload}
                        accept="image/*"
                      />
                    </label>
                  )
                ) : (
                  <div className="relative group">
                    <div className="rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                      <img
                        src={mainImage}
                        alt="Preview"
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                      <button
                        onClick={() => removeImage(mainImage)}
                        className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                )}

                {mainImage && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <BsCheckCircle />

                    <span className="text-sm font-medium">
                      Image sélectionnée
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={handleResetBody}
                className="flex items-center justify-center w-full gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
              >
                <FiTrash2 />
                Réinitialiser
              </button>

              <button
                onClick={envoyerBlog}
                disabled={!title}
                className={`flex items-center w-full gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  title
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <BsCheckCircle className="text-lg" />
                Enregistrer l'article
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAdmin;

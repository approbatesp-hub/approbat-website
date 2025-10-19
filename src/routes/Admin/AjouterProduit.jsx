// src/routes/Admin/AjouterProduit.jsx
import { useState, useEffect } from "react";
import {
  categories,
  sousCategories1,
  sousCategories2,
  fournisseurs as fournisseursList, // 👈 RENAME to avoid collision
} from "../../utils/constants";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import supabase from "../../../supase-client";
import SimpleLoader from "../../components/SimpleLoader";
import Resizer from "react-image-file-resizer";
import ConfirmationModal from "../../components/ConfirmationModal";

const AjouterProduit = () => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [categorie, setCategorie] = useState(null);
  const [sousCategorie, setSousCategorie] = useState(null);
  const [fournisseur, setFournisseur] = useState(null); // 👈 SINGULAR — for single selection

  const [quantitéMinimale, setQuantitéMinimale] = useState("");
  const [prixReference, setPrixReference] = useState("");
  const [livraisonGratuite, setLivraisonGratuite] = useState(null);
  const [enStock, setEnStock] = useState(null);
  const [types, setTypes] = useState([]);
  const [prixTypes, setPrixTypes] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [imagesTab, setImagesTab] = useState([]);

  // Options
  const optionsLivraison = [
    { value: "oui", label: "oui" },
    { value: "non", label: "Non" },
  ];

  const optionsEnStock = [
    { value: "oui", label: "oui" },
    { value: "non", label: "Non" },
  ];

  const optionsCategorie = categories.map((cat) => ({
    value: cat,
    label: cat,
  }));
  // ✅ Fixed: Use renamed import
  const optionsFournisseur = fournisseursList.map((f) => ({
    value: f,
    label: f,
  }));

  const getSousCategories = () => {
    if (!categorie) return [];
    if (categorie.value === "Gros oeuvre") {
      return sousCategories1.map((sc) => ({
        value: sc,
        label: sc.replace(/^GO_/, ""),
      }));
    }
    if (categorie.value === "Second oeuvre") {
      return sousCategories2.map((sc) => ({
        value: sc,
        label: sc.replace(/^SO_/, ""),
      }));
    }
    return [];
  };

  // Handle type input
  const handleKeyDown = (event) => {
    if (!inputValue) return;
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      setTypes((prev) => [...prev, { label: inputValue, value: inputValue }]);
      setInputValue("");
    }
  };

  // Sync prixTypes with types length
  useEffect(() => {
    if (types.length !== prixTypes.length) {
      setPrixTypes(Array(types.length).fill(""));
    }
  }, [prixTypes.length, types.length]);

  const handlePrixChange = (index, value) => {
    const newPrix = [...prixTypes];
    newPrix[index] = value;
    setPrixTypes(newPrix);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !nom ||
      !description ||
      !categorie ||
      !sousCategorie ||
      !prixReference ||
      !imagesTab.length ||
      !quantitéMinimale ||
      !livraisonGratuite ||
      !fournisseur ||
      prixTypes.some((prix) => !prix)
    ) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    } else {
      setShowModal(true);
    }
    // Add your submit logic here
  };

  const handleConfirm = async () => {
    setShowModal(false);
    const toastId = toast.loading("Création du produit...");
    const typesTransformed = transform();

    const data = {
      nom: nom.toLowerCase(),
      description: description,
      livraisonGratuite:
        String(livraisonGratuite.label) === "oui" ? true : false,
      enStock: String(enStock.label) === "oui" ? true : false,
      quantiteMinimale: Number(quantitéMinimale),
      categorie: String(categorie.label).toLowerCase(),
      sousCategorie: String(sousCategorie.value).toLowerCase(),
      types: typesTransformed,
      prixReference: Number(prixReference),
      images: imagesTab,
      fournisseur: String(fournisseur.label).toLowerCase(),
    };

    const { error: addProductError } = await supabase
      .from("Products")
      .insert([data]);

    if (addProductError) {
      console.log(addProductError);
      toast.dismiss(toastId);
      toast.error("Erreur lors de l'ajout du produit, veuillez réessayer.");
      return;
    } else {
      toast.dismiss(toastId);
      toast.success("Produit ajouté avec succès 😊");

      clearData();
    }
  };

  const clearData = () => {
    setNom("");
    setDescription("");
    setQuantitéMinimale("");
    setPrixReference("");
    setCategorie("");
    setImagesTab([]);
    setTypes([]);
    setInputValue("");
    setPrixTypes([]);
    setLivraisonGratuite("");
    setSousCategorie("");
    setFournisseur("");
    setEnStock("");
  };

  function transform() {
    // let arrayTypes = [];
    const newTypes = types.map((type) => type.value);
    const arr = newTypes.map((type, index) => ({
      type,
      prix: Number(prixTypes[index]),
    }));

    // Display the JSON string in a SweetAlert2 popup
    return arr;
  }

  // IMAGE HANDLER START
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

  const uploadImages = async (e) => {
    const files = Array.from(e.target.files);
    const imagesTabExisting = imagesTab.length + files.length;

    if (files.length > 3 || imagesTabExisting > 3) {
      toast.error("Vous pouvez télécharger maximum 3 images.");
      return;
    }

    const validTypes = ["image/png", "image/jpeg"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      toast.error("Seules les images JPEG et PNG sont acceptées.");
      return;
    }

    setLoading(true);

    try {
      const resizedFiles = await Promise.all(
        files.map((file) => resizeFile(file))
      );

      for (const file of resizedFiles) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("approbatesBucket")
          .upload(fileName, file);

        if (error) {
          console.error("Upload error:", error);
          toast.error("Erreur lors du téléchargement de l'image.");
          return;
        }

        const { data } = supabase.storage
          .from("approbatesBucket")
          .getPublicUrl(fileName);
        setImagesTab((prev) => [...prev, data.publicUrl]);
      }

      toast.success(
        files.length > 1
          ? "Images téléchargées avec succès."
          : "Image téléchargée avec succès."
      );
    } catch (err) {
      console.error("Resize error:", err);
      toast.error("Erreur lors du redimensionnement de l'image.");
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (url) => {
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
      const imageTabNew = imagesTab.filter((image) => image !== url);
      setImagesTab(imageTabNew); // Remove the preview after deleting
    }
  };
  // IMAGE HANDLER END
  return (
    <div className=" xl:max-w-[90%]  mx-auto p-3 lg:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 md:mb-8">
        Ajouter un produit
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg  md:p-8"
      >
        <div className="grid grid-cols-1 lg:divide-x-2 lg:divide-dashed divide-gray-300  lg:grid-cols-[40%_58%] md:gap-8 p-4">
          {/* Image Upload */}
          {/* DIV DE GAUCHE  */}
          <div className="basis-1/2 bg-white  h-full py-3 md:py-6">
            <div className="cursor-pointer p-6 md:p-0 h-[200px] md:h-[250px] lg:h-[40%] lg:w-[90%] bg-slate-100 mx-auto rounded-md outline-2 outline-offset-2 outline-dashed outline-slate-300  flex  items-center justify-center relative ">
              {loading ? (
                <SimpleLoader />
              ) : (
                <div>
                  <label htmlFor="photo">
                    <div className="flex items-center flex-col justify-center">
                      <BsFillCloudUploadFill className="text-5xl text-gray-400 group-hover:text-amber-500 transition-colors" />
                      <p className="mt-3 text-gray-500 text-center">
                        Cliquez pour télécharger 1 à 3 images
                        <br />
                        <span className="text-sm mt-3 md:mt-0 inline-block">
                          PNG, JPG jusqu'à 10MB
                        </span>
                      </p>
                    </div>
                  </label>
                  <input
                    onChange={uploadImages}
                    type="file"
                    disabled={imagesTab.length === 3}
                    multiple
                    className="hidden"
                    id="photo"
                  />
                </div>
              )}
            </div>
            <div className="mt-5  lg:p-5 space-y-3 ">
              {imagesTab.length > 0 &&
                imagesTab.map((item, i) => (
                  <div
                    key={i}
                    className=" flex items-center gap-1 shadow-sm bg-slate-100 p-2 rounded-md "
                  >
                    <img
                      src={item}
                      alt=""
                      className="bg-black object-cover rounded-md w-[50px] h-[50px]  md:w-[70px] md:h-[70px] "
                    />
                    <div className="w-full">
                      <div className="flex justify-center items-center gap-3  ">
                        <p className="text-xs">
                          <span className="hidden md:inline-block">
                            {item
                              .split("-")
                              .slice(1)
                              .join("-")
                              .replace(".png", "")
                              .replaceAll("%", " ")}
                          </span>

                          <span className="inline-block md:hidden">
                            {item
                              .split("-")
                              .slice(1)
                              .join("-")
                              .replace(".png", "")
                              .replaceAll("%", " ")
                              .slice(0, 15)}
                            ...
                          </span>
                        </p>
                      </div>
                    </div>
                    <MdDelete
                      onClick={() => deleteImage(item)}
                      className="ml-auto text-slate-300 hover:text-amber-400 duration-500 transition-all cursor-pointer text-4xl "
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-3 md:space-y-6">
            <h3 className="font-semibold text-gray-700 mt-3 md:mt-0">
              Détails du produit
            </h3>

            {/* Nom & Description */}
            <input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Nom du produit"
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du produit"
              rows={3}
              className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none resize-none"
            />

            {/* Dropdowns Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                value={livraisonGratuite}
                onChange={setLivraisonGratuite}
                options={optionsLivraison}
                placeholder="Livraison gratuite"
                className="text-sm"
                classNames={{
                  control: (state) =>
                    "border border-gray-300 rounded-lg px-3 md:py-2 hover:border-amber-400 focus:border-amber-500",
                }}
              />
              <Select
                value={enStock}
                onChange={setEnStock}
                options={optionsEnStock}
                placeholder="En stock"
                className="text-sm"
                classNames={{
                  control: (state) =>
                    "border border-gray-300 rounded-lg px-3 md:py-2 hover:border-amber-400 focus:border-amber-500",
                }}
              />
            </div>

            {/* Quantité & Fournisseur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ✅ FIXED: Use fournisseur (singular) state */}
              <Select
                value={fournisseur}
                onChange={setFournisseur}
                options={optionsFournisseur}
                placeholder="Fournisseur"
                className="text-sm"
                classNames={{
                  control: (state) =>
                    "border border-gray-300 rounded-lg px-3 md:py-2 hover:border-amber-400 focus:border-amber-500",
                }}
              />
              <input
                value={quantitéMinimale}
                onChange={(e) => setQuantitéMinimale(e.target.value)}
                placeholder="Quantité minimale"
                type="number"
                min="1"
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none"
              />
            </div>

            {/* Catégories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                value={categorie}
                onChange={(option) => {
                  setCategorie(option);
                  setSousCategorie(null);
                }}
                options={optionsCategorie}
                placeholder="Catégorie"
                className="text-sm"
                classNames={{
                  control: (state) =>
                    "border border-gray-300 rounded-lg px-3 md:py-2 hover:border-amber-400 focus:border-amber-500",
                }}
              />
              <Select
                value={sousCategorie}
                onChange={setSousCategorie}
                options={getSousCategories()}
                placeholder="Sous-catégorie"
                isDisabled={!categorie}
                className="text-sm"
                classNames={{
                  control: (state) =>
                    "border border-gray-300 rounded-lg px-3 md:py-2 hover:border-amber-400 focus:border-amber-500",
                }}
              />
            </div>

            {/* Types & Prix de référence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CreatableSelect
                inputValue={inputValue}
                isClearable
                isMulti
                menuIsOpen={false}
                onChange={setTypes}
                onInputChange={setInputValue}
                onKeyDown={handleKeyDown}
                placeholder="Ajouter des types (ex: 50kg, 1m²...)"
                value={types}
                className="text-sm"
                classNames={{
                  control: (state) =>
                    "border border-gray-300 rounded-lg px-3 md:py-2 hover:border-amber-400 focus:border-amber-500",
                }}
              />
              <input
                value={prixReference}
                onChange={(e) => setPrixReference(e.target.value)}
                placeholder="Prix de référence"
                type="number"
                min="0"
                step="0.01"
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none"
              />
            </div>

            {/* Dynamic Price Inputs */}
            {types.length > 0 && (
              <div className="space-y-3 pt-4 border-t">
                <h4 className="font-medium text-gray-700">Prix par type</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {types.map((type, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        {type.label}
                      </label>
                      <input
                        value={prixTypes[index] || ""}
                        onChange={(e) =>
                          handlePrixChange(index, e.target.value)
                        }
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder={`Prix pour ${type.label}`}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-amber-300 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Enregistrer le produit
              </button>
            </div>
          </div>
          <ConfirmationModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
            data={{
              nom: nom.toLowerCase(),
              description: description,
              fournisseur: String(fournisseur?.label).toLowerCase(),
              livraisonGratuite: String(livraisonGratuite?.label),
              enStock: String(enStock?.label),
              quantiteMinimale: Number(quantitéMinimale),
              categorie: String(categorie?.label).toLowerCase(),
              sousCategorie: String(sousCategorie?.label).toLowerCase(),
              types: types.map((type) => type.label).join(", "), // Convert to string here
              prixParType: prixTypes.map((type) => type).join(", "),
              prixReference: `${Number(prixReference)}`,
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default AjouterProduit;

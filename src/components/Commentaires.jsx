import { Rating } from "@smastrom/react-rating";
import React, { useEffect, useState } from "react";
import { PiUserCircleCheckDuotone } from "react-icons/pi";
import "@smastrom/react-rating/style.css";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import { TbEdit } from "react-icons/tb";
import { TbEditOff } from "react-icons/tb";
import { FaDeleteLeft } from "react-icons/fa6";
import Swal from "sweetalert2";

import toast from "react-hot-toast";
import supabase from "../../supase-client";
import { sendProductInfo } from "../redux/espremium";

const Star = (
  <path d="M62 25.154H39.082L32 3l-7.082 22.154H2l18.541 13.693L13.459 61L32 47.309L50.541 61l-7.082-22.152L62 25.154z" />
);

const customStyles = {
  itemShapes: Star,
  boxBorderWidth: 1,

  activeFillColor: ["#FEE2E2", "#FFEDD5", "#FEF9C3", "#ECFCCB", "#D1FAE5"],
  activeBoxColor: ["#da1600", "#db711a", "#dcb000", "#61bb00", "#009664"],
  activeBoxBorderColor: ["#c41400", "#d05e00", "#cca300", "#498d00", "#00724c"],

  inactiveFillColor: "white",
  inactiveBoxColor: "#dddddd",
  inactiveBoxBorderColor: "#a8a8a8",
};

const Commentaires = ({ produit, allProduit, setProduit }) => {
  const { userInfo, productDetails } = useSelector((state) => state.projet);
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [ratingPut, setRatingPut] = useState(0);
  const [titre, setTitre] = useState("");
  const [details, setDetails] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Better for comments
  const onPageChange = (page) => {
    setCurrentPage(page);
  };
  const navigate = useNavigate();
  const [jModifier, setJModifier] = useState(false);
  const [idModif, setIdModif] = useState(0);

  // Compute average rating
  useEffect(() => {
    const validNotes =
      produit?.commentaires?.filter(
        (i) => typeof i.note === "number" && !isNaN(i.note)
      ) || [];
    const avg = validNotes.length
      ? Math.round(
          validNotes.reduce((acc, i) => acc + i.note, 0) / validNotes.length
        )
      : 0;
    setRating(avg);
  }, [produit?.commentaires]);

  // Compute stats for rating bars
  const totalComments = produit?.commentaires?.length || 0;
  const getPercentage = (note) => {
    if (totalComments === 0) return 0;
    const count = produit.commentaires.filter((c) => c.note === note).length;
    return Math.round((count / totalComments) * 100);
  };

  const avisStats = [5, 4, 3, 2, 1].map((note) => ({
    note,
    count: produit?.commentaires?.filter((c) => c.note === note).length || 0,
    percent: getPercentage(note),
  }));

  async function sendAvis(e) {
    e.preventDefault();

    if (!userInfo) {
      toast.error("Veuillez vous connectez svp !");
      navigate("/connexion");
      return;
    }

    if (!userInfo.emailVerified) {
      toast.error("Veuillez vérifiez votre compte svp!");
      return;
    }

    if (!ratingPut || !titre || !details) {
      toast.error("Tous les champs sont obligatoires");
      return;
    }
    if (jModifier) {
      const updatedCommentaires = produit?.commentaires?.map((c) =>
        c.id === idModif
          ? {
              ...c,
              note: Number(ratingPut),
              titre,
              details,
              date: new Date().toISOString(),
            }
          : c
      );

      const { error: updateError } = await supabase
        .from("Products")
        .update({ commentaires: updatedCommentaires })
        .eq("id", produit.id);

      if (updateError) {
        toast.error("Erreur lors de la modification de votre avis.");
        console.error(updateError);
      } else {
        dispatch(
          sendProductInfo({
            ...productDetails,
            commentaires: updatedCommentaires,
          })
        );
        toast.success("Commentaire mis à jour avec succès!");
        setRatingPut(0);
        setTitre("");
        setDetails("");
        setIdModif(0);
        setJModifier(false);
      }
    } else {
      //  have you the right to comment
      if (userInfo?.idArticlesAchetes?.includes(produit.id)) {
        try {
          const commentExists = produit?.commentaires?.find(
            (c) => c.idClient === userInfo.id
          );

          if (commentExists) {
            toast.error("Avis déjà laissé, modifiez-le !");
            return;
          } else {
            const toastId = toast.loading(
              "Création du commentaire en cours..."
            );

            const newComment = {
              id: crypto.randomUUID(),
              produitId: produit.id,
              idClient: userInfo.id,
              nomComplet: userInfo.nomComplet,
              note: Number(ratingPut),
              titre,
              details,
              date: new Date().toISOString(),
            };

            const updatedCommentaires = [
              ...(produit.commentaires || []),
              newComment,
            ];

            const { error } = await supabase
              .from("Products")
              .update({ commentaires: updatedCommentaires })
              .eq("id", produit.id);

            if (error) throw error;

            dispatch(
              sendProductInfo({
                ...productDetails,
                commentaires: updatedCommentaires,
              })
            );

            toast.dismiss(toastId);
            setRatingPut(0);
            setTitre("");
            setDetails("");
            setIdModif(0);
            setJModifier(false);
            toast.success("Merci pour votre avis !");
          }
        } catch (error) {
          toast.error("Erreur lors de la soumission de votre avis.");
          console.error(error);
        }
      } else {
        toast.error(
          "Veuillez commander ce produit avant de laisser un commentaire"
        );
        setRatingPut(0);
        setTitre("");
        setDetails("");
      }
    }
  }

  function envoyerAModifier(commentaire) {
    setJModifier(true);
    setIdModif(commentaire.id);
    setRatingPut(commentaire.note);
    setTitre(commentaire.titre);
    setDetails(commentaire.details);

    const element = document.getElementById("ajoutAvis");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  async function supprimerAvis(id) {
    const confirmation = await Swal.fire({
      title: "Voulez-vous supprimer votre avis?",
      text: "Action définitive",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, je confirme!",
      cancelButtonText: "J'annule",
    });

    if (!confirmation.isConfirmed) return;

    try {
      const toastId = toast.loading("Suppression en cours...");
      const updatedCommentaires =
        produit?.commentaires?.filter((c) => c.id !== id) || [];

      const { error } = await supabase
        .from("Products")
        .update({ commentaires: updatedCommentaires })
        .eq("id", produit.id);

      if (error) throw error;

      dispatch(
        sendProductInfo({
          ...productDetails,
          commentaires: updatedCommentaires,
        })
      );

      if (currentPage > 1 && updatedCommentaires.length % pageSize === 0) {
        setCurrentPage(currentPage - 1);
      }

      toast.dismiss(toastId);
      toast.success("Commentaire supprimé avec succès !");
    } catch (error) {
      toast.error(
        error.message || "Erreur lors de la suppression du commentaire."
      );
    }
  }

  // Pagination
  const startIdx = (currentPage - 1) * pageSize;
  const currentItems =
    produit?.commentaires?.slice(startIdx, startIdx + pageSize) || [];

  return (
    <div className=" relative md:pt-10   " id="ajoutAvis">
      <p className="p-5 px-10 font-medium text-[24px] my-2 border-t border-b border-gray-200">
        Votre avis compte
      </p>

      <div className="max-w-[95%] md:max-w-[85%]  mx-auto gap-[40px] md:gap-[70px] flex md:items-start  mb-[30px] flex-col md:flex-row items-center md:justify-center mt-4 md:mt-10  ">
        {/* LEFT: Rating Summary */}
        <div className="bg-gray-50 md:w-[20%] lg:w-[30%] xl:w-[25%] rounded-xl p-6">
          <div className="text-center w-full mb-6">
            <p className="text-gray-600 mb-2">Moyenne du produit</p>
            <p className="text-4xl font-bold text-amber-500">{rating}</p>
            <Rating
              readOnly
              style={{ maxWidth: 250, margin: "0 auto" }}
              value={rating}
              spaceBetween="small"
              radius="large"
              itemStyles={customStyles}
            />
          </div>

          <div className="space-y-3  ">
            {avisStats.map(({ note, count, percent }) => (
              <div key={note} className="flex items-center gap-4">
                <span className="text-gray-700 w-12">{note} ⭐</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-gray-600 w-8 text-right">({count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="  px-4 md:px-0   ">
          <p className="uppercase font-semibold  ">ajouter un avis </p>

          <div className="flex items-center gap-[20px] my-[20px] ">
            <p>Votre évaluation du produit</p>
            <Rating
              style={{ maxWidth: 160 }}
              value={ratingPut}
              onChange={setRatingPut}
              itemStyles={customStyles}
              radius="large"
              spaceBetween="small"
              spaceInside="large"
            />
          </div>
          <form className=" space-y-6 grid " onSubmit={sendAvis}>
            <div className="flex gap-10 ">
              <input
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                type="text"
                placeholder="Titre de l'avis"
                className="flex-1 outline-none border border-gray-200 bg-slate-50 rounded pl-4 py-2 "
              />
            </div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={7}
              cols={100}
              name=""
              className="flex-1 outline-none border border-gray-200 bg-slate-50 rounded-xl pl-4 py-2 "
              id=""
              placeholder="Dites-nous plus sur ce produit"
            ></textarea>

            <div className=" w-full ">
              <input
                type="submit"
                value={jModifier ? "MODIFIER" : "ENREGISTRER"}
                className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-md  w-full  px-4 py-2 text-white cursor-pointer hover:bg-bleu4 transition-all duration-500  font-medium"
              />
            </div>
          </form>
        </div>
      </div>

      {/* COMMENTAIRES CLIENTS VERIFIES  */}
      {produit?.commentaires?.length > 0 ? (
        <p className="max-w-[85%] mx-auto font-medium text-[24px] my-2 ">
          Avis clients vérifiés ({produit?.commentaires?.length})
        </p>
      ) : (
        <p className="max-w-[85%] text-center text-gray-700 mx-auto  my-[20px] ">
          Aucun Avis pour le moment !
        </p>
      )}

      <div className=" max-w-[85%] mx-auto relative">
        {/* <div className="border rounded-md p-4 flex flex-col gap-[20px] relative"> */}
        {produit && produit?.commentaires?.length > 0
          ? currentItems.map((commentaire, i) => (
              <div
                key={i}
                className="flex items-center space-y-[30px] gap-[10px] bg-slate-100 p-5 my-[10px] rounded-md "
              >
                <div className="flex items-center justify-between w-full gap-[20px]">
                  <PiUserCircleCheckDuotone className="text-[60px] hidden md:block  " />
                  <div className=" flex flex-col w-full space-y-1 ">
                    <Rating
                      readOnly
                      style={{ maxWidth: 120 }}
                      value={commentaire.note}
                      itemStyles={customStyles}
                      radius="large"
                      spaceBetween="small"
                      spaceInside="large"
                    />

                    <div />
                    <p className="text-[18px] font-medium capitalize ">
                      {commentaire.titre}
                    </p>
                    <p>{commentaire.details}</p>

                    <p className=" flex text-sm text-gray-500  flex-col md:flex-row gap-0 md:gap-2 ">
                      <span className="capitalize">
                        par {commentaire.nomComplet}
                      </span>
                      <span className="hidden md:block">
                        {" "}
                        {"  "}|{"     "}
                      </span>
                      <span>
                        {format(new Date(commentaire.date), "d MMMM yyyy", {
                          locale: frCA,
                        })}
                      </span>
                    </p>
                  </div>
                  {userInfo?.id === commentaire.idClient ? (
                    <div className="flex items-center gap-3">
                      <button
                        className="cursor-pointer tooltip	"
                        data-tip="Modifier"
                        onClick={() => envoyerAModifier(commentaire)}
                      >
                        <TbEdit className=" text-amber-600 text-[30px]  " />
                      </button>
                      <button
                        data-tip="Supprimer"
                        className="cursor-pointer tooltip  "
                      >
                        <FaDeleteLeft
                          className="text-[30px] text-amber-600 "
                          onClick={() => supprimerAvis(commentaire.id)}
                        />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button disabled className="cursor-not-allowed	">
                        <TbEditOff className=" text-slate-500 text-[25px] md:text-[30px]  " />
                      </button>
                      <button disabled className="cursor-not-allowed	">
                        <FaDeleteLeft className=" text-slate-500 text-[25px] md:text-[30px]  " />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : ""}

        {/* </div> */}
      </div>
      {produit?.commentaires?.length > 0 && (
        <div className=" w-full -bottom-4  ">
          <div className="w-full flex justify-center my-5   ">
            <Pagination
              style={{ fontWeight: "normal" }}
              current={currentPage} // The current page
              total={produit?.commentaires?.length} // Total number of products
              pageSize={pageSize} // Number of items per page
              onChange={onPageChange} // Handle page change
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Commentaires;

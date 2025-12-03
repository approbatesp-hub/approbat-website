import { format } from "date-fns";
import { frCA } from "date-fns/locale";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generateOrderPDF = async (order, Logo) => {
  const formatNumberWithDots = (number) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Create a temporary hidden div with invoice content
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "800px";
  tempDiv.style.padding = "40px";
  tempDiv.style.fontFamily = "'Helvetica', 'Arial', sans-serif";
  tempDiv.style.background = "white";
  tempDiv.style.color = "#333";

  tempDiv.innerHTML = `
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #2f4858;">
            <div>
            <img src="${Logo}" alt="Logo" style="width: 50px; height: 50px;" />
                <h1 style="font-size: 32px; font-weight: bold; color: #2f4858;">APPROBAT SERVICES</h1>
                <p style="color: #666; margin: 0; font-size: 14px;">Votre partenaire de confiance</p>
            </div>
            <div style="text-align: right;">
                <h2 style="font-size: 24px; color: #2f4858; margin: 0 0 10px 0;">FACTURE</h2>
                <p style="color: #666; margin: 0; font-size: 14px;">N° ${
                  order.id || "N/A"
                }</p>
            </div>
        </div>

        <!-- Client and Order Info -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <!-- Client Information -->
            <div>
                <h3 style="color: #2f4858; font-size: 16px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e0e0e0;">INFORMATIONS CLIENT</h3>
                <div style="line-height: 1.6;">
                    <p style="margin: 8px 0;"><strong>Nom :</strong> ${
                      order.idClient?.nomComplet || "N/A"
                    }</p>
                    <p style="margin: 8px 0;"><strong>Téléphone :</strong> ${
                      order.idClient?.numero || "N/A"
                    }</p>
                    <p style="margin: 8px 0;"><strong>District :</strong> ${
                      order.idClient?.adresse?.district || "N/A"
                    }</p>
                    <p style="margin: 8px 0;"><strong>Commune :</strong> ${
                      order.idClient?.adresse?.commune || "N/A"
                    }</p>
                    <p style="margin: 8px 0;"><strong>Adresse :</strong> ${
                      order.idClient?.adresse?.adresse || "N/A"
                    }</p>
                </div>
            </div>

            <!-- Order Information -->
            <div>
                <h3 style="color: #2f4858; font-size: 16px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e0e0e0;">DÉTAILS DE LA COMMANDE</h3>
                <div style="line-height: 1.6;">
                    <p style="margin: 8px 0;"><strong>Date de commande :</strong> ${
                      order.created_at
                        ? format(new Date(order.created_at), "d MMMM yyyy", {
                            locale: frCA,
                          })
                        : "N/A"
                    }</p>
                    <p style="margin: 8px 0;"><strong>Statut :</strong> <span style="text-transform: capitalize;">${
                      order.status || "N/A"
                    }</span></p>
                    <p style="margin: 8px 0;"><strong>Coupon appliqué :</strong> ${
                      order.couponApplique ? "Oui" : "Non"
                    }</p>
                    <p style="margin: 8px 0;"><strong>Référence :</strong> #${
                      order.id || "N/A"
                    }</p>
                </div>
            </div>
        </div>

        <!-- Products Table -->
        <div style="margin-bottom: 30px;">
            <h3 style="color: #2f4858; font-size: 16px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 1px solid #e0e0e0;">ARTICLES COMMANDÉS</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background: linear-gradient(135deg, #2f4858, #3a5769); color: white;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #2f4858;">Produit</th>
                        <th style="padding: 12px; text-align: center; border: 1px solid #2f4858;">Type</th>
                        <th style="padding: 12px; text-align: center; border: 1px solid #2f4858;">Prix Unitaire</th>
                        <th style="padding: 12px; text-align: center; border: 1px solid #2f4858;">Quantité</th>
                        
                        <th style="padding: 12px; text-align: right; border: 1px solid #2f4858;">Sous-total</th>
                    </tr>
                </thead>
                <tbody>
                    ${
                      Array.isArray(order.articlesAchetes) &&
                      order.articlesAchetes.length > 0
                        ? order.articlesAchetes
                            .map(
                              (item, index) => `
                                <tr style="background: ${
                                  index % 2 === 0 ? "#f8f9fa" : "white"
                                };">
                                    <td style="padding: 10px; border: 1px solid #ddd;">${
                                      item.nom || "N/A"
                                    }</td>
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${
                                      item.type && item.type !== "undefined"
                                        ? item.type
                                        : "-"
                                    }</td>
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">
                                    ${
                                      item.nom !== "sable" &&
                                      item.nom !== "gravier"
                                        ? `${formatNumberWithDots(
                                            item.prix
                                          )} Fcfa`
                                        : "-"
                                    } 
                                    
                                    </td>
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${
                                      item.quantite || 0
                                    }</td>
                                   
                                    <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${
                                      item.nom !== "sable" &&
                                      item.nom !== "gravier"
                                        ? formatNumberWithDots(
                                            (item.prix || 0) *
                                              (item.quantite || 0)
                                          )
                                        : formatNumberWithDots(item.prix || 0)
                                    } Fcfa</td>
                                </tr>
                            `
                            )
                            .join("")
                        : `<tr><td colspan="6" style="padding: 20px; text-align: center; border: 1px solid #ddd; color: #666;">Aucun article dans cette commande</td></tr>`
                    }
                </tbody>
            </table>
        </div>

        <!-- Total Section -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 30px;">
            <div style="width: 300px; background: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-weight: bold;">Sous-total :</span>
                    <span>${formatNumberWithDots(
                      order.montantTotal
                    )} Fcfa</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-weight: bold;">Livraison :</span>
                    <span>${
                      order.articlesAchetes?.some(
                        (item) => !item.livraisonGratuite
                      )
                        ? "À calculer"
                        : '<span style="color: #10b981;">Gratuite</span>'
                    }</span>
                </div>
                <hr style="border: none; border-top: 2px solid #2f4858; margin: 15px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; color: #2f4858;">
                    <span>TOTAL :</span>
                    <span>${formatNumberWithDots(
                      order.montantTotal
                    )} Fcfa</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #2f4858; text-align: center; color: #666; font-size: 12px;">
            <p style="margin: 5px 0;">APPROBAT SERVICES - Votre satisfaction est notre priorité</p>
            <p style="margin: 5px 0;">Email: approbatservices@gmail.com | Téléphone: +225 05 00 76 96 96</p>
            <p style="margin: 5px 0; font-style: italic;">Merci pour votre confiance !</p>
        </div>

        <!-- Watermark -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
                   opacity: 0.05; font-size: 80px; font-weight: bold; color: #2f4858; pointer-events: none;">
            APPROBAT SERVICES
        </div>
    `;

  document.body.appendChild(tempDiv);

  try {
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add background color
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, 210, 297, "F");

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Facture-APPROBAT-${order.idClient?.nomComplet}.pdf`);
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
  } finally {
    document.body.removeChild(tempDiv);
  }
};

// utils/hookPDF.js - Add this function alongside generateOrderPDF

export const generateFacturePDF = async (facture, Logo) => {
  const formatNumberWithDots = (number) => {
    if (!number && number !== 0) return "0";
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // Create a temporary hidden div with invoice content
  const tempDiv = document.createElement("div");
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "800px";
  tempDiv.style.padding = "30px";
  tempDiv.style.fontFamily = "'Inter', 'Helvetica', 'Arial', sans-serif";
  tempDiv.style.background = "#ffffff";
  tempDiv.style.color = "#1f2937";
  tempDiv.style.minHeight = "1123px";

  tempDiv.innerHTML = `
    <div style="max-width: 740px; margin: 0 auto; position: relative;">
      <!-- Simple Watermark -->
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); 
                 opacity: 0.02; font-size: 100px; font-weight: 900; color: #2f4858; pointer-events: none; z-index: 0; white-space: nowrap;">
        APPROBAT SERVICES
      </div>

      <!-- Header Section -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2f4858;">
        <!-- Company Info -->
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <img src="${Logo}" alt="Logo" style="width: 50px; height: 50px;" />
            <div>
              <h1 style="font-size: 24px; font-weight: 700; color: #2f4858; margin: 0;">APPROBAT SERVICES</h1>
              <p style="color: #6b7280; margin: 2px 0; font-size: 12px;">Votre partenaire de confiance</p>
            </div>
          </div>
          <div style="color: #6b7280; font-size: 11px; line-height: 1.4;">
            <p style="margin: 2px 0;">Abidjan, Côte d'Ivoire</p>
            <p style="margin: 2px 0;">Email: approbatservices@gmail.com</p>
            <p style="margin: 2px 0;">Tél: +225 05 00 76 96 96</p>
          </div>
        </div>

      </div>

      <!-- Simple Details -->
      <div style="margin-bottom: 30px;">
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2f4858;">
          <h3 style="color: #2f4858; font-size: 14px; font-weight: 600; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">
            <span>📋</span>
            INFORMATIONS
          </h3>
          <div style="color: #374151; font-size: 12px; line-height: 1.6;">
            <p style="margin: 6px 0;"><strong>Date:</strong> ${format(
              new Date(facture.created_at),
              "dd MMMM yyyy",
              { locale: frCA }
            )}</p>
            <p style="margin: 6px 0;"><strong>Référence:</strong> #${
              facture.id || "N/A"
            }</p>
            <p style="margin: 6px 0;"><strong>Nombre d'articles:</strong> ${
              facture.articlesAchetes?.length || 0
            }</p>
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div style="margin-bottom: 30px;">
        <h3 style="color: #2f4858; font-size: 16px; font-weight: 600; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
          <span>📦</span>
          ARTICLES
        </h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; background: white; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
          <thead>
            <tr style="background: #2f4858; color: white;">
              <th style="padding: 12px; text-align: left; font-weight: 600; border: none;">Désignation</th>
              <th style="padding: 12px; text-align: center; font-weight: 600; border: none;">Type/Dimension</th>
              <th style="padding: 12px; text-align: center; font-weight: 600; border: none;">Quantité</th>
              <th style="padding: 12px; text-align: center; font-weight: 600; border: none;">Prix Unitaire</th>
              <th style="padding: 12px; text-align: right; font-weight: 600; border: none;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${
              Array.isArray(facture.articlesAchetes) &&
              facture.articlesAchetes.length > 0
                ? facture.articlesAchetes
                    .map(
                      (item, index) => `
                <tr style="border-bottom: 1px solid #f3f4f6; background: ${
                  index % 2 === 0 ? "#fafafa" : "white"
                };">
                  <td style="padding: 12px; border: none; font-weight: 500;">${
                    item.nom || "N/A"
                  }</td>
                  <td style="padding: 12px; border: none; text-align: center; color: #6b7280;">
                    ${item.type && item.type !== "undefined" ? item.type : "-"}
                  </td>
                  <td style="padding: 12px; border: none; text-align: center;">${
                    item.quantite || 0
                  }</td>
                  <td style="padding: 12px; border: none; text-align: center; font-weight: 600;">
             ${
               item.nom !== "sable" && item.nom !== "gravier"
                 ? `${formatNumberWithDots(item.prix)} Fcfa`
                 : "-"
             } 
                  </td>
                  <td style="padding: 12px; border: none; text-align: right; font-weight: 700; color: #2f4858;">
                    ${
                      item.nom !== "sable" && item.nom !== "gravier"
                        ? formatNumberWithDots(
                            (item.prix || 0) * (item.quantite || 0)
                          )
                        : formatNumberWithDots(item.prix || 0)
                    } Fcfa
                  </td>
                </tr>
              `
                    )
                    .join("")
                : `<tr>
                    <td colspan="5" style="padding: 30px; text-align: center; border: none; color: #9ca3af; font-style: italic;">
                      Aucun article dans cette facture
                    </td>
                   </tr>`
            }
          </tbody>
        </table>
      </div>

      <!-- Simple Total Section -->
      <div style="display: flex; justify-content: flex-end; margin-bottom: 30px; margin-right: 50px;">
        <div style="width: 300px; background: #f8fafc;  ">
          <div style="display: flex; gap: 10px; justify-content: space-between; align-items: center; font-size: 18px;">
            <span style="font-weight: 700; color: #2f4858; text-wrap: nowrap">MONTANT TOTAL:</span>
            <span style="font-weight: 800; color: #2f4858; font-size: 20px; text-wrap: nowrap">${formatNumberWithDots(
              facture.montantTotal
            )}  Fcfa</span>
          </div>
        </div>
      </div>

      <!-- Notes & Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <!-- Simple Notes -->
        <div style="background: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #0369a1; margin-bottom: 20px;">
          <p style="color: #0369a1; font-size: 11px; margin: 0; line-height: 1.4; text-align: center;">
            Ce document est un devis estimatif. 
          </p>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #6b7280; font-size: 10px;">
          <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 8px; flex-wrap: wrap;">
            <span>📧 approbatservices@gmail.com</span>
            <span>📞 +225 05 00 76 96 96</span>
            <span>🌐 www.approbatservices.com</span>
          </div>
          <p style="margin: 4px 0; font-weight: 600;">APPROBAT SERVICES - Excellence et Confiance</p>
          <p style="margin: 4px 0; font-style: italic;">Merci pour votre confiance !</p>
          
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `Devis-APPROBAT SERVICES-${facture.id || ""}.pdf`
      .replace(/\s+/g, "-")
      .toLowerCase();

    pdf.save(fileName);
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Erreur lors de la génération du PDF. Veuillez réessayer.");
  } finally {
    document.body.removeChild(tempDiv);
  }
};

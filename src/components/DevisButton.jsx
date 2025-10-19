import { LiaWhatsapp } from "react-icons/lia";

const DevisButton = ({ className }) => {
  const phoneNumber = "+2250500769696";
  const message =
    "Bonjour Approbat, je vous écris concernant une demande de devis"; // The message you want to pre-fill

  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <button
      onClick={() => window.open(whatsappURL, "_blank")}
      className={`${className} flex items-center z-50 justify-center rounded-md px-4 flex-1 bg-linear-to-br from-amber-400 to-amber-500 text-white font-medium shadow-md py-2 gap-1 hover:bg-amber-700 duration-300 transition-all text-[14px] md:text-base `}
    >
      <LiaWhatsapp className="text-[25px]" />
      <span> Demander un devis</span>
    </button>
  );
};

export default DevisButton;

// src/routes/Contact.jsx
import { useState } from "react";
import { MdPhoneInTalk, MdOutlineAttachEmail } from "react-icons/md";
import ImgContact from "../assets/Images/contact/contact4.jpg";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

const Contact = () => {
  const [sujet, setSujet] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    if (!sujet || !number || !email || !nom || !message) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    console.log(sujet, nom, message, number, email);
    setIsSubmitting(true);

    const templateParams = {
      user_subject: sujet,
      user_fullName: nom,
      user_message: message,
      user_phoneNumber: number,
      user_email: email,
    };

    const templateId = "template_rc7v9dt";
    const serviceID = "service_neppp7k";
    const publicKEY = "68pXeZCvBI2EfIOS_";

    emailjs.send(serviceID, templateId, templateParams, publicKEY).then(
      (res) => {
        console.log(res);
        toast.success("✅ Message envoyé avec succès !");
        setNom("");
        setEmail("");
        setNumber("");
        setMessage("");
        setSujet("");
        setIsSubmitting(false);
      },
      (error) => {
        console.error("FAILED...", error);
        toast.error("❌ Échec de l'envoi. Réessayez plus tard.");
        setIsSubmitting(false);
      }
    );
  };

  return (
    <div className="bg-gray-50 ">
      {/* Hero Section */}
      {/* <div className="relative">
        <img
          src={ImgContact}
          alt="Contactez-nous"
          className="w-full h-[250px] md:h-[320px] object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute pt-[80px] md:pt-[50px] bottom-8 left-1/2 transform top-1/2 -translate-y-1/2 -translate-x-1/2 text-center">
          <h4 className="text-white text-nowrap text-xl uppercase md:capitalize md:text-5xl font-bold tracking-wide drop-shadow-lg">
            Contactez-Nous
          </h4>
          <p className=" hidden md:block text-gray-200 mt-2 text-lg md:text-xl font-medium">
            Nous sommes là pour vous aider.
          </p>
        </div>
      </div> */}

      <div
        className="relative w-full h-[250px] md:h-[350px] object-cover brightness-95 overflow-hidden before:absolute before:bg-black before:inset-0 before:opacity-50 bg-position-[100%_-600%]  md:bg-position-[20%_40%]  "
        style={{
          backgroundImage: `url(${ImgContact})`, // use the imported variable
          backgroundSize: "cover",
          // backgroundPosition: "20% 40%", // Adjust to your needs
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent  flex items-center justify-center mt-[120px] md:mt-10">
          <div className="text-center text-white px-4 max-w-3xl">
            <h4 className="text-white text-nowrap text-xl uppercase md:capitalize md:text-5xl font-bold tracking-wide drop-shadow-lg">
              Contactez-Nous
            </h4>
            <p className=" hidden md:block text-gray-200 mt-2 text-lg md:text-xl font-medium">
              Nous sommes là pour vous aider.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:max-w-[90%] xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 xl:gap-20">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
            <div className="mb-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-">
                Nous sommes à votre écoute
              </h3>
            </div>

            <form onSubmit={sendEmail} className="space-y-6 mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="sujet"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sujet
                  </label>
                  <input
                    id="sujet"
                    type="text"
                    value={sujet}
                    onChange={(e) => setSujet(e.target.value)}
                    placeholder="Sujet de votre message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="number"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Numéro de téléphone
                  </label>
                  <input
                    id="number"
                    type="tel"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="05 XX XX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="nom"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nom complet
                  </label>
                  <input
                    id="nom"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Nom & Prénoms"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Adresse e-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  rows={6}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Décrivez-nous votre demande en détail..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-300 focus:border-amber-500 outline-none transition-all resize-none placeholder:text-gray-400"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-amber-300 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  "ENVOYER VOTRE MESSAGE"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1 mb-2">
                Restez en contact avec nous
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Vous avez une suggestion, une question ou simplement envie de
                partager votre expérience ? Notre équipe est prête à vous
                répondre dans les plus brefs délais.
              </p>

              <div className="space-y-8">
                <div className="flex gap-5 items-start p-5 bg-gradient-to-r from-amber-50 to-red-50 rounded-2xl border border-amber-100 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 p-4 bg-amber-500 text-white rounded-xl shadow-lg">
                    <MdPhoneInTalk className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Par téléphone
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Appelez-nous pour une réponse immédiate.
                    </p>
                    <p className="font-mono text-lg font-bold text-amber-600 mt-2">
                      +225 05 00 76 96 96
                    </p>
                  </div>
                </div>

                <div className="flex gap-5 items-start p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 p-4 bg-blue-500 text-white rounded-xl shadow-lg">
                    <MdOutlineAttachEmail className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      Par e-mail
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Envoyez-nous un message à tout moment.
                    </p>
                    <p className="font-mono text-lg font-bold text-blue-600 mt-2 break-all">
                      approbatesp@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10 p-5 bg-gray-50 rounded-xl border-l-4 border-amber-500">
                <p className="text-sm text-gray-600 italic">
                  ⏱️ <strong>Temps de réponse :</strong> Sous 24 heures en
                  semaine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

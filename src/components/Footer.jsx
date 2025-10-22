import { CiFacebook, CiLinkedin } from "react-icons/ci";
import { FaWhatsapp, FaHeart } from "react-icons/fa";
import { IoConstruct } from "react-icons/io5";
import Logo from "../assets/Images/logo.png";
import { Link } from "react-router";
import ContactMe from "./ContactMe";

const Footer = () => {
  const phoneNumber = "+2250500769696";
  const message =
    "Bonjour Approbat,\nNotre équipe est à votre disposition et assure un suivi personnalisé de votre commande!";

  return (
    <footer className="bg-gray-900 text-white py-5 shadow-lg border-t border-gray-700">
      <div className="lg:max-w-[90%] xl:max-w-[85%]    mx-auto px-4 sm:px-6 lg:p-0">
        {/* Main Footer Content */}
        <div className="grid items-center grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-8">
          {/* Company Info */}
          <div className="flex flex-col items-center justify-center md:items-start ">
            <Link
              to="/"
              className="flex flex-col items-center md:items-start group"
            >
              <div className="flex items-center space-x-1">
                <img
                  src={Logo}
                  alt="Approbat Logo"
                  className="w-12 h-12 md:w-20 md:h-20 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-xl font-bold text-white">
                  Approbat Services
                </span>
              </div>
            </Link>
            <div className="flex items-center space-x-2 text-gray-300">
              <IoConstruct className="text-amber hidden lg:block" />
              <p className="text-sm text-center md:text-left hidden lg:block">
                Fournisseur de matériaux de construction de qualité
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center justify-center  space-y-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Navigation
            </h3>
            <div className="flex flex-col items-center lg:flex-row gap-4 text-center md:text-left">
              <Link
                to="/boutique"
                className="text-gray-300 hover:text-amber transition-all duration-300 hover:translate-x-1"
              >
                Boutique
              </Link>
              <Link
                to="/contact"
                className="text-gray-300 text-nowrap hover:text-amber transition-all duration-300 hover:translate-x-1"
              >
                Contactez-Nous
              </Link>
              <Link
                to="/blog"
                className="text-gray-300 text-nowrap hover:text-amber transition-all duration-300 hover:translate-x-1"
              >
                Articles
              </Link>
              <Link
                to="/profil"
                className="text-gray-300 text-nowrap hover:text-amber transition-all duration-300 hover:translate-x-1"
              >
                Mon Profil
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-end space-y-4 ">
            <h3 className="text-lg font-semibold text-white mb-2">
              Suivez-nous
            </h3>
            <div className="flex space-x-4">
              <Link
                to={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(
                  message
                )}`}
                target="_blank"
                className="bg-green-600 hover:bg-green-700 text-white p-2 lg:p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="Contactez-nous sur WhatsApp"
              >
                <FaWhatsapp className="text-xl" />
              </Link>
              <Link
                to="https://www.facebook.com/profile.php?id=61565884556628"
                target="_blank"
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 lg:p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="Suivez-nous sur Facebook"
              >
                <CiFacebook className="text-xl" />
              </Link>
              <Link
                to="https://www.linkedin.com/in/approbat-approbat-8212b2331/"
                target="_blank"
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 lg:p-3 rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                aria-label="Suivez-nous sur LinkedIn"
              >
                <CiLinkedin className="text-xl" />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Section */}
        <p className="text-gray-400  space-y-2 md:space-y-0 text-sm text-center ">
          © 2025 Approbat. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

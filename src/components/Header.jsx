import { Link, NavLink, useNavigate } from "react-router"; // Use react-router-dom
import Logo from "../assets/Images/logo-no-bg.png";
import { PiUserCircleLight } from "react-icons/pi";
import { SlBasket } from "react-icons/sl";
import { FaUserSlash } from "react-icons/fa";
import { LiaBoxOpenSolid } from "react-icons/lia";
import { LuHeart, LuLayoutDashboard, LuLogOut } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMenu } from "react-icons/io5";

import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import supabase from "../../supase-client";
import { deconnexion } from "../redux/espremium";

const Header = ({ openDrawer }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  // Placeholder for Redux state, adjust as necessary
  const { cart, userInfo } = useSelector(
    (state) => state.projet || { cart: [], userInfo: null }
  );
  const dispatch = useDispatch();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    // Optional: Close menu/drawer if open
    setIsUserMenuOpen(false);
  };

  const getUserDisplayName = () => {
    if (!userInfo) return "Se Connecter";
    if (!userInfo.emailVerified) return "Vérifiez Email";
    const firstName = userInfo?.nomComplet?.split(" ")[0] || "Utilisateur"; // Use first name
    return `Bonjour, ${firstName}`;
  };

  const getInitials = () => {
    if (!userInfo?.nomComplet) return "U";
    return userInfo.nomComplet
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut({ scope: "global" });
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      navigate("/connexion");
      toast.success("Vous avez été déconnecté avec succès");
      dispatch(deconnexion());
    }
  };

  return (
    <nav className="shadow-lg fixed left-0 right-0 top-0 z-50 border-b border-gray-100 backdrop-blur-sm bg-white/95 ">
      <div className="md:max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto px-4">
        {/* TOP ROW: Logo, Cart, User, Menu Button */}
        <div className="flex bg items-center justify-between h-16 md:h-20">
          {" "}
          {/* Increased height slightly for better feel */}
          {/* Logo (Unchanged) */}
          <Link
            to="/"
            className="flex items-center  gap-1 md:gap-3 group transition-all duration-300 "
          >
            <img
              src={Logo}
              alt="Approbat"
              className="h-13 w-13 md:w-20 md:h-20 transition-transform duration-300" // Adjusted size for better mobile fit
            />
          </Link>
          {/* Desktop Navigation (Unchanged) */}
          <div className="lg:flex items-center flex-1 max-w-4xl mx-12">
            {/* Navigation Links (Unchanged) */}
            <div className="hidden lg:flex items-center space-x-6 mr-12">
              {[
                { path: "/", label: "Accueil" },
                { path: "/boutique", label: "Boutique" },
                { path: "/contact", label: "Contact" },
                { path: "/Blog", label: "Articles" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-1 py-2 text-[15px] ${
                      isActive
                        ? "text-amber-500 font-semibold"
                        : "text-gray-700 hover:text-amber-500"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Search Bar (Desktop - Unchanged) */}
            <form
              onSubmit={handleSearch}
              className="hidden md:block flex-1 max-w-lg"
            >
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-6 pr-14 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-[15px] duration-300 bg-gray-50/50 hover:bg-white"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-2.5 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 cursor-pointer"
                >
                  <IoSearch className="text-xl" />
                </button>
              </div>
            </form>
          </div>
          {/* Right Side Actions (Mobile/Desktop) */}
          <div className="flex items-center space-x-2 md:space-x-0 lg:space-x-4 ">
            {/* User Menu Trigger (Mobile/Tablet-Optimized) */}
            <div
              ref={userMenuRef}
              className="relative 
          "
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center justify-center w-10 h-10 md:w-auto md:space-x-3 p-1 lg:p-3 rounded-xl md:rounded-2xl  transition-all duration-300 border border-transparent "
                aria-label="Menu Utilisateur"
              >
                <div className="relative">
                  {userInfo?.emailVerified ? (
                    <div className="relative flex items-center gap-1">
                      {/* Avatar */}
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {getInitials()}
                      </div>
                      {/* Status dot (Optional on mobile, but keep for consistency) */}
                      <div className="hidden lg:block absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      <IoIosArrowDown
                        className={`block  lg:hidden text-gray-500 transition-transform duration-300 ${
                          isUserMenuOpen ? "rotate-180" : ""
                        }`}
                      />{" "}
                    </div>
                  ) : (
                    <FaUserSlash className="text-xl md:text-2xl text-gray-400" />
                  )}
                </div>
                {/* Text hidden on mobile (sm/md) */}
                <div className="hidden lg:block text-left">
                  <span className="block text-sm font-semibold text-gray-900 max-w-[140px] truncate capitalize">
                    {getUserDisplayName()}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {userInfo?.emailVerified
                      ? "Compte vérifié"
                      : "Non connecté"}
                  </span>
                </div>
                <IoIosArrowDown
                  className={`hidden lg:block text-gray-500 transition-transform duration-300 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown Menu (Unchanged - Styling is great) */}
              {isUserMenuOpen && (
                <div className="absolute right-[-40px] md:right-0 mt-2 md:mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-60 animate-in fade-in-80 zoom-in-95">
                  {!userInfo ? (
                    <div className="p-3 md:p-6 text-center">
                      {/* ... (Login Prompt) ... */}
                      <div className=" h-12 w-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PiUserCircleLight className="text-3xl text-gray-400" />
                      </div>
                      <p className="text-gray-600 mb-4">
                        Connectez-vous pour accéder à votre compte
                      </p>
                      <button
                        onClick={() => {
                          navigate("/connexion");
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white py-2 md:py-3.5 rounded-xl font-semibold hover:from-amber-500 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
                      >
                        Se Connecter
                      </button>
                    </div>
                  ) : userInfo.emailVerified ? (
                    <>
                      {/* ... (Verified User Menu) ... */}
                      <div className="py-2 px-4 md:p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {getInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-lg capitalize">
                              {userInfo.nomComplet}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {userInfo.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-1 md:p-2">
                        {[
                          {
                            path: "/profil",
                            icon: PiUserCircleLight,
                            label: "Votre compte",
                            color: "blue",
                          },
                          {
                            path: "/profil/commandes",
                            icon: LiaBoxOpenSolid,
                            label: "Vos commandes",
                            color: "green",
                          },
                          {
                            path: "/profil/envies",
                            icon: LuHeart,
                            label: "Liste d'envies",
                            color: "pink",
                          },
                          ...(userInfo.role === "admin"
                            ? [
                                {
                                  path: "/admin",
                                  icon: LuLayoutDashboard,
                                  label: "Tableau de bord",
                                  color: "purple",
                                },
                              ]
                            : []),
                        ].map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsUserMenuOpen(false)}
                            // Fix for Tailwind dynamic classes (you'll need to ensure these are in your safelist/config)
                            // Replaced with fixed colors or using a safer approach
                            className="flex items-center space-x-2 p-1 md:p-2 rounded-xl hover:bg-gray-50 text-gray-700 transition-all duration-200 group border border-transparent hover:border-gray-200"
                          >
                            <div
                              className={`w-10 h-10 ${
                                item.color === "blue"
                                  ? "bg-blue-100"
                                  : item.color === "green"
                                  ? "bg-green-100"
                                  : item.color === "pink"
                                  ? "bg-pink-100"
                                  : "bg-purple-100"
                              } rounded-lg flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-300`}
                            >
                              <item.icon
                                className={`text-xl ${
                                  item.color === "blue"
                                    ? "text-blue-500"
                                    : item.color === "green"
                                    ? "text-green-500"
                                    : item.color === "pink"
                                    ? "text-pink-500"
                                    : "text-purple-500"
                                }`}
                              />
                            </div>
                            <span className="font-medium text-gray-800">
                              {item.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200 bg-gray-50">
                        <button
                          className="flex items-center justify-center space-x-3 w-full p-2 md:p-3.5 rounded-xl bg-white text-red-600 transition-all duration-200 group border border-red-200 hover:bg-red-50 hover:border-red-300 cursor-pointer"
                          onClick={() => {
                            signOut();
                            setIsUserMenuOpen(false);
                          }}
                        >
                          <LuLogOut className="text-xl" />
                          <span className="font-semibold ">Déconnexion</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center">
                      {/* ... (Unverified User Menu) ... */}
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUserSlash className="text-2xl text-red-500" />
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">
                        Vérifiez votre adresse email pour activer votre compte
                      </p>
                      <button
                        onClick={() => signOut()} // Use signout to clear session
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors border border-gray-300 cursor-pointer"
                      >
                        Se Déconnecter
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart (Unchanged, looks great) */}
            <Link
              to="/cart"
              className="relative p-1 rounded-xl transition-all duration-300 group" // Reduced padding slightly for mobile
              aria-label={`Panier avec ${cart.length} articles`}
            >
              <SlBasket className="text-xl md:text-2xl text-gray-700" />
              <span className="absolute top-0 right-0 md:-top-1 md:-right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-bold shadow-lg ">
                {cart.length}
              </span>
            </Link>

            {/* Mobile Menu Button (Unchanged, good placement) */}
            <button
              onClick={openDrawer}
              className="lg:hidden p-1 md:p-3 rounded-xl md:rounded-2xl hover:bg-gray-100 transition-colors duration-300 border border-transparent hover:border-gray-200"
              aria-label="Ouvrir le menu de navigation"
            >
              <IoMenu className="text-2xl md:text-3xl text-gray-700" />
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Mobile Search Bar (Moved to its own row) */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-5 pr-14 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-3 focus:ring-amber-200 focus:border-amber-400 transition-all placeholder:text-gray-400 text-sm shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-full hover:from-amber-500 hover:to-amber-500 transition-all duration-200 shadow-md hover:shadow-lg"
              aria-label="Rechercher"
            >
              <IoSearch className="text-lg" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;

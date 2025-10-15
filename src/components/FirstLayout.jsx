import Header from "./Header";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";
import Drawer from "rc-drawer";
import { FaTimes } from "react-icons/fa"; // cleaner icon
import { useEffect, useState } from "react";
import Logo from "../assets/Images/logo-no-bg.png";
import { useSelector } from "react-redux";
import BackToTop from "./Acceuil/BackToTop";
import "rc-drawer/assets/index.css"; // ensures base styles
import { LuCircleUser } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { RiLoginCircleLine } from "react-icons/ri";
import { TiContacts } from "react-icons/ti";
import { BsClipboard2Data } from "react-icons/bs";

const FirstLayout = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { userInfo } = useSelector((state) => state.projet);

  const { pathname } = useLocation();

  const openDrawer = () => {
    setOpenMenu(true);
  };

  const closeDrawer = () => {
    setOpenMenu(false);
  };

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  const getDrawerWidth = () => {
    if (window.innerWidth < 768) {
      return "60%"; // slightly wider on mobile for readability
    }
    return "320px"; // fixed width for consistency
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Drawer
        open={openMenu}
        onClose={closeDrawer}
        width={getDrawerWidth()}
        placement="right"
        maskClosable={true}
        className="!rounded-l-2xl overflow-hidden shadow-xl"
        handler={false} // hides default handler
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 relative">
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={closeDrawer}
          >
            <img src={Logo} alt="Approbat Logo" className="w-10 h-10" />
            <span className="text-lg font-bold tracking-tight">Approbat</span>
          </Link>
          <button
            onClick={closeDrawer}
            aria-label="Fermer le menu"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <FaTimes className="text-[14px]" />
          </button>
        </div>

        {/* Drawer Navigation */}
        <nav className="p-6">
          <ul className="space-y-3">
            {userInfo?.role === "admin" && (
              <li className=" ">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center px-4 gap-2  py-3 rounded-xl text-nowrap transition-all font-medium ${
                      isActive
                        ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={closeDrawer}
                >
                  <span>
                    <BsClipboard2Data />
                  </span>
                  Tableau de bord
                </NavLink>
              </li>
            )}
            {userInfo && (
              <li className=" ">
                <NavLink
                  to="/profil"
                  className={({ isActive }) =>
                    `flex items-center px-4 gap-2 py-3 rounded-xl text-nowrap transition-all font-medium ${
                      isActive
                        ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
                        : "text-gray-700 "
                    }`
                  }
                  onClick={closeDrawer}
                >
                  <span>
                    <LuCircleUser />
                  </span>
                  Votre Compte
                </NavLink>
              </li>
            )}
            <li className=" ">
              <NavLink
                to="/boutique"
                className={({ isActive }) =>
                  `flex items-center px-4 gap-2  py-3 rounded-xl transition-all text-nowrap font-medium ${
                    isActive
                      ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
                      : "text-gray-700 "
                  }`
                }
                onClick={closeDrawer}
              >
                <span>
                  <FiShoppingCart />
                </span>
                Boutique
              </NavLink>
            </li>
            <li className="">
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `flex items-center px-4 gap-2   py-3 rounded-xl text-nowrap transition-all font-medium ${
                    isActive
                      ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                onClick={closeDrawer}
              >
                <span>
                  <TiContacts />
                </span>
                Contact
              </NavLink>
            </li>
            {!userInfo && (
              <li>
                <NavLink
                  to="/connexion"
                  className={({ isActive }) =>
                    `flex items-center px-4 gap-2  py-3 rounded-xl text-nowrap transition-all font-medium ${
                      isActive
                        ? "bg-orange-100 text-orange-700 border-l-4 border-orange-500"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={closeDrawer}
                >
                  <span>
                    <RiLoginCircleLine />
                  </span>
                  Connexion
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </Drawer>

      <Header openDrawer={openDrawer} />
      <main className="flex-grow flex flex-col">
        <Outlet />
        <BackToTop />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default FirstLayout;

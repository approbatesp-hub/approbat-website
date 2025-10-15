import Header from "./Header";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import ScrollToTop from "./ScrollToTop";
import Footer from "./Footer";
import Drawer from "rc-drawer";
import { FaWindowClose } from "react-icons/fa";
import { useEffect, useState } from "react";
import Logo from "../assets/Images/logo-no-bg.png";
import { useSelector } from "react-redux";
import BackToTop from "./Acceuil/BackToTop";

const FirstLayout = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { userInfo } = useSelector((state) => state.projet);

  const { pathname } = useLocation();

  const openDrawer = () => {
    setOpenMenu(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setOpenMenu(false);
  };

  useEffect(() => {
    closeDrawer();
  }, [pathname]);

  const getDrawerWidth = () => {
    if (window.innerWidth < 768) {
      return "60%"; // Set smaller width for mobile screens
    }
    return "30%"; // Default width for larger screens
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Drawer open={openMenu} onClose={closeDrawer} width={getDrawerWidth()}>
        <div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold flex items-center justify-center flex-col py-4 relative">
            <Link to="/" className="flex flex-col  items-center ">
              <img src={Logo} alt="Approbat Logo" className="w-10" />
              <span>Approbat</span>
            </Link>
            <button
              onClick={closeDrawer}
              aria-label="Fermer le menu"
              className="absolute top-2 right-3 text-[26px] bg-transparent border-none cursor-pointer"
            >
              <FaWindowClose />
            </button>
          </div>
          <ul className="flex flex-col gap-7 mt-10 text-center">
            <li>
              <NavLink
                to="/profil" // ✅ Fixed: absolute path
                className={({ isActive }) =>
                  isActive
                    ? "text-orange underline underline-offset-4 font-medium text-nowrap"
                    : "text-bleu4 text-nowrap"
                }
              >
                Votre Compte
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/boutique"
                className={({ isActive }) =>
                  isActive
                    ? "text-orange underline underline-offset-4 font-medium text-nowrap"
                    : "text-bleu4 text-nowrap"
                }
              >
                Boutique
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact" // ✅ Fixed: absolute path
                className={({ isActive }) =>
                  isActive
                    ? "text-orange underline underline-offset-4 font-medium text-nowrap"
                    : "text-bleu4 text-nowrap"
                }
              >
                Contact
              </NavLink>
            </li>

            {!userInfo && (
              <li>
                <NavLink
                  to="/connexion" // ✅ Fixed: absolute path
                  className={({ isActive }) =>
                    isActive
                      ? "text-orange underline underline-offset-4 font-medium text-nowrap"
                      : "text-bleu4 text-nowrap"
                  }
                >
                  Connexion{" "}
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </Drawer>
      <Header openDrawer={openDrawer} />
      <main className="flex-grow flex flex-col ">
        {" "}
        {/* pt-16 accounts for fixed header height */}
        <Outlet />
        <BackToTop />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default FirstLayout;

import { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { deconnexion, resetAll } from "../redux/espremium";

// import { LuHeart, LuUserCircle } from "react-icons/lu";
import { FaCircleUser } from "react-icons/fa6";
import { BiLogOutCircle } from "react-icons/bi";
import { MdPhonelinkSetup } from "react-icons/md";
import { FaMapLocation } from "react-icons/fa6";
import { IoHeartSharp } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa6";
import supabase from "../../supase-client";

// --- Data for Navigation Links ---
// Grouping links makes it easy to add dividers and manage sections.
const navLinks = [
  {
    group: "General",
    links: [
      { to: "/profil", icon: <FaCircleUser />, text: "Votre Compte" },
      {
        to: "/profil/commandes",
        icon: <FaBoxOpen />,
        text: "Vos Commandes",
      },
      {
        to: "/profil/envies",
        icon: <IoHeartSharp />,
        text: "Votre liste d'envies",
      },
    ],
  },
  {
    group: "Settings",
    links: [
      {
        to: "/profil/adresse",
        icon: <FaMapLocation />,
        text: "Adresse de livraison",
      },
      {
        to: "/profil/modifierNumero",
        icon: <MdPhonelinkSetup />,
        text: "Modifier votre numéro",
      },
    ],
  },
];

// --- Reusable NavLink Component for a cleaner look ---
const ProfileNavLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-4 px-2 md:px-4 py-2 md:py-3 rounded-md transition-colors duration-200 text-sm font-medium ${
        isActive
          ? "bg-amber-100 text-amber-500"
          : "text-gray-600 hover:bg-gray-100 hover:text-amber-600"
      }`
    }
  >
    <span className="text-2xl">{icon}</span>
    <span className="hidden md:inline text-nowrap">{text}</span>
  </NavLink>
);

// --- Main Layout Component ---
const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.projet);

  // Redirect to login if user info is not available
  useEffect(() => {
    if (!userInfo) {
      navigate("/connexion");
    }
  }, [userInfo, navigate]);

  // Handle user sign-out
  const signOutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erreur lors de la déconnexion");
    } else {
      navigate("/connexion");
      toast.success("Vous avez été déconnecté.");

      dispatch(deconnexion());
      dispatch(resetAll());
    }
  };

  // Render a loading state or null if userInfo is not yet available
  if (!userInfo) {
    return null;
  }

  return (
    <div className="min-h-screen  bg-gray-50 pt-[140px] pb-[50px] md:py-[120px]   ">
      <div className="lg:max-w-[95%]  xl:max-w-[85%] h-full  mx-auto  px-2 sm:px-6 lg:px-8">
        {/* --- Header Section --- */}
        <header className="mb-3 md:mb-5">
          <h1 className=" text-2xl md:text-3xl font-bold text-gray-800 text-nowrap">
            Mon Espace Client
          </h1>
        </header>

        {/* --- Main Layout: Sidebar + Content --- */}
        <div className="flex flex-row gap-3 md:gap-8 h-full">
          {/* --- Sidebar --- */}
          <aside className="w-[15%] max-h-[75vh] md:w-64 ">
            <nav className="bg-white items-center rounded-lg shadow-sm p-4 h-full flex flex-col">
              <div className="flex-grow space-y-1">
                {navLinks.map((group, index) => (
                  <div key={group.group}>
                    {group.links.map((link) => (
                      <ProfileNavLink key={link.to} {...link} />
                    ))}
                    {/* Add a divider between groups */}
                    {index < navLinks.length - 1 && <hr className="my-3" />}
                  </div>
                ))}
              </div>

              {/* --- Logout Button --- */}
              <div className="mt-6">
                <hr className="my-3" />
                <button
                  onClick={signOutUser}
                  className="flex items-center gap-4 w-full px-4 py-3 rounded-md text-sm font-medium text-amber-500 hover:bg-red-50 transition-colors duration-200"
                >
                  <span className="text-2xl">
                    <BiLogOutCircle />
                  </span>
                  <span className="hidden md:inline">Déconnexion</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* --- Main Content --- */}
          <main className="flex-1 bg-white rounded-lg shadow-sm p-3 lg:p-6 min-h-[75vh]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;

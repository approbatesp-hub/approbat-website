import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { LocationProvider } from "./utils/LocationContext";

// Import all your components
import AdminLayout from "./components/AdminLayout";
import ErrorPage from "./components/ErrorPage";
import FirstLayout from "./components/FirstLayout";
import Layout from "./components/Layout";
import AjouterProduit from "./routes/Admin/AjouterProduit";
import Coupons from "./routes/Admin/Coupons";
import ModifierProduit from "./routes/Admin/ModifierProduit";
import Proforma from "./routes/Admin/Proforma";
import TableauDeBord from "./routes/Admin/TableauDeBord";
import Utilisateurs from "./routes/Admin/Utilisateurs";
import VoirCommandes from "./routes/Admin/VoirCommandes";
import VoirProduits from "./routes/Admin/VoirProduits";
import Boutique from "./routes/Boutique";
import Cart from "./routes/Cart";
import Checkout from "./routes/Checkout";
import Connexion from "./routes/Connexion";
import Contact from "./routes/Contact";
import EnregistrezVous from "./routes/EnregistrezVous";
import Home from "./routes/Home";
import MDPOublie from "./routes/MDPOublie";
import Produit from "./routes/Produit";
import Addresse from "./routes/Profil/Addresse";
import AMAdresse from "./routes/Profil/AMAdresse";
import Commandes from "./routes/Profil/Commandes";
import CommandesLivrees from "./routes/Profil/CommandesLivrees";
import ListeEnvies from "./routes/Profil/ListeEnvies";
import ModifierNumero from "./routes/Profil/ModifierNumero";
import Search from "./routes/Search";
import ProtectedRoute from "./routes/Admin/ProtectedRoute";
import VerifyOTP from "./routes/VerifyOTP";
import UpdatePassword from "./routes/UpdatePassword";
import DashBoardClient from "./routes/Profil/DashBoardClient";

// 1. Create a Root component to provide the location context to all routes.
const Root = () => {
  return (
    <LocationProvider>
      {/* The Outlet will render whichever child route is active */}
      <Outlet />
    </LocationProvider>
  );
};

// 2. Configure the router with the new Root component as the main element.
const router = createBrowserRouter([
  {
    element: <Root />, // All routes will now be children of this component
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <FirstLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "boutique", element: <Boutique /> },
          { path: "produit/:slug/*", element: <Produit /> },
          { path: "cart", element: <Cart /> },
          { path: "connexion", element: <Connexion /> },
          { path: "verify-otp", element: <VerifyOTP /> },
          { path: "update-password", element: <UpdatePassword /> },
          { path: "search", element: <Search /> },
          { path: "enregistrer", element: <EnregistrezVous /> },
          { path: "mdpoublie", element: <MDPOublie /> },
          { path: "contact", element: <Contact /> },
          {
            path: "profil",
            element: <Layout />,
            children: [
              { index: true, element: <DashBoardClient /> },
              { path: "commandes", element: <Commandes /> },
              { path: "commandes/okay", element: <CommandesLivrees /> },
              { path: "envies", element: <ListeEnvies /> },
              { path: "modifierNumero", element: <ModifierNumero /> },
              { path: "adresse", element: <Addresse /> },
              { path: "adresse/creer", element: <AMAdresse /> },
            ],
          },
        ],
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/admin",
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <TableauDeBord /> },
          { path: "produits", element: <VoirProduits /> },
          { path: "ajouter", element: <AjouterProduit /> },
          { path: "commandes", element: <VoirCommandes /> },
          { path: "utilisateurs", element: <Utilisateurs /> },
          { path: "proforma", element: <Proforma /> },
          { path: "coupons", element: <Coupons /> },
          { path: "modifier/:id", element: <ModifierProduit /> },
        ],
      },
      // This will catch any routes that don't match the ones above
      { path: "*", element: <ErrorPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

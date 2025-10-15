import { useSelector } from "react-redux";
import { Link } from "react-router"; // Use 'react-router-dom' for modern React Router
import { BsPlusCircleFill } from "react-icons/bs";

const Addresse = () => {
  const { userInfo } = useSelector((state) => state.projet);

  return (
    <div className="min-h-full  md:p-4 lg:p-6">
      <div className=" ">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
            Votre Adresse de Livraison
          </h3>
          <Link
            to={"/profil/adresse/creer"}
            className="mt-3 sm:mt-0 px-5 py-2 text-sm font-semibold text-white bg-orange-600 rounded-lg shadow-md hover:bg-orange-700 transition duration-300 ease-in-out uppercase flex items-center gap-2 "
          >
            <span className="text-white">
              <BsPlusCircleFill className="text-lg" />
            </span>{" "}
            Nouvelle Adresse
          </Link>
        </header>

        {/* Main Content Area */}
        <div className="mt-3 md:mt-8">
          {userInfo?.adresse ? (
            // Address Card (More prominent and structured)
            <div className="bg-white p-3 md:p-6 rounded-xl shadow-lg border border-gray-200">
              {/* Address Details */}
              <div className="space-y-4">
                {/* Name & Badge */}
                <div className="flex items-center justify-between">
                  <p className=" md:text-xl font-bold text-blue-700 capitalize">
                    {userInfo.nomComplet || "Nom Complet Non Spécifié"}
                  </p>
                  <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Adresse par Défaut
                  </span>
                </div>

                {/* Location Details */}
                <div className="text-gray-600 space-y-2">
                  <div className="flex items-start">
                    {/* Location Icon */}
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.899A2 2 0 0110.586 20.899L6.343 16.657A8 8 0 1117.657 16.657z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                    <p className="font-medium text-[15px] md:text-base ">
                      {userInfo.adresse.adresse
                        ? `${userInfo.adresse.adresse}, `
                        : ""}
                      {userInfo.adresse.commune
                        ? `${userInfo.adresse.commune}, `
                        : ""}
                      <span className="font-semibold text-gray-800">
                        {userInfo.adresse.district}
                      </span>
                    </p>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-center">
                    {/* Phone Icon */}
                    <svg
                      className="w-5 h-5 mr-2 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                    <p className="text-[15px] md:text-base ">
                      +225 {userInfo?.numero}
                    </p>
                  </div>
                </div>
              </div>

              <div className="my-3 md:my-5  bg-gray-200 w-full h-[1px] " />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Link
                  to={"/profil/adresse/creer"}
                  className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-300"
                >
                  Modifier
                </Link>
              </div>
            </div>
          ) : (
            // Empty State
            <div className="text-center p-10 bg-white rounded-xl shadow-inner border border-dashed border-gray-300">
              <p className="text-lg text-gray-600 mb-4">
                Vous n'avez pas encore d'adresse enregistrée.
              </p>
              <p className="text-sm text-gray-500">
                Ajoutez votre première adresse pour faciliter vos commandes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Addresse;

import { TiEdit } from "react-icons/ti";
import { useSelector } from "react-redux";
import { Link } from "react-router";

const DashBoardClient = () => {
  const { userInfo } = useSelector((state) => state.projet);

  return (
    <div className=" md:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-3 md:mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <p className="text-gray-600 mt-1">
          Gérez vos informations personnelles
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="md:text-lg font-semibold text-gray-900">
              Informations personnelles
            </h3>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-sm font-medium">👤</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">
                Nom complet
              </span>
              <span className="text-gray-900 font-medium capitalize">
                {userInfo?.nomComplet}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Email</span>
              <span className="text-gray-900">{userInfo?.email}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-600">
                Téléphone
              </span>
              <span className="text-gray-900">+225 {userInfo?.numero}</span>
            </div>
          </div>
        </div>

        {/* Address Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Adresse de livraison
            </h3>
            <Link
              to="/profil/adresse/creer"
              className="flex items-center gap-2 bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-600 transition-colors"
            >
              <TiEdit className="text-lg" />
              <span className="text-sm font-medium">Modifier</span>
            </Link>
          </div>

          {userInfo?.adresse?.district ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-2 md:p-4">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Adresse par défaut
                </p>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex md:items-center gap-2">
                    <span className="font-medium">District:</span>
                    <span className="capitalize">
                      {userInfo.adresse.district}
                    </span>
                  </div>
                  <div className="flex md:items-center gap-2">
                    <span className="font-medium">Commune:</span>
                    <span className="capitalize">
                      {userInfo.adresse.commune}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium">Adresse:</span>
                    <span className="capitalize">
                      {userInfo.adresse.adresse}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏠</span>
              </div>
              <p className="text-gray-600 mb-4">Aucune adresse enregistrée</p>
              <Link
                to="/profil/adresse/creer"
                className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
              >
                <TiEdit className="text-lg" />
                Ajouter une adresse
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashBoardClient;

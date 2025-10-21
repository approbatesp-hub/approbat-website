const ConfirmationModal = ({ isOpen, onClose, onConfirm, data }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-lg">
        <h3 className="text-center text-amber-500 text-xl font-semibold mb-4">
          Vérification des informations
        </h3>

        <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 space-y-2">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex">
              <span className="font-semibold w-40 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}:
              </span>
              <span className="ml-2 flex-1">{value || "Non spécifié"}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
          >
            J'annule
          </button>
          <button
            onClick={onConfirm}
            className="px-4 text-white py-2 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 cursor-pointer"
          >
            Oui, tout est correct !
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

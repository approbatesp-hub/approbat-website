import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import supabase from "../../supase-client";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { connexion } from "../redux/espremium";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { email, fullName, numberTrim, password } = state || {};

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = [...otp];
      pasteData.split("").forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasteData.length, 5)].focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Veuillez entrer un code complet à 6 chiffres.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: code,
        type: "email",
      });

      if (error) {
        throw error;
      }

      registerUser(data.user.id);
    } catch (error) {
      console.log(error);
      toast.error("Code invalide ou expiré. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (id) => {
    const toastId = toast.loading("Création du profil...");

    // VERIFIER D'ABORD SI L'UTILISATEUR EXISTE DANS LA BASE DE DONNÉES

    // ENSUITE CRÉER L'AUTHENTIFICATION
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      toast.dismiss(toastId);
      console.log(updateError);
      return toast.error("Erreur lors de la création du compte.");
    }

    // ENREGISTRER L'UTILISATEUR DANS LA BASE DE DONNEES
    const user = {
      id,
      nomComplet: fullName.toLowerCase(),
      email: email,
      numero: numberTrim,
      emailVerified: true,
    };

    const { error: userRegisterError } = await supabase
      .from("Users")
      .insert(user);

    if (userRegisterError) {
      console.log(userRegisterError);
      toast.dismiss(toastId);
      return toast.error(
        "Erreur lors de la création du compte. Veuillez réessayer."
      );
    } else {
      toast.dismiss(toastId);
      toast.success("Compte créé avec succès!");
      dispatch(connexion(user));
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 && timeLeft !== 5 * 60) {
      toast.error(
        `Veuillez attendre ${formatTime(timeLeft)} avant de renvoyer.`
      );
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });

      if (error) throw error;

      setTimeLeft(5 * 60);
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      toast.success("📧 Nouveau code envoyé !");
    } catch (error) {
      toast.error("Erreur lors de l'envoi du code. Veuillez réessayer.");
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = otp.every((digit) => digit !== "");
  const isExpired = timeLeft <= 0;

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-purple-50 text-white flex items-center justify-center p-4 pt-[140px] pb-[50px] md:py-[120px] ">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white p-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Vérification du compte
            </h3>
            <p className="text-white">Entrez le code à 6 chiffres envoyé à</p>
            <p className="text-white font-semibold truncate">{email}</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* OTP Inputs */}
            <div className="mb-6">
              <div className="flex justify-center space-x-3 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={isLoading}
                    className={`w-12 h-12 text-2xl font-semibold text-center border-2 rounded-lg transition-all duration-200 focus:ring focus:ring-amber text-gray-700 focus:border-amber outline-none ${
                      digit ? "border-amber " : "border-gray-300"
                    } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                <div
                  className={`text-sm font-medium ${
                    timeLeft < 60
                      ? "text-red-600 animate-pulse"
                      : "text-gray-600"
                  }`}
                >
                  {isExpired ? (
                    <span className="text-red-600 font-semibold">
                      Code expiré
                    </span>
                  ) : (
                    `⏱️ Expire dans ${formatTime(timeLeft)}`
                  )}
                </div>
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isCodeComplete || isLoading || isExpired}
              className="w-full bg-gradient-to-br from-amber-400 to-amber-500 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Vérification...
                </div>
              ) : (
                "Vérifier le code"
              )}
            </button>

            {/* Resend Section */}
            <div className="mt-6 text-center">
              {isExpired ? (
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 disabled:opacity-50"
                >
                  {isResending ? "Envoi en cours..." : "Renvoyer le code"}
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-gray-500 text-sm">
                    Vous n'avez pas reçu le code ?
                  </p>
                  <button
                    onClick={handleResend}
                    disabled={timeLeft > 14 * 60} // Prevent resend too quickly
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isResending ? "Envoi..." : "Renvoyer un code"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Le code de vérification est valable 5 minutes
            </p>
          </div>
        </div>

        {/* Back to login */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/connexion")}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
          >
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

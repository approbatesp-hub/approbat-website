import Lottie from "lottie-react";
import Aloading from "../assets/Images/animation/ALoading.json"; // reuse your loader

export default function SearchLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Lottie animationData={Aloading} loop className="w-[150px]" />
    </div>
  );
}

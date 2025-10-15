import SafeLottie from "./SafeLottie";
import Aloading from "../assets/Images/animation/ALoading.json";

export default function SearchLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SafeLottie animationData={Aloading} loop className="w-[150px]" />
    </div>
  );
}

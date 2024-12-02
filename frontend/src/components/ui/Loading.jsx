import Lottie from "lottie-react";
import loadingAnimation from '@/assets/animations/AnimationLoading.json';

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <Lottie className="h-1/6" animationData={loadingAnimation} loop={true} />
    </div>
  );
};

export default Loading;

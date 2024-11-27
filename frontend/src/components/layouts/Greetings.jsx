import Mockup from "@/assets/videos/mockup.mov";
import Lottie from "lottie-react";
import arrowAnimation from "@/assets/animations/AnimationArrow.json";

const Greetings = () => {
  return (
    <div className="w-full lg:w-8/12 bg-[#dbdfe5] lg:h-screen h-full flex flex-col items-center justify-between py-5 lg:pl-5 lg:rounded-2xl overflow-hidden">
    {/* First Layer: Heading (Small Height) */}
    <div className="h-max p-5 rounded-xl mb-4 w-full lg:flex flex-col items-center my-3 mr-5 hidden">
      <div className="flex items-center justify-end gap-3 w-full">
        <h1 className="text-white text-lg rounded-full rounded-tr-none bg-blue-600 shadow px-6 py-2 ml-auto">
          Let's Chat!
        </h1>
        <img
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDg0fHx1c2VyfGVufDB8fHx8MTczMjU1NjgyMHww&ixlib=rb-4.0.3&q=80&w=1080"
          alt="Logo"
          className="size-10 min-h-5 min-w-5 object-cover rounded-full border-2"
        />
      </div>
      <div className="flex items-center justify-end gap-3 w-full">
        <img
          src="https://images.unsplash.com/photo-1499887142886-791eca5918cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDl8fHVzZXIlMjBmZW1hbGV8ZW58MHx8fHwxNzMyNTU2ODUyfDA&ixlib=rb-4.0.3&q=80&w=1080"
          alt="Logo"
          className="size-10 min-h-5 min-w-5 object-cover rounded-full border-2"
        />
        <h1 className="text-white text-lg rounded-full rounded-tl-none bg-blue-600 shadow px-6 py-2 mr-auto">
          Join the conversation!
        </h1>
      </div>
    </div>

    {/* Second Layer: Arrow Animation (Medium Height) */}
    <div className="h-40 mb-4 w-full flex flex-col items-center justify-center p-5 lg:p-0 gap-3">
      <div className="flex items-center justify-end gap-3 w-full lg:hidden">
        <h1 className="text-white text-lg rounded-full rounded-tr-none bg-blue-600 shadow px-6 py-2 ml-auto">
          Join the conversation!
        </h1>
        <img
          src="https://images.unsplash.com/photo-1499887142886-791eca5918cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDkyMnwwfDF8c2VhcmNofDl8fHVzZXIlMjBmZW1hbGV8ZW58MHx8fHwxNzMyNTU2ODUyfDA&ixlib=rb-4.0.3&q=80&w=1080"
          alt="Logo"
          className="size-10 min-h-5 min-w-5 object-cover rounded-full border-2"
        />
      </div>
      <Lottie
        className="h-full w-full object-contain transform rotate-180"
        animationData={arrowAnimation}
        loop={true}
      />
    </div>

    {/* Third Layer: Video (Remaining Height) */}
    <div className="flex-grow w-full">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={Mockup} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </div>
  )
}

export default Greetings
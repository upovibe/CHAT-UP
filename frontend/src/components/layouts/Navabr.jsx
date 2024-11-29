import AuthBox from "@/components/layouts/AuthBox"
import Logo from "@/components/ui/Logo";
import NavList from "@/components/layouts/NavList";

const Navabr = () => {
  return (
    <>
      <nav className="w-full flex items-center justify-between px-5 py-3">
        <div className="">
          <Logo />
        </div>
        <div className="">
          <NavList />
        </div>
        <div className="">
          <AuthBox/>
        </div>
      </nav>
    </>
  );
};

export default Navabr;

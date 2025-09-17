import { LuTrendingUpDown } from "react-icons/lu";
import GraphicCard from "../../assets/img/graphic-card.jpeg";
import Logo from "../../assets/img/logo.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12 ">
        <div className="flex justify-center mb-8">
          <img
            src={Logo}
            alt="logo"
            className="w-40 mb-8 rounded-full border-3 border-stone-500 "
          />
        </div>
        {children}
      </div>

      <div className="hidden md:block w-[40vw] h-screen bg-stone-700 bg-auth-bg-img bg-no-repeat bg-center overflow-hidden p-8 relative">
        <div className="w-48 h-48 rounded-[40px] bg-white mb-30"></div>
        <div className="w-48 h-48 rounded-[40px] border-8 border-stone-500 absolute top-[10%] right-1"></div>
        <div className="w-48 h-48 rounded-[40px] bg-stone-500 absolute bottom-[5%] left-8"></div>
        <div className="w-48 h-48 rounded-[40px] border-8 border-white absolute bottom-[10%] right-1"></div>
        <div className="grid grid-cols-1 z-20 absolute top-12 right-2 ">
          <InfoCard
            icon={<LuTrendingUpDown />}
            label="Traccia le tue Entrate e Uscite"
            value="270,000"
            color="bg-primary"
          />
        </div>
        "
        <img
          src={GraphicCard}
          alt="graphic card"
          className="rounded-2xl w-64 lg:w-[90%] absolute bottom-40 shadow-lg shadow-stone-900"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const InfoCard = ({ icon, label, value, color }) => {
  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-lg shadow-md ${color} text-white mb-6 w-90`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xl font-semibold">€ {value}</p>
      </div>
    </div>
  );
};

import DashboardLayout from "../../components/layouts/dashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";

const Home = () => {
  useUserAuth();
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">Home</div>
    </DashboardLayout>
  );
};

export default Home;

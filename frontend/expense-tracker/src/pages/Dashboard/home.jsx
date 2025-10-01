import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaBalanceScale } from "react-icons/fa";
import { GrMoney } from "react-icons/gr";
import { LuHandCoins } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/cards/infoCard";
import ExpenseTransactions from "../../components/dashboard/expenseTransactions";
import FinanceOverview from "../../components/dashboard/financeOverview";
import Last30DaysExpenses from "../../components/dashboard/last30DaysExpenses";
import RecentIncome from "../../components/dashboard/recentIncome";
import RecentIncomeWithChart from "../../components/dashboard/recentIncomeWithChart";
import RecentTransactions from "../../components/dashboard/recentTransactions";
import DashboardLayout from "../../components/layouts/dashboardLayout";
import { useLoading } from "../../context/loaderContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { addThousandsSeparetor } from "../../utils/helper";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6,
    },
  },
};

const gridItemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
      duration: 0.7,
    },
  },
};

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoading();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      showLoader();
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      hideLoader();
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={cardVariants}>
            <InfoCard
              icon={<FaBalanceScale />}
              label="Total Balance"
              value={addThousandsSeparetor(dashboardData?.totalBalance || 0)}
              color="bg-primary"
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <InfoCard
              icon={<GrMoney />}
              label="Total Income"
              value={addThousandsSeparetor(dashboardData?.totalIncome || 0)}
              color="bg-green-500"
            />
          </motion.div>

          <motion.div variants={cardVariants}>
            <InfoCard
              icon={<LuHandCoins />}
              label="Total Expense"
              value={addThousandsSeparetor(dashboardData?.totalExpense || 0)}
              color="bg-red-500"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={gridItemVariants}>
            <RecentTransactions
              transactions={dashboardData?.recentTransactions}
              onSeeMore={() => navigate("/expense")}
            />
          </motion.div>

          <motion.div variants={gridItemVariants}>
            <FinanceOverview
              totalBalance={dashboardData?.totalBalance || 0}
              totalIncome={dashboardData?.totalIncome || 0}
              totalExpense={dashboardData?.totalExpense || 0}
            />
          </motion.div>

          <motion.div variants={gridItemVariants}>
            <ExpenseTransactions
              transactions={
                dashboardData?.last30DaysExpenses?.transactions || []
              }
              onSeeMore={() => navigate("/expense")}
            />
          </motion.div>

          <motion.div variants={gridItemVariants}>
            <Last30DaysExpenses
              data={dashboardData?.last30DaysExpenses?.transactions || []}
            />
          </motion.div>

          <motion.div variants={gridItemVariants}>
            <RecentIncomeWithChart
              data={
                dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []
              }
              totalIncome={dashboardData?.totalIncome || 0}
            />
          </motion.div>

          <motion.div variants={gridItemVariants}>
            <RecentIncome
              transactions={dashboardData?.last60DaysIncome?.transactions || []}
              onSeeMore={() => navigate("/income")}
            />
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Home;

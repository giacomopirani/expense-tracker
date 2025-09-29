import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/deleteAlert";
import AddExpenseForm from "../../components/expense/addExpenseForm";
import ExpenseList from "../../components/expense/expenseList";
import ExpenseOverview from "../../components/expense/expenseOverview";
import DashboardLayout from "../../components/layouts/dashboardLayout";
import Modal from "../../components/modal";
import { useLoading } from "../../context/loaderContext";
import { useUserAuth } from "../../hooks/useUserAuth";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";

const Expense = () => {
  useUserAuth();
  const [expenseData, setExpenseData] = useState([]);
  const { showLoader, hideLoader } = useLoading();
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

  // Get All Expense Detailsc
  const fetchExpenseDetails = async () => {
    try {
      showLoader();
      const response = await axiosInstance.get(
        `${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`
      );

      if (response.data) {
        setExpenseData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error);
    } finally {
      hideLoader();
    }
  };

  // Handle Add Expense
  const handleAddExpense = async (expense) => {
    const { category, amount, date, icon } = expense;

    // Validation checks
    if (!category.trim()) {
      toast.error("Category is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number greater than 0.");
    }

    if (!date) {
      toast.error("Date is required.");
      return;
    }

    try {
      showLoader();
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
        category,
        amount,
        date,
        icon,
      });

      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error adding expense:",
        error.response?.data?.message || error.message
      );
    } finally {
      hideLoader();
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      showLoader();
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Expense details deleted succesfully");
      fetchExpenseDetails();
    } catch (error) {
      console.error(
        "Error deleting expense:",
        error.response?.data?.message || error.message
      );
    } finally {
      hideLoader();
    }
  };

  // Handle download expense details
  const handleDownloadExpenseDetails = async () => {
    try {
      showLoader();
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchExpenseDetails();

    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Expense">
      <div className="my-5 mx-auto">
        <div className="">
          <div className="">
            <ExpenseOverview
              transactions={expenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={expenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id });
            }}
            onDownload={handleDownloadExpenseDetails}
          />
        </div>

        <Modal
          isOpen={openAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert
            content="Are you sure you want to delete this expense detail?"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Expense;

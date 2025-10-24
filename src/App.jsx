import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import CombinedHeaderNav from "./components/Header/CombinedHeaderNav.jsx";
import SurrenderDog from "./pages/SurrenderDog/SurrenderDog.jsx";
import ReportPage from "./pages/ReportPage/ReportPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ContactPage from "./pages/ContactPage/ContactPage.jsx";
import AdoptOrBuy from "./pages/AdoptBuyDogs/AdoptOrBuy.jsx";
import DogAdopt from "./pages/AdoptBuyDogs/AdoptDogs.jsx";
import DogBuy from "./pages/AdoptBuyDogs/BuyDogs.jsx";
import DogDetails from "./pages/AdoptBuyDogs/DogDetail.jsx";
import AdminDog from "./pages/Admin/AdminDog.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AdminAuthProvider } from "./contexts/AdminAuthContext.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Profile from "./pages/Auth/Profile.jsx";
import { overrideGlobalAlerts } from "./utils/customAlert.jsx";

// Admin Components
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminUsers from "./pages/Admin/AdminUsers.jsx";
import AdminDogs from "./pages/Admin/AdminDogs.jsx";
import AdminApplications from "./pages/Admin/AdminApplications.jsx";
import AdminReports from "./pages/Admin/AdminReports.jsx";
import AdminSurrender from "./pages/Admin/AdminSurrender.jsx";
import AdminContactMessages from "./pages/Admin/AdminContactMessages.jsx";
import AdminProfileNew from "./pages/Admin/AdminProfileNew.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";

function App() {
  // Initialize custom alerts on app start
  useEffect(() => {
    overrideGlobalAlerts();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <AdminAuthProvider>
          <Routes>
          {/* Regular User Routes with Navigation */}
          <Route path="/" element={<><CombinedHeaderNav /><HomePage /></>} />
          <Route path="/surrender" element={<><CombinedHeaderNav /><SurrenderDog /></>} />
          <Route path="/report" element={<><CombinedHeaderNav /><ReportPage /></>} />
          <Route path="/contact" element={<><CombinedHeaderNav /><ContactPage /></>} />
          <Route path="/adopt" element={<><CombinedHeaderNav /><AdoptOrBuy /></>} />
          <Route path="/dogs/adopt" element={<><CombinedHeaderNav /><DogAdopt /></>} />
          <Route path="/dogs/buy" element={<><CombinedHeaderNav /><DogBuy /></>} />
          <Route path="/dogs/:id" element={<><CombinedHeaderNav /><DogDetails /></>} />
          <Route path="/login" element={<><CombinedHeaderNav /><Login /></>} />
          <Route path="/register" element={<><CombinedHeaderNav /><Register /></>} />
          <Route path="/profile" element={<><CombinedHeaderNav /><Profile /></>} />
          <Route path="/dashboard" element={<><CombinedHeaderNav /><div>Dashboard Page</div></>} />
          <Route path="/forgot-password" element={<><CombinedHeaderNav /><div>Forgot Password Page</div></>} />
          <Route path="/terms" element={<><CombinedHeaderNav /><div>Terms of Service Page</div></>} />
          <Route path="/privacy" element={<><CombinedHeaderNav /><div>Privacy Policy Page</div></>} />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminUsers /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/dogs" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminDogs /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/applications" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminApplications /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminReports /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/contact-messages" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminContactMessages /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/surrender" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminSurrender /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedAdminRoute>
              <AdminLayout><AdminProfileNew /></AdminLayout>
            </ProtectedAdminRoute>
          } />
          
          {/* Legacy Admin Route */}
          <Route path="/admin/legacy-dogs" element={<AdminDog />} />
        </Routes>
        </AdminAuthProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
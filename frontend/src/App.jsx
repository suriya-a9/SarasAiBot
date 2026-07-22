import { Routes, Route } from "react-router-dom";
import PublicRoute from "./utls/publicRoutes";
import AdminPublicRoute from "./utls/adminPublicRoutes";
import ClientPrivateRoute from "./utls/ClientPrivateRoute";
import AdminPrivateRoute from "./utls/AdminPrivateRoute";
import MainLayout from "./layout/MainLayout";
import AdminMainLayout from "./layout/AdminMainLayout";
import HomePage from "./pages/publicPages/homePage";
import CommonAuth from "./pages/publicPages/ClientLogin";
import Register from "./pages/publicPages/ClientRegister";
import Dashboard from "./pages/client/Dashboard";
import Profile from "./pages/client/Profile";
import { Toaster } from "react-hot-toast";
import ChatbotWidgetBuilder from "./pages/client/ChatBotWidget";
import ConversationsPage from "./pages/client/ConversationsPage";
import ChatbotSettingsPage from "./pages/client/ChatBotSettings";
import HelpSupportPage from "./pages/client/HelpSupportPage";
import AdminLogin from "./pages/publicPages/adminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminClient from "./pages/admin/AdminClient";
import AdminClientDetail from "./pages/admin/AdminClientDetail";

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <HomePage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <CommonAuth />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/admin-login"
          element={
            <AdminPublicRoute>
              <AdminLogin />
            </AdminPublicRoute>
          }
        />

        <Route
          element={
            <ClientPrivateRoute>
              <MainLayout />
            </ClientPrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatbotWidgetBuilder />} />
          <Route path="/analytics/:botId?" element={<ConversationsPage />} />
          <Route path="/settings" element={<ChatbotSettingsPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
        </Route>
        <Route
          element={
            <AdminPrivateRoute>
              <AdminMainLayout />
            </AdminPrivateRoute>
          }
        >
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-client" element={<AdminClient />} />
          <Route path="/admin-client/:id?" element={<AdminClientDetail />} />
        </Route>
      </Routes>
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
    </>
  )
}

export default App;
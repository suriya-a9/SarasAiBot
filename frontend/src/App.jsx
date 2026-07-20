import { Routes, Route } from "react-router-dom";
import PublicRoute from "./utls/publicRoutes";
import ClientPrivateRoute from "./utls/ClientPrivateRoute";
import MainLayout from "./layout/MainLayout";
import HomePage from "./pages/publicPages/homePage";
import CommonAuth from "./pages/publicPages/clientLogin";
import Register from "./pages/publicPages/ClientRegister";
import Dashboard from "./pages/client/Dashboard";
import Profile from "./pages/client/Profile";
import { Toaster } from "react-hot-toast";
import ChatbotWidgetBuilder from "./pages/client/ChatBotWidget";
import ConversationsPage from "./pages/client/ConversationsPage";

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
        </Route>
      </Routes>
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
    </>
  )
}

export default App;
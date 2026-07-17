import { Routes, Route } from "react-router-dom";
import PublicRoute from "./utls/publicRoutes";
import HomePage from "./pages/publicPages/homePage";
import CommonAuth from "./pages/publicPages/clientLogin";
import Register from "./pages/publicPages/ClientRegister";
import { Toaster } from "react-hot-toast";

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
      </Routes>
      <Toaster position="top-right" reverseOrder={false} duration={2000} />
    </>
  )
}

export default App;
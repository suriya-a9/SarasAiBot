import { Routes, Route } from "react-router-dom";
import PublicRoute from "./utls/publicRoutes";
import HomePage from "./pages/publicPages/homePage";

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
      </Routes>
    </>
  )
}

export default App;
// App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Login from "./pages/admin/Login";
import { QueryProvider } from "./providers/QueryProvider";
import Dashboard from "./pages/admin/dashboard/Dashboard";

import CameraAlerts from "./pages/admin/cameras/CameraAlerts";
import Users from "./pages/admin/users/Users";
import CameraStream from "./pages/admin/zones/CameraStream";
import Camera from "./pages/admin/cameras/Camera";

// Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/camera"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <Camera />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <Users />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/cameraStream"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <CameraStream />
                  </Layout>
                }
              />
            }
          />
          <Route
            path="/alerts/:id"
            element={
              <ProtectedRoute
                element={
                  <Layout>
                    <CameraAlerts />
                  </Layout>
                }
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;

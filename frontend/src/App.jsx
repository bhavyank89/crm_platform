import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { Toaster } from "react-hot-toast";

// Component imports
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LoginGoogle from "./components/LoginGoogle";
import Customers from "./components/Customers";
import Campaigns from "./components/Campaigns";
import Segments from "./components/Segments";
import CommunicationLogs from "./components/CommunicationLogs";
import Home from "./components/Home";
import Orders from "./components/Orders";

// Page animation wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    style={{
      width: "100%", // full width of parent container
      minHeight: "100%", // allow height expansion, don't fix to viewport
      boxSizing: "border-box",
      overflow: "visible", // don't cut off content or scroll inside here
      // Removed padding here. Each page component should handle its own padding.
    }}
  >
    {children}
  </motion.div>
);

// Protected route
const ProtectedRoute = ({ user, children }) =>
  user ? children : <Navigate to="/login" replace />;

// Redirect to dashboard if already logged in
const AuthRoute = ({ user, children }) =>
  user ? <Navigate to="/" replace /> : children;

// Animated route declarations
const AnimatedRoutes = ({ user, setUser }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/login"
          element={
            <AuthRoute user={user}>
              <PageWrapper>
                <Login setUser={setUser} />
              </PageWrapper>
            </AuthRoute>
          }
        />
        <Route
          path="/home"
          element={
            <AuthRoute user={user}>
              <PageWrapper>
                <Home />
              </PageWrapper>
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRoute user={user}>
              <PageWrapper>
                <Signup />
              </PageWrapper>
            </AuthRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/auth/google/callback"
          element={
            <ProtectedRoute user={user}>
              <PageWrapper>
                <LoginGoogle setUser={setUser} />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute user={user}>
              <PageWrapper>
                <Customers />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/campaigns"
          element={
            <ProtectedRoute user={user}>
              <PageWrapper>
                <Campaigns />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/segments"
          element={
            <ProtectedRoute user={user}>
              <PageWrapper>
                <Segments />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute user={user}>
              <PageWrapper>
                <Orders />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/communicationLogs"
          element={
            <ProtectedRoute user={user}>
              <PageWrapper>
                <CommunicationLogs />
              </PageWrapper>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // The CSS for hiding the scrollbar should be in index.css as you provided.
  // Dynamic injection via useEffect is not necessary if it's already in a global CSS file.
  // Removing this block for cleaner code, assuming index.css is properly loaded.
  /*
  useEffect(() => {
    if (!document.getElementById("hide-scrollbar-style")) {
      const styleEl = document.createElement("style");
      styleEl.id = "hide-scrollbar-style";
      styleEl.innerHTML = hideScrollbarStyle;
      document.head.appendChild(styleEl);
    }
  }, []);
  */

  useEffect(() => {
    // Check for token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      setUser(tokenFromUrl);

      // Clean URL to remove token query
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else {
      // Load from localStorage if already logged in
      const storedToken = localStorage.getItem("token");
      setUser(storedToken || null);
    }
  }, []);

  const isAuthPage = useMemo(() => {
    return location.pathname === "/login" || location.pathname === "/signup";
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar/Navbar */}
      {!isAuthPage && user && (
        <div
          className={`h-full bg-[#F8FAFC] fixed top-0 left-0 shadow z-10 transition-all duration-300 ${
            collapsed ? "w-20" : "w-64"
          }`}
        >
          <Navbar
            setUser={setUser}
            user={user}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>
      )}

      {/* Main content area */}
      <main
        className={`mainContent flex-1 bg-[#EFF3EA] transition-all duration-300 overflow-y-auto overflow-x-hidden ${ // Combined and ensured overflow classes
          !isAuthPage && user ? (collapsed ? "ml-20" : "ml-64") : ""
        }`}
        style={{
          minHeight: "100vh", // Use minHeight for content flexibility
          // Removed inline overflowY/X properties as they are now in className
          // Removed WebkitOverflowScrolling as it's generally handled by modern browsers
        }}
      >
        <AnimatedRoutes user={user} setUser={setUser} />
      </main>
    </div>
  );
};

// App root with router
const App = () => (
  <Router>
    <AppContent />
    {/* <Toaster position="top-right" /> */}
  </Router>
);

export default App;
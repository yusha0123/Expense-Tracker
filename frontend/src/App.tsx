import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Loading } from "./components/Loading";
import { PrivateRoute } from "./hoc/PrivateRoute";
import { PublicRoute } from "./hoc/PublicRoute";
import { useAuthStore } from "./store/authStore";

function App() {
  const { initialize, isInitializing, user } = useAuthStore();

  const Auth = lazy(() => import("./pages/Auth"));
  const Root = lazy(() => import("./pages/Root"));
  const NotFound = lazy(() => import("./pages/NotFound"));
  const Leaderboard = lazy(() => import("./pages/Leaderboard"));
  const Dashboard = lazy(() => import("./pages/Dashboard"));
  const Report = lazy(() => import("./pages/Report"));
  const ResetPassword = lazy(() => import("./pages/ResetPassword"));

  useEffect(() => {
    initialize();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route
          element={<PublicRoute user={user} isInitializing={isInitializing} />}
        >
          <Route path="/" element={<Root />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
        <Route
          element={
            <PrivateRoute
              user={user}
              isPremiumRoute={false}
              isInitializing={isInitializing}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route
          element={
            <PrivateRoute
              user={user}
              isPremiumRoute={true}
              isInitializing={isInitializing}
            />
          }
        >
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/reports" element={<Report />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Suspense>
  );
}

export default App;

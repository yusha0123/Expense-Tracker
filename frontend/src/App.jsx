import axios from "axios";
import { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Loading } from "./components/Loading";
import { useAuthContext } from "./hooks/useAuthContext";
import { PrivateRoute } from "./utils/PrivateRoute";
import { PublicRoute } from "./utils/PublicRoute";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_ADDRESS;

function App() {
  const { user } = useAuthContext();
  const Auth = lazy(() => import("./routes/Auth"));
  const Root = lazy(() => import("./routes/Root"));
  const NotFound = lazy(() => import("./routes/NotFound"));
  const Leaderboard = lazy(() => import("./routes/Leaderboard"));
  const Dashboard = lazy(() => import("./routes/Dashboard"));
  const Report = lazy(() => import("./routes/Report"));

  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          <Route element={<PublicRoute user={user} />}>
            <Route path="/" element={<Root />} />
            <Route path="/auth" element={<Auth />} />
          </Route>
          <Route element={<PrivateRoute user={user} isPremiumRoute={false} />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<PrivateRoute user={user} isPremiumRoute={true} />}>
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/reports" element={<Report />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;

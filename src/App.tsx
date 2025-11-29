import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { setUser } from "./store/slices/userSlice";
import { retrieveLaunchParams } from "@tma.js/sdk-react";
import { Collections } from "./pages/Collections/Collections";
import "./styles/reset.css";
import "./styles/global.css";
import { Generate } from "./pages/Generate/Generate";
import { Profile } from "./pages/Profile/Profile";

function App() {
  const dispatch = useAppDispatch();
  const launchParams = retrieveLaunchParams();

  useEffect(() => {
    if (launchParams.tgWebAppData?.user) {
      dispatch(setUser(launchParams.tgWebAppData.user));
    }
  }, [launchParams, dispatch]);

  return (
    <div>
      <Router>
        <Routes>
          <Route index element={<Collections />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

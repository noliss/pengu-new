import { useEffect } from "react";
import { HashRouter } from 'react-router-dom';
import { useAppDispatch } from "./store/hooks";
import { setUser } from "./store/slices/userSlice";
import { retrieveLaunchParams } from "@tma.js/sdk-react";
import { AppRoutes } from "./router";
import "./styles/reset.css";
import "./styles/global.css";

const App = () => {
  const dispatch = useAppDispatch();
  const launchParams = retrieveLaunchParams();

  useEffect(() => {
    if (launchParams.tgWebAppData?.user) {
      dispatch(setUser(launchParams.tgWebAppData.user));
    }
  }, [launchParams, dispatch]);

  return (
    <div>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </div>
  );
};

export default App;
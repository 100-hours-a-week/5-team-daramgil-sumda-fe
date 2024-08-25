import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Layout from "./components/layout/Layout";
import Home from "./routes/Home";

import AQIDetails from "./routes/info/AQIDetails";
import WeatherInfo from "./routes/info/WeatherInfo";
import Favorites from "./routes/info/Favorites";

import Notice from "./routes/community/Notice";
import LocalPride from "./routes/community/LocalPride";
import Contact from "./routes/community/Contact";

import ActivityRecommed from "./routes/recommend/ActivityRecommed";
import OutfitDaily from "./routes/recommend/OutfitDaily";
import OutfitByTemp from "./routes/recommend/OutfitByTemp";

import Squirrel from "./routes/squirrel/Squirrel";
import Adopt from "./routes/squirrel/Adopt";
import Collection from "./routes/squirrel/collection/Collection";

import DaliyMission from "./routes/games/DailyMission";
import GameList from "./routes/games/GameList";
import OX from "./routes/games/OX";
import Answer from "./routes/games/Answer";
import FallingAcorn from "./routes/games/FallingAcorn";

import SensitiveCheck from "./routes/SensitiveCheck";
import Setting from "./routes/Setting";

import UnderConstruction from "./routes/UnderConstruction";

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sensitiveGroup = localStorage.getItem("sensitiveGroup");
    const restrictedPaths = ["/", "/activityRecommed"];

    // 현재 경로가 restrictedPaths 중 하나인 경우에만 민감군 정보를 확인
    if (restrictedPaths.includes(location.pathname) && !sensitiveGroup) {
      navigate("/sensitivecheck");
    }
  }, [navigate, location.pathname]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/sensitivecheck" element={<SensitiveCheck />} />
          <Route path="/" element={<Home />} />

          <Route path="/aqi-details" element={<AQIDetails />} />
          <Route path="/weatherinfo" element={<WeatherInfo />} />
          <Route path="/favorites" element={<Favorites />} />

          <Route path="/notice" element={<Notice />} />
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/localpride" element={<LocalPride />} />

          <Route path="/activityRecommed" element={<ActivityRecommed />} /> */}
          <Route path="/outfitdaily" element={<OutfitDaily />} />
          <Route path="/outfitbytemp" element={<OutfitByTemp />} />

          {/* <Route path="/squirrel" element={<Squirrel />} />
          <Route path="/adopt" element={<Adopt />} />
          <Route path="/collection" element={<Collection />} />

          <Route path="/daily" element={<DaliyMission />} />
          <Route path="/games" element={<GameList />} />
          <Route path="/games/ox" element={<OX />} />
          <Route path="/games/answer" element={<Answer />} />
          <Route path="/games/fallingacorn" element={<FallingAcorn />} />*/}

          <Route path="/setting" element={<Setting />} />

          <Route path="/underConstruction" element={<UnderConstruction />} />
        </Route>
      </Routes>
    </div>
  );
};
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;

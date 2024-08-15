import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./routes/Home";
import Notice from "./routes/info/Notice";
import ActivityRecommed from "./routes/recommend/ActivityRecommed";
import OutfitByTemp from "./routes/recommend/OutfitByTemp";
import Favorites from "./routes/Favorites";
import LocalPride from "./routes/LocalPride";
import SensitiveCheck from "./routes/SensitiveCheck";
import Setting from "./routes/info/Setting";
import Contact from "./routes/info/Contact";
import OutfitDaily from "./routes/recommend/OutfitDaily";
import Collection from "./routes/Collection";
import DaliyMission from "./routes/DailyMission";
import GameList from "./routes/games/GameList";
import AQIDetails from "./routes/AQIDetails";
import WeatherInfo from "./routes/WeatherInfo";
import OX from "./routes/games/OX";
import FallingAcorn from "./routes/games/FallingAcorn";
import Answer from "./routes/games/Answer";

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/notice" element={<Notice />} />
            <Route path="/activityRecommed" element={<ActivityRecommed />} />
            <Route path="/outfitbytemp" element={<OutfitByTemp />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/localpride" element={<LocalPride />} />
            <Route path="/sensitivecheck" element={<SensitiveCheck />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/outfitdaily" element={<OutfitDaily />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/daily" element={<DaliyMission />}></Route>
            <Route path="/games" element={<GameList />}></Route>
            <Route path="/aqi-details" element={<AQIDetails />}></Route>
            <Route path="/daily" element={<DaliyMission />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/weatherinfo" element={<WeatherInfo />} />
            <Route path="/games/ox" element={<OX />} />
            <Route path="/games/fallingacorn" element={<FallingAcorn />} />
            <Route path="/games/answer" element={<Answer />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./routes/Home";
import Notice from "./routes/Notice";
import ActivityRecommed from "./routes/ActivityRecommed";
import OutfitByTemp from "./routes/OutfitByTemp";
import Favorites from "./routes/Favorites";
import LocalPride from "./routes/LocalPride";
import SensitiveCheck from "./routes/SensitiveCheck";
import Setting from "./routes/Setting";
import Contact from "./routes/Contact";

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
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Home from "./routes/Home";
import Notice from "./routes/Notice";
import ActivityRecommed from "./routes/ActivityRecommed";
import OutfitByTemp from "./routes/OutfitByTemp";

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
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;

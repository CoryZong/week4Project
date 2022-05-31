import React from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../components/Footer";

export const Homepage = () => {
  const navigate = useNavigate();
  return (
    <div className="homepage">
      <h1>家用快篩地圖</h1>
      <div>
        <button onClick={() => navigate("/searchlist")}>開始使用</button>
        <button onClick={() => navigate("/storepage")}>儲存機構</button>
      </div>
      <Footer />
    </div>
  );
};

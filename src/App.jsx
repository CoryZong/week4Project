import React from "react";
import "../css/main.css";
import { Homepage } from "./pages/Homepage";
import { SearchList } from "./pages/SearchList";
import { StorePage } from "./pages/StorePage";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/searchlist" element={<SearchList />}></Route>
        <Route path="/storepage" element={<StorePage />}></Route>
      </Routes>
    </div>
  );
}

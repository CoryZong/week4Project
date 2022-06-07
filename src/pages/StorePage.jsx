import React, { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GetLocalStorage, ClearLocalStorage } from "../reduxSlice";

export const StorePage = () => {
  const navigate = useNavigate();
  const [storeData, setStoreData] = useState([]);
  const dispatch = useDispatch();

  let mylist = dispatch(GetLocalStorage()).payload;
  useEffect(() => setStoreData(JSON.parse(mylist)), []);

  function resetStoreData() {
    dispatch(ClearLocalStorage());
    setStoreData([]);
  }

  return (
    <div className="storepage">
      <h1>儲存機構</h1>
      <div className="store-list">
        {storeData
          ? storeData.map((e, index) => {
              return (
                <div key={index} id={index} className="list">
                  <div className="list-top">
                    <p className="pharmacy-name">{e.醫事機構名稱}</p>
                    <p className="pharmacy-phone">({e.醫事機構電話})</p>
                    <div className="sieve-count">{e.快篩試劑截至目前結餘存貨數量}</div>
                  </div>
                  <p className="pharmacy-address">
                    {e.醫事機構地址}
                    <a href={`http://maps.google.com/?q=${e.醫事機構名稱}`}>
                      <img src="../../icons/icon.png" />
                    </a>{" "}
                  </p>
                  <p className="sieve-label">{e.廠牌項目}</p>
                  <p className="ps">{e.備註}</p>
                </div>
              );
            })
          : ""}
      </div>
      <div className="store-button">
        <button onClick={resetStoreData}>清除紀錄</button>
        <button onClick={() => navigate("/")}>回到首頁</button>
      </div>
      <Footer />
    </div>
  );
};

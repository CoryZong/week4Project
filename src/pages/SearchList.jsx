import CityAPI from "../../city.json";
import React, { useEffect, useRef, useState } from "react";
import { StoreComponent } from "../components/StoreComponent";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { StoreLocalStorage, GetLocalStorage } from "../reduxSlice";

export const SearchList = () => {
  const cityName = CityAPI;

  const navigate = useNavigate();

  const [updataTime, setUpdateTime] = useState("");
  const [list, setList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [input, setInput] = useState("");
  const [longTouchHandler, setLongTouchHandler] = useState(false);
  const [load, setLoad] = useState(10);

  const citySelecter = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    const dater = new Date();
    let year = dater.getFullYear(),
      month = dater.getMonth() + 1,
      date = dater.getDate(),
      hour = dater.getHours(),
      min = dater.getMinutes(),
      second = dater.getSeconds();

    setUpdateTime(`${year}/${month}/${date} ${hour}:${min}:${second}`);
  }, []);

  //csv to json
  function csvJSON(csv) {
    var lines = csv.split("\r\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }
    return JSON.stringify(result); //JSON
  }

  //get api function
  function getData() {
    Axios.post("https://data.nhi.gov.tw/Datasets/Download.ashx?rid=A21030000I-D03001-001&l=https://data.nhi.gov.tw/resource/Nhi_Fst/Fstdata.csv")
      .then((res) => {
        let CSVdata = res.data;
        let JSONdata = JSON.parse(csvJSON(CSVdata));
        let EngData = changeObjEng(JSONdata);
        setList(EngData);
        setDisplayList(EngData);
      })
      .catch((error) => console.log(error));
  }

  //change Obj to Eng
  function changeObjEng(objArr) {
    let newObjArr = [];
    objArr.forEach((e) => {
      let newObj = {
        agencyNumber: e.醫事機構代碼,
        agencyName: e.醫事機構名稱,
        agencyPhone: e.醫事機構電話,
        agencyAddress: e.醫事機構地址,
        sieveCount: e.快篩試劑截至目前結餘存貨數量,
        sieveName: e.廠牌項目,
        ps: e.備註,
      };
      newObjArr.push(newObj);
    });
    return newObjArr;
  }

  //Select element to filter data
  function selectData() {
    let result = list.filter((e) => {
      if (!e.agencyName) {
        return false;
      } else {
        return e.agencyName.includes(citySelecter.current.value);
      }
    });
    setStoreList(result);
    setDisplayList(result);
  }

  //Search button onclick
  function SerchData() {
    let result = storeList.filter((e) => {
      return e.sieveName.includes(input) || e.agencyName.includes(input) || e.agencyAddress.includes(input) || e.agencyNumber.includes(input);
    });
    result.length == 0 ? alert("查無相關資料，請重新輸入關鍵字!") : setDisplayList(result);
  }

  //長按兩秒
  let lonhTouchFlag;

  const [resultStore, setResultStore] = useState({});
  function touchStart(div) {
    lonhTouchFlag = setInterval(() => {
      let result = displayList.filter((e, index) => {
        return index == div.target.parentElement.id;
      });
      setResultStore(result[0]);
      setLongTouchHandler(true);
    }, 2000);
    //2.5s後自動clearInterval，去除彈出視窗重複彈出問題
    setTimeout(() => clearInterval(lonhTouchFlag), 2500);
  }
  //點擊結束clearInterval
  function touchEnd() {
    clearInterval(lonhTouchFlag);
  }

  //Yes => store list
  function YesHandler() {
    dispatch(StoreLocalStorage({ store: resultStore }));
    setLongTouchHandler((pre) => !pre);
  }

  //NO => 關閉視窗
  function NoHandler() {
    setLongTouchHandler((pre) => !pre);
  }

  //下拉加載更多
  function scrollHandler(e) {
    if (e.target.clientHeight + e.target.scrollTop >= e.target.scrollHeight) {
      setLoad((pre) => pre + 10);
    }
  }
  return (
    <div className="searchlist">
      <div className="search-nav">
        <select ref={citySelecter} name="city" onChange={selectData}>
          <option value={""}>縣市</option>
          {cityName.map((e, index) => {
            return <option key={index}>{e.city}</option>;
          })}
        </select>
        <input type="text" placeholder="搜尋藥局/機構..." onChange={(e) => setInput(e.target.value)} />
        <button onClick={SerchData}>搜尋</button>
      </div>
      <div className="update-time">{`最後更新時間:${updataTime}`}</div>
      <div className="list-area" onScroll={(e) => scrollHandler(e)}>
        {/*彈出視窗*/}
        <StoreComponent trigger={longTouchHandler} yes={YesHandler} no={NoHandler} />
        {displayList.map((e, index) => {
          return (
            index < load && (
              <div key={index} id={index} className="list" onTouchStart={(e) => touchStart(e)} onTouchEnd={touchEnd}>
                <div className="list-top">
                  <p className="pharmacy-name">{e.agencyName}</p>
                  <p className="pharmacy-phone">({e.agencyPhone})</p>
                  <div className="sieve-count">{e.sieveCount}</div>
                </div>
                <p className="pharmacy-address">
                  {e.agencyAddress}
                  <a href={`http://maps.google.com/?q=${e.agencyName}`}>
                    <img src="../../icons/icon.png" />
                  </a>
                </p>
                <p className="sieve-label">{e.sieveName}</p>
                <p className="ps">{e.ps}</p>
              </div>
            )
          );
        })}
      </div>
      <button className="goto-btn" onClick={() => navigate("/storepage")}>
        <img src="../../icons/store.png" alt="" />
      </button>
    </div>
  );
};

import CityAPI from "../../city.json";
import React, { useEffect, useRef, useState } from "react";
import { StoreComponent } from "../components/StoreComponent";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { StoreLocalStorage, GetLocalStorage, ClearLocalStorage } from "../reduxSlice";

export const SearchList = () => {
  const navigate = useNavigate();

  const [updataTime, setUpdateTime] = useState("");
  const [list, setList] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [displayList, setDisplayList] = useState([]);
  const [input, setInput] = useState("");
  const [longTouchHandler, setLongTouchHandler] = useState(false);
  const [load, setLoad] = useState(10);

  const citySelecter = useRef();
  const cityName = CityAPI;

  const dispatch = useDispatch();

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
        var JSONdata = JSON.parse(csvJSON(CSVdata));
        setList(JSONdata);
        setDisplayList(JSONdata);
      })
      .catch((error) => console.log(error));
  }

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

  //Select element to filter data
  function selectData() {
    let result = list.filter((e) => {
      if (!e.醫事機構名稱) {
        return false;
      } else {
        return e.醫事機構名稱.includes(citySelecter.current.value);
      }
    });
    setStoreList(result);
    setDisplayList(result);
  }

  //Search button onclick
  function SerchData() {
    let result = storeList.filter((e) => {
      return e.廠牌項目.includes(input) || e.醫事機構名稱.includes(input) || e.醫事機構地址.includes(input) || e.醫事機構代碼.includes(input);
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

  //下拉加載更多
  function scrollHandler(e) {
    if (e.target.clientHeight + e.target.scrollTop >= e.target.scrollHeight) {
      setLoad((pre) => pre + 10);
    }
  }

  //localstorage
  let mylist = dispatch(GetLocalStorage());

  //判別重複資料
  function repeatHandler(data) {
    let flag = false;
    let paeseData = JSON.parse(localStorage.getItem("list"));
    paeseData.forEach((e) => {
      if (e.醫事機構代碼 == data.醫事機構代碼) flag = true;
    });
    return flag;
  }

  //Yes => store list
  function YesHandler() {
    dispatch(StoreLocalStorage({ store: resultStore, repeat: repeatHandler }));
    setLongTouchHandler((pre) => !pre);
  }

  //NO => 關閉視窗
  function NoHandler() {
    setLongTouchHandler((pre) => !pre);
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
                  <p className="pharmacy-name">{e.醫事機構名稱}</p>
                  <p className="pharmacy-phone">({e.醫事機構電話})</p>
                  <div className="sieve-count">{e.快篩試劑截至目前結餘存貨數量}</div>
                </div>
                <p className="pharmacy-address">
                  {e.醫事機構地址}
                  <a href={`http://maps.google.com/?q=${e.醫事機構名稱}`}>
                    <img src="../../icons/icon.png" />
                  </a>
                </p>
                <p className="sieve-label">{e.廠牌項目}</p>
                <p className="ps">{e.備註}</p>
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

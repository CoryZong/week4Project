import { createSlice } from "@reduxjs/toolkit";

//判別重複資料
function repeatHandler(data) {
  let flag = false;
  let paeseData = JSON.parse(localStorage.getItem("list"));
  paeseData.forEach((e) => {
    if (e.agencyNumber == data.agencyNumber) flag = true;
  });
  return flag;
}

export const reduxSlice = createSlice({
  name: "test",
  initialState: {},
  reducers: {
    StoreLocalStorage: (state, actions) => {
      if (localStorage.getItem("list") == null) {
        localStorage.setItem("list", JSON.stringify([actions.payload.store]));
      } else if (repeatHandler(actions.payload.store)) {
        alert("該資料已在儲存機構內!");
      } else {
        let myListArray = JSON.parse(localStorage.getItem("list")); //變回object
        if (myListArray.length > 9) {
          myListArray.shift();
          myListArray.push(actions.payload.store);
        } else {
          myListArray.push(actions.payload.store);
        }
        localStorage.setItem("list", JSON.stringify(myListArray));
      }
    },
    GetLocalStorage: (state, actions) => {
      actions.payload = localStorage.getItem("list");
    },
    ClearLocalStorage: () => {
      localStorage.clear();
    },
  },
});

export const { StoreLocalStorage, GetLocalStorage, ClearLocalStorage } = reduxSlice.actions;
export default reduxSlice.reducer;

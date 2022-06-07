import { createSlice } from "@reduxjs/toolkit";

export const reduxSlice = createSlice({
  name: "test",
  initialState: {
    value: 0,
  },
  reducers: {
    StoreLocalStorage: (state, actions) => {
      let fun = actions.payload.repeat;
      if (localStorage.getItem("list") == null) {
        localStorage.setItem("list", JSON.stringify([actions.payload.store]));
      } else if (fun(actions.payload.store)) {
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

import React from "react";

export const StoreComponent = ({ trigger, yes, no }) => {
  return trigger ? (
    <div className="storecomponent">
      <div className="store-view">
        <h2>是否儲存此筆店家?</h2>
        <div>
          <button onClick={yes}>是</button>
          <button onClick={no}>否</button>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

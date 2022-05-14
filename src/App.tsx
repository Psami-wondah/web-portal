import React from "react";

function App() {
  const wave = () => {};
  return (
    <div className=" text-center space-y-5 mt-5">
      <div className=" font-bold text-3xl">Hey there</div>
      <div className="text-xl">Hey I'm Samuel and I just got into web3</div>
      <button
        onClick={wave}
        className="px-5 py-2 bg-blue-500 rounded text-white"
      >
        Wave at me
      </button>
    </div>
  );
}

export default App;

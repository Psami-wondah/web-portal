import React from "react";
import { TailSpin } from "react-loader-spinner";

const Spin = ({ color }: { color: string }) => {
  return (
    <div>
      <TailSpin width={20} height={20} color={color} />
    </div>
  );
};

export default Spin;

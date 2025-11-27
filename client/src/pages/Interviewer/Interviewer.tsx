
import { Outlet } from "react-router-dom";

const Interviewer = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Outlet />
    </div>
  );
};

export default Interviewer;

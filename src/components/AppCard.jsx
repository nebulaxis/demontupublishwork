import { useNavigate } from "react-router-dom";

const AppCard = ({ app }) => {
  const navigate = useNavigate();

  return (
    <div
      className="w-40 h-40 bg-blue-600 text-white flex justify-center items-center rounded-lg cursor-pointer"
      onClick={() => navigate(`/view-app/${app.bundle_id}`)}
    >
      {app.name}
    </div>
  );
};

export default AppCard;

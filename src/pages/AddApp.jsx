import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddApp = () => {
  const [appName, setAppName] = useState("");
  const [bundleId, setBundleId] = useState("");
  const navigate = useNavigate();

  const handleCreateApp = async () => {
    const newApp = { appName, bundleId };
    const res = await axios.post("https://ntuproject.24livehost.com:6003/create-app", newApp);
    if (res.data.success) {
      navigate(`/questions-form/${res.data.appId}`); // Redirect to add questions
    }
  };

  return (
    <div className="add-app-container">
      <h2>Create New App</h2>
      <input type="text" placeholder="App Name" value={appName} onChange={(e) => setAppName(e.target.value)} />
      <input type="text" placeholder="Bundle Identifier" value={bundleId} onChange={(e) => setBundleId(e.target.value)} />
      <button onClick={handleCreateApp}>Create</button>
    </div>
  );
};

export default AddApp;

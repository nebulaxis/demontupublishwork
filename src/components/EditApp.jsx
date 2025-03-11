import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const EditApp = () => {
  const { bundleId } = useParams();
  const navigate = useNavigate();
  const [appName, setAppName] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch app details
  useEffect(() => {
    axios.get(`http://localhost:6002/get-app/${bundleId}`)
      .then((res) => {
        if (res.data.success) {
          setAppName(res.data.appName);
          setQuestions(res.data.questions);
        } else {
          setMessage({ text: res.data.message, type: "error" });
        }
      })
      .catch(() => setMessage({ text: "Error fetching app details", type: "error" }));
  }, [bundleId]);

  // Handle submit (save changes)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:6002/edit-app/${bundleId}`, { appName, questions });
      if (res.data.success) {
        setMessage({ text: "App updated successfully!", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage({ text: res.data.message, type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Failed to update app", type: "error" });
    }
  };

  // Add a new question
  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion("");
    }
  };

  // Delete a question
  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <Navbar />
        <h2>Edit App</h2>

        {/* Success or Error Message */}
        {message.text && (
          <div className={`message ${message.type === "success" ? "success-msg" : "error-msg"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="app-form">
          <label>App Name:</label>
          <input type="text" value={appName} onChange={(e) => setAppName(e.target.value)} required />

          <h3>Questions</h3>
          <ul>
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <li key={index} className="question-item">
                  {question} 
                  <button type="button" onClick={() => handleDeleteQuestion(index)}>Delete</button>
                </li>
              ))
            ) : (
              <p>No questions available.</p>
            )}
          </ul>

          <input type="text" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Add a new question" />
          <button type="button" onClick={handleAddQuestion}>Add Question</button>

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditApp;

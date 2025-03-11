import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/viewapp.css';

const ViewApp = () => {
  const { appId } = useParams();
  const [app, setApp] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [bundleId, setBundleId] = useState("");
  const [allApps, setAllApps] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [updatedAnswer, setUpdatedAnswer] = useState("");
  const [loading, setLoading] = useState({ fetchApp: false, fetchAll: false });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bundleId) {
      fetchAppDetailsByBundleId();
    } else if (appId) {
      fetchAppDetailsByAppId();
    }
  }, [bundleId, appId]);

  const fetchAppDetailsByAppId = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetchApp: true }));
      setError(null);
      const res = await axios.get(`http://localhost:6002/get-app/${appId}`);
      setApp(res.data.app || {});
      setQuestions(res.data.questions || []);
    } catch (err) {
      setError("Error fetching app details.");
    } finally {
      setLoading((prev) => ({ ...prev, fetchApp: false }));
    }
  };

  const fetchAllApps = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetchAll: true }));
      setError(null);
      const res = await axios.get("http://localhost:6002/get-apps");
      setAllApps(res.data.apps || []);
    } catch (err) {
      setError("Error fetching all apps.");
    } finally {
      setLoading((prev) => ({ ...prev, fetchAll: false }));
    }
  };

  const fetchAppDetailsByBundleId = async () => {
    try {
      setLoading((prev) => ({ ...prev, fetchApp: true }));
      setError(null);
      const res = await axios.get(`http://localhost:6002/get-app/bundle/${bundleId}`);
      setApp(res.data.app || {});
      setQuestions(res.data.questions || []);
    } catch (err) {
      setError("Error fetching app details.");
    } finally {
      setLoading((prev) => ({ ...prev, fetchApp: false }));
    }
  };

  const addQuestion = async () => {
    if (!newQuestion.trim()) return;
    try {
      const res = await axios.post("http://localhost:6002/add-question", { 
        text: newQuestion, 
        answer: newAnswer, 
        appId: app.id 
      });
      setQuestions([...questions, { id: res.data.questionId, text: newQuestion, answer: newAnswer }]);
      setNewQuestion("");
      setNewAnswer("");
      setSuccessMessage("Question added successfully!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      setError("Error adding question.");
    }
  };

  const updateQuestion = async (id) => {
    try {
      await axios.put(`http://localhost:6002/update-question/${id}`, { 
        text: updatedText, 
        answer: updatedAnswer 
      });
      setQuestions(questions.map(q => q.id === id ? { ...q, text: updatedText, answer: updatedAnswer } : q));
      setEditMode(null);
    } catch (err) {
      setError("Error updating question.");
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await axios.delete(`http://localhost:6002/delete-question/${id}`);
      setQuestions(questions.filter(q => q.id !== id));
    } catch (err) {
      setError("Error deleting question.");
    }
  };


  return (
    <div className="app-details-container">
      <h2 className="title">App Details</h2>
      {loading.fetchApp ? <p className="loading-text">Loading...</p> : (
        app ? (
          <div className="app-details">
            <p><strong>Name:</strong> {app.appName || "N/A"}</p>
            <p><strong>Bundle ID:</strong> {app.bundleId || "N/A"}</p>
          </div>
        ) : <p>No app details available.</p> )}

      <h2 className="title">Manage Questions</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="question-inputs">
        <input 
          type="text" 
          className="input-field" 
          placeholder="New Question" 
          value={newQuestion} 
          onChange={(e) => setNewQuestion(e.target.value)} 
        />
        <input 
          type="text" 
          className="input-field" 
          placeholder="Answer (Optional)" 
          value={newAnswer} 
          onChange={(e) => setNewAnswer(e.target.value)} 
        />
        <button className="button add-button" onClick={addQuestion}>Add Question</button>
      </div>

      <ul className="question-list">
        {questions.map((q) => (
          <li key={q.id} className="question-item">
            {editMode === q.id ? (
              <>
                <input 
                  type="text" 
                  className="input-field" 
                  value={updatedText} 
                  onChange={(e) => setUpdatedText(e.target.value)} 
                />
                <input 
                  type="text" 
                  className="input-field" 
                  value={updatedAnswer} 
                  onChange={(e) => setUpdatedAnswer(e.target.value)} 
                />
                <button className="button save-button" onClick={() => updateQuestion(q.id)}> Save</button>
                <button className="button cancel-button" onClick={() => setEditMode(null)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Question:</strong> {q.text}</p>
                <p><strong>Answer:</strong> {q.answer || "No answer provided"}</p>
                <button className="button edit-button" onClick={() => { setEditMode(q.id); setUpdatedText(q.text); setUpdatedAnswer(q.answer || ""); }}>Edit</button>
                <button className="button delete-button" onClick={() => deleteQuestion(q.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h2 className="title">Search App by Bundle ID</h2>
      <div className="search-container">
        <input 
          type="text" 
          className="input-field" 
          placeholder="Enter Bundle ID" 
          value={bundleId} 
          onChange={(e) => setBundleId(e.target.value)} 
        />
        <button className="button search-button" onClick={fetchAppDetailsByBundleId}>Search</button>
      </div>
      {loading.fetchApp && <p className="loading-text">Loading...</p>}
      
      {/* Display App Name */}
      {app && (
        <div className="app-name-display">
          <h3>App Name: {app.appName}</h3>
        </div>
      )}

      {/* Display Questions */}
      <ul className="question-list">
        {questions.map((q) => (
          <li key={q.id} className="question-item">
            <p><strong>Question:</strong> {q.text}</p>
            <p><strong>Answer:</strong> {q.answer || "No answer provided"}</p>
            {/* Add buttons for editing and deleting questions if needed */}
            <button onClick={() => setEditMode(q.id)}>Edit</button>
            <button onClick={() => deleteQuestion(q.id)}>Delete</button>
          </li>
        ))}
      </ul>


      <h2 className="title">All Apps</h2>
      <button className="button get-all-button" onClick={fetchAllApps} disabled={loading.fetchAll}>Get All Data</button>
      {loading.fetchAll && <p className="loading-text">Loading...</p>}
      <ul className="app-list">
        {allApps.map((app) => (
          <li key={app.id} className="app-item">
            <p><strong>Name:</strong> {app.appName}</p>
            <p><strong>Bundle ID:</strong> {app.bundleId}</p>
          </li>
        ))}
      </ul>



      <button className="button back-button" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );
};

export default ViewApp;
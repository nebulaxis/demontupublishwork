import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AddQuestions = () => {
  const { id } = useParams(); // Get app ID from URL params
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [updatedText, setUpdatedText] = useState("");
  const [updatedAnswer, setUpdatedAnswer] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  // Function to fetch questions for the specific app
  const fetchQuestions = () => {
    axios
      .get(`http://localhost:6002/get-questions-by-bundle/${id}`)
      .then((res) => {
        if (res.data.success) {
          setQuestions(res.data.questions);
        } else {
          setMessage({ text: res.data.message, type: "error" });
        }
      })
      .catch(() => setMessage({ text: "Error fetching questions", type: "error" }));
  };

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, [id]);

  // Function to handle adding a new question
  const handleAddQuestion = (e) => {
    e.preventDefault(); // Prevent form submission behavior

    if (newQuestion.trim() === "") {
      setMessage({ text: "Question cannot be empty!", type: "error" });
      return;
    }

    // Send the new question to the server
    axios
      .post("http://localhost:6002/add-question", { appId: id, text: newQuestion, answer: newAnswer })
      .then((res) => {
        if (res.data.success) {
          setMessage({ text: "Question added successfully!", type: "success" });
          setNewQuestion("");
          setNewAnswer("");
          fetchQuestions(); // Refresh the list of questions
        } else {
          setMessage({ text: res.data.message, type: "error" });
        }
      })
      .catch(() => setMessage({ text: "Error adding question", type: "error" }));
  };

  // Function to handle updating a question
  const handleUpdateQuestion = (id) => {
    axios
      .put(`http://localhost:6002/update-question/${id}`, { text: updatedText, answer: updatedAnswer })
      .then((res) => {
        if (res.data.success) {
          setMessage({ text: "Question updated successfully!", type: "success" });
          setQuestions(questions.map(q => (q.id === id ? { ...q, text: updatedText, answer: updatedAnswer } : q)));
          setEditMode(null);
          setUpdatedText("");
          setUpdatedAnswer("");
        } else {
          setMessage({ text: res.data.message, type: "error" });
        }
      })
      .catch(() => setMessage({ text: "Error updating question", type: "error" }));
  };

  // Function to handle deleting a question
  const handleDeleteQuestion = (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    axios
      .delete(`http://localhost:6002/delete-question/${id}`)
      .then((res) => {
        if (res.data.success) {
          setMessage({ text: "Question deleted successfully!", type: "success" });
          setQuestions(questions.filter(q => q.id !== id));
        } else {
          setMessage({ text: res.data.message, type: "error" });
        }
      })
      .catch(() => setMessage({ text: "Error deleting question", type: "error" }));
  };

  return (
    <div className="add-questions-container">
      <Sidebar />
      <div className="add-questions-main">
        <Navbar />

        <h2>Manage Questions</h2>

        {/* Display success or error message */}
        {message.text && (
          <div className={`message ${message.type === "success" ? "success-msg" : "error-msg"}`}>
            {message.text}
          </div>
        )}

        {/* Existing Questions */}
        <ul className="question-list">
          {questions.length > 0 ? (
            questions.map((q) => (
              <li key={q.id}>
                {editMode === q.id ? (
                  <>
                    <input
                      type="text"
                      value={updatedText}
                      onChange={(e) => setUpdatedText(e.target.value)}
                      placeholder="Update question"
                      className="input-field"
                    />
                    <input
                      type="text"
                      value={updatedAnswer}
                      onChange={(e) => setUpdatedAnswer(e.target.value)}
                      placeholder="Update answer (Optional)"
                      className="input-field"
                    />
                    <button onClick={() => handleUpdateQuestion(q.id)} className="update-btn">Save</button>
                    <button onClick={() => setEditMode(null)} className="cancel-btn">Cancel</button>
                  </>
                ) : (
                  <>
                    <p>{q.text}</p>
                    <p>{q.answer || "No answer provided"}</p>
                    <button onClick={() => { setEditMode(q.id); setUpdatedText(q.text); setUpdatedAnswer(q.answer || ""); }} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="delete-btn">Delete</button>
                  </>
                )}
              </li>
            ))
          ) : (
            <p>No questions found.</p>
          )}
        </ul>

        {/* Add New Question Form */}
        <form onSubmit={handleAddQuestion}>
          <div className="add-question-form">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter new question"
              className="input-field"
            />
            <input
              type="text"
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Enter answer (Optional)"
              className="input-field"
            />
            <button type="submit" className="add-btn">Add Question</button>
          </div>
        </form>

        <button onClick={() => navigate(-1)} className="back-btn">Back</button>
      </div>
    </div>
  );
};

export default AddQuestions;
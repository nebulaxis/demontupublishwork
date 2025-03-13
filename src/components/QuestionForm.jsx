import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuestionsForm = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => setQuestions([...questions, ""]); // Add new question field

  const handleChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const saveQuestions = async () => {
    await axios.post(`https://ntuproject.24livehost.com:6003/save-questions/${appId}`, { questions });
    navigate("/dashboard");
  };

  return (
    <div>
      <h2>Add Questions</h2>
      {questions.map((q, index) => (
        <input key={index} value={q} onChange={(e) => handleChange(index, e.target.value)} placeholder={`Question ${index + 1}`} />
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={saveQuestions}>Save & Continue</button>
    </div>
  );
};

export default QuestionsForm;

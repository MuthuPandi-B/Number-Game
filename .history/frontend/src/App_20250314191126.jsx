import React, { useState} from "react";
const App = () => {
  const [name,setName]=useState("");
  const [score,setScore]=useState(0);
  const [attempts,setAttempts]=useState(0);
  const [time,setTime]=useState("");
  const [bestScores,setBestScores]=useState([]);
  const [newScore,setNewScore]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState("");
  const [loading,setLoading]=useState(false);
  const [gameOver,setGameOver]=useState(false);
  const [gameStarted,setGameStarted]=useState(false);
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default App;
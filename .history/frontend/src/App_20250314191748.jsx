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
  const [seconds,setSeconds]=useState(0);
  const [secretNumber,setSecretNumber]=useState(generateUniqueNumber());
  const generateUniqueNumber=()=>{
    let digits=new Set();
    while(digits.size<4){
      digits.add(Math.floor(Math.random()*10));
    }
    return Array.from(digits).join("");
  }
  const startGame=()=>{
    
    setGameStarted(true);
    setGameOver(false);
    setSecretNumber(generateUniqueNumber());
    setScore(0);
    setAttempts(0);
    setTime("");
    setSeconds(0);
  }

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default App;
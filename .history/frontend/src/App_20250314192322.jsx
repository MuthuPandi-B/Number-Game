import React, { useState} from "react";
const App = () => {
  const [playerName,setPlayerName]=useState("");
  const [gameStarted,setGameStarted]=useState(false);
  const [gameOver,setGameOver]=useState(false);
  const [guess,setGuess]=useState("");
  const [feedback,setFeedback]=useState("");
  const [bestScores,setBestScores]=useState(null);
  const[startTime,setStartTime]=useState(0);
  const [attempts,setAttempts]=useState(0);
  const [secretNumber,setSecretNumber]=useState(generateUniqueNumber());
  const generateUniqueNumber=()=>{
    let digits=new Set();
    while(digits.size<4){
      digits.add(Math.floor(Math.random()*10));
    }
    return Array.from(digits).join("");
  }
  const startGame=()=>{
    if(playerName===""){
      setError("Please enter your name");
      return;
    }
    setGameStarted(true);
    setStartTime(Date.now());
    setA
  }

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default App;
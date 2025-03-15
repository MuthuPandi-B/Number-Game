import React, { useState} from "react";
const App = () => {
  const [playerName,setPlayerName]=useState("");
  const [gameStarted,setGameStarted]=useState(false);
  const [gameOver,setGameOver]=useState(false);
  const [guess,setGuess]=useState("");
  const [feedback,setFeedback]=useState("");
  const [bestScores,setBestScores]=useState([]);
  const[startT]
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
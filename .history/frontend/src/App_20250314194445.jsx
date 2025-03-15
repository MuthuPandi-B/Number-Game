import React, { useState} from "react";
const App = () => {
  const [playerName,setPlayerName]=useState("");
  const [gameStarted,setGameStarted]=useState(false);
  const [gameOver,setGameOver]=useState(false);
  const [guess,setGuess]=useState("");
  const [feedback,setFeedback]=useState("");
  const [bestScore,setBestScore]=useState(null);
  const[startTime,setStartTime]=useState(null);
  const [attempts,setAttempts]=useState(0);
  const [secretNumber,setSecretNumber]=useState("");
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
    setAttempts(0);
    setSecretNumber(generateUniqueNumber());
    setFeedback("");

  }
  const checkGuess=()=>{
    if(guess.length !==4 || new Set (guess).size !==4){
      setFeedback("Enter a valid 4-digit")
    }
  }
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default App;
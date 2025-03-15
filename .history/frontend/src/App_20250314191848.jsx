import React, { useState} from "react";
const App = () => {
  
  const [secretNumber,setSecretNumber]=useState(generateUniqueNumber());
  const generateUniqueNumber=()=>{
    let digits=new Set();
    while(digits.size<4){
      digits.add(Math.floor(Math.random()*10));
    }
    return Array.from(digits).join("");
  }
  const startGame=()=>{
    if(name===""){
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
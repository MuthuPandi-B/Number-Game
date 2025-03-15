import axios from "axios";
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

  useEffect(() => {
    fetchBestScore();
  }, []);

  const fetchBestScore = async () => {
    try {
      const response = await axios.get("http://localhost:5000/best-score");
      setBestScore(response.data);
    } catch (error) {
      console.error("Error fetching best score", error);
    }
  };
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
      setFeedback("Enter a valid 4-digit number with unique digits.");
      return;
    }
    setAttempts(attempts +1);
    let plus =0,
    minus =0;
    for(let i=0;i<4;i++){
      if(guess[i]===secretNumber[i]){
        plus++;
      }else if(secretNumber.includes(guess[i])){
        minus++;
      }
    }
    if(plus===4){
      const timeTaken =( Date.now() -startTime)/1000;
      saveScore(playerName,attempts+1,timeTaken);
      setFeedback(`Congratulations! You guessed it in ${attempts+1} tries.`);
      setGameStarted(false);

  }else{
    setFeedback(`+${plus}-${minus}`);
  }
};
const saveScore =async (name ,attempts,time) => {
  try {
    await axios.post("http://localhost:5000/save-score",{name,attempts,time});
    fetchBestScore();

    
  } catch (error) {
    console.error("Error saving score",error);
    
  }
  
}
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
    <div className="bg-white p-6 rounded-lg  shadow-md text-center">
      <h1 className="text-2xl font-bold mb-4">Guess the Number</h1>
      {!gameStarted ?(
        <>
        </>
      ):(<>
      \</>)}
    </div>
    </div>
  );
};

export default App;
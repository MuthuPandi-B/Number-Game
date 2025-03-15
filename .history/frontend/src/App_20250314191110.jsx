import React, { useState} from "react";
const App = () => {
  const [name,setName]=useState("");
  const [score,setScore]=useState(0);
  const [attempts,setAttempts]=useState(0);
  const [time,setTime]=useState("");
  const [bestScores,setBestScores]=useState([]);
  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default App;
import {useEffect, useState} from "react";

export default function NumberGame() {
  // TODO - Make this a database request
  const DIFFICULTY = 3;

  const [gameState, setGameState] = useState("start");
  const [currentQuestion, setCurrentQuestion] = useState("x + y");
  const [questionNo, setQuestionNo] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const INITIAL_STATE = [
    {answer: "0", color: "lightblue"},
    {answer: "0", color: "lightblue"},
    {answer: "0", color: "lightblue"},
    {answer: "0", color: "lightblue"},
  ];
  const [boxList, setBoxList] = useState([...INITIAL_STATE]);

  const [confirmBoxText, setConfirmBoxText] = useState("CONFIRM");
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [selectedBox, setSelectedBox] = useState(5);
  const [correctBox, setCorrectBox] = useState(0);

  const TOTAL_QUESTIONS = 10;

  useEffect(() => {
  }, [answerRevealed]);

  function gameLoop() {
    if (questionNo < TOTAL_QUESTIONS) {
      getQuestion()
    } else {
      loadEndScreen()
    }
  }

  function getQuestion() {
    const MODIFIER_LIST = [" + ", " - ", " x "];

    let n1 = getRndInteger(1, 10);
    let n2 = getRndInteger(1, 10);
    let modifier = getRndInteger(0, DIFFICULTY - 1);

    setCurrentQuestion((n1 + MODIFIER_LIST[modifier] + n2));

    function calculateAnswer(x, y) {
      switch (modifier) {
        case 0:
          return x + y;
        case 1:
          return x - y;
        case 2:
          return x * y;
        default:
          return 0;
      }
    }

    let answer = calculateAnswer(n1, n2);

    let newVal = getRndInteger(0, 3)
    console.log("correct box should now be " + newVal)
    setCorrectBox(newVal);
    console.log("correct box is now " + correctBox)

    let tempBoxList = [...INITIAL_STATE];
    for (let box = 0; box < boxList.length; box++) {
      console.log("correct answer: " + answer)
      console.log("correct box: " + newVal)
      let newNumber = answer;

      if (box !== newVal) {
        let offBy = getRndInteger(1, 10);
        console.log("not the correct answer, adjusting")
        console.log("off by: " + offBy)
        newNumber = getRndInteger(0, 1) ? answer + offBy : answer - offBy;
      }

      tempBoxList[box] = updateBox(box, newNumber, "lightblue");
    }

    console.log("box list about to be set")
    console.log(tempBoxList)
    setBoxList(tempBoxList);
    setSelectedBox(5);
  }

  /// OnClick Functions

  function selectAnswer(inputNo) {
    if (answerRevealed) {
      return;
    }
    console.log("correct box: " + correctBox)

    setSelectedBox(inputNo);

    setConfirmBoxText("CONFIRM");
    const newBoxList = [...boxList];
    newBoxList[inputNo] = {...newBoxList[inputNo], color: "yellow"}
    setBoxList(newBoxList)
  }

  function confirmBoxSelect() {
    if (selectedBox === 5) {
      return;
    }

    if (answerRevealed) {
      console.log("-------MOVING TO NEXT QUESTION-------")
      document.getElementById("confirmBox").hidden = true;

      setConfirmBoxText("CONFIRM");
      setAnswerRevealed(false);

      setQuestionNo(questionNo + 1);

      console.log("final boxList state");
      console.log(boxList)
      gameLoop();
    } else {
      let tempBoxList = resetSelection();

      tempBoxList[correctBox] = updateBox(correctBox, null, "green")
      if (selectedBox === correctBox) {
        setScore(score + 1);
      } else {
        tempBoxList[selectedBox] = updateBox(selectedBox, null, "red")
      }
      setBoxList(tempBoxList);

      setConfirmBoxText("NEXT QUESTION");
      if (questionNo === TOTAL_QUESTIONS) {
        setConfirmBoxText("FINISH");
      }

      setAnswerRevealed(true);
    }
  }

  /// Change Game State

  function startGame() {
    setGameState("running")
    gameLoop();
  }

  function loadEndScreen() {
    setGameState("end")
    setQuestionNo(1);
  }

  function restartGame() {
    setGameState("start")

    if (score > highScore) {
      setHighScore(score);
    }
    setScore(0);
  }

  /// Helper Functions

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function resetSelection() {
    let tempBoxList = [];
    for (let box = 0; box < boxList.length; box++) {
      tempBoxList.push(updateBox(box, null, "lightblue"));
    }
    return tempBoxList;
  }

  function updateBox(boxNo, newAnswer = null, newColor = null) {
    let tempBox = {...boxList[boxNo]};

    if (newAnswer && tempBox.answer !== newAnswer) {
      console.log("updating box " + boxNo + " answer from " + tempBox.answer + " to " + newAnswer);
      tempBox.answer = newAnswer;
    }
    if (newColor && tempBox.color !== newColor) {
      // console.log("updating box " + boxNo + " color from " + tempBox.color + " to " + newColor);
      tempBox.color = newColor;
    }

    console.log("returning box")
    console.log(tempBox)
    return tempBox;
  }

  function selectAnswerOne() {
    selectAnswer(0)
  }

  function selectAnswerTwo() {
    selectAnswer(1)
  }

  function selectAnswerThree() {
    selectAnswer(2)
  }

  function selectAnswerFour() {
    selectAnswer(3)
  }

  return (
    <div className="Game">
      <main className="gameContainer">
        {gameState === "start" &&
          <main className="gameBox" id="startScreen">
            <section>
              <p>MATHS!</p>
            </section>

            <section>
              <p id="highScore">HIGH SCORE: {highScore}</p>
            </section>

            <section>
              <button onClick={startGame}>START GAME</button>
            </section>
          </main>
        }

        {gameState === "running" &&
          <main className="gameBox" id="runningGame">
            <section>
              <p id="questionNo">Question {questionNo}</p>
            </section>

            <section>
              <p id="question">{currentQuestion}</p>
            </section>

            <section className="answerSection">
              <button className="answerBox" style={{backgroundColor: boxList[0].color}} onClick={selectAnswerOne}>{boxList[0].answer}</button>
              <button className="answerBox" style={{backgroundColor: boxList[1].color}} onClick={selectAnswerTwo}>{boxList[1].answer}</button>
              <button className="answerBox" style={{backgroundColor: boxList[2].color}} onClick={selectAnswerThree}>{boxList[2].answer}</button>
              <button className="answerBox" style={{backgroundColor: boxList[3].color}} onClick={selectAnswerFour}>{boxList[3].answer}</button>
            </section>

            <section>
              <button id="confirmBox" onClick={confirmBoxSelect}>{confirmBoxText}</button>
            </section>
          </main>
        }

        {gameState === "end" &&
          <main className="gameBox" id="endScreen">
            <section>
              <p>GAME OVER</p>
            </section>

            <section>
              <p id="score">{score}</p>
            </section>

            <section>
              <button onClick={() => {
                restartGame()
              }}>TRY AGAIN?
              </button>
            </section>
          </main>
        }
      </main>
    </div>
  )
}

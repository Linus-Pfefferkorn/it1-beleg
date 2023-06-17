const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
//console.log(choices);
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];

const FileLength = 10;
const FileWidth = 4;

let questions = [];
//let Question = Array.from(Array(this.FileLength), () => new Array(this.FileWidth + 1));
let Question = Array.from(Array(10), () => new Array(4)); //Array mit 10 Arrays mit jeweils 4 Elementen


fetch("../JSON/Allgemeines.json")
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < FileLength; i++) {

            //Aufgaben
            Question[i][0] = data.Allgemeines[i].a;
           // console.log("Aufgabe: " + Question[i]);

            for (let j = 1; j <= FileWidth; j++) {

                //Lösungen
                Question[i][j] = data.Allgemeines[i].l[j - 1];
            //console.log("Antwort: " + Question[i][j]);
            }
        }
        startGame();
    });


    taskRandomizer = (questions) => {
        const shuffledQuestions = questions.slice();
        const rightAnswers = [];
      
        // Mische die Aufgaben zufällig
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }
      
        // Mische die Antworten zu jeder Aufgabe zufällig und erstelle das resultierende Array von Objekten
        const result = shuffledQuestions.map((question) => {
          const answers = question.slice(1); // Kopiere die Antworten, um das ursprüngliche Array nicht zu ändern
          const rightAnswer = answers[0]; // Die richtige Antwort ist immer an erster Stelle
          for (let j = answers.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [answers[j], answers[k]] = [answers[k], answers[j]]; // Mische die Antworten zufällig
          }
          const shuffledQuestion = {
            question: question[0],
            choices: answers,
            rightAnswer: rightAnswer
          };
          rightAnswers.push(rightAnswer); // Füge die richtige Antwort zum rightAnswers-Array hinzu
          return shuffledQuestion;
        });
      
        return { shuffledQuestions: result, rightAnswers };
      };
  



/*
    taskRandomizer = (questions) => {

    const shuffledQuestions = questions.slice();
    const rightAnswers = [];

    // Mische die Aufgaben zufällig
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }

    // Mische die Antworten zu jeder Aufgabe zufällig
    for (let i = 0; i < shuffledQuestions.length; i++) {
        const answers = shuffledQuestions[i].slice(1); // Kopiere die Antworten, um das ursprüngliche Array nicht zu ändern
        const rightAnswer = answers[0]; // Die richtige Antwort ist immer an der ersten Stelle
        for (let j = answers.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [answers[j], answers[k]] = [answers[k], answers[j]]; // Mische die Antworten zufällig
        }
        shuffledQuestions[i] = [shuffledQuestions[i][0], ...answers]; // Setze die Antworten in die aufgemischte Frage ein
        rightAnswers.push(rightAnswer); // Füge die richtige Antwort zum rightAnswers-Array hinzu
    }
    //console.log(shuffledQuestions);
    //console.log(rightAnswers);
    return {shuffledQuestions, rightAnswers};
}

*/



//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    taskRandomizer(Question);
    
    rightAnswers = taskRandomizer(Question).rightAnswers;
    shuffledQuestions = taskRandomizer(Question).shuffledQuestions;
    console.log(shuffledQuestions);
    console.log(rightAnswers);
    
    availableQuesions = [...shuffledQuestions];
    console.log(availableQuesions);

    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('../HTML/end.html');
    }
    
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = 0;
    currentQuestion = availableQuesions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choices'][number - 1];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        console.log(choice.innerText, currentQuestion.rightAnswer);

        const classToApply =
            choice.innerText == currentQuestion.rightAnswer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};

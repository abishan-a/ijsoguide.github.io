import {db} from '/centralAuthenticationSystem.js';
import { doc, getDoc , getDocs, collection} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"

let loginfinished = false;
let uid;
let by;
let admin;
window.addEventListener("loginOK", (e)=>{
  let {userId, time, birthYear, executive} = e.detail;
  uid = userId;
  by = birthYear;
  admin = executive;
  loginfinished = true;
  loadProblems();
  if (admin){
    document.getElementById('dashboardBtn').style.display = "block";
  }
})

let correctSolution;
let season = "2026";
let problemId = "";

let problemList = {};
let promises = [];

function loadProblems(){
  let now = Date.now();
  getDocs(collection(db, "otherData", "potw", "2026"))
  .then((allProblems)=> {
    allProblems.forEach((document) => {
      let problemData = document.data();
      if (problemData.startTime < now && problemData.endTime > now){
        let alreadyDone = false;
        let currentBase = 1;
        const pr = getDoc(doc(db, "otherData", "potw", "2026", document.id, "submissions", uid))
        .then((data)=>{
          if (data.exists()){
            let d = data.data();
            currentBase = d.currentPoints;
            if (d.solved) alreadyDone = true;
          }
          else alreadyDone = false;
        })
        .then(()=>{
          problemData.id = document.id;
          problemData.currentBase = currentBase;
          problemData.alreadyDone = alreadyDone;
          problemData.problemText = problemData.problemText//.replaceAll("\\\\", "\\");
          problemList[problemData.id] = problemData;
        })
        .catch(error => {
          alert("An error occured: " + error.code + "; " + error.message);
        });
        promises.push(pr);
      }
    })
    return Promise.all(promises);
  })
  .then(() => {
    updateProblemList(problemList);
  })
  .catch(error => {
    alert("An error occured: " + error.code + "; " + error.message);
  });
}

function addProblemToDisplay(problemData){
  let problemDiv = document.createElement('div');
  problemDiv.classList.add('problem');
  let title = document.createElement('h3');
  title.innerHTML = problemData.problemTitle;
  let text = document.createElement('p');
  text.innerHTML = problemData.problemText;
  text.classList.add('problemText')
  let authors = document.createElement('p');
  authors.innerHTML = "Problem by: " + problemData.problemAuthors;
  authors.classList.add('additionalText')
  let correctCount = document.createElement('p');
  correctCount.innerHTML = "Total correct submissions: " + problemData.correctSubmissions;
  correctCount.classList.add('additionalText');

  problemDiv.appendChild(title);
  problemDiv.appendChild(text);
  problemDiv.appendChild(authors);
  problemDiv.appendChild(correctCount);

  if (problemData.alreadyDone){
    let points = document.createElement('p');
    points.innerText = "Problem solved. Points: " + problemData.currentBase;
    points.classList.add('additionalText2');
    problemDiv.appendChild(points);

    problemDiv.classList.add('solvedProblem')
  } else{
    let currentBase = document.createElement('p');
    currentBase.innerHTML = "Your current point base: " + problemData.currentBase;
    currentBase.classList.add('additionalText')

    let userInputDiv = document.createElement('div');
    userInputDiv.classList.add('userInput')
    let input = document.createElement('input');
    input.type = 'number';
    input.id = "userSolution-" + problemData.id;
    let button = document.createElement('button');
    button.id = "solutionSubmitBtn-" + problemData.id;
    button.innerHTML = "Submit solution"
    userInputDiv.appendChild(input);
    userInputDiv.appendChild(button);

    problemDiv.appendChild(currentBase);
    problemDiv.appendChild(userInputDiv);

    button.addEventListener('click', ()=>{
      button.disabled = true;
      let userSolution = input.value;
      let solCorr;
      if ((1 - problemData.solutionMargin) * problemData.correctSolution <= userSolution && userSolution <= (1 + problemData.solutionMargin) * problemData.correctSolution){
        solCorr = true;
        problemData.alreadyDone = true;
        problemData.correctSubmissions += 1;
        updateProblemList(problemList);
      } else{
        solCorr = false;
        problemData.currentBase = newScoreCalculator(problemData.problemType, problemData.currentBase);
        updateProblemList(problemList);
      }
      let eventToDispatch = new CustomEvent("solutionSubmitted", {
        detail: {
          season: season,
          problemId: problemData.id,
          correct: solCorr,
          corrSubs: problemData.correctSubmissions,
          problemType: problemData.problemType,
          triggerElement: button,
          submissionTime: Date.now(),
          birthYear: by,
        }
      });
      window.dispatchEvent(eventToDispatch);
    })
  }
  
  document.getElementById('allProblemsSection').appendChild(problemDiv);
  renderMathInElement(document.getElementById('allProblemsSection'));
}

function updateProblemList(problemList){
  document.getElementById('allProblemsSection').innerHTML = "";
  if (Object.keys(problemList).length == 0){
    let t = document.createElement('p');
    t.id = "noProblemsText"
    t.innerHTML = "No problems available at this moment."
    document.getElementById('allProblemsSection').appendChild(t);
  } else{
    Object.keys(problemList).forEach(key => {
      let problemData = problemList[key];
      addProblemToDisplay(problemData);
    })
  }
}

export function newScoreCalculator(problemType, currentPoints){
  let newPoints;
  if (problemType == "standard"){
    if (currentPoints == 1) newPoints = 0.7;
    else if (currentPoints == 0.5) newPoints = 0.5;
    else newPoints = currentPoints - 0.1;
  } else{
    if (currentPoints == 1) newPoints = 0.5;
    else newPoints = 0;
  }
  return newPoints;
}

function quit(){
  window.history.back();
}

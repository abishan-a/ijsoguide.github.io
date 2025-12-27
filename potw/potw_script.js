import {db} from '/centralAuthenticationSystem.js';
import { doc, getDoc , getDocs, collection} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"

let loginfinished = false;
let uid;
window.addEventListener("loginOK", (e)=>{
  let {userId, time} = e.detail;
  uid = userId;
  loginfinished = true;
  loadProblems();
})

let correctSolution;
let season = "2026";
let problemId = "";

let problemList = [];
let promises = [];

function loadProblems(){
  let now = Date.now();
  getDocs(collection(db, "otherData", "potw", "2026"))
  .then((allProblems)=> {
    allProblems.forEach((document) => {
      let problemData = document.data();
      if (problemData.startTime < now && problemData.endTime > now){
        let alreadyDone = false;
        const pr = getDoc(doc(db, "userData", uid, "potw", document.id))
        .then((data)=> {
          if(data.exists()){
              let d = data.data()
              if (d.points > 0) alreadyDone = true;
          } else{
            alreadyDone = false;
          }
        })
        .then(() => {
          if (!alreadyDone){
            problemData.id = document.id;
            problemList.push(problemData);
          }
        })
        .catch(error => {
          console.log("Error getting document:", error);
        });
        promises.push(pr);
      }
    })
    return Promise.all(promises);
  })
  .then(() => {
    for (let i = 0; i < problemList.length; i++){
      let problemDiv = document.createElement('div');
      problemDiv.classList.add('problem');
      let title = document.createElement('h3');
      title.innerHTML = problemList[i].problemTitle;
      let text = document.createElement('p');
      text.innerHTML = problemList[i].problemText;
      let authors = document.createElement('p');
      authors.innerHTML = problemList[i].problemAuthors;

      let userInputDiv = document.createElement('div');
      let input = document.createElement('input');
      input.type = 'number';
      input.id = "userSolution-" + problemList[i].id;
      let button = document.createElement('button');
      button.id = "solutionSubmitBtn-" + problemList[i].id;
      button.innerHTML = "Submit solution"
      userInputDiv.appendChild(input);
      userInputDiv.appendChild(button);

      problemDiv.appendChild(title);
      problemDiv.appendChild(text);
      problemDiv.appendChild(authors);
      problemDiv.appendChild(userInputDiv);
      document.querySelector('main').appendChild(problemDiv);

      button.addEventListener('click', ()=>{
        let userSolution = input.value;
        let solCorr;
        if (0.95 * problemList[i].correctSolution <= userSolution && userSolution <= 1.05 * problemList[i].correctSolution){
          solCorr = true;
        } else{
          solCorr = false;
        }
        let eventToDispatch = new CustomEvent("solutionSubmitted", {
          detail: {
            season: season,
            problemId: problemList[i].id,
            correct: solCorr,
          }
        });
        window.dispatchEvent(eventToDispatch);
      })
    }
  })
  .catch(error => {
    console.log("Error getting document:", error);
  });
}

function quit(){
  window.history.back();
}


import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"

let uid;

onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        uid = user.uid;
        console.log(uid)

        let systemData = [];

        /* Loading data about the testing system */
        let filePath = "../Practice%20Questions/systemData.json";
        (async (filePath)=>{
          try {
            let module = await fetch(filePath)
            let loadedData = await module.json();
            systemData = loadedData;
          } catch (err) {
            console.error("Failed to load system data:", err);
          }
        })(filePath)
        .then(()=>{
          loadProgress(systemData);
        })
        .catch(()=>{
          console.log('error');
        })



        /*getDocs(collection(db, "userData", uid, "testHistory"))
        .then((querySnapshot1)=> {
            querySnapshot1.forEach((doc) => {
                let finishTime = new Date(doc.data().finishTime);
                if (!historyTitles.includes(doc.data().title)){
                    testNo++;
                    historyTitles.push(doc.data().title);
                }

                let li = document.createElement('li');
                let span = document.createElement('span');
                span.classList.add('topic-title');
                span.innerHTML = doc.data().title + ", " + finishTime.toLocaleDateString();
                li.appendChild(span);
                let progressContainer = document.createElement('div');
                progressContainer.classList.add('progress-container');
                let progressBar = document.createElement('div');
                progressBar.classList.add('progress-bar');
                progressBar.style.setProperty('--progress', doc.data().percent + "%");
                let progressText = document.createElement('span');
                progressText.classList.add('progress-text');
                progressText.innerHTML = Math.round(doc.data().percent) + "%";
                progressContainer.appendChild(progressBar);
                progressContainer.appendChild(progressText);
                li.appendChild(progressContainer);
                if(doc.data().subject == "physics") document.getElementById('testHistoryListPhysics').appendChild(li);
                else if (doc.data().subject == "chemistry") document.getElementById('testHistoryListChemistry').appendChild(li);
                else if(doc.data().subject == "biology") document.getElementById('testHistoryListBiology').appendChild(li);
            });
            document.getElementById('overallProgressBar').style.width = testNo/totalTests * 100 + "%";
            document.getElementById('overallProgressText').innerHTML = Math.round(testNo/totalTests * 100) + "%";
            document.getElementById('overallProgressBar').style.setProperty('--progress', testNo/totalTests * 100 + "%")
        })
        .catch(error => {
            console.log("Error getting document:", error);
        });*/
        // ...
    } else {
        // User is signed out
        // ...
        window.location.href = "sign-in.html"
        console.log('signed out')
    }
  });

  function loadProgress(systemData){
    let testNo = 0;
    let stats = [];
    stats["physics"] = [];
    stats["chemistry"] = [];
    stats["biology"] = [];
    getDocs(collection(db, "userData", uid, "completedProblems"))
    .then((documents)=>{
      documents.forEach(document => {
        let documentData = document.data()
        if (documentData){
          testNo += 1;
          let problem_id = documentData.problem_id;
          let test_id = documentData.test_id;
          let subject = documentData.subject;
          let level = documentData.level;
          let test_title = documentData.test_title;

          if (!stats[subject][test_id]) {
              stats[subject][test_id] = [];
              stats[subject][test_id]["test_title"] = test_title;
          }
          if(stats[subject][test_id][level]) stats[subject][test_id][level] += 1;
          else stats[subject][test_id][level] = 1;

          let subjectCode;
          if (subject == "physics") subjectCode = 1;
          else if (subject = "chemistry") subjectCode = 2;
          else if (subject = "biology") subjectCode = 3;

          //stats[subject][test_id][(level + "Total")] = systemData["problemCount"][subjectCode][test_id][level];
        }
        
      })
      // Stats object built
      console.log(stats)
      console.log(systemData);

      /* Building progress bars" */

      let totalProblems = 0;
      for (let subjectCode in systemData["problemCount"]){
        for (let unitKey in systemData["problemCount"][subjectCode]){

          let subject;
          if (subjectCode == "1") subject = "physics";
          else if (subjectCode == "2") subject = "chemistry";
          else if (subjectCode == "3") subject = "biology";

          let li = document.createElement('li');
          let unitTitle = document.createElement('p');
          unitTitle.innerHTML = unitKey;
          li.appendChild(unitTitle);
          li.id = unitKey;
          if(subject == "physics") li = document.getElementById('testHistoryListPhysics').appendChild(li);
          else if (subject == "chemistry") li = document.getElementById('testHistoryListChemistry').appendChild(li);
          else if(subject == "biology") li = document.getElementById('testHistoryListBiology').appendChild(li);

          for (let topicKey in systemData["problemCount"][subjectCode][unitKey]){
            let topicData = systemData["problemCount"][subjectCode][unitKey][topicKey];
            totalProblems += topicData["easy"] + topicData["medium"] + topicData["hard"];

            let scoreEasy = 0;
            let scoreMedium = 0;
            let scoreHard = 0;
            if (stats[subject][topicKey]){
              if(stats[subject][topicKey]["easy"]) scoreEasy = stats[subject][topicKey]["easy"];
              if(stats[subject][topicKey]["medium"]) scoreMedium = stats[subject][topicKey]["medium"];
              if(stats[subject][topicKey]["hard"]) scoreHard = stats[subject][topicKey]["hard"];
            }

            let topicDiv = document.createElement('div');
            let p = document.createElement('p');
            p.innerHTML = topicData["title"];
            let barsDiv = document.createElement('div')
            let barsDivID = topicKey + "_bars"
            barsDiv.id = topicKey + "_bars"
            barsDiv.classList.add("barsDiv");
            topicDiv.appendChild(p);
            topicDiv.appendChild(barsDiv);
            topicDiv.classList.add('topicDiv');

            p.addEventListener('click', ()=>{
              barsDiv.classList.toggle('barsActive');
            })
            unitTitle.addEventListener('click', ()=>{
              topicDiv.classList.toggle('topicActive');
            })

            li.appendChild(topicDiv);
            if(topicData["easy"] > 0) buildProgressBar(topicData["title"], "easy", calculateScore(scoreEasy, topicData["easy"]), subject, barsDivID);
            if(topicData["medium"] > 0) buildProgressBar(topicData["title"], "medium", calculateScore(scoreMedium, topicData["medium"]), subject, barsDivID);
            if(topicData["hard"] > 0) buildProgressBar(topicData["title"], "hard", calculateScore(scoreHard, topicData["hard"]), subject, barsDivID);
          }
        }
      }

      document.getElementById('overallProgressText').innerHTML = Math.round(testNo/totalProblems * 100) + "%";
      document.getElementById('overallProgressBar').style.setProperty('--progress', testNo/totalProblems * 100 + "%")
    })
  }

  function buildProgressBar(title, level, score, subject, parent_id){
    let div = document.createElement('div');
    let span = document.createElement('span');
    span.classList.add('topic-title');
    span.innerHTML = title + " - " + level;
    div.appendChild(span);
    let progressContainer = document.createElement('div');
    progressContainer.classList.add('progress-container');
    let progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    progressBar.style.setProperty('--progress', score + "%");
    let progressText = document.createElement('span');
    progressText.classList.add('progress-text');
    progressText.innerHTML = Math.round(score) + "%";
    progressContainer.appendChild(progressBar);
    progressContainer.appendChild(progressText);
    div.appendChild(progressContainer);

    /*if(subject == "physics") document.getElementById('testHistoryListPhysics').appendChild(li);
    else if (subject == "chemistry") document.getElementById('testHistoryListChemistry').appendChild(li);
    else if(subject == "biology") document.getElementById('testHistoryListBiology').appendChild(li);*/

    document.getElementById(parent_id).appendChild(div);
  }

  function calculateScore(score, total){
    if (total == 0 || score == 0) return 0;
    return (score / total) * 100;
  }

  document.getElementById('signoutButton').addEventListener('click', (e)=>{
    e.preventDefault();
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        console.log(error)
      });
      
})

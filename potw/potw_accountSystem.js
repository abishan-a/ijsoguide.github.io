// Import the functions you need from the SDKs you need
import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , increment, updateDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"
import { newScoreCalculator } from './potw_script.js';

let uid;
let birthYear;

onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      console.log(uid)
      getDoc(doc(db, "users", uid))
      .then((data)=> {
        if(data.exists()){
          let d = data.data();
          birthYear = d.birthYear;
          let executive;
          if (d.executive) executive = true;
          else executive = false;
          let loginOK = new CustomEvent("loginOK", {
            detail: {
              time: Date.now(),
              userId: uid,
              birthYear: birthYear,
              executive: executive,
            }
          });
          window.dispatchEvent(loginOK);
        }
      })


      window.addEventListener('solutionSubmitted', (e)=>{
        let {season, problemId, correct, corrSubs, problemType, triggerElement, submissionTime, birthYear} = e.detail;
        let finalPoints;
        
        getDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid))
        .then((data)=> {
            if(data.exists()){
                let d = data.data();
                let currentPoints = d.currentPoints;
                if (correct){
                  finalPoints = currentPoints;
                  setDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid), {
                    solved: true,
                    currentPoints: currentPoints,
                    time: submissionTime,
                    birthYear: birthYear,
                  })
                  .then(()=>{
                    updateDoc(doc(db, "otherData", "potw", season, problemId), {
                      correctSubmissions: increment(1),
                    })
                  })
                } else{
                  finalPoints = newScoreCalculator(problemType, currentPoints);
                  updateDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid), {
                    currentPoints: finalPoints,
                  })
                }
            } else{
                if (correct){
                  finalPoints = 1;
                  setDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid), {
                    solved: true,
                    currentPoints: 1,
                    time: submissionTime,
                    birthYear: birthYear,
                  })
                  .then(()=>{
                    updateDoc(doc(db, "otherData", "potw", season, problemId), {
                      correctSubmissions: increment(1),
                    })
                  })
                  .catch((error) => {
                    alert("An error occured: " + error.code + "; " + error.message);
                    // ..
                  });
                } else{
                  finalPoints = newScoreCalculator(problemType, 1);
                  setDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid), {
                    solved: false,
                    currentPoints: finalPoints,
                    time: submissionTime,
                    birthYear: birthYear,
                  })
                  .catch((error) => {
                    alert("An error occured: " + error.code + "; " + error.message);
                  });
                }
            }
        })
        .then(()=>{
          if (correct){
            setDoc(doc(db, "userData", uid, "potw", problemId), {
              solved: true,
              points: finalPoints,
              time: submissionTime,
              birthYear: birthYear,
            })
            .then(()=>{
              alert('Problem solved correctly! Points: ' + finalPoints);
            })
            .catch((error) => {
              alert("An error occured: " + error.code + "; " + error.message);
              // ..
            });
          } else{
            alert('Incorrect solution! New point base: ' + finalPoints);
            triggerElement.disabled = false;
          }
        })
        .catch(error => {
            console.log("Error getting document:", error);
        });
  
      })
    } else {
      // User is signed out
      // ...
      window.location.href = "/Account/sign-in.html?redirect=" + window.location.href;
    }
  });
// Import the functions you need from the SDKs you need
import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"


let uid;

onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
      console.log(uid)

      let loginOK = new CustomEvent("loginOK", {
        detail: {
          time: Date.now(),
          userId: uid,
        }
      });
      window.dispatchEvent(loginOK);

      window.addEventListener('solutionSubmitted', (e)=>{
        let {season, problemId, correct} = e.detail;
        console.log(correct);

        let finalPoints;
        
        getDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid))
        .then((data)=> {
            if(data.exists()){
                let d = data.data();
                let currentPoints = d.currentPoints;
                if (correct){
                  finalPoints = currentPoints;
                  updateDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid), {
                    solved: true,
                  })
                } else{
                  let newPoints = currentPoints - 0.2;
                  updateDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid), {
                    currentPoints: newPoints,
                  })
                }
            } else{
                if (correct){
                  finalPoints = 1;
                  setDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid), {
                    solved: true,
                    currentPoints: 1,
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode)
                    console.log(errorMessage)
                    // ..
                  });
                } else{
                  setDoc(doc(db, "otherData", "potw", season, problemId, "submissions", uid), {
                    solved: false,
                    currentPoints: 0.9,
                  })
                  .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode)
                    console.log(errorMessage)
                    // ..
                  });
                }
            }
        })
        .then(()=>{
          if (correct){
          setDoc(doc(db, "userData", uid, "potw", problemId), {
            solved: true,
            points: finalPoints,
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            // ..
          });
        }
        })
        .catch(error => {
            console.log("Error getting document:", error);
        });
  
      })
    } else {
      // User is signed out
      // ...
      window.location.href = "../../../Account/sign-in.html?redirect=" + window.location.href
      window.addEventListener("testStarted", (e)=>{
        window.location.href = "../../../Account/sign-in.html?redirect=" + window.location.href
      })
    }
  });
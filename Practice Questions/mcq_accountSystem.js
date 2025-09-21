// Import the functions you need from the SDKs you need
import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"


let uid;

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      uid = user.uid;
      console.log(uid)
      

      /* On correctly solved problem */

      window.addEventListener('problemSolved', (e)=>{
        let {time, test_id, subject, test_title, problem_id, level} = e.detail;
        
        console.log('transfered data: ')
        console.log(problem_id);
        console.log(test_id);
        console.log(test_title);
        console.log(subject);
        console.log(time);
        console.log(level);
        console.log('---')
        
        let docTitle = problem_id;

        getDoc(doc(db, "userData", uid, "completedProblems", docTitle))
        .then((document)=>{
          if (document.exists()){
              console.log('alreadyDone')
          }
          else{
              console.log('not already done')
              setDoc(doc(db, "userData", uid, "completedProblems", docTitle), {
                finishTime: time,
                test_id: test_id,
                subject: subject,
                test_title: test_title,
                problem_id: problem_id,
                level: level
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
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
          // ..
        });

      })


      // Test finished
      window.addEventListener('testFinished', (e)=>{
        let {time, test_id, subject, test_title, full_count, full_correct_count} = e.detail;
        
        console.log('transfered data: ')
        console.log(test_id);
        console.log(test_title);
        console.log(subject);
        console.log(time);
        console.log('---')
        
        let docTitle = test_id;

        let easyResult = 0;
        if (full_count["easy"] != 0) easyResult = Math.round((full_correct_count["easy"] / full_count["easy"]) * 100);
        let mediumResult = 0;
        if (full_count["medium"] != 0) mediumResult = Math.round((full_correct_count["medium"] / full_count["medium"]) * 100);
        let hardResult = 0;
        if (full_count["hard"] != 0) hardResult = Math.round((full_correct_count["hard"] / full_count["hard"]) * 100);

        getDoc(doc(db, "userData", uid, "completedTests", "allTests", subject, docTitle))
          .then((document)=>{
            if (!document.exists() ){
                setDoc(doc(db, "userData", uid, "completedTests", "allTests", subject, docTitle), {
                  easyPercent: easyResult,
                  mediumPercent: mediumResult,
                  hardPercent: hardResult,
                  easyTime: time,
                  mediumTime: time,
                  hardTime: time
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log(errorCode)
                  console.log(errorMessage)
                  // ..
                });
            }
            else{
              if (easyResult > document.data().easyPercent){
                updateDoc(doc(db, "userData", uid, "completedTests", "allTests", subject, docTitle), {
                  easyPercent: easyResult,
                  easyTime: time
                })
              }
              if (mediumResult > document.data().mediumPercent){
                updateDoc(doc(db, "userData", uid, "completedTests", "allTests", subject, docTitle), {
                  mediumPercent: mediumResult,
                  mediumTime: time
                })
              }
              if (hardResult > document.data().hardPercent){
                updateDoc(doc(db, "userData", uid, "completedTests", "allTests", subject, docTitle), {
                  hardPercent: hardResult,
                  hardTime: time
                })
              }
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            // ..
          });



      })
    } else {
      // User is signed out
      // ...
      window.location.href = "../../../Account/sign-in.html?redirect=" + window.location.href
    }
  });
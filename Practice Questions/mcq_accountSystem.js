// Import the functions you need from the SDKs you need
import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"


let uid;

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      uid = user.uid;
      console.log(uid)
      

      /* On completed test */

      window.addEventListener('problemSolved', (e)=>{
        let {time, test_id, subject, test_title, problem_id} = e.detail;
        /*console.log('transfered data: ')
        console.log(problem_id);
        console.log(test_id);
        console.log(test_title);
        console.log(subject);
        console.log(time);
        console.log('---')*/
        
        let docTitle = problem_id;

        /*async function checkProblemStatus{

        }

        setDoc(doc(db, "userData", uid, "completedProblems", docTitle), {
            finishTime: time,
            test_id: test_id,
            subject: subject,
            test_title: test_title,
            problem_id: problem_id,
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            // ..
        })*/
      }, {once: true})
    } else {
      // User is signed out
      // ...
      window.location.href = "../../../Account/sign-in.html?redirect=" + window.location.href
    }
  });
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

      window.addEventListener('testCompleted', (e)=>{
        /*const { score, testTitle, time, subject} = e.detail;
        console.log('transfered data: ')
        console.log(score);
        console.log(testTitle)
        console.log(time)
        let docTitle = "test_" + time;
        setDoc(doc(db, "userData", uid, "testHistory", docTitle), {
            finishTime: time,
            percent: score,
            title: testTitle,
            subject: subject
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
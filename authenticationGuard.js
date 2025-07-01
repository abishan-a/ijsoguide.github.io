import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"


function guard(){
    document.querySelector('body').style.display = "none";
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            console.log('success')
            document.querySelector('body').style.display = "block";
        } else {
            window.location.href = "/Account/sign-in.html?redirect=" + window.location.href
        }
    });
}

function blurContent(){
    onAuthStateChanged(auth, (user) => {
        if (user) {
            
        } else {
            let blur = document.createElement('div');
            blur.classList.add('blur-overlay');
            blur.id = "blurOverlay";
            let p = document.createElement('p');
            p.innerHTML = "Please sign in or sign up for a free account to read the full article!";
            blur.appendChild(p);
            let a = document.createElement('a');
            a.href = "/Account/sign-in.html?redirect=" + window.location.href;
            a.classList.add('btn');
            a.innerHTML = "Sign in";
            blur.appendChild(a);

            document.querySelector('.container').appendChild(blur);
        }
    });
}

export {guard};
export {blurContent};

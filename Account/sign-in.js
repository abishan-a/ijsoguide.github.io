import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged , signInWithEmailAndPassword ,signOut, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"

let passwordField = document.getElementById('password');
let emailField = document.getElementById('email');

let uid;
let justLogged = false;

let redirectLink = window.location.href.split('redirect=')[1];
if (redirectLink) document.getElementById('signUpRedirectionLink').href = "/Account/sign-up.html?redirect=" + window.location.href.split('redirect=')[1];

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      uid = user.uid;
      console.log(uid)
      if(passwordField.value){
        console.log('in if')
        setDoc(doc(db, "users", uid), {
            password: passwordField.value,
          }, {merge: true})
          .then(()=>{
            console.log("success")
            if (redirectLink) window.location.href = redirectLink;
            else window.location.href = "settings.html?theIFlink"
          })
          .catch(()=>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
          })
      } else{
        console.log('in else')
        if (redirectLink) window.location.href = redirectLink;
        else window.location.href = "settings.html?theELSElink"
      }
      // ...
    } else {
      // User is signed out
      // ...
      console.log('signed out')
    }
  });

document.getElementById('signinForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    let email = emailField.value;
    let password = passwordField.value;
    if (password) console.log('checkT')
    else console.log('checkF')
    console.log(email)
    console.log(password)
    if (signInDetailsValid(email, password)){
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //window.location.href = "settings.html?what"
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            // ...
            uid = user.uid;
            console.log("uid: " + uid);
            justLogged = true;
            console.log('justLogged: ' + justLogged)
        })
        .then(()=>{
          let redirect = window.location.href.split('redirect=')[1];
          console.log(redirect)
          if (redirect != null){
            window.location.href = redirect;
          } /*else{
            window.location.href = "settings.html"
          }*/
          
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            if (errorCode == "auth/invalid-credential"){
                alert('Incorrect username or password. Please try again.')
            }
        });

    //}
  }
})

document.getElementById('passwordResetLink').addEventListener('click', (e)=>{
  e.preventDefault();
  let passResetEmail = emailField.value;
  sendPasswordResetEmail(auth, passResetEmail)
  .then(() => {
    alert('Password reset link sent.')
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode);
    if(errorCode == "auth/missing-email") alert("Please enter your email first.")
    console.log(errorMessage);
    // ..
  });
})

function signInDetailsValid(email, password){
    return true;
}

let passwordVisibilityToggle = document.getElementById('togglePasswordVisibility');
passwordVisibilityToggle.addEventListener('click', ()=>{
  if (passwordVisibilityToggle.classList.contains('fa-eye')){
    passwordVisibilityToggle.classList.remove('fa-eye');
    passwordVisibilityToggle.classList.add('fa-eye-slash');
    passwordField.type = "text";
  } else{
    passwordVisibilityToggle.classList.add('fa-eye');
    passwordVisibilityToggle.classList.remove('fa-eye-slash')
    passwordField.type = "password";
  }
})


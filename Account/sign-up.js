import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"

let nameField = document.getElementById('firstName');
let surnameField = document.getElementById('lastName');
let countryField = document.getElementById('country');
let emailField = document.getElementById('email');
let passwordField = document.getElementById('password');
let passwordRepeatField = document.getElementById('passwordRepeat');
let birthYearField = document.getElementById('birthYear');
let emailUpdates = document.getElementById('emailUpdates');

let uid;

emailUpdates.addEventListener('change', ()=>{
  console.log(emailUpdates.checked);
})

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      uid = user.uid;
      console.log(uid)
      let userName;
      getDoc(doc(db, "users", uid))
      .then((data)=> {
          if(data.exists()){
              userName = data.data().name;
              document.getElementById('alreadyLoggedInMessage').innerHTML = "It seems like you are already signed in as " + userName + ". You can see your account settings " + "<a href=" + "./settings.html" + ">here</a>";
          }
      })
      .catch(error => {
          console.log("Error getting document:", error);
      });
      //window.location.href = "settings.html"
      // ...
    } else {
      // User is signed out
      // ...
      console.log('signed out')
    }
  });

document.getElementById('signupForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    let name = nameField.value;
    let surname = surnameField.value;
    let country = countryField.value;
    let email = emailField.value;
    let password = passwordField.value;
    let passwordRepeat = passwordRepeatField.value;
    let birthYear = birthYearField.value;
    let updates = emailUpdates.checked;
    console.log(updates)
    console.log(email)
    console.log(password)
    if (signUpDetailsValid(name, surname, email, password, passwordRepeat, birthYear, country)){
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log('success?')
            console.log(user)
            
            const docRef = doc(db, "users", uid);
            const data = {
                name: name,
                surname: surname,
                country: country,
                birthYear: birthYear,
                email: email,
                password: password,
                updates: updates,
                signUpDate: Date.now(),
            }
            setDoc(docRef, data)
            .then(()=>{
              setDoc(doc(db, "userData", uid), {
                tests: 0
              })
              .then(()=>{
                let redirect = window.location.href.split('redirect=')[1];
                console.log(redirect)
                if (redirect != null){
                  window.location.href = redirect;
                } else{
                  window.location.href = "settings.html"
                }
              })
            })
            

            console.log('database data written')
            // ...
        })
        
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
            if(errorCode == "auth/email-already-in-use") alert("Account with that email address already exists.")
            else alert("An error occured. Please make sure all the data is in valid format.")
            // ..
        });
    //}
  }
})

function signUpDetailsValid(name, surname, email, password, passwordRepeat, grade, country){
    return true;
}

let passwordVisibilityToggle1 = document.getElementById('togglePasswordVisibility1');
let passwordField1 = document.getElementById('password');
let passwordField2 = document.getElementById('passwordRepeat');
passwordVisibilityToggle1.addEventListener('click', ()=>{
  if (passwordVisibilityToggle1.classList.contains('fa-eye')){
    passwordVisibilityToggle1.classList.remove('fa-eye');
    passwordVisibilityToggle1.classList.add('fa-eye-slash')
    passwordField1.type = "text";
  } else{
    passwordVisibilityToggle1.classList.add('fa-eye');
    passwordVisibilityToggle1.classList.remove('fa-eye-slash')
    passwordField1.type = "password";
  }
})
let passwordVisibilityToggle2 = document.getElementById('togglePasswordVisibility2');
passwordVisibilityToggle2.addEventListener('click', ()=>{
  if (passwordVisibilityToggle2.classList.contains('fa-eye')){
    passwordVisibilityToggle2.classList.remove('fa-eye');
    passwordVisibilityToggle2.classList.add('fa-eye-slash')
    passwordField2.type = "text";
  } else{
    passwordVisibilityToggle2.classList.add('fa-eye');
    passwordVisibilityToggle2.classList.remove('fa-eye-slash')
    passwordField2.type = "password";
  }
})

let rptMsg = document.getElementById('passwordRepeatMessage');
passwordRepeatField.addEventListener('change', ()=>{
  if (passwordRepeatField.value == passwordField.value) rptMsg.style.display = "none";
  else rptMsg.style.display = "block";
})
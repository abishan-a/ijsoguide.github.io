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
        
        getDoc(doc(db, "users", uid))
        .then((data)=> {
            if(data.exists()){
                let d = data.data()
                console.log(d)
                document.getElementById('name').innerHTML = "<b>Name: </b>" + d.name + " " + d.surname;
                document.getElementById('country').innerHTML = "<b>Country: </b>" + d.country;
                document.getElementById('birthYear').innerHTML = "<b>Birth year: </b>" + d.birthYear;
                document.getElementById('email').innerHTML = "<b>Email: </b>" + d.email;
                if (d.updates) document.getElementById('emailUpdates').checked = true;

                let passwordFill = "";
                let realPw = d.password;
                for (let i = 0; i < realPw.length; i++) passwordFill += "•";
                document.getElementById('password').innerHTML = "<b>Password: </b>" + "<span class=\"password-field\" id=\"password-field\">" + passwordFill + "</span>";
                // Password
                let pw = document.getElementById("password-field");
                let shown = false;

                pw.addEventListener("click", () => {
                    shown = !shown;
                    pw.textContent = shown ? realPw : passwordFill;
                    if(pw.style.letterSpacing == "normal") pw.style.letterSpacing = "1.5px";
                    else pw.style.letterSpacing = "normal";
                });
            }
        })
        .catch(error => {
            console.log("Error getting document:", error);
        });
    } else {
        // User is signed out
        // ...
        window.location.href = "sign-in.html"
        console.log('signed out')
    }
  });

  document.getElementById('signoutButton').addEventListener('click', (e)=>{
    e.preventDefault();
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
        console.log(error)
      });
      
})


document.getElementById('saveChangesButton').addEventListener('click', ()=>{
    let updatesValue = document.getElementById('emailUpdates').checked;
    setDoc(doc(db, "users", uid), {
        updates: updatesValue
    }, {merge: true}).then(()=>{
        alert("Settings saved.")
    }).catch(()=>{
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
    })
})


/* Preloader */
document.getElementById('mainContent').style.display = "none";
document.querySelector('footer').style.display = "none";

var loader = document.getElementById("preload")
window.addEventListener("load", function(){
    loader.style.display = "none";
    document.getElementById('mainContent').style.display = "block";
    document.querySelector('footer').style.display = "block";
})

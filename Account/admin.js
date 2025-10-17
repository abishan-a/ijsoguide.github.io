import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"

let uid;

document.getElementById('mainContent').style.display = "none";

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
                if(d.executive){    // Verified admin

                    console.log('adminVerified')
                    let totalUsers = 0;
                    let mailingList = [];
                    let countryStats = {};
                    let overview = [];

                    getDocs(collection(db, "users"))
                    .then((allUsers)=> {
                        allUsers.forEach((doc) => {
                            let userData = doc.data();
                            if(userData.testAccount && userData.testAccount == true) return;
                            if(!userData.name) return;
                            totalUsers += 1;
                            if (userData.updates) {
                                mailingList.push([userData.name, userData.surname, userData.email]);
                            }

                            let country = userData.country;
                            if(country) countryStats[country] = (countryStats[country] || 0) + 1;

                            let userOverview = [userData.name, userData.surname, userData.country, userData.birthYear, doc.id];
                            overview.push(userOverview);
                        });
                    }).then(()=>{
                        document.getElementById('totalUsers').innerHTML = totalUsers;
                        document.getElementById('mainContent').style.display = "block";
                        document.getElementById('mailingListLength').innerHTML = mailingList.length;
                        mailingList.forEach(e => {
                            /*let li1 = document.createElement('li');
                            li1.innerHTML = e;
                            document.getElementById('mailingList').appendChild(li1);*/
                            let tr = document.createElement('tr');
                            let td1 = document.createElement('td');
                            let td2 = document.createElement('td');
                            let td3 = document.createElement('td');
                            td1.innerHTML = e[0];
                            td2.innerHTML = e[1];
                            td3.innerHTML = e[2];
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            tr.appendChild(td3);
                            document.getElementById('mailingListTable').appendChild(tr);
                        })
                        for(let country in countryStats){
                            let tr = document.createElement('tr');
                            let td1 = document.createElement('td');
                            let td2 = document.createElement('td');
                            td1.innerHTML = country;
                            td2.innerHTML = countryStats[country];
                            tr.appendChild(td1);
                            tr.appendChild(td2);
                            document.getElementById('countryStatistics').appendChild(tr);
                        }
                        overview.forEach(user => {
                            let tr_overview = document.createElement('tr');
                            let td1_overview = document.createElement('td');
                            let td2_overview = document.createElement('td');
                            let td3_overview = document.createElement('td');
                            let td4_overview = document.createElement('td');
                            let td5_overview = document.createElement('td');
                            td1_overview.innerHTML = user[0];
                            td2_overview.innerHTML = user[1];
                            td3_overview.innerHTML = user[2];
                            td4_overview.innerHTML = user[3];
                            td5_overview.innerHTML = user[4];
                            tr_overview.appendChild(td1_overview);
                            tr_overview.appendChild(td2_overview);
                            tr_overview.appendChild(td3_overview);
                            tr_overview.appendChild(td4_overview);
                            tr_overview.appendChild(td5_overview);
                            document.getElementById('overview').appendChild(tr_overview);
                        })
                    })
                    .catch(error => {
                        alert("An error happened. Please refresh the page.")
                        console.log(error);
                    });

                } else{
                    window.location.href = "sign-in.html"
                }
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



/* Preloader */
document.getElementById('mainContent').style.display = "none";
document.querySelector('footer').style.display = "none";

var loader = document.getElementById("preload")
window.addEventListener("load", function(){
    loader.style.display = "none";
    document.getElementById('mainContent').style.display = "block";
    document.querySelector('footer').style.display = "block";
})

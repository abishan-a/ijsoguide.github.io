import {db} from '/centralAuthenticationSystem.js';
import { doc, getDoc , collection} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"

let startDate = new Date('2025-11-01T00:00:00Z')
let endDate = new Date('2026-11-01T00:00:00Z')
let current = new Date();
if (startDate < current && current < endDate){
    if(document.contains(document.getElementById('registrationButton'))) document.getElementById('registrationButton').style.display = "none";

    /** Obtaining the problems link */
    let problemsLink = "";

    getDoc(doc(db, "otherData", "challenge2025"))
    .then((data)=> {
        if(data.exists()){
            let d = data.data()
            console.log(d.problemLink)
            problemsLink = d.problemLink;
            document.getElementById('problemsLink').innerHTML = "Competition problems";
            document.getElementById('problemsLink').href = problemsLink;
            document.getElementById('problemsLink').style.display = "inline-block"
        } else{
            console.log("No data.")
        }
    })
    .catch(error => {
        console.log("Error getting document:", error);
    });
}
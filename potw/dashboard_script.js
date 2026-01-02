import {app} from '/centralAuthenticationSystem.js';
import {auth} from '/centralAuthenticationSystem.js';
import {db} from '/centralAuthenticationSystem.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore,  doc, setDoc , getDoc , getDocs, collection, query, deleteDoc} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js"

let uid;

document.body.style.display = "none";

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
                    document.body.style.display = "block";
                    let timeNow = Date.now();
                    getDocs(collection(db, "otherData", "potw", "2026"))
                    .then((allProblems)=> {
                        allProblems.forEach((doc) => {
                            problemsList[doc.id] = doc.data();
                            problemsList[doc.id]["id"] = doc.id;
                            if (problemsList[doc.id].startTime <= timeNow && timeNow <= problemsList[doc.id].endTime) addProblemToDisplay(problemsList[doc.id]);
                        })
                    
                    })
                    .then(() => {
                        console.log(problemsList)
                    })
                    .catch(error => {
                        console.log("Error getting document:", error);
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

let problemsList = [];

let newProblemID = "";
let editing = false;
updateEditingButtons();

document.getElementById('newProblemSubmit').addEventListener('click', ()=>{
    if (editing){
        const result = confirm("You are editing " + newProblemID + ". Do you want to continue?");
        if (result) {
            console.log("User clicked OK");

        } else {
            console.log("User clicked Cancel");
            return;
        }
    }
    if (newProblemID == "") newProblemID = update_newProblemID();
    let problemId = newProblemID;
    let dataToWrite = {
        problemText: document.getElementById('newProblemText').value,
        problemTitle: document.getElementById('newProblemTitle').value,
        problemAuthors: document.getElementById('newProblemAuthors').value,
        startTime: inputToUnix(document.getElementById('newProblemStarttime').value),
        endTime: inputToUnix(document.getElementById('newProblemEndtime').value),
        correctSolution: Number(document.getElementById('newProblemSolution').value),
    }
    setDoc(doc(db, "otherData", "potw", "2026", problemId), dataToWrite)
    .then(()=>{
        alert("Problem successfully saved!");
        problemsList[problemId] = dataToWrite;
        exitEditing();
        refreshDisplayedProblemList(problemsList, {
            title: document.getElementById('filterTitle').value,
            startTime: inputToUnix(document.getElementById('filterStart').value),
            endTime: inputToUnix(document.getElementById('filterEnd').value)
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
    // ..
    });
})

document.getElementById('deleteProblem').addEventListener('click', ()=>{
    const result = confirm("You tried to delete " + newProblemID + ". This action cannot be undone. Do you want to continue?");
    if (result) console.log('Del pr.' + newProblemID);
    else console.log('Not del.' + newProblemID)
})

document.getElementById('filterStart').clear;
document.getElementById('filterEnd').clear;

document.getElementById('newProblemRender').addEventListener('click', renderNewProblem)

document.getElementById('exitEditing').addEventListener('click', exitEditing)

document.getElementById('filterButton').addEventListener('click', ()=>{
    refreshDisplayedProblemList(problemsList, {
        title: document.getElementById('filterTitle').value,
        startTime: inputToUnix(document.getElementById('filterStart').value),
        endTime: inputToUnix(document.getElementById('filterEnd').value)
    })
})

function renderNewProblem(){
    document.getElementById('exampleProblemTitle').innerHTML = document.getElementById('newProblemTitle').value;
    document.getElementById('exampleProblemText').innerHTML = document.getElementById('newProblemText').value;
    document.getElementById('exampleProblemAuthors').innerHTML = document.getElementById('newProblemAuthors').value;
    renderMathInElement(document.getElementById('exampleProblemText'));
}

function loadDataToEdit(problemData, id){
    newProblemID = id;
    editing = true;
    updateEditingButtons();
    document.getElementById('newProblemTitle').value = problemData.problemTitle;
    document.getElementById('newProblemText').value = problemData.problemText;
    document.getElementById('newProblemAuthors').value = problemData.problemAuthors;
    document.getElementById('newProblemSolution').value = problemData.correctSolution;
    document.getElementById('newProblemStarttime').value = setDateTimeInputValue(problemData.startTime);
    document.getElementById('newProblemEndtime').value = setDateTimeInputValue(problemData.endTime);
    renderNewProblem();
}

function exitEditing(){
    editing = false;
    newProblemID = "";
    document.getElementById('newProblemTitle').value = "";
    document.getElementById('newProblemText').value = "";
    document.getElementById('newProblemAuthors').value = "";
    document.getElementById('newProblemSolution').value = 0;
    document.getElementById('newProblemStarttime').value = setDateTimeInputValue(Date.now());
    document.getElementById('newProblemEndtime').value = setDateTimeInputValue(Date.now());

    document.getElementById('exampleProblemTitle').innerHTML = "";
    document.getElementById('exampleProblemText').innerHTML = "";
    document.getElementById('exampleProblemAuthors').innerHTML = "";

    updateEditingButtons();
}

function addProblemToDisplay(problemData){
    let div = document.createElement('div');
    console.log(problemData.id)
    div.id = problemData.id;
    let p1 = document.createElement('p');
    p1.innerHTML = problemData.problemTitle;
    let p2 = document.createElement('p');
    let startString = new Date(problemData.startTime).toUTCString();
    let endString = new Date(problemData.endTime).toUTCString();
    p2.innerHTML = startString + " - " + endString;
    div.appendChild(p1);
    div.appendChild(p2);
    document.getElementById('allProblemsList').appendChild(div);

    div.addEventListener('click', ()=>{
        loadDataToEdit(problemData, problemData.id);
    })
}

function refreshDisplayedProblemList(problemsList, filter){
    document.getElementById('allProblemsList').innerHTML = "";
    Object.keys(problemsList).forEach(id => {
        let problemData = problemsList[id];
        if (filterPass(problemData, filter)) addProblemToDisplay(problemData);
    })
}

function update_newProblemID(){
    let result = "";
    let s1 = document.getElementById('newProblemTitle').value.toLowerCase().replace(/\s/g, "_");
    let s2 = inputToUnix(document.getElementById('newProblemStarttime').value);
    result += s2
    result += "_";
    result += s1;
    return result;
}

function inputToUnix(value){

    if (!value) return;
    const [datePart, timePart] = value.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // Create UTC date explicitly
    const utcMs = Date.UTC(year, month - 1, day, hour, minute);

    return utcMs;
}

function setDateTimeInputValue(unixMs) {
  const date = new Date(unixMs);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function updateEditingButtons(){
    //document.getElementById('exitEditing').disabled = !editing;
    let deleteBtn = document.getElementById('deleteProblem');
    let header = document.getElementById('newProblemSectionHeader');
    switch(editing){
        case true:
            header.innerHTML = "Editing problem " + newProblemID
            deleteBtn.style.display = "block";
            break;
        case false:
            header.innerHTML = "New problem"
            deleteBtn.style.display = "none";
            break;
    }
}

function filterPass(problemData, filter){
    // Title check
    if (filter.title) {
        if (!problemData.problemTitle.toLowerCase().includes(filter.title.toLowerCase())) return false;
    }
    // Start time check
    if (filter.startTime) {
        if (problemData.startTime < filter.startTime) return false;
    }
    // End time check
    if (filter.endTime) {
        if (problemData.endTime >= filter.endTime) return false;
    }
    return true;
}






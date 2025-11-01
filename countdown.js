let countdownList = [
    ["IJSO Guide Challenge countdown", new Date(Date.UTC(2025, 10, 1, 0, 0, 0)).getTime()],
    ["IJSO Guide Challenge is in progress. The competition is ending in: ", new Date(Date.UTC(2025, 10, 2, 23, 59, 59)).getTime()]
]

document.getElementById('countdownLink').href = "/competitions/";

let nextTarget;
for (let i = 0; i < countdownList.length; i+=1){
    let now = new Date().getTime()
    console.log(now)
    console.log(countdownList[i][1])
    if (countdownList[i][1] > now){
        nextTarget = countdownList[i][1];
        document.getElementById('countdownLabel').innerHTML = countdownList[i][0];
        countdownFunction(nextTarget, 'countdown');
        break;
    }
}

function timer(nextTarget){
    var countDownDate = nextTarget;
    var now = new Date().getTime()
    var distance = countDownDate - now

    var days = Math.floor(distance / (1000 * 60 * 60 * 24))
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    var seconds = Math.floor((distance % (1000 * 60)) / 1000)

    document.getElementById('countdownDays').innerHTML = days
    document.getElementById('countdownHours').innerHTML = hours
    document.getElementById('countdownMinutes').innerHTML = minutes
    document.getElementById('countdownSeconds').innerHTML = seconds

    if (distance < 0){
        clearInterval(x)
        document.getElementById('countdownDays').innerHTML = "00"
        document.getElementById('countdownHours').innerHTML = "00"
        document.getElementById('countdownMinutes').innerHTML = "00"
        document.getElementById('countdownSeconds').innerHTML = "00"
    }

}

function countdownFunction(nextTarget, containerID){
    timer(nextTarget)
    document.getElementById(containerID).style.display = "flex";
    var x = setInterval(function() {timer(nextTarget)}, 1000)
}

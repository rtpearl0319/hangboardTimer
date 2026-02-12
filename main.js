// Counts down from total iterations.
class CountdownTimer {

    timerID = -1;
    count;
    startCount;
    callback; // What gets called when we "count"
    isRunning;

    constructor(timeout, iterations, callback) {
        this.timeout = timeout;
        this.startCount = iterations;
        this.count = iterations;
        this.callback = callback;
        this.isRunning = false;
    }

    start(){

        if (isNaN(this.count) || isNaN(this.startCount)) {
            console.error("WTF, why is our numbers, not numbers?!")
            return;
        }

        if (this.isRunning || this.count <= 0 || this.timerID !== -1) {
            return;
        }

        // bind `this` so onTick sees the instance
        this.timerID = setInterval(() => this.onTick(), this.timeout);
        this.isRunning = true;
    }

    stop(){
            clearInterval(this.timerID);
            this.timerID = -1;
            this.isRunning = false;
            document.getElementById("start_button").textContent = "Start Timer"
    }

    onTick() {

        this.count--;

        if (typeof this.callback !== 'function') {
            console.error("INCORRECT !!!!! - Cam :3")
        }

        this.callback(Math.max(this.count, 0), this.startCount);

        // stop when we've reached zero or below
        if (this.count <= 0) {
            this.stop();
            let timerLabel = document.getElementById("timerLabel")
            timerLabel.textContent = "DONE"
        }
    }

    reset() {
        clearInterval(this.timerID);
        this.timerID = -1;
        this.count = this.startCount;
        this.isRunning = false;
    }
}

class UserTimerInput {

    exerciseInput;
    restInput;
    userSets;

    constructor(exerciseInput, restInput, userSets) {
        this.exerciseInput = exerciseInput;
        this.restInput = restInput;
        this.userSets = userSets;
    }

    equals(otherUserTimerInput) {

        if (!(otherUserTimerInput instanceof UserTimerInput)) {
            return false;
        }

        return this.exerciseInput === otherUserTimerInput.exerciseInput && this.restInput === otherUserTimerInput.restInput && this.userSets === otherUserTimerInput.userSets
    }

    exerciseSeconds() {
        return Math.min(Math.floor(this.exerciseInput / 1000), 3600);
    }

    restSeconds() {
        return Math.min(Math.floor(this.restInput / 1000), 3600);
    }
}

let timer;
let lastUserInput;
let startButtonClicked;

function startButtonClick() {

    if (startButtonClicked){
        pauseButtonClick()
        startButtonClicked = false;
        document.getElementById("start_button").textContent = "Start Timer"
        document.getElementById("start_button").style.setProperty('background', '#4caf50')
    }

    else{

        if (parseInt(document.getElementById('userTime').value, 10)) {
            updateTimerForInput();
            updateTimerUI(timer.count, timer.startCount, lastUserInput);
            startButtonClicked = true;
            document.getElementById("start_button").textContent = "Pause Timer"
            document.getElementById("start_button").style.setProperty('background', '#ff2972')
        }
    }
}

function updateTimerForInput(isReset) {

    const userTimerInput = fetchUserTimerInput();
    const hasNewInput = lastUserInput && !userTimerInput.equals(lastUserInput)

    // If new input, on start should just show new input
    if (hasNewInput) {
        timer?.stop()
        timer = null;
    }

    if (!timer) {
        timer = new CountdownTimer(1000, (userTimerInput.exerciseSeconds() + userTimerInput.restSeconds()) * userTimerInput.userSets, (count, startCount) => {
            updateTimerUI(count, startCount, userTimerInput);
        })
    }

    // Create timer but don't start, if new input
    if (!hasNewInput && !isReset) {
        timer.start()
    }

    lastUserInput = userTimerInput;
}

function fetchUserTimerInput() {
    return new UserTimerInput(
        document.getElementById("userTime").value * 1000,
        document.getElementById("userRestTime").value * 1000,
        Math.max(document.getElementById("userSets").value, 1));
}

function updateTimerUI(count, startCount, userInput){

    let timerElement = document.getElementById("timer");
    let circleFill = document.getElementById("circle-fill");
    const display_seconds = (count % 60).toString().padStart(2, '0');
    const display_minutes = Math.floor(count / 60).toString();

    timerElement.innerHTML = (display_minutes !== '0' ? display_minutes + ":" : '') + (display_seconds);

    const radius = circleFill.r.baseVal.value
    const circumference = 2 * Math.PI * radius

    circleFill.style.strokeDashoffset = circumference - ((circumference * count) / startCount) + "";

    let circleElem = document.getElementById("circle");
    let cycleLength = userInput.exerciseSeconds() + userInput.restSeconds();
    let elapsedSinceStart = startCount - count;
    let elapsedInCycle = cycleLength > 0 ? (elapsedSinceStart % cycleLength) : 0;

    let timerLabel = document.getElementById("timerLabel")

    if (userInput.exerciseSeconds() > 0 && elapsedInCycle < userInput.exerciseSeconds()) {
        // exercise/hang phase
        circleElem.style.setProperty('--clr', '#4caf50');
        timerLabel.textContent = "HANG"
    } else {
        // rest phase or no exercise time
        circleElem.style.setProperty('--clr', '#ff2972');
        timerLabel.textContent = "REST"
    }
}

function pauseButtonClick() {
    timer.stop()
}

function resetButtonClick(){
    timer.reset()
    updateTimerForInput(true);
    updateTimerUI(timer.count, timer.startCount, lastUserInput);
    document.getElementById("start_button").textContent = "Start Timer"
    document.getElementById("start_button").style.setProperty('background', '#4caf50')
    startButtonClicked = false;
}
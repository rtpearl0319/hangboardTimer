
// Counts down from total iterations.
class CountdownTimer {

    timerID = -1;
    count;
    startCount;
    callback; // What gets called when we "count"

    constructor(timeout, iterations, callback) {
        this.timeout = timeout;
        this.startCount = iterations;
        this.count = iterations;
        this.callback = callback;
    }

    start(){
        // Stop any ongoing countdowns
        this.stop();

        if (this.count <= 0) {
            return // completed counting
        }

        // ensure callback is called immediately for initial UI state
        if (this.count > 0 && typeof this.callback === 'function') {
            this.callback(this.count, this.startCount);
        }

        if (this.timerID !== -1) {
            return;
        }

        // bind `this` so onTick sees the instance
        this.timerID = setInterval(() => this.onTick(), this.timeout);
    }

    stop(){
        if (this.timerID !== -1 && this.timerID !== null) {
            clearInterval(this.timerID);
            this.timerID = -1;
        }
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
        }
    }

    reset() {
        clearInterval(this.timerID);
        this.timerID = -1;
        this.count = this.startCount;
    }
}

let timer;
let exerciseInput;
let restInput;

function startButtonClick() {

    let startButton = document.getElementById("start_button")
    startButton.textContent = "Start Timer"

    let value = parseInt(document.getElementById('userTime').value, 10);

    exerciseInput = document.getElementById("userTime").value * 1000;
    restInput = document.getElementById("userRestTime").value * 1000;
    let userSets = Math.max(document.getElementById("userSets").value, 1);

    let exerciseSeconds = Math.floor(exerciseInput / 1000);
    let restSeconds = Math.floor(restInput / 1000);

    if (value) {

        if (!timer) {
            timer = new CountdownTimer(1000, (exerciseSeconds + restSeconds) * userSets, (count, startCount) => {
                updateTimerUI(count, startCount, exerciseSeconds, restSeconds);
            })
        }

        timer.start();
    }
}

function updateTimerUI(count, startCount, exerciseSeconds, restSeconds){

    let timerElement = document.getElementById("timer");
    let circleFill = document.getElementById("circle-fill");
    const display_seconds = (count % 60).toString().padStart(2, '0');
    const display_minutes = Math.floor(count / 60).toString();

    timerElement.innerHTML = (display_minutes !== '0' ? display_minutes + ":" : '') + (display_seconds);

    const radius = circleFill.r.baseVal.value
    const circumference = 2 * Math.PI * radius

    circleFill.style.strokeDashoffset = circumference - ((circumference * count) / startCount) + "";

    let circleElem = document.getElementById("circle");
    let cycleLength = exerciseSeconds + restSeconds;
    let elapsedSinceStart = startCount - count;
    let elapsedInCycle = cycleLength > 0 ? (elapsedSinceStart % cycleLength) : 0;

    let timerLabel = document.getElementById("timerLabel")

    if (exerciseSeconds > 0 && elapsedInCycle < exerciseSeconds) {
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

    let exerciseSeconds = Math.floor(exerciseInput / 1000);
    let restSeconds = Math.floor(restInput / 1000);

    updateTimerUI(timer.count, timer.startCount, exerciseSeconds, restSeconds);
}

/*function timerLogic(rest_seconds, exercise_seconds, user_sets, timer, circleFill) {

    /*let raw = user_sets == null ? '' : String(user_sets.value).trim();
    let setsNum = parseInt(raw, 10);
    let inputSets = (raw !== '' && !isNaN(setsNum) && setsNum > 0) ? setsNum : 1;

    const initialSeconds = (exercise_seconds + rest_seconds) * inputSets;
    let total_seconds = (exercise_seconds + rest_seconds) * inputSets;

    timerID = setInterval(() => {

        const display_seconds = (total_seconds % 60).toString().padStart(2, '0');
        const display_minutes = Math.floor(total_seconds / 60).toString();

        timer.innerHTML = (display_minutes !== '0' ? display_minutes + ":" : '') + (display_seconds);

        const radius = circleFill.r.baseVal.value
        const circumference = 2 * Math.PI * radius

        circleFill.style.strokeDashoffset = circumference - ((circumference * total_seconds) / initialSeconds) + "";

        let circleElem = document.getElementById("circle");
        let cycleLength = exercise_seconds + rest_seconds;
        let elapsedSinceStart = initialSeconds - total_seconds;
        let elapsedInCycle = cycleLength > 0 ? (elapsedSinceStart % cycleLength) : 0;

        let timerLabel = document.getElementById("timerLabel")

        if (exercise_seconds > 0 && elapsedInCycle < exercise_seconds) {
            // exercise/hang phase
            circleElem.style.setProperty('--clr', '#4caf50');
            timerLabel.textContent = "HANG"
        } else {
            // rest phase or no exercise time
            circleElem.style.setProperty('--clr', '#ff2972');
            timerLabel.textContent = "REST"
        }

        total_seconds--;

        if (total_seconds < 0) {
            clearInterval(timerID);
            timerLabel.textContent = "DONE"
        }
    }, 1000)
}
*/

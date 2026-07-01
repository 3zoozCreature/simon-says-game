/*-------------------------------- Constants --------------------------------*/
const colorArr = ['red', 'blue', 'green', 'yellow']

const highScore = document.querySelector("#high-score")

const gameSounds = {
    green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    blue: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    error: new Audio("../assets/Wrong-answer-sound-effect.mp3")
}

/*-------------------------------- Variables --------------------------------*/
let gameSequence = []

let playerSequence = []

let level = 0

let gameStarted = false

let playerTurn = false

let timeouts = []

let highestScore = 0

/*------------------------ Cached Element References ------------------------*/
const startBtn = document.querySelector('#start-btn')

const restartBtn = document.querySelector('#restart-btn')

const colorBtns = document.querySelectorAll('.color-btn')

const message = document.querySelector('#message')

/*----------------------------- Event Listeners -----------------------------*/
startBtn.addEventListener('click', startGame)

restartBtn.addEventListener('click', restartGame)

colorBtns.forEach(function (button) {
    button.addEventListener("click", handleUserClick)
})

/*-------------------------------- Functions --------------------------------*/
function init() {
    timeouts.forEach(function (timeout) {
        clearTimeout(timeout)
    })

    timeouts = []

    gameSequence = []
    playerSequence = []
    level = 0
    gameStarted = false
    playerTurn = false

    message.textContent = 'Press Start to Play'

    highScore.textContent = highestScore
}

function startGame() {
    if (gameStarted) {
        return
    }

    gameStarted = true
    nextRound()
}

function restartGame() {
    init()
}

function nextRound() {
    playerSequence = []
    playerTurn = false

    level++
    message.textContent = 'Level ' + level

    let colorsToAdd

    if (level === 1) {
        colorsToAdd = 4
    } else {
        colorsToAdd = 2
    }

    for (let i = 0; i < colorsToAdd; i++) {
        const randomIndex = Math.floor(Math.random() * colorArr.length)
        const randomColor = colorArr[randomIndex]
        gameSequence.push(randomColor)
    }

    console.log(gameSequence)
    playSequence()
}

function playSequence() {
    playerTurn = false

    gameSequence.forEach(function (color, index) {
        const timeout = setTimeout(function () {
            const button = document.querySelector('#' + color)
            lightUp(button)
        }, index * 700)

        timeouts.push(timeout)
    })

    const turnTimeout = setTimeout(function () {
        playerTurn = true
        message.textContent = 'Your Turn'
    }, gameSequence.length * 700)

    timeouts.push(turnTimeout)
}

function lightUp(button) {
    const color = button.id

    if (gameSounds[color]) {
        gameSounds[color].currentTime = 0
        gameSounds[color].play()
    }

    button.classList.add('active')

    const timeout = setTimeout(function () {
        button.classList.remove('active')
    }, 300)

    timeouts.push(timeout)
}

function handleUserClick(event) {
    if (playerTurn === false) {
        return
    }

    const clickedColor = event.target.id
    playerSequence.push(clickedColor)

    lightUp(event.target)

    const currentIndex = playerSequence.length - 1

    if (playerSequence[currentIndex] !== gameSequence[currentIndex]) {
        gameSounds.error.currentTime = 0
        gameSounds.error.play()

        const score = level - 1

        if (score > highestScore) {
            highestScore = score
            highScore.textContent = highestScore
        }

        gameStarted = false
        playerTurn = false
        gameSequence = []
        playerSequence = []
        level = 0

        const playAgain = confirm(
            "Game Over!\n\nLevel Reached: " + score + "\n\nPlay Again?"
        )

        message.textContent = "Press Start to Play"

        if (playAgain) {
            startGame()
        }

        return
    }

    if (playerSequence.length === gameSequence.length) {
        playerTurn = false
        message.textContent = "Correct!"

        const timeout = setTimeout(function () {
            nextRound()
        }, 1000)

        timeouts.push(timeout)
    }
}

init()
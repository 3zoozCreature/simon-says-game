const colorArr = ['red', 'blue', 'green', 'yellow']

let gameSequence = []
let playerSequence = []
let level = 0
let gameStarted = false
let playerTurn = false

const startBtn = document.querySelector('#start-btn')
const restartBtn = document.querySelector('#restart-btn')
const colorBtns = document.querySelectorAll('.color-btn')
const message = document.querySelector('#message')

startBtn.addEventListener('click', startGame)
restartBtn.addEventListener('click', restartGame)
colorBtns.forEach(function (button) {
    button.addEventListener("click", handleUserClick)
})

function init() {
    gameSequence = []
    playerSequence = []
    level = 0
    gameStarted = false
    playerTurn = false
    message.textContent = 'Press Start to Play'
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
        setTimeout(function () {
            const button = document.querySelector('#' + color)
            lightUp(button)
        }, index * 700)
    })

    setTimeout(function () {
        playerTurn = true
        message.textContent = 'Your Turn'
    }, gameSequence.length * 700)
}

function lightUp(button) {
    button.classList.add('active')

    setTimeout(function () {
        button.classList.remove('active')
    }, 300)
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
        message.textContent = "Game Over"
        gameStarted = false
        playerTurn = false
        return
    }

    if (playerSequence.length === gameSequence.length) {
        playerTurn = false
        message.textContent = "Correct!"

        setTimeout(function () {
            nextRound()
        }, 1000)
    }
}

init()
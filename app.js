let cpuPattern = []
let cpuPosition = 1
let playerPattern = []
let maxMoves = 5
let cpuLeds = null
let playerLeds = null
const maxCombination = 16

const memoryPanel = document.querySelector('.memoryPanel'),
  memoryPanelFields = document.querySelectorAll('.memory'),
  playerMemory = document.querySelector('.playerMemory'),
  playerButtons = document.querySelectorAll('.btn'),
  startButton = document.getElementById('startButton'),
  header = document.getElementById('title'),
  rangeInput = document.querySelector('input[type="range"]'),
  stepsNumber = document.querySelector('.range'),
  cpuLedPanel = document.querySelector('.cpuLeds'),
  playerLedPanel = document.querySelector('.playerLeds'),
  rangeWrapper = document.querySelector('.rangeWrapper'),
  ledWrappers = document.querySelectorAll('.ledsWrapper'),
  resetBtn = document.querySelector('.resetGame')

const createPattern = () => {
  const newPattern = []
  for (let i = 0; i < maxMoves; i++) {
    const position = Math.floor(Math.random() * maxCombination + 1)
    newPattern.push(position - 1)
  }
  return newPattern
}

const turnLedsOff = () => {
  cpuLeds.forEach((led) => led.classList.remove('ledOn'))
  playerLeds.forEach((led) => led.classList.remove('ledOn'))
}

const turnLedOn = (index, ledPanel) =>
  ledPanel.children[index].classList.add('ledOn')

const enableButtons = () => {
  playerMemory.classList.add('playerActive')
  playerButtons.forEach((btn) => btn.classList.add('playerMemoryActive'))
}

const disableButtons = () => {
  playerMemory.classList.remove('playerActive')
  playerButtons.forEach((btn) => btn.classList.remove('playerMemoryActive'))
}

const playItem = (index, combinationPos, location = 'computer') => {
  const leds = location === 'computer' ? cpuLedPanel : playerLedPanel
  memoryPanel.children[index].classList.add('memoryActive')
  turnLedOn(combinationPos, leds)
  setTimeout(() => {
    memoryPanel.children[index].classList.remove('memoryActive')
  }, 500)
}

const finishGame = (output = 'fail') => {
  const outputClasses =
    output === 'success'
      ? ['playerMemoryComplete', 'playerLedComplete']
      : ['playerMemoryError', 'playerLedError']
  disableButtons()
  turnLedsOff()

  memoryPanelFields.forEach((field) => field.classList.add(outputClasses[0]))
  cpuLeds.forEach((led) => led.classList.add(outputClasses[1]))

  setTimeout(() => {
    memoryPanelFields.forEach((field) =>
      field.classList.remove(outputClasses[0]),
    )
    cpuLeds.forEach((led) => led.classList.remove(outputClasses[1]))
  }, 900)
}

const displayStartingPoint = () => {
  startButton.style.display = 'block'
  rangeWrapper.style.display = 'block'
  ledWrappers.forEach((wrapper) => {
    wrapper.innerHTML = ''
  })
}

const reset = () => {
  cpuPattern = []
  cpuPosition = 1
  playerPattern = []
  maxMoves = 5
  cpuLeds = null
  playerLeds = null
  resetBtn.style.visibility = 'hidden'
  header.innerHTML = 'THE GAME'
  stepsNumber.innerHTML = maxMoves
  rangeInput.value = maxMoves
  disableButtons()
  displayStartingPoint()
}

const playCombination = () => {
  playerPattern = []
  disableButtons()
  turnLedsOff()
  for (let i = 0; i <= cpuPosition - 1; i++) {
    setTimeout(() => {
      playItem(cpuPattern[i], i)
    }, 600 * (i + 1))
  }
  setTimeout(() => {
    turnLedsOff()
    enableButtons()
  }, 600 * cpuPosition)
}

const isCombinationCorrect = (position) =>
  cpuPattern.slice(0, position).toString() === playerPattern.toString()

const playGame = (index) => {
  playItem(index, playerPattern.length, 'player')
  playerPattern.push(index)

  if (isCombinationCorrect(playerPattern.length)) {
    if (playerPattern.length === maxMoves) {
      finishGame('success')
      header.innerHTML = 'SUCCESS!!!'
      setTimeout(() => {
        reset()
      }, 2000)
      return
    }
    if (playerPattern.length === cpuPosition) {
      cpuPosition++
      header.innerHTML = 'THE GAME'
      setTimeout(() => {
        playCombination()
      }, 1200)
      return
    }
  } else {
    finishGame('fail')
    header.innerHTML = 'YOU LOOSE! TRY AGAIN'
    let numberOfOperations = 0
    const operation = (operationsNo) => {
      numberOfOperations++
      if (numberOfOperations === operationsNo) {
        setTimeout(() => {
          reset()
        }, 2000)
      }
    }

    for (let i = 0; i <= cpuPosition - 1; i++) {
      setTimeout(() => {
        playItem(cpuPattern[i], i)
        operation(cpuPosition)
      }, 600 * (i + 1))
    }

    return
  }
}

const startGame = () => {
  ledWrappers.forEach((wrapper) => {
    for (let i = 0; i < maxMoves; i++) {
      const ledLight = document.createElement('div')
      ledLight.classList.add('led')
      wrapper.appendChild(ledLight)
      if (ledLight.parentElement.classList.contains('.cpuLeds')) {
        ledLight.classList.add('cpu')
      } else {
        ledLight.classList.add('player')
      }
    }
  })

  cpuLeds = document.querySelectorAll('.led.cpu')
  playerLeds = document.querySelectorAll('.led.player')

  cpuPattern = createPattern()
  cpuPosition = 1
  playerPattern = []

  resetBtn.style.visibility = 'visible'

  setTimeout(() => {
    playCombination()
  }, 500)
}

const rangeValue = () => {
  const newValue = rangeInput.value
  stepsNumber.innerHTML = newValue
  maxMoves = +newValue
}

startButton.addEventListener('click', () => {
  startGame()
  startButton.style.display = 'none'
  header.innerHTML = 'THE GAME'
  rangeWrapper.style.display = 'none'
})

playerButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (playerMemory.classList.contains('playerActive')) {
      playGame(+btn.dataset.memory)
      btn.style.animation = 'playermemoryClick .2s'
      setTimeout(() => (btn.style.animation = ''), 200)
    }
  })
})

rangeInput.addEventListener('input', rangeValue)

resetBtn.addEventListener('click', reset)

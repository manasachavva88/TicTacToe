let playwithfrnd = document.getElementById("playWithFriend");
let playwithcomputer = document.getElementById("playWithComputer");
let board = document.getElementById("board");
let resetbutton = document.getElementById("resetbutton");
let winningmsg = document.getElementById("playerwinmsg");
let mainboard = document.getElementById("mainboard");

let playercard1 = document.getElementById("playercards1");
let playercard2 = document.getElementById("playercards2");

let player1name;
let player2name;
let computerName;

mainboard.style.display = "None";
playwithfrnd.style.display = "None";
playwithcomputer.style.display = "None";
resetbutton.style.display = "None";

let playingWithfrnd = false;
let playingwithComputer = false;

let cellContent = document.querySelectorAll(".cell");

var currentURL = window.location.href;
if (currentURL.includes("#playWithFriend")) {
  playwithfrnd.style.display = "Block";
} else {
  playwithcomputer.style.display = "Block";
}

let currentPlayer = "X";
playercard1.classList.add("playercardsactive");

let noOfMoves = 0;
let gameContinue = true;
let winningCombos = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];
document.getElementById("playfrndmsg").textContent =
  "You can make your move first. Here's the initial game board:";

function friendsgame() {
  player1name = document.getElementById("player1Name").value;
  player2name = document.getElementById("player2Name").value;
  playingWithfrnd = true;
  document.getElementById(
    "playfrndmsg"
  ).textContent = `Alright, ${player1name} you'll be 'X' and ${player2name} you'll be 'O'. `;
  playwithfrnd.style.display = "None";
  document.getElementById(
    "playername"
  ).textContent = `${player1name} its your turn to make choice`;
  mainboard.style.display = "flex";
  document.getElementById("player1UserName").textContent = player1name;
  document.getElementById("player2UserName").textContent = player2name;
  resetbutton.style.display = "Block";
}
function computergame() {
  playingwithComputer = true;
  computerName = document.getElementById("computerName").value;
  document.getElementById(
    "playfrndmsg"
  ).textContent = `Alright, ${computerName} you'll be 'X' and computer you'll be 'O'. 
 `;
  playwithcomputer.style.display = "None";
  document.getElementById(
    "playername"
  ).textContent = `${computerName} its your turn to make choice`;
  mainboard.style.display = "flex";
  document.getElementById("player1UserName").textContent = computerName;
  document.getElementById("player2UserName").textContent = "Computer";
  resetbutton.style.display = "Block";
}

function cellClick(i, j) {
  const cell = board.getElementsByClassName("cell")[i * 3 + j];
  if (!gameContinue || cell.textContent) return;
  cell.textContent = currentPlayer;
  noOfMoves++;
  checkWinner();
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  if (playingWithfrnd == true) {
    document.getElementById("playername").textContent =
      currentPlayer == "X"
        ? `${player1name} its your turn to make choice`
        : `${player2name} its your turn to make choice`;
  }

  if (currentPlayer == "X") {
    playercard1.classList.add("playercardsactive");
    playercard2.classList.remove("playercardsactive");
  } else {
    playercard2.classList.add("playercardsactive");
    playercard1.classList.remove("playercardsactive");
  }
  if (playingwithComputer == true) {
    if (gameContinue && currentPlayer === "O") {
      // Computer's turn (AI) when it's O's turn
      document.getElementById("playername").textContent =
        currentPlayer == "X"
          ? `${computerName} its your turn to make choice`
          : `Its computer turn to make choice`;
      setTimeout(computerMove, 1000); // Delay for a better user experience
    }
  }
}

function checkWinner() {
  for (let combo of winningCombos) {
    const [x, y, z] = combo;
    let cells = board.getElementsByClassName("cell");
    if (
      cells[x].textContent &&
      cells[x].textContent == cells[y].textContent &&
      cells[x].textContent == cells[z].textContent
    ) {
      playercard1.classList.add("playerinactive");
      playercard2.classList.add("playerinactive");
      gameContinue = false;
      combo.forEach((index) => cells[index].classList.add("win"));

      if (playingWithfrnd == true) {
        winningmsg.textContent =
          currentPlayer == "X"
            ? `${player1name} wins !!!`
            : `${player2name} wins !!!`;
      } else {
        winningmsg.textContent =
          currentPlayer == "X"
            ? `${computerName} wins !!!`
            : `Computer wins !!!`;
      }
      //winningmsg.textContent = `Player ${player1name} wins`;
      document.getElementById("playername").style.display = "None";
    }
  }

  if (noOfMoves === 9 && gameContinue) {
    gameContinue = false;
    winningmsg.textContent = `It's a tie`;
    document.getElementById("playername").style.display = "None";
    playercard1.classList.remove("playercardsactive");
    playercard2.classList.remove("playercardsactive");
  }
}

function computerMove() {
  if (!gameContinue || currentPlayer !== "O") return;
  const winningMove = findWinningMove();
  if (winningMove !== -1) {
    const row = Math.floor(winningMove / 3); // Calculate the row index
    const col = winningMove % 3; // Calculate the column index
    cellClick(row, col); // Call cellClick with row and column indices
    return;
  }

  // Next, check if the player is about to win, and block them
  const blockingMove = findBlockingMove();
  if (blockingMove !== -1) {
    const row = Math.floor(blockingMove / 3); // Calculate the row index
    const col = blockingMove % 3; // Calculate the column index
    cellClick(row, col); // Call cellClick with row and column indices
    return;
  }

  let emptyCells = [];
  cellContent.forEach((cell) => {
    if (!cell.textContent) {
      emptyCells.push(cell);
    }
  });
  if (emptyCells.length === 0) return;
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomEmptyCell = emptyCells[randomIndex];
  randomEmptyCell.textContent = "O";
  noOfMoves++;
  checkWinner();
  currentPlayer = "X";
}
function findWinningMove() {
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (
      cellContent[a].textContent === "O" &&
      cellContent[b].textContent === "O" &&
      cellContent[c].textContent === ""
    ) {
      return c;
    }
    if (
      cellContent[a].textContent === "O" &&
      cellContent[c].textContent === "O" &&
      cellContent[b].textContent === ""
    ) {
      return b;
    }
    if (
      cellContent[b].textContent === "O" &&
      cellContent[c].textContent === "O" &&
      cellContent[a].textContent === ""
    ) {
      return a;
    }
  }
  return -1;
}

function findBlockingMove() {
  for (let i = 0; i < winningCombos.length; i++) {
    const [a, b, c] = winningCombos[i];
    if (
      cellContent[a].textContent === "X" &&
      cellContent[b].textContent === "X" &&
      cellContent[c].textContent === ""
    ) {
      return c;
    }
    if (
      cellContent[a].textContent === "X" &&
      cellContent[c].textContent === "X" &&
      cellContent[b].textContent === ""
    ) {
      return b;
    }
    if (
      cellContent[b].textContent === "X" &&
      cellContent[c].textContent === "X" &&
      cellContent[a].textContent === ""
    ) {
      return a;
    }
  }
  return -1;
}

function resetgame() {
  cellContent.forEach((item) => {
    item.textContent = "";
    item.classList.remove("win");
    currentPlayer = "X";
    gameContinue = true;
    noOfMoves = 0;
    winningmsg.textContent = "";
    playercard2.classList.remove("playercardsactive");
    playercard1.classList.remove("playerinactive");
    playercard1.classList.add("playercardsactive");
    document.getElementById("playername").style.display = "Block";
    document.getElementById(
      "playername"
    ).textContent = `${player1name} its your turn to make choice`;
  });
}
function backTogame() {}

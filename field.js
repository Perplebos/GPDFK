const getLetter = document.getElementById("getLetter");
const letterIndex = document.getElementById("letterIndex");
const go = document.getElementById("go");

const playersField = document.getElementById("players");
let availableLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

class Spin {
  sectors = ["100", "250", "*"];

  constructor(sectors = null) {
    if (sectors != null) this.sectors = sectors;
  }
  getField() {
    let n = Math.floor(Math.random() * this.sectors.length);
    return this.sectors[n];
  }
}

// let spin = new Spin(["100", "250", "*"]);
// alert(spin.getField());

class Player {
  #name;

  get name() {
    return this.#name;
  }

  constructor(name) {
    this.#name = name;
  }

  async chooseLetter() {}

  render() {}
}

// const player = new Player("Ватсон");
// alert(player.name);

class BotPlayer extends Player {
  async chooseLetter(availableLetters) {
    const idx = Math.floor(Math.random() * availableLetters.length);
    console.log(availableLetters[idx]);
    return availableLetters[idx];
  }

  render() {
    playersField.innerHTML += `<img src="images/${this.name}.png">`;
  }
}

class HumanPlayer extends Player {
  resolveChooseLetterPromise;

  async chooseLetter(availableLetters) {
    // this.#choosenLetterIndex = prompt(
    //   `Input your letter number from 0 to ${availableLetters.length}`
    // );

    let promise = new Promise((resolve, reject) => {
      this.resolveChooseLetterPromise = resolve;
    });
    let letterIndex = await promise;

    console.log(availableLetters[letterIndex]);
    return availableLetters[letterIndex];
  }
}

// const botPlayer = new BotPlayer("Watson");
// botPlayer.chooseLetter(availableLetters);
// const humanPlayer = new HumanPlayer("You");
// humanPlayer.chooseLetter(availableLetters);

class Game {
  #host;

  #players = [];

  #currentPlayer;

  get currentPlayer() {
    return this.#currentPlayer;
  }

  set currentPlayer(value) {
    this.#currentPlayer = value;
  }

  #themeWords = [
    {
      title: "Auto",
      words: ["accumulator", "armrest", "brakes", "chassis", "clutch"],
    },
    {
      title: "City",
      words: ["library", "hospital", "gallery", "stall", "mosque"],
    },
  ];

  #botNames = ["Watson", "Sherlock", "Potter", "Germiona"];

  #theme;

  #targetWord;

  constructor(themeTitle = "Auto", humenPlayerNames = ["You"], botCount = 2) {
    this.#host = new Host();
    for (let name of humenPlayerNames) {
      this.#players.push(new HumanPlayer(name));
    }
    let availableBotNames = [...this.#botNames];
    console.log(availableBotNames);
    for (let i = 0; i < botCount; i++) {
      const index = Math.floor(Math.random() * availableBotNames.length);
      const name = availableBotNames[index];
      this.#players.push(new BotPlayer(name));
      availableBotNames.splice(index, 1);
      console.log(availableBotNames);
    }
    console.log(this.#players);
    this.#theme = themeTitle;

    this.#currentPlayer = this.#players[0];
    console.log(this.#currentPlayer);

    for (const theme of this.#themeWords) {
      if (theme.title == themeTitle) {
        const words = theme.words;
        this.#targetWord = words[Math.floor(Math.random() * words.length)];
        break;
      }
    }
    console.log(this.#targetWord);
  }

  async run() {
    // Приветствие
    this.#host.sayHi(this.#players);
    this.render();
    while (true) {
      for (let i = 0; i < this.#players.length; i++) {
        this.currentPlayer = this.#players[i];
        console.log("choosing letter for " + this.currentPlayer.name);
        const letter = await this.currentPlayer.chooseLetter(availableLetters);
      }
    }
  }

  render() {
    for (let i = 0; i < this.#players.length; i++) {
      this.#players[i].render();
    }
  }
}

class Host {
  sayHi(players) {
    const playersNames = players.map((item) => item.name);
    alert("Hello! " + playersNames.join(", "));
  }
}

const game = new Game("City");

go.addEventListener("click", game.run.bind(game));

getLetter.addEventListener("click", () => {
  game.currentPlayer.resolveChooseLetterPromise(letterIndex.value);
});

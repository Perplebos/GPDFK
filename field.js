const getLetter = document.getElementById("get_letter");
const letterIndex = document.getElementById("letter_index");
const letters = document.getElementById("letters");
const letterField = document.getElementById("letter");
const newGame = document.getElementById("new_game");
const spin = document.getElementById("spin");
const spinRandom = document.getElementById("spin_random");

const playersField = document.getElementById("players");

const go = document.getElementById("go");

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
  #sectors = ["100", "250", "*"];

  constructor(sectors = null) {
    if (sectors != null) this.sectors = sectors;
  }

  getField() {
    let n = Math.floor(Math.random() * this.#sectors.length);
    return this.#sectors[n];
  }

  render() {
    spin.innerHTML = this.#sectors;
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

  #spin;

  get currentPlayer() {
    return this.#currentPlayer;
  }

  set currentPlayer(value) {
    this.#currentPlayer = value;
  }

  #themeWords = [
    {
      title: "Auto",
      words: {
        accumulator: "аккумулятор",
        armrest: "подлокотник",
        brakes: "тормоза",
        chassis: "шасси",
        clutch: "сцепление",
      },
    },
    {
      title: "City",
      words: {
        library: "библиотека",
        hospital: "больница",
        gallery: "галлерея",
        stall: "киоск",
        mosque: "мечеть",
      },
    },
    {
      title: "Character",
      words: {
        curious: "любопытный",
        obedient: "послушный",
        determined: "настойчивый",
        caring: "заботливый",
        independent: "независимый",
      },
    },
    {
      title: "Family",
      words: {
        stepfather: "отчим",
        stepmother: "мачеха",
        "ex-wife": "бывшая жена",
        "husband-to-be": "будущий муж",
        godmother: "крёстная",
      },
    },
  ];

  #botNames = ["Watson", "Sherlock", "Potter", "Germiona"];

  #theme;

  #targetWord;

  constructor(
    themeTitle = "Auto",
    humenPlayerNames = ["You"],
    botCount = 2,
    spin = new Spin()
  ) {
    this.#host = new Host();
    this.#spin = spin;

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
        // this.#targetWord = words[Math.floor(Math.random() * words.length)];
        let enWords = Object.keys(words); // keys of the words array (english words), a regular array
        let randEnWord = enWords[Math.floor(Math.random() * enWords.length)]; //a random value from enWords array (a word in English)
        this.#targetWord = randEnWord;
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
        const randSpin = this.#spin.getField();
        console.log(`Spin: ${randSpin}`);
        this.currentPlayer = this.#players[i];
        console.log("choosing letter for " + this.currentPlayer.name);
        const letter = await this.currentPlayer.chooseLetter(availableLetters);
        this.render(randSpin, letter);
      }
    }
  }

  render(randSpin = "", letter = "") {
    letters.innerHTML = "";
    spinRandom.innerHTML = "";
    playersField.innerHTML = "";

    for (let i = 0; i < this.#players.length; i++) {
      this.#players[i].render();
    }
    for (let i = 0; i < availableLetters.length; i++) {
      const letter = availableLetters[i];
      letters.innerHTML += `${letter} `;
    }
    this.#spin.render();
    spinRandom.innerHTML = randSpin;
    letterField.innerHTML = letter;
    go.disabled = true;
  }

  newGame() {
    location.reload();
    return false;
  }
}

class Host {


  constructor(let) {
    
    
  }
  sayHi(players) {
    const playersNames = players.map((item) => item.name);
    alert("Hello! " + playersNames.join(", "));
  }
  CommercialBreak() {
    alert("А сейчас реклама")
    //И здесь функция для отображения рекламы
  }
  NextMove() {
    alert("Крутите барабан")
    const randSpin = this.#spin.getField();
    //функция для отображения того как крутится барабан
  }
  ResultDrum() {
    const randSpin = this.#spin.getField();
    alert("Сектор") + randSpin;
    alert("Выбирайте букву");
   
  }
  WinWords() {

  }
  RightLetter() {
    alert("Откройте букву" + this.let)//пробный вариант с alert
    //функция для открытия буквы
  }
  NotRightLetter() {
    alert("Буквы" + this.let + "в слове нет!")//пробный вариант с alert
    
  }
  render() {
    playersField.innerHTML += `<img src="images/${this.name}.png">`;
  }
}
const game = new Game("Family");

go.addEventListener("click", game.run.bind(game));

newGame.addEventListener("click", game.newGame.bind(game));

getLetter.addEventListener("click", () => {
  game.currentPlayer.resolveChooseLetterPromise(letterIndex.value);
});

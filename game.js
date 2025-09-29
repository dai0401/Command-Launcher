let secret;

const questions = [
  { key: "lt5",  text: "5より小さい？",  check: n => n < 5  },
  { key: "lt10", text: "10より小さい？", check: n => n < 10 },
  { key: "lt15", text: "15より小さい？", check: n => n < 15 },
  { key: "lt20", text: "20より小さい？", check: n => n < 20 },
  { key: "lt25", text: "25より小さい？", check: n => n < 25 },
  { key: "lt30", text: "30より小さい？", check: n => n < 30 },
  { key: "lt35", text: "35より小さい？", check: n => n < 35 },
  { key: "lt40", text: "40より小さい？", check: n => n < 40 },
  { key: "lt45", text: "45より小さい？", check: n => n < 45 },
  { key: "lt50", text: "50より小さい？", check: n => n < 50 },
  { key: "lt55", text: "55より小さい？", check: n => n < 55 },
  { key: "lt60", text: "60より小さい？", check: n => n < 60 },
  { key: "lt65", text: "65より小さい？", check: n => n < 65 },
  { key: "lt70", text: "70より小さい？", check: n => n < 70 },
  { key: "lt75", text: "75より小さい？", check: n => n < 75 },
  { key: "lt80", text: "80より小さい？", check: n => n < 80 },
  { key: "lt85", text: "85より小さい？", check: n => n < 85 },
  { key: "lt90", text: "90より小さい？", check: n => n < 90 },
  { key: "lt95", text: "95より小さい？", check: n => n < 95 },
  { key: "even", text: "偶数？", check: n => n % 2 === 0 },
  { key: "odd", text: "奇数？", check: n => n % 2 === 1 },
  { key: "isSingleDigit", text: "1桁の数字？", check: n => n < 10 },
  { key: "isDoubleDigit", text: "2桁の数字？", check: n => n >= 10 },
  { key: "sumOfDigits_gt5", text: "各位の和は5より大きい？", check: n => (Math.floor(n / 10) + (n % 10)) > 5 },
  { key: "sumOfDigits_gt10", text: "各位の和は10より大きい？", check: n => (Math.floor(n / 10) + (n % 10)) > 10 },
  { key: "divisibleBy3", text: "3で割り切れる？", check: n => n % 3 === 0 },
  { key: "divisibleBy5", text: "5で割り切れる？", check: n => n % 5 === 0 },
];

const questionButtonsDiv = document.getElementById("questionButtons");
const messages = document.getElementById("messages");
const result = document.getElementById("result");
const answerInput = document.getElementById("answerInput");
const answerBtn = document.getElementById("answerBtn");
const resetBtn = document.getElementById("resetBtn");

function initGame() {
  secret = Math.floor(Math.random() * 101);
  messages.textContent = "質問をして数字を予想。";
  result.textContent = "";
  answerInput.value = "";
  resetBtn.style.display = "none";
  answerInput.disabled = false;
  answerBtn.disabled = false;
  const btns = document.querySelectorAll("#questionButtons button");
  btns.forEach(btn => btn.disabled = false);
}

function createQuestionButtons() {
  questionButtonsDiv.innerHTML = ""; // 初期化
  questions.forEach(({ text, check }) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", () => {
      const answer = check(secret) ? "はい" : "いいえ";
      messages.textContent = `質問：「${text}」→ 答え：${answer}`;
    });
    questionButtonsDiv.appendChild(btn);
  });
}

answerBtn.addEventListener("click", () => {
  const guess = Number(answerInput.value);
  if (isNaN(guess) || guess < 0 || guess > 100) {
    alert("0〜100の数字を入力");
    return;
  }
  if (guess === secret) {
    result.textContent = ` 正解。答えは ${secret} でした！`;
    endGame();
  } else if (guess < secret) {
    result.textContent = "答えはもっと大きい。";
  } else {
    result.textContent = "答えはもっと小さい。";
  }
});
function endGame() {
  answerInput.disabled = true;
  answerBtn.disabled = true;
  const btns = document.querySelectorAll("#questionButtons button");
  btns.forEach(btn => btn.disabled = true);
  resetBtn.style.display = "inline-block";
}

resetBtn.addEventListener("click", () => {
  initGame();
});

createQuestionButtons();
initGame();
const number = document.querySelector('.number-input');
const category = document.querySelector('.category-input');
const difficulty = document.querySelector('.difficulty-input');

const generateBtn = document.querySelector('.generate');
const resetBtn = document.querySelector('.reset');
const generateNew = document.querySelector('.again');

var activeNumber = 10;
var activeCategory = 9;
var activeDifficulty = `random`;

fetch(`https://opentdb.com/api_category.php`)
  .then((response) => response.json())
  .then((data) => {
    for (let i = 0; i < data.trivia_categories.length; i++) {
      var option = document.createElement('option');
      option.value = data.trivia_categories[i].id;
      option.text = data.trivia_categories[i].name;
      category.add(option);
    }
  })
  .catch((err) => console.error(err));

number.addEventListener('input', () => {
  activeNumber = number.value;
  if (activeNumber >= 10 && activeNumber <= 50) {
    number.classList.remove('err');
    document.querySelector('.err-msg').classList.add('hidden');
  } else {
    number.classList.add('err');
    document.querySelector('.err-msg').classList.remove('hidden');
  }
});
category.addEventListener('input', () => {
  activeCategory = category.value;
});
difficulty.addEventListener('input', () => {
  activeDifficulty = difficulty.value;
});

generateBtn.addEventListener('click', () => {
  if (activeNumber >= 10 && activeNumber <= 50) {
    const type = activeDifficulty;
    const url = type === 'random' ? `https://opentdb.com/api.php?amount=${activeNumber}&category=${activeCategory}` : `https://opentdb.com/api.php?amount=${activeNumber}&category=${activeCategory}&difficulty=${activeDifficulty}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.response_code === 0) {
          let correctAnswersCount = 0;
          let totalQuestions = 0;
          let answeredQuestions = 0;

          for (let i = 0; i < data.results.length; i++) {
            let x = data.results[i];
            totalQuestions++;

            if (x.type === 'multiple') {
              let correctAnswer = x.correct_answer;
              let incorrectAnswers = x.incorrect_answers;

              let allAnswers = [correctAnswer, ...incorrectAnswers];

              function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
              }
              allAnswers = shuffleArray(allAnswers);

              document.querySelector('.quiz').insertAdjacentHTML(
                'beforeend',
                `
                <div class="question question${i}" id="question">
                  <div class="difficulty ${x.difficulty}"></div>
                  <p>Category: ${x.category}</p>
                  <h3>${x.question}</h3>
                  <div class="answers">
                    <div class="answer answer0-${i}" data-correct="${correctAnswer === allAnswers[0]}" q="multiple">${allAnswers[0]}</div>
                    <div class="answer answer1-${i}" data-correct="${correctAnswer === allAnswers[1]}" q="multiple">${allAnswers[1]}</div>
                    <div class="answer answer2-${i}" data-correct="${correctAnswer === allAnswers[2]}" q="multiple">${allAnswers[2]}</div>
                    <div class="answer answer3-${i}" data-correct="${correctAnswer === allAnswers[3]}" q="multiple">${allAnswers[3]}</div>
                  </div>
                </div>
                `
              );
            } else if (x.type === 'boolean') {
              let correctAnswer = x.correct_answer;

              document.querySelector('.quiz').insertAdjacentHTML(
                'beforeend',
                `
                <div class="question question${i}" id="question">
                  <div class="difficulty ${x.difficulty}"></div>
                  <p>Category: ${x.category}</p>
                  <h3>${x.question}</h3>
                  <div class="answers">
                    <div class="answer answerTrue-${i}" data-correct="${correctAnswer === 'True'}" q="boolean">True</div>
                    <div class="answer answerFalse-${i}" data-correct="${correctAnswer === 'False'}" q="boolean">False</div>
                  </div>
                </div>
                `
              );
            }
            document.querySelector(`.question${i}`).classList.add('hidden');
            document.querySelector(`.question0`).classList.remove('hidden');
          }
          document.querySelector('.current-question').innerHTML = `Question 1/${totalQuestions}`;
          document.querySelectorAll('[data-correct]').forEach((e) => {
            e.addEventListener('click', () => {
              let user = e.textContent;
              let correct = document.querySelector('[data-correct="true"]').textContent;

              if (e.getAttribute(`data-correct`) === 'true') {
                answeredQuestions++;
                correctAnswersCount++;

                if (e.getAttribute(`q`) === 'boolean') {
                  document.querySelector('[q]').remove();
                  document.querySelector('[q]').remove();
                } else if (e.getAttribute(`q`) === 'multiple') {
                  document.querySelector('[q]').remove();
                  document.querySelector('[q]').remove();
                  document.querySelector('[q]').remove();
                  document.querySelector('[q]').remove();
                }
              } else {
                answeredQuestions++;

                if (e.getAttribute(`q`) === 'boolean') {
                  document.querySelector('[q]').remove();
                  document.querySelector('[q]').remove();
                } else if (e.getAttribute(`q`) === 'multiple') {
                  document.querySelector('[q]').remove();
                  document.querySelector('[q]').remove();
                  document.querySelector('[q]').remove();
                  document.querySelector('[q]').remove();
                }
              }
              if (user === correct) {
                document.querySelector('.answers').insertAdjacentHTML(
                  'beforeend',
                  `
                  <div class="answered correct">Your answer: ${user}</div>
                  <div class="answered correct">Correct answer: ${correct}</div>
                  `
                );
              } else {
                document.querySelector('.answers').insertAdjacentHTML(
                  'beforeend',
                  `
                  <div class="answered wrong">Your answer:<br>${user}</div>
                  <div class="answered correct">Correct answer:<br>${correct}</div>
                  `
                );
              }

              setTimeout(() => {
                document.querySelector('#question').remove();

                if (answeredQuestions === totalQuestions) {
                  console.log('answered all questions');
                } else {
                  document.querySelector(`.question${answeredQuestions}`).classList.remove('hidden');
                }

                // console.log(e.closest('.question'));
                // e.closest('.question').classList.add('hidden');
                document.querySelector('.current-question').innerHTML = `Question ${answeredQuestions + 1}/${totalQuestions}`;

                if (answeredQuestions === totalQuestions) {
                  let percent = (correctAnswersCount / answeredQuestions) * 100;

                  const circleElement = document.querySelector('circle:nth-child(2)');

                  circleElement.style.strokeDashoffset = `calc(600 - (600 * ${parseInt(percent)}) / 100)`;
                  document.querySelector('.number').innerHTML = `${parseInt(percent)}<span>%</span>`;
                  document.querySelector('.result-info').innerHTML = `Category: ${category.options[category.selectedIndex].text}<br>Difficulty: ${activeDifficulty}`;

                  if (parseInt(percent) <= 33) {
                    circleElement.classList.add('r1');
                  } else if (parseInt(percent) > 33 && parseInt(percent) < 66) {
                    circleElement.classList.add('r2');
                  } else if (parseInt(percent) <= 66) {
                    circleElement.classList.add('r3');
                  }

                  document.querySelector('.quiz').classList.add('hidden');
                  document.querySelector('.result').classList.remove('hidden');

                  document.querySelectorAll('.question').forEach((e) => {
                    e.remove();
                  });
                  document.querySelector('.current-question').innerHTML = `Question 1/${totalQuestions}`;
                }
              }, 3000);
            });
          });

          document.querySelector('.generator').classList.add('hidden');
          document.querySelector('.quiz').classList.remove('hidden');
        } else if (data.response_code === 1) {
          alert(`Error: Could not return results.\nThe API doesn't have enough questions for your query.\nTry lowering the amount of questions.`);
        } else if (data.response_code === 2) {
          alert(`Error: Contains an invalid parameter.\nArguements passed in aren't valid.\nContact the website author please!`);
        } else if (data.response_code === 3) {
          alert(`Error: Session Token does not exist.\nContact the website author please!`);
        } else if (data.response_code === 4) {
          alert(`Error: Session Token has returned all possible questions for the specified query.\nResetting the Token is necessary.\nContact the website author please!`);
        } else if (data.response_code === 5) {
          alert(`Error: Too many requests have occurred.\nEach IP can only access the API once every 5 seconds.\nWait 5 seconds, and try again.`);
        }
      })
      .catch((err) => console.error(err));
  }
});

resetBtn.addEventListener('click', () => {
  activeNumber = 10;
  activeCategory = 9;
  activeDifficulty = `random`;
});

generateNew.addEventListener('click', () => {
  document.querySelector('.result').classList.add('hidden');
  document.querySelector('.generator').classList.remove('hidden');

  document.querySelector('circle:nth-child(2)').classList.remove('r1');
  document.querySelector('circle:nth-child(2)').classList.remove('r2');
  document.querySelector('circle:nth-child(2)').classList.remove('r3');
});

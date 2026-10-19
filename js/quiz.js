document.addEventListener("DOMContentLoaded", () => {
    let originalQuestions = [];
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOptionIndex = null;

    let failText = "Ez most nem sikerült jól, próbáld újra!";
    let halfCorrectText = "Szép munka! Nézd át a többi menüpontot a hiányzó tudásért.";
    let allCorrectText = "Minden válaszod helyes volt! Gratulálunk!";

    const quizBox = document.querySelector("#quiz-box");
    const resultBox = document.querySelector("#result-box");
    const questionTitle = document.querySelector("#question-title");
    const optionsContainer = document.querySelector("#options-container");
    const nextBtn = document.querySelector("#next-btn");
    const progressText = document.querySelector("#progress-text");
    const progressBar = document.querySelector("#progress-bar");
    const resultScore = document.querySelector("#result-score");
    const resultText = document.querySelector("#result-text");
    const retryBtn = document.querySelector("#retry-btn");

    async function fetchQuestions() {
        try {
            const response = await fetch("../data/questions.json");
            originalQuestions = await response.json();
            startQuiz();
        } catch (error) {
            console.error("Hiba a kérdések betöltésekor:", error);
            questionTitle.textContent = "Hiba történt a kérdések betöltése során.";
        }
    }

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    function startQuiz() {
        questions = shuffleArray(originalQuestions);
        currentQuestionIndex = 0;
        score = 0;
        resultBox.classList.add("d-none");
        quizBox.classList.remove("d-none");
        loadQuestion();
    }

    function loadQuestion() {
        selectedOptionIndex = null;
        nextBtn.disabled = true;

        const currentData = questions[currentQuestionIndex];

        questionTitle.textContent = `${currentQuestionIndex + 1}. ${currentData.question}`;
        progressText.textContent = `Kérdés: ${currentQuestionIndex + 1} / ${questions.length}`;
        
        const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressBar.style.width = `${progressPercent}%`;

        optionsContainer.innerHTML = "";

        currentData.options.forEach((option, index) => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-light w-100 text-start p-3 mb-2 rounded-3 option-btn optionBtn";
            button.textContent = option;
            
            button.addEventListener("click", () => selectOption(index, button));
            optionsContainer.appendChild(button);
        });

        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.textContent = "Kvíz befejezése";
        } else {
            nextBtn.textContent = "Következő kérdés →";
        }
    }

    function selectOption(index, selectedButton) {
        selectedOptionIndex = index;

        const allButtons = optionsContainer.querySelectorAll(".option-btn");
        allButtons.forEach(btn => btn.classList.remove("active", "bg-white", "text-dark"));

        selectedButton.classList.add("active", "bg-white", "text-dark");
        nextBtn.disabled = false;
    }

    nextBtn.addEventListener("click", () => {
        if (selectedOptionIndex === questions[currentQuestionIndex].answer) {
            score++;
        }

        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });

    function showResults() {
    quizBox.classList.add("d-none");
    resultBox.classList.remove("d-none");

    resultScore.textContent = `${score} / ${questions.length}`;
        if (score === questions.length) {
            resultText.textContent = allCorrectText;
        } else if (score >= questions.length / 2) {
            resultText.textContent = halfCorrectText;
        } else {
            resultText.textContent = failText;
        }
    }

    retryBtn.addEventListener("click", startQuiz);

    fetchQuestions();
});
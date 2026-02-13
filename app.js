/**
 * Основная логика приложения YardWords Deutsch
 * Чистый JavaScript, без зависимостей
 */

// --- Конфигурация ---
const TARGET_LANG = 'de'; // Целевой язык - немецкий
const INTERFACE_LANG = 'ru';

// --- Словарь (VOCAB) ---
const VOCAB = [
    // 30+ предметов во дворе и на улице на немецком
    { de: "Zaun", ipa: "/t͡saʊn/", ru: "забор" },
    { de: "Tor", ipa: "/toːɐ̯/", ru: "калитка, ворота" },
    { de: "Bank", ipa: "/baŋk/", ru: "скамейка" },
    { de: "Schaukel", ipa: "/ˈʃaʊ̯kəl/", ru: "качели" },
    { de: "Rasen", ipa: "/ˈʁaːzn̩/", ru: "газон" },
    { de: "Busch", ipa: "/bʊʃ/", ru: "куст" },
    { de: "Baum", ipa: "/baʊ̯m/", ru: "дерево" },
    { de: "Blume", ipa: "/ˈbluːmə/", ru: "цветок" },
    { de: "Brunnen", ipa: "/ˈbʁʊnən/", ru: "фонтан" },
    { de: "Gartenlaube", ipa: "/ˈɡaʁtn̩ˌlaʊ̯bə/", ru: "беседка" },
    { de: "Grill", ipa: "/ɡʁɪl/", ru: "гриль" },
    { de: "Holzkohlegrill", ipa: "/ˈhɔlt͡skoːləˌɡʁɪl/", ru: "мангал" },
    { de: "Schuppen", ipa: "/ˈʃʊpn̩/", ru: "сарай" },
    { de: "Garage", ipa: "/ɡaˈʁaːʒə/", ru: "гараж" },
    { de: "Weg", ipa: "/veːk/", ru: "дорожка, тропинка" },
    { de: "Laterne", ipa: "/laˈtɛʁnə/", ru: "фонарь" },
    { de: "Briefkasten", ipa: "/ˈbʁiːfˌkastn̩/", ru: "почтовый ящик" },
    { de: "Mülltonne", ipa: "/ˈmʏlˌtɔnə/", ru: "мусорный бак" },
    { de: "Gartenschlauch", ipa: "/ˈɡaʁtn̩ˌʃlaʊ̯x/", ru: "шланг" },
    { de: "Gießkanne", ipa: "/ˈɡiːsˌkanə/", ru: "лейка" },
    { de: "Rechen", ipa: "/ˈʁɛçn̩/", ru: "грабли" },
    { de: "Schaufel", ipa: "/ˈʃaʊ̯fl̩/", ru: "лопата" },
    { de: "Schubkarre", ipa: "/ˈʃuːpˌkaʁə/", ru: "тачка" },
    { de: "Schwimmbecken", ipa: "/ˈʃvɪmˌbɛkn̩/", ru: "бассейн" },
    { de: "Spielplatz", ipa: "/ˈʃpiːlˌplat͡s/", ru: "детская площадка" },
    { de: "Rutsche", ipa: "/ˈʁʊt͡ʃə/", ru: "горка" },
    { de: "Sandkasten", ipa: "/ˈzantˌkastn̩/", ru: "песочница" },
    { de: "Vogel", ipa: "/ˈfoːɡl̩/", ru: "птица" },
    { de: "Vogelfutterhaus", ipa: "/ˈfoːɡl̩ˌfʊtɐˌhaʊs/", ru: "кормушка" },
    { de: "Vogelhaus", ipa: "/ˈfoːɡl̩ˌhaʊs/", ru: "скворечник" },
    { de: "Rasenmäher", ipa: "/ˈʁaːzn̩ˌmɛːɐ/", ru: "газонокосилка" },
    { de: "Treppe", ipa: "/ˈtʁɛpə/", ru: "крыльцо" },
    { de: "Terrasse", ipa: "/tɛˈʁasə/", ru: "патио, терраса" },
];

// --- Состояние приложения (State) ---
let state = {
    currentTheme: 'light',
    currentVocab: [...VOCAB], // Текущий отображаемый список слов
    quizMode: 'ru-de', // 'ru-de', 'de-ru', 'mixed'
    quizQuestions: [], // Массив вопросов для текущей сессии
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    selectedOption: null, // Индекс выбранного варианта
    answerSubmitted: false,
    isQuizActive: false,
    mistakes: [], // Слова, на которые ответили неправильно
    originalQuizQuestions: [], // Для сброса
};

// --- DOM Элементы ---
const dom = {
    themeToggle: document.getElementById('theme-toggle'),
    dictSection: document.getElementById('dictionary-section'),
    quizSection: document.getElementById('quiz-section'),
    cardsContainer: document.getElementById('cards-container'),
    searchInput: document.getElementById('search-input'),
    sortAzBtn: document.getElementById('sort-az'),
    sortRandomBtn: document.getElementById('sort-random'),
    goToQuizBtn: document.getElementById('go-to-quiz'),
    backToDictBtns: [
        document.getElementById('back-to-dict-from-result'),
    ],
    quizModeTitle: document.getElementById('quiz-mode-title'),
    scoreDisplay: document.getElementById('score-display'),
    progressBar: document.getElementById('progress-bar'),
    questionWord: document.getElementById('question-word'),
    questionTranslation: document.getElementById('question-translation'),
    optionsContainer: document.getElementById('options-container'),
    nextBtn: document.getElementById('next-btn'),
    resultScreen: document.getElementById('result-screen'),
    quizArea: document.getElementById('quiz-area'),
    resultMessage: document.getElementById('result-message'),
    retryMistakesBtn: document.getElementById('retry-mistakes-btn'),
    playAgainBtn: document.getElementById('play-again-btn'),
};

// --- Инициализация приложения ---
function initApp() {
    loadTheme();
    renderDictionary(state.currentVocab);
    setupEventListeners();
}

// --- Работа с темой ---
function loadTheme() {
    const savedTheme = localStorage.getItem('yardwords-de-theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    state.currentTheme = savedTheme;
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('yardwords-de-theme', newTheme);
    state.currentTheme = newTheme;
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    dom.themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
}

// --- Функции словаря ---
function renderDictionary(items) {
    if (!dom.cardsContainer) return;
    if (items.length === 0) {
        dom.cardsContainer.innerHTML = '<p class="no-results">Ничего не найдено</p>';
        return;
    }

    dom.cardsContainer.innerHTML = items.map(item => `
        <div class="word-card">
            <span class="target-word">${item.de}</span>
            <span class="ipa">${item.ipa}</span>
            <span class="translation">${item.ru}</span>
            <button class="speak-btn" data-word="${item.de}" data-lang="de-DE">🔊 Озвучить</button>
        </div>
    `).join('');

    // Добавляем слушатели на кнопки "Озвучить"
    document.querySelectorAll('.speak-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const word = btn.dataset.word;
            speakText(word, 'de-DE');
        });
    });
}

// Web Speech API
function speakText(text, lang) {
    if (!window.speechSynthesis) {
        alert('Ваш браузер не поддерживает синтез речи.');
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85; // Комфортная скорость для немецкого
    utterance.pitch = 1;
    window.speechSynthesis.cancel(); // Остановить предыдущую речь
    window.speechSynthesis.speak(utterance);
}

// Поиск и сортировка
function filterAndSortDictionary() {
    const searchTerm = dom.searchInput.value.toLowerCase().trim();
    let filtered = VOCAB.filter(item =>
        item.de.toLowerCase().includes(searchTerm) ||
        item.ru.toLowerCase().includes(searchTerm)
    );

    // Применяем текущую сортировку (по умолчанию A-Z)
    filtered.sort((a, b) => a.de.localeCompare(b.de));
    state.currentVocab = filtered;
    renderDictionary(state.currentVocab);
}

function sortAZ() {
    state.currentVocab = [...state.currentVocab].sort((a, b) => a.de.localeCompare(b.de));
    renderDictionary(state.currentVocab);
}

function sortRandom() {
    state.currentVocab = [...state.currentVocab].sort(() => Math.random() - 0.5);
    renderDictionary(state.currentVocab);
}

// --- Логика Квиза ---
function startQuiz(mode = 'ru-de', questionsList = null) {
    // Переключение секций
    dom.dictSection.classList.remove('active');
    dom.quizSection.classList.add('active');
    dom.resultScreen.classList.add('hidden');
    dom.quizArea.classList.remove('hidden');

    // Сброс состояния квиза
    if (questionsList) {
        // Для повторения ошибок или кастомного списка
        state.quizQuestions = questionsList;
    } else {
        // Генерация новых вопросов из всего словаря
        state.quizQuestions = generateQuestions(VOCAB, mode);
    }

    state.quizMode = mode;
    state.currentQuestionIndex = 0;
    state.score = 0;
    state.totalQuestions = state.quizQuestions.length;
    state.selectedOption = null;
    state.answerSubmitted = false;
    state.isQuizActive = true;
    state.mistakes = [];

    updateQuizHeader();
    renderQuestion();
}

function generateQuestions(vocab, mode) {
    // Перемешиваем и берём все слова
    const shuffled = [...vocab].sort(() => Math.random() - 0.5);
    return shuffled.map(item => {
        let type;
        if (mode === 'mixed') {
            type = Math.random() < 0.5 ? 'ru-de' : 'de-ru';
        } else {
            type = mode;
        }
        return {
            ...item,
            type: type,
        };
    });
}

function renderQuestion() {
    if (state.currentQuestionIndex >= state.quizQuestions.length) {
        endQuiz();
        return;
    }

    const question = state.quizQuestions[state.currentQuestionIndex];
    const isRuDe = question.type === 'ru-de';

    // Устанавливаем текст вопроса
    dom.questionWord.textContent = isRuDe ? question.ru : question.de;
    dom.questionTranslation.textContent = isRuDe ? question.de : question.ru;

    // Генерация вариантов ответа
    const correctAnswer = isRuDe ? question.de : question.ru;
    const allPossibleAnswers = isRuDe
        ? VOCAB.map(item => item.de) // Все немецкие слова
        : VOCAB.map(item => item.ru); // Все русские переводы

    // Получаем 3 неправильных уникальных варианта
    let wrongOptions = allPossibleAnswers.filter(ans => ans !== correctAnswer);
    wrongOptions = shuffleArray(wrongOptions).slice(0, 3);

    let options = [...wrongOptions, correctAnswer];
    options = shuffleArray(options); // Финальное перемешивание

    // Отрисовка кнопок
    dom.optionsContainer.innerHTML = options.map((opt, index) => `
        <button class="option-btn" data-option-index="${index}" data-value="${opt}">${opt}</button>
    `).join('');

    // Добавляем слушатели
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleOptionClick(e, correctAnswer, question));
    });

    // Сброс состояния для нового вопроса
    state.selectedOption = null;
    state.answerSubmitted = false;
    dom.nextBtn.disabled = true;
}

function handleOptionClick(e, correctAnswer, question) {
    if (state.answerSubmitted) return; // Блокируем повторный выбор

    const clickedBtn = e.currentTarget;
    const selectedValue = clickedBtn.dataset.value;
    const isCorrect = selectedValue === correctAnswer;

    // Подсветка
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.dataset.value === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.dataset.value === selectedValue && !isCorrect) {
            btn.classList.add('wrong');
        }
    });

    // Обновление счета и запись ошибок
    if (isCorrect) {
        state.score++;
    } else {
        // Сохраняем оригинальный объект слова для повтора ошибок
        state.mistakes.push(question);
    }

    state.answerSubmitted = true;
    dom.nextBtn.disabled = false;

    // Обновить счет на экране
    updateScore();
}

function nextQuestion() {
    if (state.currentQuestionIndex < state.quizQuestions.length - 1) {
        state.currentQuestionIndex++;
        state.selectedOption = null;
        state.answerSubmitted = false;
        dom.nextBtn.disabled = true;
        updateProgress();
        renderQuestion();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    state.isQuizActive = false;
    dom.quizArea.classList.add('hidden');
    dom.resultScreen.classList.remove('hidden');

    const percentage = Math.round((state.score / state.totalQuestions) * 100);
    dom.resultMessage.textContent = `Вы ответили правильно на ${state.score} из ${state.totalQuestions} (${percentage}%)`;
}

function updateQuizHeader() {
    const modeNames = {
        'ru-de': 'Русский → Немецкий',
        'de-ru': 'Немецкий → Русский',
        'mixed': 'Смешанный режим'
    };
    dom.quizModeTitle.textContent = `Квиз: ${modeNames[state.quizMode]}`;
    updateScore();
    updateProgress();
}

function updateScore() {
    dom.scoreDisplay.textContent = `Счёт: ${state.score} / ${state.totalQuestions}`;
}

function updateProgress() {
    const progress = ((state.currentQuestionIndex + (state.answerSubmitted ? 1 : 0)) / state.totalQuestions) * 100;
    dom.progressBar.style.width = `${progress}%`;
}

// Повтор ошибочных
function retryMistakes() {
    if (state.mistakes.length === 0) {
        alert('Нет ошибочных слов!');
        return;
    }
    // Создаем новые вопросы только из ошибочных слов, сохраняя режим
    const mistakeQuestions = state.mistakes.map(item => ({
        ...item,
        type: state.quizMode === 'mixed' ? (Math.random() < 0.5 ? 'ru-de' : 'de-ru') : state.quizMode
    }));
    startQuiz(state.quizMode, mistakeQuestions);
}

// Сброс и новая игра
function playAgain() {
    startQuiz(state.quizMode);
}

// Переход в словарь
function backToDictionary() {
    dom.quizSection.classList.remove('active');
    dom.dictSection.classList.add('active');
    // Перерендерить словарь на всякий случай
    renderDictionary(state.currentVocab);
}

// --- Утилиты ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Настройка слушателей событий ---
function setupEventListeners() {
    // Тема
    dom.themeToggle.addEventListener('click', toggleTheme);

    // Словарь
    dom.searchInput.addEventListener('input', filterAndSortDictionary);
    dom.sortAzBtn.addEventListener('click', sortAZ);
    dom.sortRandomBtn.addEventListener('click', sortRandom);
    dom.goToQuizBtn.addEventListener('click', () => startQuiz('ru-de'));

    // Квиз навигация
    dom.nextBtn.addEventListener('click', nextQuestion);
    dom.retryMistakesBtn.addEventListener('click', retryMistakes);
    dom.playAgainBtn.addEventListener('click', playAgain);

    // Кнопки "Назад в словарь"
    dom.backToDictBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', backToDictionary);
    });
}

// --- Запуск приложения ---
document.addEventListener('DOMContentLoaded', initApp);

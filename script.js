let currentQuestionIndex = 0;
const questions = document.querySelectorAll('.question');
const nextButton = document.getElementById('next-button');
const sectionTitle = document.getElementById('section-title');

const sections = [
    { title: "Características Básicas", questionCount: 4 },
    { title: "Trasfondo", questionCount: 3 },
    { title: "Motivaciones y Metas", questionCount: 2 },
    { title: "Relaciones", questionCount: 2 },
    { title: "Detalles Adicionales", questionCount: 2 }
];

function updateSectionTitle() {
    let cumulativeCount = 0;
    for (const section of sections) {
        cumulativeCount += section.questionCount;
        if (currentQuestionIndex < cumulativeCount) {
            sectionTitle.textContent = section.title;
            break;
        }
    }
}

function saveResponses() {
    const responses = [];
    for (let i = 0; i < questions.length; i++) {
        const question = questions[i].querySelector('label').textContent;
        const answer = questions[i].querySelector('input').value;
        responses.push({ question, answer });
    }
    localStorage.setItem('formResponses', JSON.stringify(responses));
}

function downloadWord() {
    const responses = JSON.parse(localStorage.getItem('formResponses'));
    let docContent = 'Formulario de Encuesta\n\n';
    responses.forEach(response => {
        docContent += `${response.question}\n${response.answer}\n\n`;
    });

    const blob = new Blob([docContent], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'respuestas.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function checkInput() {
    const input = questions[currentQuestionIndex].querySelector('input');
    if (input.value.trim() !== "") {
        nextButton.disabled = false;
    } else {
        nextButton.disabled = true;
    }
}

nextButton.addEventListener('click', () => {
    if (currentQuestionIndex < questions.length - 1) {
        questions[currentQuestionIndex].classList.remove('active');
        currentQuestionIndex++;
        questions[currentQuestionIndex].classList.add('active');
        updateSectionTitle();
        checkInput();
        const input = questions[currentQuestionIndex].querySelector('input');
        input.addEventListener('input', checkInput);

        if (currentQuestionIndex === questions.length - 1) {
            nextButton.textContent = "Enviar";
        }
    } else {
        saveResponses();
        downloadWord();
        window.close();
    }
});

updateSectionTitle();
checkInput();
const input = questions[currentQuestionIndex].querySelector('input');
input.addEventListener('input', checkInput);
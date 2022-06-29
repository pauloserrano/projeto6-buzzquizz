const apiURL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/"


const getQuizzes = async (quizId='') => {
    const response = await axios.get(`${apiURL}/${quizId}`)

    return response.data
}

const setQuizzes = async () => {
    renderQuizzes(await getQuizzes())
}


const renderQuizzes = async (quizzes) => {
    const allQuizzesContainer = document.querySelector('.all-quizzes .quizzes-container')

    quizzes.forEach(quiz => {
        allQuizzesContainer.innerHTML += `<li data-id="${quiz.id}">${quiz.title}</li>` 

        const newQuiz = allQuizzesContainer.querySelector(':last-child')
        newQuiz.style.backgroundImage = `url(${quiz.image})`
    });

        
    const allQuizzes = allQuizzesContainer.querySelectorAll('li')
    allQuizzes.forEach(quiz => quiz.addEventListener('click', e => openQuiz(e.target)))

    console.log(quizzes)
}


const openQuiz = (e) => {
    const quizId = e.dataset.id
    console.log(quizId)
    /* TO-DO */
}


setQuizzes()

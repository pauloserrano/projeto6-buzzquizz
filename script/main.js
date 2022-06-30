const apiURL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
let lista  //lista com todos os quiz's
let quizObject;

const getQuizzes = async (quizId='') => {
    const response = await axios.get(`${apiURL}/${quizId}`)

    return response.data
}

const postQuiz = async () => {
    const response = await axios.post(apiURL)
    
    return response.data.id
}

const getUserQuizzesID = (key="userQuizzes") => {
    return JSON.parse(localStorage.getItem(key))
}

const storeUserQuizID = (id, key="userQuizzes") => {
    const userQuizzes = localStorage.getItem(key)

    if (!userQuizzes) {
        localStorage.setItem(key, `[${id}]`)
    
    } else {
        const novoArray = JSON.parse(userQuizzes)
        novoArray.push(id)
        localStorage.setItem(key, JSON.stringify(novoArray))
    }

    console.log({localStorage: localStorage.userQuizzes})
}

const setQuizzes = async () => {
    renderQuizzes(await getQuizzes())
}


const renderQuizzes = async (quizzes) => {
    const allQuizzesContainer = document.querySelector('.home > .all-quizzes .quizzes-container')
    const userQuizzesContainer = document.querySelector('.home .user-quizzes .quizzes-container')
    const userQuizzesIds = getUserQuizzesID()
    lista = quizzes

    quizzes.forEach(quiz => {
        let container = allQuizzesContainer
        const isFromUser = userQuizzesIds.some(id => id === quiz.id)
        
        if (isFromUser) container = userQuizzesContainer

        container.innerHTML += `<li data-id="${quiz.id}">${quiz.title}</li>` 
        const newQuiz = container.querySelector(':last-child')
        newQuiz.style.backgroundImage = `url(${quiz.image})`
    });

    // Evento onclick
    const allQuizzes = document.querySelectorAll('.quizzes-container li')
    allQuizzes.forEach(quiz => quiz.addEventListener('click', e => openQuiz(e.target)))
}


const openQuiz = (e) => {
    const quizId = e.dataset.id
    let quiz;
    console.log(quizId)
    
    for (let i = 0; i < lista.length; i++){
        if(Number(lista[i].id) === Number(quizId)) quiz = lista[i];
    }
    
    exibirQuiz(quizId, quiz)
}

function exibirQuiz (quizId, quizObj){

    quizObject = quizObj
    console.log(quizObj)

    document.querySelector(".home").classList.toggle("hidden")
    document.querySelector(".page02").classList.toggle("hidden")

    document.querySelector(".page02").innerHTML = 
            `
            <div class="banner-quiz">
            <img src="${quizObj.image}" alt="">
            <span>${quizObj.title}</span>
            <div></div>
            </div>

            <div class="main-containner-quiz">
            </div>

            <button class="button-restart-quiz" onclick="restartButton()">Reiniciar Quizz</button>
            <button class="button-home-quiz" onclick="backHome()">Voltar pra home</button>
            `
    for ( let i = 0; i < quizObj.questions.length; i++){
            
        let respostas = quizObj.questions[i].answers
        console.log(respostas)
        respostas.sort(() => Math.random() - 0.5)
        console.log(respostas)

            document.querySelector(".main-containner-quiz").innerHTML += 

            `
            <div class="containner-quiz">

                <div class="question-quiz">${quizObj.questions[i].title}</div> 

                <div class="question-options">
                </div>

            </div>
            `
       
        for (let z = 0; z < quizObj.questions[i].answers.length; z++ ){

            document.querySelectorAll(".question-options")[document.querySelectorAll(".question-options").length - 1].innerHTML += `
            <div class="question" onclick="foiClicado(this)">
            <img src="${quizObj.questions[i].answers[z].image}" alt="">
            <span>${quizObj.questions[i].answers[z].text}</span>
            </div>
            `
        }
    }

}
function foiClicado (e) {
    e.childNodes[1].getAttribute('src')
    e.childNodes[3].innerHTML
    /*
    if(e.childNodes[1].getAttribute('src' === "certo" && e.childNodes[3].innerHTML === "certo"){
        
    }
    */
    
}
const backHome = () => {
document.querySelector(".home").classList.toggle("hidden")
document.querySelector(".page02").classList.toggle("hidden")
}
const restartButton = () => {
    
    backHome()
    exibirQuiz(quizObject.id, quizObject)
}

function checkURL(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;  
    }
    if (url != false)
        return true;
}


// Inicialização
setQuizzes()
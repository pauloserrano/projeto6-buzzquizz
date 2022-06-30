const apiURL = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
let lista  //lista com todos os quiz's
let quizObject;
let result = 0;
let clicks = 0;


const getQuizzes = async (quizId='') => {
    const response = await axios.get(`${apiURL}/${quizId}`)

    return response.data
}

const postQuiz = async () => {
    const response = await axios.post(apiURL)
    
    return response.data.id
}

const getUserQuizzes = () => {
    return localStorage.getItem('userQuizzes')
}

const storeUserQuiz = (id) => {
    const userQuizzes = getUserQuizzes()

    if (!userQuizzes) {
        localStorage.setItem('userQuizzes', `[${id}]`)
    
    } else {
        const novoArray = JSON.parse(getUserQuizzes())
        novoArray.push(id)
        localStorage.setItem('userQuizzes', JSON.stringify(novoArray))
    }

    console.log({localStorage: localStorage.userQuizzes})
}

const setQuizzes = async () => {
    renderQuizzes(await getQuizzes())
}


const renderQuizzes = async (quizzes) => {
    const allQuizzesContainer = document.querySelector('.home > .all-quizzes .quizzes-container')
    const userQuizzesContainer = document.querySelector('.home .user-quizzes .quizzes-container')

    lista = quizzes

    quizzes.forEach(quiz => {
        const isFromUser = quiz.id
        allQuizzesContainer.innerHTML += `<li data-id="${quiz.id}">${quiz.title}</li>` 

        const newQuiz = allQuizzesContainer.querySelector(':last-child')
        newQuiz.style.backgroundImage = `url(${quiz.image})`
    });

        
    const allQuizzes = allQuizzesContainer.querySelectorAll('li')
    allQuizzes.forEach(quiz => quiz.addEventListener('click', e => openQuiz(e.target)))

    console.log(quizzes)
}


const openQuiz = async (e) => {
    const quizId = e.dataset.id
    let quiz;
    console.log(quizId)
    
    /* TO-DO */

    quiz = await axios.get(`${apiURL}/${quizId}`)

    exibirQuiz(quizId, quiz.data)

}

function exibirQuiz (quizId, quizObj){

    quizObject = quizObj
    console.log(quizObj)
    document.body.scrollIntoView()

    document.querySelector(".home").classList.add("hidden")
    document.querySelector(".home").classList.add("hidden")
    document.querySelector(".page02").classList.remove("hidden")

    document.querySelector(".page02").innerHTML = 
            `
            <div class="banner-quiz">
            <img src="${quizObj.image}" alt="">
            <span>${quizObj.title}</span>
            <div></div>
            </div>

            <div class="main-containner-quiz">
            </div>
            `
    for ( let i = 0; i < quizObj.questions.length; i++){
            
        let respostas = quizObj.questions[i].answers
        console.log(respostas)
        respostas.sort(() => Math.random() - 0.5)
        console.log(respostas)

            document.querySelector(".main-containner-quiz").innerHTML += 

            `
            <div class="containner-quiz">

                <div class="question-quiz" style="background-color: ${quizObject.questions[i].color}">${quizObj.questions[i].title}</div> 

                <div class="question-options">
                </div>

            </div>
            
            `
            
            //.style.backgroundColor = "red";
       
        for (let z = 0; z < quizObj.questions[i].answers.length; z++ ){

            document.querySelectorAll(".question-options")[document.querySelectorAll(".question-options").length - 1].innerHTML += `
            <div class="question ${quizObj.questions[i].answers[z].isCorrectAnswer}" onclick="foiClicado(this)">
            <img src="${quizObj.questions[i].answers[z].image}" alt="">
            <span>${quizObj.questions[i].answers[z].text}</span>
            </div>
            `
        }
    }

}
function foiClicado (e) {
 
    let proximo = e.parentElement.parentElement.nextElementSibling

    setTimeout(function(){
    if (proximo !== null) proximo.scrollIntoView({block: "center", behavior: "smooth"});
    else document.querySelector(".containner-result-quiz").scrollIntoView({block: "center", behavior: "smooth"})
    }, 500); //2 segundos é muita coisa

    e.classList.toggle("quiz-opacity")
    clicks++
        
        
        for(let i = 1; i < (e.parentNode.childNodes.length - 1); i+=2){           
            
            if (e.parentNode.childNodes[i].className === "question true" ){

                e.parentNode.childNodes[i].classList.toggle("quiz-opacity")
                e.parentNode.childNodes[i].classList.toggle("quiz-true");
            }
            else if (e.parentNode.childNodes[i].className === "question true quiz-opacity"){

                result++
                e.parentNode.childNodes[i].classList.toggle("quiz-opacity")
                e.parentNode.childNodes[i].classList.toggle("quiz-true");
            } else {
                
                e.parentNode.childNodes[i].classList.toggle("quiz-opacity")
                e.parentNode.childNodes[i].classList.toggle("quiz-false")  
            }        
        }   
    verifyResult()
}

const backHome = () => {
document.querySelector(".home").classList.remove("hidden")
document.querySelector(".page02").classList.add("hidden")
restartVar()
}
const restartButton = () => {
    document.querySelector(".question-options").scrollIntoView({block: "center", behavior: "smooth"});
    restartVar()
    backHome()
    exibirQuiz(quizObject.id, quizObject)
    
}
function restartVar () {

    result = 0;
    clicks = 0;

}
function verifyResult(){

    total = Math.round((result/quizObject.questions.length) * 100)

    if (clicks === quizObject.questions.length){
        
        
            if ( total >= quizObject.levels[quizObject.levels.length - 1].minValue){
                document.querySelector(".page02").innerHTML +=`
                <div class="containner-result-quiz">
                <div class="info-quiz">${total}% de acerto: ${quizObject.levels[quizObject.levels.length - 1].title}</div>
        
                <div class="result-quiz">
                    <img src="${quizObject.levels[quizObject.levels.length - 1].image}" alt="">
                    <span>${quizObject.levels[quizObject.levels.length - 1].text}</span>
                </div>
                </div>
                
                <button class="button-restart-quiz" onclick="restartButton()">Reiniciar Quizz</button>
                <button class="button-home-quiz" onclick="backHome()">Voltar pra home</button>
                `          
            }  else if (total >= quizObject.levels.length - 2) {
                document.querySelector(".page02").innerHTML +=`
                <div class="containner-result-quiz">
                <div class="info-quiz">${total}% de acerto: ${quizObject.levels[quizObject.levels.length - 2].title}</div>
        
                <div class="result-quiz">
                    <img src="${quizObject.levels[quizObject.levels.length - 2].image}" alt="">
                    <span>${quizObject.levels[quizObject.levels.length - 2].text}</span>
                </div>
                </div>
                
                <button class="button-restart-quiz" onclick="restartButton()">Reiniciar Quizz</button>
                <button class="button-home-quiz" onclick="backHome()">Voltar pra home</button>
                `          
            }  
            else if (total >= quizObject.levels.length - 3) {
                document.querySelector(".page02").innerHTML +=`
                <div class="containner-result-quiz">
                <div class="info-quiz">${total}% de acerto: ${quizObject.levels[quizObject.levels.length - 3].title}</div>
        
                <div class="result-quiz">
                    <img src="${quizObject.levels[quizObject.levels.length - 3].image}" alt="">
                    <span>${quizObject.levels[quizObject.levels.length - 3].text}</span>
                </div>
                </div>
                
                <button class="button-restart-quiz" onclick="restartButton()">Reiniciar Quizz</button>
                <button class="button-home-quiz" onclick="backHome()">Voltar pra home</button>
                `           
            }  
            else {
                document.querySelector(".page02").innerHTML +=`
                <div class="containner-result-quiz">
                <div class="info-quiz">${total}% de acerto: ${quizObject.levels[quizObject.levels.length - 4].title}</div>
        
                <div class="result-quiz">
                    <img src="${quizObject.levels[quizObject.levels.length - 4].image}" alt="">
                    <span>${quizObject.levels[quizObject.levels.length - 4].text}</span>
                </div>
                </div>
                
                <button class="button-restart-quiz" onclick="restartButton()">Reiniciar Quizz</button>
                <button class="button-home-quiz" onclick="backHome()">Voltar pra home</button>
                `
            }
    }   
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
let userQuizzes = getUserQuizzes()
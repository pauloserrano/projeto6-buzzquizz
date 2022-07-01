// VARIABLES
const apiURL = "https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes"
const loadingScreen = {
    e: document.querySelector('.loader-container'),
    show: () => loadingScreen.e.classList.remove('hidden'),
    hide: () => loadingScreen.e.classList.add('hidden')
}
const userStorage = {
    set: {
        id: (value) => userStorage.save(value, 'userIDs'),
        key: (value) => userStorage.save(value, 'userKeys')
    },

    get: {
        ids: () => JSON.parse(localStorage.getItem('userIDs')),
        keys: () => JSON.parse(localStorage.getItem('userKeys'))
    },

    save: (value, key) => {
        const userQuizzes = localStorage.getItem(key)

        if (!userQuizzes) {
            localStorage.setItem(key, `[${value}]`)
        
        } else {
            const novoArray = JSON.parse(userQuizzes)
            novoArray.push(value)
            localStorage.setItem(key, JSON.stringify(novoArray))
        }
    }
}
let lista = [] // lista com todos os quiz's
let quizObject;
let result = 0;
let clicks = 0;


// FUNCTIONS
const getQuizzes = async (quizId='') => {
    const response = await axios.get(`${apiURL}/${quizId}`)

    return response.data
}


const editQuiz = () => {
    console.log('edit')
}


const deleteQuiz = () => {
    console.log('delete')
}


// const postQuiz = async () => {
//     const response = await axios.post(apiURL)
    
//     return response.data.id
// }


const setQuizzes = async () => {
    loadingScreen.show()
    renderQuizzes(await getQuizzes())
    loadingScreen.hide()
}

const renderQuizzes = async (quizzes) => {
    const allQuizzesContainer = document.querySelector('.home > .all-quizzes .quizzes-container')
    const userQuizzesContainer = document.querySelector('.home .user-quizzes .quizzes-container')
    const userQuizzesIds = userStorage.get.ids() || []

    quizzes.forEach(quiz => {
        lista.push(quiz)
        let container = allQuizzesContainer
        const isFromUser = userQuizzesIds.some(id => id === quiz.id)
        const templates = {
            default: `<li data-id="${quiz.id}">${quiz.title}</li>`, 
            user: `
                <li data-id="${quiz.id}">
                    <span>${quiz.title}</span>
                    <div class="options">
                        <button onclick="editQuiz()">
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button onclick="deleteQuiz()">
                            <ion-icon name="trash-outline"></ion-icon>
                        </button>
                    </div>
                </li>`,
        }
        
        if (isFromUser) {
            container = userQuizzesContainer
            userQuizzesContainer.innerHTML += templates.user
        
        } else {
            allQuizzesContainer.innerHTML += templates.default
        }

        const newQuiz = container.querySelector('li:last-child')
        newQuiz.style.backgroundImage = `url(${quiz.image})`
    });

    // Mostrar container certo dependendo se o usuario criou quizzes ou não
    if (userQuizzesContainer.querySelector('li') !== null){
        document.querySelector('.home .user-quizzes .all-quizzes').classList.remove('hidden')
    
    } else {
        document.querySelector('.home .user-quizzes .empty').classList.remove('hidden')
    }

    // Define evento onclick
    const allQuizzes = document.querySelectorAll('.quizzes-container li')
    allQuizzes.forEach(quiz => quiz.addEventListener('click', e => openQuiz(e.target)))
}


const openQuiz = async (e) => {
    const quizId = e.dataset.id
    let quiz;
    console.log(quizId)

    loadingScreen.show()
    quiz = await axios.get(`${apiURL}/${quizId}`)
    loadingScreen.hide()

    exibirQuiz(quizId, quiz.data)

}

function exibirQuiz (quizId, quizObj){

    quizObject = quizObj
    console.log(quizObj)
    document.body.scrollIntoView()

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

    quizObject.levels.sort(ordemCrescente)

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
function checkColor(string) {
    for (let i=1 ; i<string.length ; i++)
        if(isNaN(string[i]) && !(string[i] === "A" || string[i] === "B" || string[i] === "C" || string[i] === "D" || string[i] === "E" || string[i] === "F" || string[i] === "a" || string[i] === "b" || string[i] === "c" || string[i] === "d" || string[i] === "e" || string[i] === "f"))
            return false;
    
    if(string.length != 7)
        return false;
    else if(string[0] != "#")
        return false;
    else
        return true;    
}


// Inicialização
loadingScreen.show()
setQuizzes()

let ordemCrescente = (a, b) => {
    if (a.minValue > b.minValue) {
      return 1;
    }
    if (a.minValue < b.minValue) {
      return -1;
    }
   
    return 0;
  }
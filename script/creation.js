function collapseDiv(element) {
    element.parentNode.classList.toggle("collapsed");
}

let quiz = {
    title: "",
    image: "",
    questions: [],
    levels: []
};
let lastPostedQuiz = {};

function startQuizCreation() {
    document.querySelector("main.home").classList.add("hidden");

    document.querySelector("main.creation").innerHTML = `
        <h3>Comece pelo começo</h3>
        <div>
            <input placeholder="Título do seu quizz" type="text">
            <input placeholder="URL da imagem do seu quizz" type="text">
            <input placeholder="Quantidade de perguntas do quizz" type="text">
            <input placeholder="Quantidade de níveis do quizz" type="text">
        </div>
        <button onclick="createBasicInfo(this)">Prosseguir para criar perguntas</button>
    `;
    //colocar um função aqui para inserir os values nos inputs para editar
    document.querySelector("main.creation").classList.remove("hidden");
}
function createBasicInfo(element) {
    const basicInfo = {
        title: `${element.parentNode.querySelector("input:nth-of-type(1)").value}`,
        image: `${element.parentNode.querySelector("input:nth-of-type(2)").value}`,
        nquestions: `${element.parentNode.querySelector("input:nth-of-type(3)").value}`,
        nlevels: `${element.parentNode.querySelector("input:nth-of-type(4)").value}`,
    };

    if (checkBasicInfo(basicInfo)) {
        quiz.title = basicInfo.title;
        quiz.image = basicInfo.image;
        quiz.questions.length = basicInfo.nquestions;
        quiz.questions = quiz.questions.slice(0,basicInfo.nquestions);
        quiz.levels.length = basicInfo.nlevels;
        quiz.levels = quiz.levels.slice(0,basicInfo.nlevels);

        console.log(quiz);        
        startQuestionsCreation();
    } else
        alert("Dados incorretos!");
}
function checkBasicInfo(basicInfo) {
    const title = basicInfo.title;

    if (title.length < 20 || title.length > 65)
        return false;
    else if(Number(basicInfo.nquestions) < 3 || isNaN(basicInfo.nquestions))
        return false;
    else if (Number(basicInfo.nlevels) < 2 || isNaN(basicInfo.nlevels))
        return false;
    else if (!checkURL(basicInfo.image))
        return false;
    else
        return true;
}

function startQuestionsCreation() {
    document.querySelector("main.creation").innerHTML = '<h3>Crie suas perguntas</h3>';
    
    for (let i=0 ; i<quiz.questions.length ; i++)
        document.querySelector("main.creation").innerHTML += `
            <div class="create questions collapsed">
                <div onclick="collapseDiv(this)">
                    <h2>Pergunta ${i+1}</h2>
                </div>
                <ion-icon onclick="collapseDiv(this)" name="create-outline"></ion-icon>
                <div>
                    <input placeholder="Texto da pergunta" type="text">
                    <input placeholder="Cor de fundo da pergunta" type="text">
                    
                    <h2>Resposta correta</h2>
                    <input placeholder="Resposta correta" type="text">
                    <input placeholder="URL da imagem" type="text">

                    <h2>Respostas incorretas</h2>
                    <input placeholder="Resposta incorreta 1" type="text">
                    <input placeholder="URL da imagem 1" type="text">
                    <input placeholder="Resposta incorreta 2" type="text">
                    <input placeholder="URL da imagem 2" type="text">
                    <input placeholder="Resposta incorreta 3" type="text">
                    <input placeholder="URL da imagem 3" type="text">
                </div>                
            </div>
        `;
        document.querySelector("main.creation div:first-of-type").classList.remove("collapsed");
        document.querySelector("main.creation").innerHTML += `
            <button onclick="createQuestions(this)">Prosseguir para criar níveis</button>
       `;

    //colocar um função aqui para inserir os values nos inputs para editar    
}
function createQuestions(element) {
    let createdQuestions = [];
    let createdAnswers = [];
    let questionElm;

    for (let i=0 ; i<quiz.questions.length ; i++) {
        questionElm = element.parentNode.querySelector(`div.create.questions:nth-of-type(${i+1})`);

        createdAnswers = [];
        for (j=0 ; j<4 ; j++) {
            if(questionElm.querySelector(`input:nth-of-type(${3+j*2})`).value.length > 0 && questionElm.querySelector(`input:nth-of-type(${4+j*2})`).value.length > 0) {
                let jtext = questionElm.querySelector(`input:nth-of-type(${3+j*2})`).value;
                let jimage = questionElm.querySelector(`input:nth-of-type(${4+j*2})`).value;
                createdAnswers.push({
                    text: jtext,
                    image: jimage,
                    isCorrectAnswer: (j===0),
                });
            }
        }

        createdQuestions[i] = {
            title: `${questionElm.querySelector("input:nth-of-type(1)").value}`,
            color: `${questionElm.querySelector("input:nth-of-type(2)").value}`,
            answers: createdAnswers,
        };
    }
    
    if(checkQuestions(createdQuestions)) {
        quiz.questions = createdQuestions;
        console.log(quiz);
        startLevelsCreation();
    } else
        alert("Dados incorretos!");
}
function checkQuestions(createdQuestions) {

    for (let i=0 ; i<createdQuestions.length ; i++) {
        
        if (createdQuestions[i].title.length < 20)
            return false;
        if (!checkColor(createdQuestions[i].color))
            return false;
        if (createdQuestions[i].answers.length < 2)
            return false;
        if(createdQuestions[i].answers[0].isCorrectAnswer === false)
            return false;

        for (let j=0 ; j<createdQuestions[i].answers.length ; j++)
                    if(!checkURL(createdQuestions[i].answers[j].image))
                        return false;
    }
    return true;
}

function startLevelsCreation() {
    
    document.querySelector("main.creation").innerHTML = '<h3>Agora, decida os níveis</h3>';
    for (let i=0 ; i<quiz.levels.length ; i++)
        document.querySelector("main.creation").innerHTML += `
            <div class="create collapsed">
                <div onclick="collapseDiv(this)">
                    <h2>Nível ${i+1}</h2>
                </div>
                <ion-icon onclick="collapseDiv(this)" name="create-outline"></ion-icon>
                <div>
                    <input placeholder="Título do nível" type="text">
                    <input placeholder="% de acerto mínima" type="text">
                    <input placeholder="URL da imagem do nível" type="text">
                    <input placeholder="Descrição do nível" type="text">
                </div>                
            </div>
        `;
        document.querySelector("main.creation div:first-of-type").classList.remove("collapsed");
        document.querySelector("main.creation").innerHTML += `
            <button onclick="createLevels(this)">Finalizar Quiz</button>
       `;
    //Criar função aqui para preencher os dados em caso de edição
}
function createLevels(element) {
    let createdLevels = [];
    
    let levelElm;
    for (let i=0 ; i<quiz.levels.length ; i++) {
        levelElm = element.parentNode.querySelector(`div.create:nth-of-type(${i+1})`);

        createdLevels[i] = {
            title: `${levelElm.querySelector("input:nth-of-type(1)").value}`,
            minValue: `${levelElm.querySelector("input:nth-of-type(2)").value}`,
            image: `${levelElm.querySelector("input:nth-of-type(3)").value}`,
            text: `${levelElm.querySelector("input:nth-of-type(4)").value}`,
        };
    }

    console.log(createdLevels);
    if(checkLevels(createdLevels)) {
        quiz.levels = createdLevels;
        console.log(quiz);
        postCreatedQuiz();
    } else
        alert("Dados incorretos!");
}
function checkLevels(createdLevels) {

    let lvlzero = false;
    for (let i=0 ; i<createdLevels.length ; i++) {
        
        if(createdLevels[i].title.length < 10)
            return false;
        if(isNaN(createdLevels[i].minValue) || createdLevels[i].minValue < 0 || createdLevels[i].minValue > 100)
            return false;
        if(!checkURL(createdLevels[i].image))
            return false;
        if(createdLevels[i].text.length < 30)
            return false;

        if(createdLevels[i].minValue === "0")
            lvlzero = true;
    }

    if(!lvlzero)
        return false;
    else
        return true;
}

function postCreatedQuiz() {
    const promise = axios.post("https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes",quiz);
    loadingScreen.show()
    promise.then(createQuizSuccess);
    loadingScreen.hide()
    //chamar tela de loading
    // Opá, aqui é o Paulo, fiz pra ti essa parte já =)
}
function createQuizSuccess(postedQuiz) {
    
    lastPostedQuiz = postedQuiz;
    console.log(lastPostedQuiz.data);
    console.log(lastPostedQuiz.data.id);

    // Paulo: Armazenamento do id e key (não foi testado ainda mas deve funcionar)
    userStorage.set.id(lastPostedQuiz.data.id);
    userStorage.set.key(lastPostedQuiz.data.key);

    // Paulo: Renderização do novo quiz na home
    renderQuizzes(lastPostedQuiz.data);

    document.querySelector("main.creation").innerHTML = `
        <h3>Seu Quizz está pronto!</h3>
        <div class="create success">
            <img src="${lastPostedQuiz.data.image}">
            <p>${lastPostedQuiz.data.title}</p>
        </div>
        <button class="open-created-quiz">Acessar Quizz</button>
        <button class="button-home-quiz" onclick="backHome()">Voltar pra home</button>
    `;
    document.querySelector("button.open-created-quiz").setAttribute("onclick",`exibirQuiz(lastPostedQuiz.data.id,lastPostedQuiz.data)`);

    quiz = {
        title: "",
        image: "",
        questions: [],
        levels: []
    };
}
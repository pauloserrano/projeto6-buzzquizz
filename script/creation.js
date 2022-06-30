let quiz = {
    title: "",
    image: "",
    questions: [],
    levels: []
};

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
}
function createBasicInfo(element) {
    const basicInfo = {
        title: `${element.parentNode.querySelector("input:nth-of-type(1)").value}`,
        image: `${element.parentNode.querySelector("input:nth-of-type(2)").value}`,
        nquestions: `${element.parentNode.querySelector("input:nth-of-type(3)").value}`,
        nlevels: `${element.parentNode.querySelector("input:nth-of-type(4)").value}`,
    };
    console.log(checkBasicInfo(basicInfo));

    if (checkBasicInfo(basicInfo)) {
        quiz.title = basicInfo.title;
        quiz.image = basicInfo.image;
        for(let i=0 ; i<basicInfo.nquestions ; i++)
            quiz.questions[i] = i+1;
        for(let i=0 ; i<basicInfo.nlevels ; i++)
            quiz.levels[i] = i+1;
        
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
            <div class="create-questions collapsed">
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
}
function createQuestions(element) {
    let createdQuestions = [];
    let createdAnswers = [];
    let questionElm;

    for (let i=0 ; i<quiz.questions.length ; i++) {
        questionElm = element.parentNode.querySelector(`div.create-questions:nth-of-type(${i+1})`);
        
        let j=0;
        createdAnswers[j] = {
            text: `${questionElm.querySelector(`input:nth-of-type(${3+j*2})`).value}`,
            image: `${questionElm.querySelector(`input:nth-of-type(${4+j*2})`).value}`,
            isCorrectAnswer: true,
        };
        for (j=1 ; j<4 ; j++) {
            
            if(questionElm.querySelector(`input:nth-of-type(${3+j*2})`).value.length > 0 && questionElm.querySelector(`input:nth-of-type(${4+j*2})`).value.length > 0)
                createdAnswers[j] = {
                    text: `${questionElm.querySelector(`input:nth-of-type(${3+j*2})`).value}`,
                    image: `${questionElm.querySelector(`input:nth-of-type(${4+j*2})`).value}`,
                    isCorrectAnswer: false,
                };
        }

        createdQuestions[i] = {
            title: `${questionElm.querySelector("input:nth-of-type(1)").value}`,
            color: `${questionElm.querySelector("input:nth-of-type(2)").value}`,
            answers: createdAnswers,
        };
    }
    console.log(createdQuestions);
    //if(checkQuestions(createdQuestions))
}
// function checkQuestions(createdQuestions) {
//     for (let i=0 ; i<createdQuestions.length ; i++) {
//         if (createdQuestions[i].title.length < 20)
//             return false;
//         if (!isColor(createdQuestions[i].title))
//             return false;

//         for (let j=0 ; j<createdQuestions[i].answers.length ; j++)
//             if(j<createdQuestions[i].answers[j].)



//     }

// }


// function isColor(string) {

// }


function collapseDiv(element) {
    element.parentNode.classList.toggle("collapsed");
}







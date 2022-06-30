let quiz = {
    title: "",
    image: "",
    questions: [],
    levels: []
};

function startQuizCreation() {
    document.querySelector("main.home").classList.add("hidden");
    document.querySelector("div.page02").classList.add("hidden"); //mudar para main

    document.querySelector("main.creation").innerHTML = '';
    document.querySelector("main.creation").innerHTML = `
        <main class="creation">
            <h3>Comece pelo começo</h3>
            <input placeholder="Título do seu quizz" type="text">
            <input placeholder="URL da imagem do seu quizz" type="text">
            <input placeholder="Quantidade de perguntas do quizz" type="text">
            <input placeholder="Quantidade de níveis do quizz" type="text">
            <button onclick="createBasicInfo(this)">Prosseguir para criar perguntas</button>
        </main>`;
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
    } else
        alert("Dados incorretos!");
    
    startQuestionsCreation();
}
function checkBasicInfo(basicInfo) {
    const title = basicInfo.title;

    if (title.length < 20 || title.length > 65)
        return false;
    else if(basicInfo.nquestions < 3)
        return false;
    else if (basicInfo.nlevels < 2)
        return false;
    else if (!checkURL(basicInfo.image))
        return false;
    else
        return true;
}

function startQuestionsCreation() {
    console.log("startQuestionsCreation");
}

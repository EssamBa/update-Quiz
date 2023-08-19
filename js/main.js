let countSpan =document.querySelector(".quiz-info .count span");
let bulletsSpanContainer =document.querySelector(".bullets .spans");
let quizArea= document.querySelector(".quiz-area");
let answersArea= document.querySelector(".answers-area");
let submitButton=document.querySelector(".submit-button");
let bullets =document.querySelector(".bullets");
let resultContainer = document.querySelector(".results");
let countdownElement = document.querySelector('.countdown')

//set options
let currentIndex=0;
let rightAnswers=0;
let countdownInterval;


function getQuestions(){
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange =function(){
        if(this.readyState === 4 && this.status === 200){
            
            let questionsObject = JSON.parse(this.responseText);
            let qCount=questionsObject.length;

            //create bullets + set questions count
            createBullets(qCount);

            //add questions data
            addQuestionData(questionsObject[currentIndex],qCount);

            // start countdown
            countdown(5,qCount);
            //click on submit
            submitButton.onclick=function(){
                let theRightAnswer=questionsObject[currentIndex].right_answer;
                
                //increase index
                currentIndex++;
                //check answer
                checkAnswer(theRightAnswer,qCount);

                //remove previes question
                quizArea.innerHTML="";
                answersArea.innerHTML="";

                addQuestionData(questionsObject[currentIndex],qCount);

                //handels bullets class
                handleBullets();

                clearInterval(countdownInterval)
                countdown(5,qCount)

                //show results
                showResults(qCount);
            }
        }
    }
    myRequest.open("GET", "html_question.json",true);
    myRequest.send();
}
getQuestions();

function createBullets(num){
countSpan.innerHTML = num;

//create bullets
for(let i=0;i<num;i++){
    let theBullet =document.createElement("span");

    if(i===0){
        theBullet.className="on"
    }
    // append bullets to main bullet container
    bulletsSpanContainer.appendChild(theBullet)

}
}

function addQuestionData(obj,count){
    
    if(currentIndex < count){
        // create h2 question
    let questionTitle= document.createElement("h2");
    let questionText=document.createTextNode(obj.title);
    questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);
    // create the answers
    for(let i=1;i<=4;i++){
        let mainDiv=document.createElement("div");
        mainDiv.className='answer';
        let radioInput= document.createElement("input");
        //add type + name + id + data-attribute
        radioInput.name='question';
        radioInput.type='radio';
        radioInput.id=`answer_${i}`;
        radioInput.dataset.answer=obj[`answer_${i}`];

        //make first option selected bu default
        if(i===1){
            radioInput.checked=true;
        }
        // create label
        let theLabel= document.createElement("label");

        theLabel.htmlFor=`answer_${i}`;
        let theLebelText =document.createTextNode(obj[`answer_${i}`]);

        //add the text to label
        theLabel.appendChild(theLebelText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        answersArea.appendChild(mainDiv)

    }
    }
}

function checkAnswer(rAnswer,count){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;
    for(let i=0;i<answers.length;i++){
        if(answers[i].checked){
            theChoosenAnswer=answers[i].dataset.answer;

        }
    }
    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
        console.log("good");
    }
}
function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans=Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndex===index){
            span.className='on';
        }
    })
}

function showResults(count){
    if(currentIndex === count){
        let theResult;
        console.log("Question is finished");
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > (count / 2) && rightAnswers < count){
            theResult = `<span class ="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if (rightAnswers === count){
            theResult = `<span class ="perfect">Perfect</span>, ${rightAnswers} From ${count}`;
        }else{
            theResult = `<span class ="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }

        resultContainer.innerHTML = theResult;
        
    }
}

function countdown(duration,count){
    if(currentIndex < count){
        let minutes, seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes= minutes<10 ? `0${minutes}` : minutes;
            seconds= seconds<10 ? `0${seconds}` : seconds

            countdownElement.innerHTML=`${minutes}:${seconds}`;
            if(--duration < 0){
                clearInterval(countdownInterval);
                submitButton.click()
            }
        },1000);
    }
}
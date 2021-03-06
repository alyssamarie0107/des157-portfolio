(function(){
    'use strict';

    // JS overlay
    const openBtns = document.querySelectorAll('.open');
    const closeBtns = document.querySelectorAll('.close');

    for(const eachOpenBtn of openBtns) {
        eachOpenBtn.addEventListener('click', function(event){
            event.preventDefault();

            console.log(event.target.id);
            
            const thisBtn = event.target.id;
        
            document.querySelector(`#ol-${thisBtn}`).className = 'overlay showing';

            // play notification mp3 for when user clicks on button with overlay (rules and quit)
            const overlaySound = new Audio('media/notification.mp3');
            overlaySound.play();
            overlaySound.volume = 0.2;
        });
    }

    for(const eachCloseBtn of closeBtns) {
        eachCloseBtn.addEventListener('click', function(event){
            event.preventDefault();

            // only one overlay showing at a time
            document.querySelector('.showing').className = 'overlay hidden';
        });
    }

    document.addEventListener('keydown', function(event){
        if(event.key == "Escape"){
            document.querySelector('.showing').className = 'overlay hidden';
        }
    });
    // end of JS overlay 

    // JS for game
    let gameControl = document.querySelector('#game-control1');
    let startGame = document.querySelector('#start-game');
    let game = document.querySelector('#game');
    let pig1Score = document.querySelector('#pig1-score');
    let pig2Score = document.querySelector('#pig2-score');
    let actionArea = document.querySelector('#actions');

    // keeping track of game data
    let gameData = {
        dice: [
            '1die.png', 
            '2die.png', 
            '3die.png', 
            '4die.png', 
            '5die.png', 
            '6die.png'
        ],
        players: ['pig 1', 'pig 2'],
        score: [0,0],
        roll1: 0,
        roll2: 0,
        rollSum: 0,
        index: 0,
        gameEnd: 29
    };

    startGame.addEventListener('click', function(){
        // display game control 2
        document.querySelector('#game-control2').style.display = "flex";

        document.querySelector('#quit-yes').addEventListener('click', function(){
            // refreshes the page
            location.reload();
        });

        // randomly set game index here
        // index will be either 0 or 1
        gameData.index = Math.round(Math.random());
        console.log(gameData.index)

        document.querySelector('#game-play').style.display = "flex";
        gameControl.style.display = "none";

        setUpTurn();
    });

    function setUpTurn() {
        game.innerHTML = `<h2>Roll the dice for ${gameData.players[gameData.index]}</h2>`;
        actionArea.innerHTML = '<button id="roll">Roll the Dice</button>';

        document.getElementById('roll').addEventListener('click', function(){
            throwDice();

            // play roll dice mp3
            const rollSound = new Audio('media/roll.mp3');
            rollSound.play();
            rollSound.volume = 0.5;
        });
    }

    function throwDice() {
        // clear out action area
        actionArea.innerHTML = '';
        // using ceil could result in a zero
        // random generates a random value between 0-1 (inclusive to 0 but not inclusive to 1)
        // rounding down and adding a 1 to get random values between 1-6
        gameData.roll1 = Math.floor(Math.random() * 6) + 1;
        gameData.roll2 = Math.floor(Math.random() * 6) + 1;
        gameData.rollSum = gameData.roll1 + gameData.roll2;

        game.innerHTML = `<h2>Roll the dice for ${gameData.players[gameData.index]}</h2>`;
        game.innerHTML += `<img src=images/${gameData.dice[gameData.roll1-1]}>
                            <img src=images/${gameData.dice[gameData.roll2-1]}>`;

        console.log(gameData);

        if(gameData.rollSum === 2) {
            // switch player
            game.innerHTML += '<h3>Uh oh! Two pigs!</h3';

            // audio sound for when pig appears
            const pigSound = new Audio('media/ofarm.mp3');
            pigSound.play();
            pigSound.volume = 0.2;

            // zero out the score
            gameData.score[gameData.index] = 0;

            // set up turn for the next player
            // ternary operator 
            // evaulate whether gameData.index is true (gameData.index is either 0(false) or 1(true))
            // if it is a 1, set index to 0 and if it is a 0, set index to 1
            // could use an if else statement
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);

            // show the current score...
            showCurrentScore();
            setTimeout(setUpTurn, 3000);
        }
        else if(gameData.roll1 === 1 || gameData.roll2 === 1) {
            // switch player
            gameData.index ? (gameData.index = 0) : (gameData.index = 1);
            game.innerHTML += `<h3>Sorry one of your rolls was a pig! Switching to ${gameData.players[gameData.index]}</h3>`;

            // audio sound for when pig appears
            const pigSound = new Audio('media/ofarm.mp3');
            pigSound.play();
            pigSound.volume = 0.2;

            // set up turn
            setTimeout(setUpTurn, 3000);
        }
        else {
            gameData.score[gameData.index] = gameData.score[gameData.index] + gameData.rollSum;
            actionArea.innerHTML = '<button id="rollagain">Roll again</button> <button id="pass">Pass</button>';

            document.getElementById('rollagain').addEventListener('click', function() {
                throwDice();

                // play roll dice mp3
                const rollSound = new Audio('media/roll.mp3');
                rollSound.play();
                rollSound.volume = 0.5;
            });

            document.getElementById('pass').addEventListener('click', function() {
                // swap player then set up the turn
                gameData.index ? (gameData.index = 0) : (gameData.index = 1);
                setUpTurn();
            });

            // check to see if the player won
            checkWinningCondition();
        }
    }

    function checkWinningCondition() {
        if(gameData.score[gameData.index] > gameData.gameEnd) {
            showCurrentScore();

            // play winning sound
            const winSound = new Audio('media/win.mp3');
            setTimeout(winSound.play(),2000);
            winSound.volume = 0.2;

            game.innerHTML = `<h2>${gameData.players[gameData.index]} wins with ${gameData.score[gameData.index]} points!</h2>`;

            actionArea.innerHTML = '';
            
            let quitBtn = document.querySelector('#quit');

            quitBtn.innerHTML = "Start a New Game";
            quitBtn.style.animation = "blinker 1s linear infinite";

            quitBtn.addEventListener('click', function(){
                // refreshes the page
                location.reload();
            });

        }
        else {
            // update the score
            showCurrentScore();
        }
    }

    function showCurrentScore() {
        pig1Score.innerHTML = `Score: ${gameData.score[0]}`;
        pig2Score.innerHTML = `Score: ${gameData.score[1]}`;
    }
})();
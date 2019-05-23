// each item inside this board is board[X][Y], X,Y: 0-2

const ticTacToe = {

  board: [
    ["","",""],
    ["","",""],
    ["","",""]
  ],

  boardLength: 3,

  // calculate valid click number,
  // which can be used to make sure that X and O will take turns to be put into boxes
  validClickNumber: 0,

  // store the UI input, X or Y, into a variable for later use!
  currentPlayerSymbol:"",

  // this is to store return value from the click event callback function, remembering if the game has finished or not!
  gameIsOver: false,

  winner:"",

  wonNumberOfPlayerX:0,

  wonNumberOfPlayerO:0,

  drawNumber:0,

  roundNumber:1,

  putcurrentPlayerSymbolIntoDOM: function(){
    if (this.validClickNumber % 2 === 0){
      //  when validClickNumber is even, input 'X', when odd, input 'O'. As validClickNumber starts from 0, so the first input is always 'X'
      this.validClickNumber += 1; // update the total number of valid clicks
      this.currentPlayerSymbol = 'X';// update currentPlayerSymbol variable's value, to be used for storing click content into board array later
      return this.currentPlayerSymbol;
    }else {
      this.validClickNumber += 1;
      this.currentPlayerSymbol = 'O';
      return this.currentPlayerSymbol;
    }
  },

  putcurrentPlayerSymbolOntoBoard: function(locationX,locationY){
    this.board[locationX][locationY] = this.currentPlayerSymbol;
  },

  recordWonNumber: function(){
    if(this.winner === 'X'){
      this.wonNumberOfPlayerX += 1;
    } else{
      this.wonNumberOfPlayerO += 1;
    }
  },

  checkHorizontal: function(locationX){
    let matchingNumberHorizontal = 0;
    const arrayForCheck = this.board[locationX];

    for (let i = 0; i < this.boardLength; i++) {
      if (arrayForCheck[i] === this.currentPlayerSymbol){
        matchingNumberHorizontal += 1;
      }
    }

    if (matchingNumberHorizontal === this.boardLength){
      this.winner = this.currentPlayerSymbol;
      this.recordWonNumber();
      this.gameIsOver = true;
      return this.gameIsOver;
    }
  },

  checkVertical: function(locationY){
    let matchingNumberVertical = 0;

    for (let i = 0; i < this.boardLength; i++) {
      if(this.board[i][locationY] === this.currentPlayerSymbol){
        matchingNumberVertical += 1;
      }
    }

    if (matchingNumberVertical === this.boardLength){
      this.winner = this.currentPlayerSymbol;
      this.recordWonNumber();
      this.gameIsOver = true;
      return this.gameIsOver ;
    }
  },

  checkBackwardDiagonal: function (){
    let matchingNumberBackwardDiagonal = 0;

    for (let i = 0; i < this.boardLength; i++) {
      if(this.board[i][i] === this.currentPlayerSymbol) {
        matchingNumberBackwardDiagonal += 1;
      }
    }

    if (matchingNumberBackwardDiagonal === this.boardLength){
      this.winner = this.currentPlayerSymbol;
      this.recordWonNumber();
      this.gameIsOver = true;
      return this.gameIsOver;
    }
  },

  checkForwardDiagonal: function(){
    let matchingNumberForwardDiagonal = 0;

    for (let i = 0; i < this.boardLength; i++) {
      if(this.board[i][this.boardLength - 1 - i] === this.currentPlayerSymbol) {
        matchingNumberForwardDiagonal += 1;
      }
    }

    if (matchingNumberForwardDiagonal === this.boardLength){
      this.winner = this.currentPlayerSymbol;
      this.recordWonNumber();
      this.gameIsOver = true;
      return this.gameIsOver;
    }
  },

  checkIfDraw: function(){
    if (this.validClickNumber === this.boardLength ** 2){
      this.drawNumber += 1;
      this.gameIsOver = true;
      return this.gameIsOver;
    }
  },

  startNewGame: function(){
    for (let i = 0; i < this.boardLength; i++) {
      this.board[i].fill('');
    }
    this.validClickNumber = 0;
    this.currentPlayerSymbol = "";
    this.gameIsOver = false;
    this.winner = "";
    this.roundNumber += 1;
  },

  // boardScale retrieved from UI, and pass in here to generate new array
  changeBoardScale: function(boardScale) {
    //use loop to create a new 2d board
    const twoDArray = [];
    for (let i = 0; i < boardScale; i++) {
      const oneDArray = [];
      for (let i = 0; i < boardScale; i++) {
        oneDArray.push("");
      }
      twoDArray.push(oneDArray);
    }

    //reset related data in core logic variables
    this.board = twoDArray; // re-assign the new 2d board to this.board
    this.boardLength = boardScale; // update boardLength to new boardScale, i.e. 3/4/5
    this.validClickNumber = 0;
    this.currentPlayerSymbol = "";
    this.winner = "";
    if (this.gameIsOver === true){
      this.roundNumber += 1;
      this.gameIsOver = false;
    }  // else, remain the current game roundNumber
    // if gameIsOver is still false, could either be at the beginning of the game or user wanted to switch to a different scale in the middle of the current round, as long as there's no result for the current round, should not count it as finished, unless they click 'newGame'!
    // no need to reset user score, keep accumulating
  },
};




//#if any winner, what to do on UI, pre-determine pattern
const whatToShowOnWinning = function() {
  $('h2').html(`Congrats! Player ${ticTacToe.winner} won!!!`);

  if (ticTacToe.winner === 'X') {
    $('#playerX').html(`Player X : ${ticTacToe.wonNumberOfPlayerX}`);
  } else {
    $('#playerO').html(`Player O : ${ticTacToe.wonNumberOfPlayerO}`);
  }
};

//#what to show when changing boardScale on UI
const changeBoardScaleOnUI = function() {
  //1) clear h2, in case any previous content remains
  $('h2').html('');

  //2) create a new visibile board table on UI, with according id inside each td element!!!
  $('tbody').html('');
  for (let k = 0; k < ticTacToe.boardLength; k++) {
    $('tbody').append('<tr id="new">');
    for (let i = 0; i < ticTacToe.boardLength; i++) {
        $('tr#new').append('<td id="new">');
        $('td#new').attr('id',`${k} ${i}`);
      }
    $('tr#new').attr('id','');
  }

  //3) need to adjust css as well!!!
  // td: 33%x33%, 25%x25%, 20x20%
  // table size, keep 400x400, ok
  $('td').css({
    width:(100/ticTacToe.boardLength)+ '%',
    height:(100/ticTacToe.boardLength)+ '%'
  });


  //4) update roundNumber anyway, whether or not to change roundNumber is decided by the logic part, DOM only retrieve the updated value from logic and render in UI
  $('#gameRound').html(`Round ${ticTacToe.roundNumber}`);

  //5) *** no need to change score!!!
}

//#during Game, click each space - <td>, using event delegation!
$(document).on('click', 'td', function(e){

  // Step 1, on each click, show input on UI, handle game over situation and clicks on occupied spaces
  // first to check if the game is over or not,
  // if yes, it should just return the function, so no need to run the rest code.
  // if not, can continue the game, and check if a space is occupied or not as below.
  if(ticTacToe.gameIsOver === true) {
    $('h2').html('Game is over! Another round?!')
    return;
  }

  // if a space is occupied, no need to run the rest code, return callback directly! so can start from the next new click.
  if ($(this).html() !== "" ){
    $('h2').html('The space is occupied!')
    return;
  }

  // when it comes to this step, means, the game hasn't finished.
  // in case the last click was on an occupied space and added content to h2 element in DOM already, for the current round, up to this step, need to RESET it to empty.
  $('h2').html(' ');

  // call pre-defined function to put 'X' or 'Y' into UI/DOM
  $(this).html(ticTacToe.putcurrentPlayerSymbolIntoDOM());

  // Step 2, store the UI input into board array
  // get the click event object data - target property, it prints out the pure DOM element that user just clicked, including all its ATTRIBUTEs and contents!
  // store this target DOM element into a variable to utilise its id attribute!!!
  const clickedTarget = e.target;

  // from the event target DOM element, get the id attribute, whose value is a string with two numbers, like 'X Y'
  // and split them into an array with two string items of number, like ['X','Y'], and store it into a variable to avoid repetition.
  const location = $(clickedTarget).attr('id').split(" ")
  const locationX = parseInt(location[0]); // pure number for location X, from 0 - 2
  const locationY = parseInt(location[1]); // pure number for location Y, from 0 - 2

  // use the attribute value X and Y to locate where in the 2D array to store the click content
  // since it's already been checked if the clicked space is occupied or not on the above steps, if occupied, it will return the function and won't get to this step.
  // This, on top of the fact that this click is not on an occupied place, can put the this.currentPlayerSymbol directly into the board array!
  // use pre-determined game object function to store the input into board array of the game object.
  ticTacToe.putcurrentPlayerSymbolOntoBoard(locationX, locationY);

  //Step 3, check matching spaces and decide if any winning
  //**************** Core Logic *******************
  // loop through the whole 2D array to see if there's any existing item matching this pass-in click content on its 4x directions ‘米 ’.
  // if the total matching number on any of the 4x directions === board.length(i.e.3/4/5), then winner!!
  // this logic should work for any size of board(n * n)
  // on each direction only need to loop 'board.length'x times, store it in a variable for multiple uses

  //******* 1) loop through horizontal direction *******
  if (ticTacToe.checkHorizontal(locationX)){
    whatToShowOnWinning();
    return;
  }

  //******* 2) loop through vertical direction *******
  if (ticTacToe.checkVertical(locationY)){
    whatToShowOnWinning();
    return;
  }

  //******* 3) loop through backward diagonal direction '\' *******
  // if this input's locationX !== locationY, means, it's not in the center backward diagonal line,
  // then there's no need to check backward diagonal direction！
  // as the only way for this kind of location to win is through horizontal and vertical line,
  // which should have been checked on the above 2x steps!
  if (locationX === locationY) {
    if(ticTacToe.checkBackwardDiagonal()) {
      whatToShowOnWinning();
      return;
    }
  }

  //******* 4) loop through forward diagonal direction '/' *******
  if ((locationX + locationY) === (ticTacToe.boardLength - 1)){
    if(ticTacToe.checkForwardDiagonal()){
      whatToShowOnWinning();
      return;
    }
  }

  // ****** 5) after above checks, if no winning and up to 9 clicks, gameover *******
  if(ticTacToe.checkIfDraw()){
    $('h2').html('Draw!');
    $('#draw').html(`Draw : ${ticTacToe.drawNumber}`);
    return;
  }

});

//#newGame, click to reset UI and call pre-determined startNewGame function to reset logic side data.
$('#newGame').on('click', function(){
  $('td').html('');
  $('h2').html('');
  ticTacToe.startNewGame();
  $('#gameRound').html(`Round ${ticTacToe.roundNumber}`);
});

//#click on 3X3, to reset the UI and logic data
$('span#3').on('click', function(e){

  //1, Step1: retrieve event object data to create new board and update logic variables etc.
  const clickElement = e.target; // pure DOM object - e.g. <span id='3'> 3 x 3</span>
  const boardScale = parseInt($(clickElement).attr('id')); // id attribute is a string "3", parse it into integer number!

  //2, Step2: update the logic side, by calling the logic object method and pass in the above new boardScale
  // doing this first as will need to use the updated logic variables to output into UI
  ticTacToe.changeBoardScale(boardScale);

  //3, Step3: what to change on UI
  //create a function that can be applied to any of the scale button
  changeBoardScaleOnUI();
});

//#click on 4X4, to reset the UI and logic data
$('span#4').on('click', function(e){

  //1, Step1: retrieve event object data to create new board and update logic variables etc.
  const clickElement = e.target; // pure DOM object - e.g. <span id='3'> 3 x 3</span>
  const boardScale = parseInt($(clickElement).attr('id')); // id attribute is a string "3", parse it into integer number!

  //2, Step2: update the logic side, by calling the logic object method and pass in the above new boardScale
  // doing this first as will need to use the updated logic variables to output into UI
  ticTacToe.changeBoardScale(boardScale);

  //3, Step3: what to change on UI
  //create a function that can be applied to any of the scale button
  changeBoardScaleOnUI();
});

//#click on 5X5, to reset the UI and logic data
$('span#5').on('click', function(e){

  //1, Step1: retrieve event object data to create new board and update logic variables etc.
  const clickElement = e.target; // pure DOM object - e.g. <span id='3'> 3 x 3</span>
  const boardScale = parseInt($(clickElement).attr('id')); // id attribute is a string "3", parse it into integer number!

  //2, Step2: update the logic side, by calling the logic object method and pass in the above new boardScale
  // doing this first as will need to use the updated logic variables to output into UI
  ticTacToe.changeBoardScale(boardScale);

  //3, Step3: what to change on UI
  //create a function that can be applied to any of the scale button
  changeBoardScaleOnUI();
});







// tic-tac-toe
// Good Practice:

// event callback, on each event occasion
// - retrieves DOM data
// - pass the retrieved DOM data to core logic functions (stored in game object) which determine whether to change something and return value accordingly
// - based on the return value from the core logic functions, event callback communicates with DOM to make the actual change happen in DOM/UI

// For UI part, better not to put function inside the event handler, as every time the event is triggered, it will re-create the function again and again!

// As it now has User Interface, not only the vanilla JS at the core logic part, need to connect to the DOM to get users input value and store the data to the back core logic and then process. After processing, return the result and communicate with DOM again to output the result onto the interface to for user view!!!

// user's input data from the interface lives in the DOM, you can still use jQuery to talk to the DOM and get these data, and apply logic directly at the same time. But you will need to repeatedly use jQuery to get these data for the whole process and it's SLOWWWW!

// thus, as good practice, it's better to store user's input data from the interface into variables on your JS code, try to avoid repeatedly using jQuery to get DOM data, and then work on the stored data in your variable using vanilla JS logic to process under the hood (not on DOM directly)!

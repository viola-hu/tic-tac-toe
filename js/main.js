//**************************** PART 1 ***********************************
// put all logic side into one big object, not to pollute global scope!

const ticTacToe = {
  // each item inside this 2D array is board[X][Y], X,Y: 0-2
  board: [
    ["","",""],
    ["","",""],
    ["","",""]
  ],

  // initially set boardLength of 3, later when changing scale, will change its value accordingly.
  boardLength: 3,

  // calculate valid click number
  validClickNumber: 0,

  // store the UI input, X or O, into a variable for later use!
  currentPlayerSymbol:"",

  // a flag to store if the game has finished or not, for multiple use.
  gameIsOver: false,

  // store winner X or O, separate from currentPlayerSymbol
  winner:"",

  // variables to store each player's score
  wonNumberOfPlayerX:0,

  wonNumberOfPlayerO:0,

  // store draw number, easy for record and output on UI
  drawNumber:0,

  // store roundNumber, easy for record and output on UI
  roundNumber:1,

  putcurrentPlayerSymbolIntoDOM: function(){
    // when validClickNumber is odd, input 'X'; when even, input 'O'.
    // thus, the first click is always 'X'.
    this.validClickNumber += 1; // update the total number of valid clicks

    if (this.validClickNumber % 2 !== 0){
      // update currentPlayerSymbol's value, to be used for updating board array later!
      return this.currentPlayerSymbol = 'X';
    }else {
      return this.currentPlayerSymbol = 'O';
    }
  },

  putcurrentPlayerSymbolOntoBoard: function(locationX,locationY){
    this.board[locationX][locationY] = this.currentPlayerSymbol;
  },

  checkIfAnyWinning: function(matchingNumber) {
    if (matchingNumber === this.boardLength){
      // update winner info, X or O
      this.winner = this.currentPlayerSymbol;
      // record player's score
      if(this.winner === 'X'){
        this.wonNumberOfPlayerX += 1;
      } else{
        this.wonNumberOfPlayerO += 1;
      }
      // update game status to true if any winning
      this.gameIsOver = true;
    }
    // return the updated game status. If no winning from the above, return game status as false.
    return this.gameIsOver;
  },

  checkHorizontal: function(locationX){
    let matchingNumberHorizontal = 0;
    const arrayForCheck = this.board[locationX];

    for (let i = 0; i < this.boardLength; i++) {
      if (arrayForCheck[i] === this.currentPlayerSymbol){
        matchingNumberHorizontal += 1;
      }
    }

    return this.checkIfAnyWinning(matchingNumberHorizontal);
  },

  checkVertical: function(locationY){
    let matchingNumberVertical = 0;

    for (let i = 0; i < this.boardLength; i++) {
      if(this.board[i][locationY] === this.currentPlayerSymbol){
        matchingNumberVertical += 1;
      }
    }

    return this.checkIfAnyWinning(matchingNumberVertical);
  },

  checkBackwardDiagonal: function (){
    let matchingNumberBackwardDiagonal = 0;

    for (let i = 0; i < this.boardLength; i++) {
      if(this.board[i][i] === this.currentPlayerSymbol) {
        matchingNumberBackwardDiagonal += 1;
      }
    }

    return this.checkIfAnyWinning(matchingNumberBackwardDiagonal);
  },

  checkForwardDiagonal: function(){
    let matchingNumberForwardDiagonal = 0;

    for (let i = 0; i < this.boardLength; i++) {
      if(this.board[i][this.boardLength - 1 - i] === this.currentPlayerSymbol) {
        matchingNumberForwardDiagonal += 1;
      }
    }

    return this.checkIfAnyWinning(matchingNumberForwardDiagonal);
  },

  checkIfDraw: function(){
    if (this.validClickNumber === this.boardLength ** 2){
      this.drawNumber += 1;
      this.gameIsOver = true;
    }
    return this.gameIsOver;
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

  // boardScale retrieved from UI, and pass in here to generate new 2D array on logit side
  changeBoardScale: function(boardScale) {
    //use loop to create a new 2D array board
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
    }  // else, remain the current game roundNumber and game status as false.
    // if gameIsOver is still false, could either be at the beginning of the game or user wanted to switch to a different scale in the middle of the current round, as long as there's no result for the current round, should not count it as finished, unless they click 'newGame'!
    // Thus, if the current round is not over, keep current roundNumber and game status as false!
    // Also, no need to reset user score, keep accumulating
  },

  resetScore: function(){
    for (let i = 0; i < this.boardLength; i++) {
      this.board[i].fill("")
    }
    this.validClickNumber = 0;
    this.currentPlayerSymbol = "";
    this.gameIsOver = false;
    this.winner = "";
    this.wonNumberOfPlayerX = 0;
    this.wonNumberOfPlayerO = 0;
    this.drawNumber = 0;
    this.roundNumber = 1;
  },
};


//**************************** PART 2 ***********************************
// put all event handlers into $(document).ready() method's callback,
// so only after the DOM is fully loaded, these event handlers will be executed, got attached to the according matching DOM elements.

$(document).ready(function(){
  //# if any winner, what to do on UI, pre-determine pattern
  const whatToShowOnWinning = function() {
    $('h2').html(`Congrats! Player ${ticTacToe.winner} won!!!`);

    if (ticTacToe.winner === 'X') {
      $('#playerX').html(`Player X : ${ticTacToe.wonNumberOfPlayerX}`);
    } else {
      $('#playerO').html(`Player O : ${ticTacToe.wonNumberOfPlayerO}`);
    }
  };

  //# what to show when changing boardScale on UI
  const changeBoardScaleOnUI = function() {
    //1) clear h2, in case any previous content remains
    $('h2').html('');

    //2) create a new table on UI, with according id inside each td element!!!
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

  //# during Game, click each space - <td>, using event delegation!
  $(document).on('click', 'td', function(e){
    // ----------------------------- Step 1 ----------------------------------
    // on each click, show input on UI, handle game over situation and clicks on occupied spaces

    // first to check if the game is over or not,
    // if yes, it should just return the function, so no need to run the rest code.
    if(ticTacToe.gameIsOver === true) {
      $('h2').html('Game is over! Another round?!')
      return;
    }

    // second to check if a space is occupied,
    // if yes, no need to run the rest code, return callback directly!
    if ($(this).html() !== "" ){
      $('h2').html('The space is occupied!')
      return;
    }

    // when it comes to this step, means game hasn't finished, and this click is not on an occupied space
    // in case the last click was on an occupied space and added content to h2 element in DOM already, RESET h2 to empty.
    $('h2').html(' ');

    // call pre-defined function to put 'X' or 'Y' into UI/DOM
    $(this).html(ticTacToe.putcurrentPlayerSymbolIntoDOM());

    // ----------------------------- Step 2 ----------------------------------
    // store the UI input into logic side board array
    // <test>
    // this: the exact PURE DOM object that triggered the click event and its callback
    // e.g. <td id="0 1">O</td>

    // $(this): the according jQuery DOM object by using $() outside 'this', so it can use jQuery methods
    // e.g.
    // jQuery.fn.init [td#0 1]
    // 0: td#0 1
    // length: 1
    // __proto__: Object(0)

    // $(this).attr('id'): access the jQuery DOM object's id attribute, i.e. "0 0", "0 1", "0 2" etc.
    // typeof($(this).attr('id')): type of the id attribute's value is string
    // split the id attribute string value into an array with two string items of number, like ["0","0"]
    // and store the array into a variable first.
    const location = $(this).attr('id').split(" ") // i.e. ["0", "0"] etc.
    const locationX = parseInt(location[0]); // pure number for location X, from 0 - 2
    const locationY = parseInt(location[1]); // pure number for location Y, from 0 - 2

    // use the attribute value locationX and locationY to store the click UI input into the logic board 2D array
    // call pre-determined game object method to do the above
    ticTacToe.putcurrentPlayerSymbolOntoBoard(locationX, locationY);

    // ----------------------------- Step 3 ----------------------------------
    // check if any winning by calling pre-determined game object methods

    //**************** Core Logic *******************
    // loop through the whole 2D array to see if there's any existing item matching this pass-in click input on its 4x directions ‘米 ’.
    // if the total matching number on any of the 4x directions === board.length(i.e.3/4/5), then winner!!
    // this logic should work for any size of board(n * n)
    // on each direction only need to loop 'boardLength'x times

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
    }
  });

  //# click on 3X3, to reset the UI and logic data
  $('span#3').on('click', function(e){

    //---------------------------- 1, Step1 ---------------------------------
    // retrieve DOM object's id attribute that stores the boardscale number
    // to create a new board 2D array and update other relative variables

    // <test>
    // $('span#3').attr('id'); // accessing the event trigger - DOM object's id attribute: "3",
    // typeof($('span#3').attr('id')); // string
    // parse it into an integer number
    const boardScale = parseInt($('span#3').attr('id'));

    //---------------------------- 2, Step2 ---------------------------------
    // update the logic side, by calling the logic object method and pass in the above boardScale
    // doing this first as will need to use the updated logic variables to output into UI later
    ticTacToe.changeBoardScale(boardScale);

    //---------------------------- 3, Step3 ---------------------------------
    // update UI
    // create a separate function that can be applied to any of the scale change on UI
    changeBoardScaleOnUI();

  });

  //# click on 4X4, to reset the UI and logic data
  $('span#4').on('click', function(e){

    //---------------------------- 1, Step1 ---------------------------------
    // retrieve DOM object's id attribute that stores the boardscale number
    // to create a new board 2D array and update other relative variables
    const boardScale = parseInt($('span#4').attr('id'));

    //---------------------------- 2, Step2 ---------------------------------
    // update the logic side, by calling the logic object method and pass in the above boardScale
    // doing this first as will need to use the updated logic variables to output into UI later
    ticTacToe.changeBoardScale(boardScale);

    //---------------------------- 3, Step3 ---------------------------------
    // update UI
    // create a separate function that can be applied to any of the scale change on UI
    changeBoardScaleOnUI();

  });

  //# click on 5X5, to reset the UI and logic data
  $('span#5').on('click', function(e){

    //---------------------------- 1, Step1 ---------------------------------
    // retrieve DOM object's id attribute that stores the boardscale number
    // to create a new board 2D array and update other relative variables
    const boardScale = parseInt($('span#5').attr('id'));

    //---------------------------- 2, Step2 ---------------------------------
    // update the logic side, by calling the logic object method and pass in the above boardScale
    // doing this first as will need to use the updated logic variables to output into UI later
    ticTacToe.changeBoardScale(boardScale);

    //---------------------------- 3, Step3 ---------------------------------
    // update UI
    // create a separate function that can be applied to any of the scale change on UI
    changeBoardScaleOnUI();

  });

  //# newGame, click to reset UI and call pre-determined startNewGame function to reset logic side data.
  $('#newGame').on('click', function(){
    $('td').html('');
    $('h2').html('');
    // update logic side variables first
    ticTacToe.startNewGame();
    $('#gameRound').html(`Round ${ticTacToe.roundNumber}`);
  });

  //# reset score, reset UI looking, and call pre-determined function to update logic side
  $('#resetScore').on('click', function(){
    $('td,h2').html('');
    $('#gameRound').html(`Round 1`);
    $('#playerX').html('Player X : 0');
    $('#playerO').html('Player O : 0');
    $('#draw').html('Draw : 0');
    ticTacToe.resetScore();
  });
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

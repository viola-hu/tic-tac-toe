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
  xOrY:"",

  putXOrYIntoDOM: function(){
    if (this.validClickNumber % 2 === 0){
      //  when validClickNumber is even, input 'X', when odd, input 'O'. As validClickNumber starts from 0, so the first input is always 'X'
      this.validClickNumber += 1; // update the total number of valid clicks
      this.xOrY = 'X';// update xOrY variable's value, to be used for storing click content into board array later
      return this.xOrY;
    }else {
      this.validClickNumber += 1;
      this.xOrY = 'O';
      return this.xOrY;
    }
  },

  putXOrYOntoBoard: function(locationX,locationY){
    this.board[locationX][locationY] = this.xOrY;
  },

  // this is to store return value from the click event callback function, remembering if the game has finished or not!
  gameIsOver: false,

  checkHorizontal: function(locationX){
    let matchingNumberHorizontal = 0;
    const arrayForCheck = this.board[locationX];

    for (var i = 0; i < this.boardLength; i++) {
      if (arrayForCheck[i] === this.xOrY){
        matchingNumberHorizontal += 1;
      }
    }

    if (matchingNumberHorizontal === this.boardLength){
      this.gameIsOver = true;
      return this.gameIsOver;
    }
  },

  checkVertical: function(locationY){
    let matchingNumberVertical = 0;

    for (var i = 0; i < this.boardLength; i++) {
      if(this.board[i][locationY] === this.xOrY){
        matchingNumberVertical += 1;
      }
    }

    if (matchingNumberVertical === this.boardLength){
      this.gameIsOver = true;
      return this.gameIsOver ;
    }
  },

  checkBackwardDiagonal: function (){
    let matchingNumberBackwardDiagonal = 0;

    for (var i = 0; i < this.boardLength; i++) {
      if(this.board[i][i] === this.xOrY) {
        matchingNumberBackwardDiagonal += 1;
      }
    }

    if (matchingNumberBackwardDiagonal === this.boardLength){
      this.gameIsOver = true;
      return this.gameIsOver;
    }
  },

  checkForwardDiagonal: function(){
    let matchingNumberForwardDiagonal = 0;

    for (var i = 0; i < this.boardLength; i++) {
      if(this.board[i][this.boardLength - 1 - i] === this.xOrY) {
        matchingNumberForwardDiagonal += 1;
      }
    }

    if (matchingNumberForwardDiagonal === this.boardLength){
      this.gameIsOver = true;
      return this.gameIsOver;
    }
  },

  checkIfNoWinning: function(){
    if (this.validClickNumber === this.boardLength ** 2){
      this.gameIsOver = true;
      return this.gameIsOver;
    }
  },

};


// click event, for each click, what to do!
$('td').on('click', function(e){
  //****** Step 1, on each click, show input on UI, handle game over situation and clicks on occupied spaces ******
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
  // in case the last click was on an occupied space and added content to h2 element in DOM already, for the current round, need to RESET it to empty, and restart the check if the clicked space this time is occupied or not and move on to this step if not.
  $('h2').html(' ');

  // call pre-defined function to put 'X' or 'Y' into UI/DOM
  $(this).html(ticTacToe.putXOrYIntoDOM());

  //****** Step 2, store the UI input into board array ******
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
  // This, on top of the fact that this click is not on an occupied place, can put the this.xOrY directly into the board array!
  // use pre-determined game object function to store the input into board array of the game object.
  ticTacToe.putXOrYOntoBoard(locationX, locationY);

  //****** Step 3, check matching spaces and decide if any winning ******
  //**************** Core Logic *******************
  // loop through the whole 2D array to see if there's any existing item matching this pass-in click content on its 4x directions ‘米 ’.
  // if the total matching number on any of the 4x directions === board.length(i.e. in this case is 3), then winner!!
  // this logic should work for any size of board(n * n)
  // on each direction only need to loop 'board.length'x times, store it in a variable for multiple uses

  //******* 1) loop through horizontal direction *******
  if (ticTacToe.checkHorizontal(locationX)){
    $('h2').html('Congrats! You won!!!');
    return;
  }

  //******* 2) loop through vertical direction *******
  if (ticTacToe.checkVertical(locationY)){
    $('h2').html('Congrats! You won!!!');
    return;
  }

  //******* 3) loop through backward diagonal direction '\' *******
  // if this input's locationX !== locationY, means, it's not in the center backward diagonal line,
  // then there's no need to check backward diagonal direction！
  // as the only way for this kind of location to win is through horizontal and vertical line,
  // which should have been checked on the above 2x steps!
  if (locationX === locationY) {
    if(ticTacToe.checkBackwardDiagonal()) {
      $('h2').html('Congrats! You won!!!');
      return;
    }
  }

  //******* 4) loop through forward diagonal direction '/' *******
  if ((locationX + locationY) === (ticTacToe.boardLength - 1)){
    if(ticTacToe.checkForwardDiagonal()){
      $('h2').html('Congrats! You won!!!');
      return;
    }
  }

  // ****** 5) no winning after all *******
  if(ticTacToe.checkIfNoWinning()){
    $('h2').html('Drew!');
    return;
  }
});
// So far, the above logic should work for multiple line board,





// event callback, on each event occasion
// - retrieves DOM data
// - pass the retrieved DOM data to core logic functions (stored in game object) which determine whether to change something and return value accordingly
// - based on the return value from the core logic functions, event callback communicates with DOM to make the actual change happen in DOM/UI







// 1>>>> put all check loops into separate functions inside an object as methods, make click event callback look neat! -- done!

// 2>>>> think about next like another round!

// 3>>>> finally, decorate UI!















// tic-tac-toe
// Good Practice:

// As it now has User Interface, not only the vanilla JS at the core logic part, need to connect to the DOM to get users input value and store the data to the back core logic and then process. After the processing, return the result and communicate with DOM again to output the result onto the interface to for user view!!!

// - user's input data from the interface lives in the DOM, you can still use jQuery to talk to the DOM and get these data, and apply logic directly at the same time. But you will need to repeatedly use jQuery to get these data for the whole process and it's SLOWWWW!

// - thus, as good practice, it's better to store user's input data from the interface into variables on your JS code, try to avoid repeatedly using jQuery to get DOM data, and then work on the stored data in your variable using vanilla JS logic to process under the hood (not on DOM directly)!

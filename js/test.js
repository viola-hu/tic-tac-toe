const board = [
  ["","",""],
  ["","",""],
  ["","",""]
]
// each item inside this board is board[X][Y], X,Y: 0-2




//********************* DOM -> Variable *************************
const boardLength = board.length;
// calculate valid click number,
// which can be used to make sure that X and O will take turns to be put into boxes
let validClickNumber = 0;

let xOrY; // store the UI input, X or Y, into a variable for later use!

const putXOrY = function(element){
  if (validClickNumber % 2 === 0){
    //  when validClickNumber is even, input 'X', when odd, input 'O'. As validClickNumber starts from 0, so the first input is always 'X'
    validClickNumber += 1; // update the total number of valid clicks
    $(element).html('X'); // add 'X' to the clicked td element as content
    xOrY = 'X'; // update xOrY variable's value, to be used for storing click content into board array later
  }else {
    validClickNumber += 1;
    $(element).html('O');
    xOrY = 'O';
  }
};

let gameIsOver = false; // this is to store return value from the click event callback function, remembering if the game has finished or not!

const checkHorizontal = function(locationX){
  let matchingNumberHorizontal = 0;
  const arrayForCheck = board[locationX];

  for (var i = 0; i < boardLength; i++) {
    if (arrayForCheck[i] === xOrY){
      matchingNumberHorizontal += 1;
    }
  }

  if (matchingNumberHorizontal === boardLength){
    $('h2').html('Congrats! You won!!!');
    gameIsOver = true;
    return gameIsOver;
  }
}






$('td').on('click', function(e){
//----- Step 1, on each click, show input on UI, make sure duplicate clicks handled -----

  if(gameIsOver === true) {
    $('h2').html('Game is over! Try another round?!')
    return;
  }
  // first to check if the game is over or not,
  // if yes, it should just return the function, so no need to run the rest code.
  // if not, can continue the game, and check if a space is occupied or not as below.

  // if a space is occupied, no need to run the rest code, return callback directly! so can start from the next new click.
  if ($(this).html() !== "" ){
    $('h2').html('The space is occupied!')
    return;
  }

  $('h2').html(' ');
  // when it comes to this step, means, the game hasn't finished.
  // in case the last click was on an occupied space and added content to h2 element in DOM already, for the current round, need to RESET it to empty, and restart the check if the clicked space this time is occupied or not and move on to this step if not.

  putXOrY(this); // call pre-defined function to put 'X' or 'Y' into UI/DOM

  //----- Step 2, store the UI input variable into board array --------
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
  // This, on top of the fact that this click is not on an occupied place, can put the xOrY directly into the board array!
  board[locationX][locationY] = xOrY;

  //*************** Core Logic *******************
  // loop through the whole 2D array to see if there's any existing item matching this pass-in click content on its 4x directions ‘米 ’.
  // if the total matching number on any of the 4x directions === board.length(i.e. in this case is 3), then winner!!
  // this logic should work for any size of board(n * n)
  // on each direction only need to loop 'board.length'x times, store it in a variable for multiple uses

  //******* 1, loop through horizontal direction *******
  if (checkHorizontal(locationX)){
    return;
  }
  //
  //

///////////////////////////////////////////////////////////////////// 21 May 2019, defactor up to here!!!
  //******* 2, loop through vertical direction *******
  let matchingNumberVertical = 0;

  for (var i = 0; i < boardLength; i++) {
    if(board[i][locationY] === xOrY){
      matchingNumberVertical += 1;
    }
  }
  // console.log(matchingNumberVertical); //OK
  if (matchingNumberVertical === boardLength){
    gameIsOver = true;
    $('h2').html('Congrats! You won!!!');
    // console.log('winning!');//OK
    return ;
  }









  //******* 3, loop through backward diagonal direction '\' *******
  // if this input's locationX !== locationY, means, it's not in the center backward diagonal line,
  // then there's no need to check backward diagonal direction！
  // as the only way for this kind of location to win is through horizontal and vertical line,
  // which should have been checked on the above 2x steps!
  if (locationX === locationY) {
    let matchingNumberBackwardDiagnal = 0;

    for (var i = 0; i < boardLength; i++) {
      if(board[i][i] === xOrY) {
        matchingNumberBackwardDiagnal += 1;
      }
    }
    // console.log(matchingNumberBackwardDiagnal); //OK
    if (matchingNumberBackwardDiagnal === boardLength){
      gameIsOver = true;
      $('h2').html('Congrats! You won!!!');
      // console.log('winning!');//OK
      return ;
    }
  }


  //******* 4, loop through forward diagonal direction '/' *******
  // if this input's (locationX + locationY) !== (array.length - 1), means, it's not in the center forward diagonal line,
  // then there's no need to check forward diagonal direction!
  // as the only way for this kind of location to win is through horizontal and vertical line,
  // which should have been checked on the above 2x steps!
  // if not in the center forward diagonal line, after checking the above steps up to here, gameIsOver remains false;
  if ((locationX + locationY) === (boardLength - 1)){
    let matchingNumberForwardDiagnal = 0;

    for (var i = 0; i < boardLength; i++) {
      if(board[i][boardLength - 1 - i] === xOrY) {
        matchingNumberForwardDiagnal += 1;
      }
    }
    // console.log(matchingNumberForwardDiagnal); //OK
    if (matchingNumberForwardDiagnal === boardLength){
      gameIsOver = true;
      $('h2').html('Congrats! You won!!!');
      // console.log('winning!'); //OK
      return;
    }
  }

  // the worst case scenerio, no winner at all, need to return
  // after clicking all the spaces, the total number of spaces in the array should be (array.length ** 2),
  // if there's any winner, it should have returned in previous steps, and the whole click event callback function finishes, also triggers the event to be off.
  // if there's no winner, it will reach this step, but as it's included inside the event callback for each click, only when the valid click numbers reached (array.length ** 2), it means all spaces are occupied and there's no matching from the above steps, it's also Game Over!
  if (validClickNumber === boardLength ** 2){
    gameIsOver = true;
    $('h2').html('Ooooops! No luck! Try again?!');
    // in this step, gameIsOver remain false!
    return;
  }
});

// So far, the above logic should work for multiple line board,
// we got return value from the click event callback function, which also triggered the output on UI!
// !!! the gameIsOver variable should sit outside the click event, to record if the game has finished or not!






// 1>>>> put all check loops into separate functions inside an object as methods, make click event callback look neat!
// 2>>>> finally, decorate UI!
// 3>>>> think about next like another round!






// tic-tac-toe
// Good Practice:

// As it now has User Interface, not only the vanilla JS at the core logic part, need to connect to the DOM to get users input value and store the data to the back core logic and then process. After the processing, return the result and communicate with DOM again to output the result onto the interface to for user view!!!

// - user's input data from the interface lives in the DOM, you can still use jQuery to talk to the DOM and get these data, and apply logic directly at the same time. But you will need to repeatedly use jQuery to get these data for the whole process and it's SLOWWWW!

// - thus, as good practice, it's better to store user's input data from the interface into variables on your JS code, try to avoid repeatedly using jQuery to get DOM data, and then work on the stored data in your variable using vanilla JS logic to process under the hood (not on DOM directly)!

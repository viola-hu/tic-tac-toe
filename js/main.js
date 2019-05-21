const board = [
  ["","",""],
  ["","",""],
  ["","",""]
]
// each item inside this board is board[X][Y], X,Y: 0-2




//********************* DOM -> Variable *************************
// calculate valid click number,
// which can be used to make sure that X and O will take turns to be put into boxes
let validClickNumber = 0;


// still need to put output result inside the click event callback, but as it's just a repetitive thing, can write it outside the event in a function, and when it gets to return result, can call the function from inside the event callback.

const outputResult = function (winningOrNot) {

  if (winningOrNot === true) {
    $('.hidden').html('Winning!!!').css('visibility','visible');
    $('td').off('click');
  } else {
    $('.hidden').html('Oooops! No luck!').css('visibility','visible');
    $('td').off('click');
  }
};
//************************
// put a game handler to stop the game once the click event returns a result, either winning or no winner at all!
// #1, if use $('td').off('click'); to turn off the event, once this round of game is finished, click is not working anymore on the page, as it's turned off. Users will need to refresh the page and restart.
//The whole above process is no problem for only one round of game!!
//#2, However, if you are planning on running the game for multiple rounds without refreshing the page, for example, click a 'button' to restart game inside the same page, it will require to turn on the 'click' event again, as the $('td') element's click event is turned off in the DOM by the last round! which requires more steps to turn it back on.
//#3, Thus good practice is not to turn off the event, instead, add another if-statement inside the event to test at the beginning if the game has finished/returned or not, by using the variable 'winningOrNot' to control the flow!
//#4, Meanwhile, the variable winningOrNot should stay outside of the click event so that it stores the event info after every click instead of being reset when starting a new click!!



// Q: if call the above function to turn off the click event, then inside the checking loop, is 'return' at the end still necessary? or even without 'return', nothing further would happen?
// A: return is needed! turn off the event trigger only means, for the next click, nothing would happen as the event is turned off. But for the current round of click event, after this outputResult function is called, it will continue to run the following code in the original event callback function if there's no return!
//**************************

$('td').on('click', function(e){
//----- Step 1, on each click, show input on UI, make sure duplicate clicks handled -----

  let xOrY; // store the UI input, X or Y, into a variable for later use!

  if ($(this).html() !== "" ){ // click on any box, if it's not empty - occupied already, return message!
  $('h2').html('The space is occupied!')

  //-----------------------------------------------------
    // $('.hidden').css('visibility','visible');
    // instead of using hide/show contents by CSS, can simply add an empty element 'h2' at the beginning, and later add or change .html() contents inside it. Thus, there's no need to change CSS that's separated in another file then.
  //-----------------------------------------------------
    return;  // if a space is occupied, no need to run the rest code, return callback directly! so can start from the next new click.
  }
  //
  // if( winningOrNot) {
  //
  //   return;
  // }


  $('h2').html(' '); // in case last click made the hidden part to visible, reset here! if it's still hidden, no harm!
  //Q: is this a good approach? kind of repetitive!
  //A: YES, it's necessary, like reset!!!


  if (validClickNumber % 2 === 0){ // Otherwise, if it's empty, when validClickNumber is even, input 'X', when odd, input 'O'. As validClickNumber starts from 0, so the first input is always 'X'
    validClickNumber += 1; // update the total number of valid clicks
    $(this).html('X'); // add 'X' to the clicked td element as content
    xOrY = 'X'; // update xOrY variable's value, to be used for storing click content into board array later
  } else {
    validClickNumber += 1;
    $(this).html('O');
    xOrY = 'O';
  }
  // console.log(xOrY); //OK

  //----- Step 2, store the UI input variable into board array --------
  // get the click event object data - target property, it prints out the pure DOM element that user just clicked, including all its ATTRIBUTEs and contents!
  // store this target DOM element into a variable to utilise its id attribute!!!
  const clickedTarget = e.target;
  // console.log(clickedTarget); // print out the clicked td element // OK
  // console.log($(clickedTarget).attr('id')); // print out the id of the td element, which is a string 'X Y' // OK
  // console.log(typeof($(clickedTarget).attr('id'))); // confirmed it's a string // OK


  // from the event target DOM element, get the id attribute, whose value is a string with two numbers, like 'X Y'
  // and split them into an array with two string items of number, like ['X','Y'], and store it into a variable to avoid repetition.
  const location = $(clickedTarget).attr('id').split(" ")
  // console.log(location); // OK
  const locationX = parseInt(location[0]); // pure number for location X, from 0 - 2
  const locationY = parseInt(location[1]); // pure number for location Y, from 0 - 2
  // console.log(locationX, 'and', locationY); // OK

  // use the attribute value X and Y to locate where in the 2D array to store the click content
  // need to avoid user clicking into the occupied place and changing the value there!!!
  if (board[locationX][locationY] === '') {
    board[locationX][locationY] = xOrY;
  }
  // console.table(board); //OK
  // so far, corretly store the click content 'X' or 'O' into the right position of the board array!


  //*************** Core Logic *******************
  // use logic to judge if succeed or not!!!
  // loop through the whole 2D array to see if there's any existing item matching this pass-in click content on its 4x directions ‘米 ’.
  // if the total matching number on any of the 4x directions === board.length(i.e. in this case is 3), then winner!!
  // this logic should work for any size of board(n * n)


  // on each direction only need to loop 'board.length'x times, store it in a variable for multiple uses
  const boardLength = board.length;
  let winningOrNot = false; // this is to store return value from the click event callback function, to pass its final value to UI for further result display.

  //******* 1, loop through horizontal direction *******
  const arrayForCheck = board[locationX];
  // console.log(arrayForCheck);//OK
  let matchingNumberHorizontal = 0;

  for (var i = 0; i < boardLength; i++) {
    if (arrayForCheck[i] === xOrY){
      matchingNumberHorizontal += 1;
    }
  }
  // console.log(matchingNumberHorizontal); //OK
  if (matchingNumberHorizontal === boardLength){
    winningOrNot = true;
    outputResult(winningOrNot);
    // console.log('winning!'); //OK
    return ;
  }
  //
  //

  //******* 2, loop through vertical direction *******
  let matchingNumberVertical = 0;

  for (var i = 0; i < boardLength; i++) {
    if(board[i][locationY] === xOrY){
      matchingNumberVertical += 1;
    }
  }
  // console.log(matchingNumberVertical); //OK
  if (matchingNumberVertical === boardLength){
    winningOrNot = true;
    outputResult(winningOrNot);
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
      winningOrNot = true;
      outputResult(winningOrNot);
      // console.log('winning!');//OK
      return ;
    }
  }


  //******* 4, loop through forward diagonal direction '/' *******
  // if this input's (locationX + locationY) !== (array.length - 1), means, it's not in the center forward diagonal line,
  // then there's no need to check forward diagonal direction!
  // as the only way for this kind of location to win is through horizontal and vertical line,
  // which should have been checked on the above 2x steps!
  // if not in the center forward diagonal line, after checking the above steps up to here, winningOrNot remains false;
  if ((locationX + locationY) === (boardLength - 1)){
    let matchingNumberForwardDiagnal = 0;

    for (var i = 0; i < boardLength; i++) {
      if(board[i][boardLength - 1 - i] === xOrY) {
        matchingNumberForwardDiagnal += 1;
      }
    }
    // console.log(matchingNumberForwardDiagnal); //OK
    if (matchingNumberForwardDiagnal === boardLength){
      winningOrNot = true;
      outputResult(winningOrNot);
      // console.log('winning!'); //OK
      return;
    }
  }

  // the worst case scenerio, no winner at all, need to return
  // after clicking all the spaces, the total number of spaces in the array should be (array.length ** 2),
  // if there's any winner, it should have returned in previous steps, and the whole click event callback function finishes, also triggers the event to be off.
  // if there's no winner, it will reach this step, but as it's included inside the event callback for each click, only when the valid click numbers reached (array.length ** 2), meanwhile there's no matching from the above steps, it can determine that there's no winner at the end, Game Over!
  if (validClickNumber === boardLength ** 2){
    outputResult(winningOrNot); // in this step, winningOrNot remain false!
    return;
  }
});

// So far, the above logic should work for multiple line board,
// we got return value from the click event callback function, which also triggered the output on UI!
// !!! the winningOrNot variable should sit outside the click event, then can use this returned value to UI intercation.






  // 4>>>> put all check loops into separate functions, make click event callback look neat!

// need to think about output into DOM tomorrow - Done!
// also separate jQuery with vanilla JS
// also further refactor
// finally, decorate UI!






// tic-tac-toe
// Good Practice:

// As it now has User Interface, not only the vanilla JS at the core logic part, need to connect to the DOM to get users input value and store the data to the back core logic and then process. After the processing, return the result and communicate with DOM again to output the result onto the interface to for user view!!!

// - user's input data from the interface lives in the DOM, you can still use jQuery to talk to the DOM and get these data, and apply logic directly at the same time. But you will need to repeatedly use jQuery to get these data for the whole process and it's SLOWWWW!

// - thus, as good practice, it's better to store user's input data from the interface into variables on your JS code, try to avoid repeatedly using jQuery to get DOM data, and then work on the stored data in your variable using vanilla JS logic to process under the hood (not on DOM directly)!

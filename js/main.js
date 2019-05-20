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

$('td').on('click', function(e){
  let xOrY = '';




  if ($(this).html() !== ""){ // click on any box, if it's not empty, return alert!
    alert("This space is occupied!")
  } else
  if (validClickNumber % 2 === 0){ // if empty, when validClickNumber is even, input 'X', when odd, input 'O'. As validClickNumber starts from 0, so the first input is 'X'
    validClickNumber += 1; //update the total number of valid clicks
    $(this).html('X'); //add 'X' to the clicked td element as content
    xOrY = 'X'; //update xOrY's value, to be used for storing click content into variable later
  } else {
    validClickNumber += 1;
    $(this).html('O');
    xOrY = 'O';
  }
  // console.log(xOrY); //OK


  // get the click event object data - target property, it prints out the pure DOM element that you just clicked, including all its ATTRIBUTE information - id attribute!
  const clickedTarget = e.target;
  // console.log(clickedTarget); // print out the clicked td element // OK
  // console.log($(clickedTarget).attr('id')); // print out the id of the td element, which is a string 'X Y' // OK
  // console.log(typeof($(clickedTarget).attr('id'))); // confirmed it's a string // OK


  // get the id attribute from the event target property, whose value is a string with two numbers,
  // and split them into an array with two string items of number.
  const location = $(clickedTarget).attr('id').split(" ")
  // console.log(location); // OK
  const locationX = parseInt(location[0]); // pure number for location X
  const locationY = parseInt(location[1]); // pure number for location Y
  // console.log(locationX, 'and', locationY); // OK

  // use the attribute value X and Y to locate where in the 2D array to store the click input
  // need to try avoid user click into the occupied place and change the value there!!!
  if (board[locationX][locationY] === '') {
    board[locationX][locationY] = xOrY;
  }
  // console.table(board); //OK
  //so far, corretly store the click X or O into the right position of the array!


  //*************** Core Logic *******************
  //use logic to judge if succeed or not!!!

  //loop through the whole 2D array to see if there's any item matching this pass-in value on 4x directions ‘米 ’
  // if the total matching number === 3, then winner!!
  // this logic should work for any size of board(n * n)


  // on each direction only need to loop 'board.length'x times
  const boardLength = board.length;
  let winningOrNot = false;

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
    console.log('winning!');
    return winningOrNot;
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
    console.log('winning!');
    return winningOrNot;
  }


  //******* 3, loop through backward diagonal direction '\' *******
  // if this input's locationX !== locationY, means, it's not in the center backward diagonal line,
  // then there's no need to check backward diagonal direction！
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
      console.log('winning!');
      return winningOrNot;
    }
  }


  //******* 4, loop through forward diagonal direction '/' *******
  // if this input's (locationX + locationY) !== (array.length - 1), means, it's not in the center forward diagonal line,
  // then there's no need to check forward diagonal direction!
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
      console.log('winning!');
      return winningOrNot;
    }
  }

  return winningOrNot;
});








//1,
// tic-tac-toe
// Good Practice:

// As it now has User Interface, not only the vanilla JS at the core logic part, need to connect to the DOM to get users input value and store the data to the back core logic and then process. After the processing, return the result and communicate with DOM again to output the result onto the interface to for user view!!!

// - user's input data from the interface lives in the DOM, you can still use jQuery to talk to the DOM and get these data, and apply logic directly at the same time. But you will need to repeatedly use jQuery to get these data for the whole process and it's SLOWWWW!

// - thus, as good practice, it's better to store user's input data from the interface into variables on your JS code, try to avoid repeatedly using jQuery to get DOM data, and then work on the stored data in your variable using vanilla JS logic to process under the hood (not on DOM directly)!

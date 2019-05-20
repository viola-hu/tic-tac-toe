const board = [
  ["","",""],
  ["","",""],
  ["","",""]
]

// each item inside this board is board[X][Y] X,Y: 0-2









//***************DOM Manipulation*************************
// click on any box, if not empty, it will put text inside it!
// make sure X and O will take turn to be put onto the boxes
let numberOfClicks = 0;

$('td').on('click', function(e){
  numberOfClicks += 1;
  // console.log(numberOfClicks);
  let xORy = '';
  if ($(this).html() === ""){
    alert("This space is occupied!")
  } else
  if (numberOfClicks % 2 !== 0){
    $(this).html('X');
    xORy = 'X';
  } else {
    $(this).html('O');
    xORy = 'O';
  }

  // console.log(xORy); //OK

  const clickedTarget = e.target;
  // console.log(clickedTarget); // print out the clicked td element // OK
  // console.log($(clickedTarget).attr('id')); // print out the id of the td element, which is a string 'X Y' // OK
  // console.log(typeof($(clickedTarget).attr('id'))); // confirmed it's a string // OK

  // get the X, Y of clicked element, and put them into the board.
  const location = $(clickedTarget).attr('id').split(" ")
  // console.log(location); // OK
  const locationX = parseInt(location[0]); // pure number for location X
  const locationY = parseInt(location[1]); // pure number for location Y
  // console.log(locationX, 'and', locationY); // OK

  // store the click element into array
  // need to try avoid user click into the occupied place and change the value there!!!
  if (board[locationX][locationY] === '') {
    board[locationX][locationY] = xORy;
  } else {

  }
});//so far, corretly store the click X or O into the right position of the array!
//
//use logic to judge if succeed or not!!!


//1,
// tic-tac-toe
// Good Practice:

// As it now has User Interface, not only the vanilla JS at the core logic part, need to connect to the DOM to get users input value and store the data to the back core logic and then process. After the processing, return the result and communicate with DOM again to output the result onto the interface to for user view!!!

// - user's input data from the interface lives in the DOM, you can still use jQuery to talk to the DOM and get these data, and apply logic directly at the same time. But you will need to repeatedly use jQuery to get these data for the whole process and it's SLOWWWW!

// - thus, as good practice, it's better to store user's input data from the interface into variables on your JS code, try to avoid repeatedly using jQuery to get DOM data, and then work on the stored data in your variable using vanilla JS logic to process under the hood (not on DOM directly)!

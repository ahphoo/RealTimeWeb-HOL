var board;
var game;
var socket = io();

window.onload = function () {initGame();};

var initGame = function() {
   var cfg = {
       draggable: true,
       position: 'start',
       onDrop: handleMove,
   };
   
   board = new ChessBoard('gameBoard', cfg);
   game = new Chess();
};

var handleMove = function(source, target ) {
    var move = game.move({from: source, to: target});
    
    if (move === null)  return 'snapback';
    else {
    	socket.emit('move', move);
	updateStatus();
    }
};

var updateStatus = function() {
	var status = '';

	var moveColor = 'White';
	if (game.turn() === 'b') {
		moveColor = 'Black';
	}

	//checkmate
	if (game.in_checkmate() === true) {
		status = 'Game over, ' + moveColor + ' is in checkmate.';
	}

	//draw
	else if (game.in_draw() === true) {
		status = 'Game over, drawn position';
	}

	//game not over
	else {
		status = moveColor + ' to move';

		//check
		if(game.in_check() === true) {
			status += ', ' + moveColor + ' is in check';
		}
	}
	socket.emit('status', status);
}
	
socket.on('move', function(msg) {
    game.move(msg);
    board.position(game.fen());
});

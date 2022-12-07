const {controller} = require('./controllers/index.js');
const router = require('express').Router();
const { Socket } = require('socket.io');
const messageController = require('./controllers/messages')

const socketRouter = async (socket = Socket) => {
  socket.on('start-game', async gameState => {
    setInitialState(gameState)
  })
  socket.on('end-game', () => {
    delete socket.ekGameState
  })
  socket.on('play-card', (userCardType, userCardIdxs, affectedUser, affectedUserIdx, insertIdx) => {
    playCard(userCardType, userCardIdxs, affectedUser, affectedUserIdx, insertIdx)
  })
  socket.on('draw-card', (username) => {
    drawCard();
  })
  socket.on('player-loses', (username) => {
  })
}

module.exports.socketRouter = socketRouter;
module.exports.router = router;

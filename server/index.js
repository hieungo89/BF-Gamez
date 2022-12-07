const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const { controller } = require('./controllers/index.js');
const options = {
  cors: {
    origin: ['http://localhost:3000', "https://admin.socket.io"],
    credentials: true
  }
};
const { instrument } = require("@socket.io/admin-ui");
const io = require('socket.io')(httpServer, options);
const { router, socketRouter } = require('./routes');

const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId({ length: 6 });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const shuffle = (targetArray) => {
  let i = targetArray.length;
  while(i > 0) {
    let idxToSwitch = Math.floor(Math.random() * targetArray.length);
    i--;
    let temp = targetArray[i];
    targetArray[i] = targetArray[idxToSwitch];
    targetArray[idxToSwitch] = temp;
  }
  return targetArray;
}

io.on('connection', socket => {
  const setInitialState = (gameState) => {
    gameState.playerOrder = shuffle(gameState.playerOrder);
    gameState.initialOrder = [...gameState.playerOrder];
    // prevTurns should have socketid or username and play
    // we might not need prevTurns since nope just cancels a move before it's effect is played
    gameState.prevTurns = [];
    gameState.attackCount = 0;
    gameState.currentPlayer = gameState.playerOrder.shift();
    socket.ekGameState = gameState;
    emitState(socket.ekGameState);
  }

  // TODO
  const updateState = (username, cardIdx) => {
  }

  const emitState = (gameState) => {
    // emit each player's hand, other players hand count and count of deck to respective socket
    // currently emitting to single socket; grab other sockets from current room
    console.log('gamestate room in emitState', gameState.room)
    // io.to(`${gameState.room}`).emit('game-state', gameState)
    // socket.to(room).emit('receive-message', message);
    io.of('/').to(gameState.room).emit('game-state', gameState);
  }
  socket.on('update-socket', (gameState) => {
    socket.ekGameState = gameState;
  })

  const drawCard = () => {
    let newCard = socket.ekGameState.deck.pop();
    let deck = socket.ekGameState.deck;
    let currPlayer = socket.ekGameState.currentPlayer;
    socket.ekGameState.attackCount = 0;

    if(newCard.type === 'bomb'){
      //Emit the bomb
      io.of('/').to(socket.ekGameState.room).emit('bomb', newCard, socket.ekGameState);

      let timer = 10;
      const bombTimer = setInterval(() => {
        // if attack count > 0 and cardType !== attack {reset attack count}
        io.of('/').to(socket.ekGameState.room).emit('bomb-countdown', timer);

        timer--;

        if(timer < 0) {
          // player loses
          // remove player from order and delete player hand
          clearInterval(bombTimer);

          socket.ekGameState.playerOrder = socket.ekGameState.playerOrder.filter((user) => {
            return user !== currPlayer;
          })

          if(socket.ekGameState.playerOrder.length === 1) {
            io.of('/').to(socket.ekGameState.room).emit('game-over', socket.ekGameState.playerOrder[0]);
            return;
          }
          socket.ekGameState[currPlayer] = null;
          let tempTurn = {
            origin: socket.ekGameState.currentPlayer,
            userCardType: 'bomb',
            userCardIdxs: [],
            affectedUser: '',
            affectedUserIdx: '',
            insertIdx: ''
          }
          socket.ekGameState.prevTurns.push(tempTurn);

          endTurn(false);
        }
      }, 1000);

      socket.on('defuse', (insertIdx, userCardIdxs) => {
        // console.log('defuse detected')
        clearInterval(bombTimer);
        socket.ekGameState[currPlayer].splice(userCardIdxs[0], 1);

        socket.ekGameState.deck = deck.slice(0, insertIdx).concat([newCard]).concat(deck.slice(insertIdx));
        let tempTurn = {
          origin: socket.ekGameState.currentPlayer,
          userCardType: 'defuse',
          userCardIdxs: userCardIdxs ?? [],
          affectedUser: '',
          affectedUserIdx: '',
          insertIdx: ''
        }
        socket.ekGameState.prevTurns.push(tempTurn);
        io.of('/').to(socket.ekGameState.room).emit('defuse');
        endTurn();

      })
      //it should remain on their turn so we can just
      // end function?
    } else {
      socket.ekGameState[currPlayer].push(newCard);
      endTurn();
    }
  }

  const endTurn = (shouldAddToEnd = true) => {
    socket.removeAllListeners('defuse')
    let currPlayer = socket.ekGameState.currentPlayer;
    const playerOrder = socket.ekGameState.playerOrder;

    if (currPlayer !== playerOrder[playerOrder.length - 1] && shouldAddToEnd) {
      playerOrder.push(currPlayer);
    }
    // Set current player
    socket.ekGameState.currentPlayer = playerOrder.shift();
    emitState(socket.ekGameState);
    // reset attack counter if attack wasn't played
  }

  const removeCard = (userCardIdxs, user) => {
    let userToRemoveFrom = socket.ekGameState.currentPlayer;
    if(user) {
      console.log('My ID:', user);
      userToRemoveFrom = user;
    }
    socket.ekGameState[userToRemoveFrom] = socket.ekGameState[userToRemoveFrom].filter((card, i) => {
      if(!userCardIdxs.includes(i)) {
        return true;
      }
    })
  }

  const playCard = (userCardType, userCardIdxs, affectedUser, affectedUserIdx, insertIdx) => {
    const gameState = socket.ekGameState;
    const deck = socket.ekGameState.deck;
    const currPlayer = socket.ekGameState.currentPlayer;
    const playerHand = socket.ekGameState[currPlayer];
    const playerOrder = socket.ekGameState.playerOrder;
    // TODO: draw card only on end turn, don't assume a cardtype played means turn is over

    //Emit the action to all players, so they can see the card
    let tempTurn = {
      origin: socket.ekGameState.currentPlayer,
      userCardType: userCardType ?? '',
      userCardIdxs: userCardIdxs ?? [],
      affectedUser: affectedUser ?? '',
      affectedUserIdx: affectedUserIdx ?? '',
      insertIdx: insertIdx ?? ''
    }
    //emit just this object

    // Remove played cards from user's hand
    removeCard(userCardIdxs);
    socket.ekGameState.prevTurns.push(tempTurn);
    emitState(socket.ekGameState)

    // SANS ATTACK
    // [3, 0, 2, 1]
    // [0, 2, 1, 3]

    // WITH ATTACK
    // [3, 0, 2, 1]
    // [0, 0, 2, 1, 3]

    // Set 5 second timer after calling playCard and emit the count down
    let timer = 5;

    const x = setInterval(() => {
      // if attack count > 0 and cardType !== attack {reset attack count}
      io.of('/').to(socket.ekGameState.room).emit('card-countdown', timer)
      timer -= 1;
      if (timer < 0) {
        clearInterval(x);
        switch (userCardType) {
          case 'attack':
            // increment attack count
            socket.ekGameState.attackCount++;
            // loop through and remove elements that are identical until they aren't
            let tempOrder = socket.ekGameState.playerOrder.filter((player)=>{
              return player !== currPlayer
            });
            let nextPlayer = tempOrder[0];
            for(let i = 0; i < (socket.ekGameState.attackCount * 2 - 1); i++) {
              tempOrder.unshift(nextPlayer);
            }
            socket.ekGameState.playerOrder = tempOrder;

            endTurn();
            break;
            // TODO fix case for favor
          /* case 'favor':
            // remove card from affectedPlayer and give it to current player
            const giveCard = socket.ekGameState[affectedUser].splice(0, 1)
            socket.ekGameState[currPlayer].push(giveCard[0])
            // pass in user to drawCard once we have a working data structure for gamestate
            break; */
          case 'future':
            // show player next three cards
            let searchIdx = deck.length - 3;
            if(searchIdx < 0) {
              searchIdx = 0;
            }
            socket.emit('show-future', deck.slice(searchIdx));
            break;
          case 'skip':
            endTurn();
            break;
          case 'shuffle':
            shuffle(socket.ekGameState.deck);
            io.of('/').to(socket.ekGameState.room).emit('shuffle');
            break;

          default:
            affectedUserIdx = Math.floor(Math.random() * socket.ekGameState[affectedUser].length);
            const stealedCard = socket.ekGameState[affectedUser].splice(affectedUserIdx, 1);
            socket.ekGameState[currPlayer].push(stealedCard[0]);
            break;
        }
        emitState(socket.ekGameState);
      }
    }, 1000);

    socket.on('clear-card-interval', () => {
      clearInterval(x);
      socket.removeAllListeners('clear-card-interval')
    });
  }

  // SOCKET LISTENERS
  socket.on('send-message', message => {
    // console.log(message)
  })

  // Socket listeners for chat components ------------
  socket.on('send-chat-message', (user, message, avatar, room) => {
    // if room text is empty send to everyone
    if (room === '') {
      // socket.broadcast sends message to everyone except me
      socket.broadcast.emit('receive-message', user, message, avatar);
    } else {
      // send message to room only
      socket.to(room).emit('receive-message', user, message, avatar);
    }
  });
  // socket listener for room joins
  // socket.on('join-room', (room, cb) => {
  //   socket.join(room);
  //   cb(`Joined ${room}`)
  // })
  // ---------------------------------------------------


  // AUTH/USER DATA LISTENERS
  socket.on('get-user-data', async user => {
    const userData = await controller.getUserData(user)
    socket.emit('send-user-data', userData)
  })
  socket.on('create-user', async user => {
    const createUser = await controller.createUser(user)
    const userData = await controller.getUserData(user)
    socket.emit('send-user-data', userData)
  })

  // PROFILE CHANGES
  socket.on('get-friend-data', async user => {
    const userData = await controller.getFriendData(user)
    socket.emit('send-friend-data', userData)
  })
  socket.on('add-friend', user => {
    controller.updateFriendList(user)
  })
  socket.on('remove-friend', async user => {
    await controller.updateFriendList(user);
    const userData = await controller.getUserData(user)
    socket.emit('send-user-data', userData)
  })
  socket.on('edit-user', async user => {
    const createUser = await controller.updateUser(user)
    const userData = await controller.getUserData(user)
    socket.emit('send-user-data', userData)
  })
  socket.on('post-edit-avatar', async user => {
    const updateUser = await controller.updateUser(user)
    const userData = await controller.getUserData(user)
    socket.emit('send-user-data', userData)
  })

  // SEARCH PROFILE
  socket.on('search-user', async user => {
    const userData = await controller.searchProfile(user)
    console.log(userData)
    socket.emit('search-result', userData)
  })

  // ROOM LISTENERS
  socket.on('host-room', userObj => {
    const roomId = uid();
    socket.join(roomId);
    const roomObj = {
      room: roomId,
      host: userObj.socketId,
      players:[userObj]
    }
    controller.createRoom(roomObj);

    socket.emit('update-room', roomId)
  })
  socket.on('join-room', async userObj => {
    socket.join(`${userObj.room}`)
    const sendUpdate = await controller.addPlayer(userObj.room, userObj)
    const roomData = await controller.getRoomData(userObj.room)
    io.in(`${userObj.room}`).emit('joined', roomData);
  })

  socket.on('join-game', (room) => {
    socket.to(`${room}`).emit('start-join', (room))
  })
  socket.on('get-all-rooms', async cb => {
    const allRooms = await controller.getAllRooms()
    console.log(allRooms, 'ALL ROOMS')
    cb(allRooms)
  })
  socket.on('return-lobby', () => {
    io.of('/').to(socket.ekGameState.room).emit('return-lobby');
  })

  const rooms = io.of('/').adapter.rooms;
  const sids = io.of('/').adapter.sids;


  // GAME STATE LISTENERS
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
    // socket.ekGameState['hand1'].push(socket.ekGameState.deck[0])
    // socket.ekGameState.deck.splice(0, 1)
  })
  socket.on('player-loses', (username) => {
    // console.log(username, 'lost')
  })

  socket.on('nope-played', (user, userCardIdxs) => {
    io.of('/').to(socket.ekGameState.room).emit('nope-effect');
    socket.ekGameState.prevTurns.push({
      origin: user,
      userCardType: 'nope',
      userCardIdxs: userCardIdxs ?? [],
      affectedUser: '',
      affectedUserIdx: '',
      insertIdx: ''
    })
    removeCard(userCardIdxs, user);
    emitState(socket.ekGameState);
    // socket.off('nope-played')
  })
})

instrument(io, { auth: false });

httpServer.listen(5001, () => console.log('Listening on 5001'));

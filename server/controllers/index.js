const models = require("../models");

module.exports.controller = {
  createUser: (user) => {
    return models
      .createUser(user)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error creating user"));
  },
  getUserData: (user) => {
    return models
      .getUserData(user)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error getting user data"));
  },
  searchProfile: (user) => {
    return models
      .searchProfile(user)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error searching profile"));
  },
  updateUser: (user) => {
    return models
      .updateUser(user)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error Updating User"));
  },
  updateFriendList: (user) => {
    return models
      .updateFriendList(user)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error Updating Friendlist"));
  },
  getFriendData: (user) => {
    return models
      .getFriendData(user)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error getting Friend Data"));
  },
  createRoom: (room) => {
    return models
      .createRoom(room)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error creating room"));
  },
  addPlayer: (room, player) => {
    return models
      .addPlayer(room, player)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error adding player"));
  },
  getRoomData: (room) => {
    return models
      .getRoomData(room)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error getting room data"));
  },
  getAllRooms: () => {
    return models
      .getAllRooms()
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error getting all rooms"));
  },
  deleteRoom: (room) => {
    return models
      .deleteRoom(room)
      .then((result) => {
        return result;
      })
      .catch((error) => console.log("Error deleting room"));
  },
};

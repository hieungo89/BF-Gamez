// import db.js when created
const { User, Room } = require("../db/db.js");

module.exports = {
  createUser: async (user) => {
    try {
      const filter = { firebase_id: user.firebase_id };
      return await User.findOneAndUpdate(filter, user, { upsert: true });
    } catch (error) {
      return error;
    }
  },
  getUserData: async (user) => {
    try {
      const filter = { firebase_id: user.firebase_id };
      return await User.find(filter);
    } catch (error) {
      return error;
    }
  },
  searchProfile: async (user) => {
    try {
      const filter = { username: user.username };
      return await User.find(filter);
    } catch (error) {
      return error;
    }
  },
  updateUser: async (user) => {
    try {
      const filter = { firebase_id: user.firebase_id };
      return await User.findOneAndUpdate(filter, user);
    } catch (error) {
      return error;
    }
  },
  updateFriendList: async (user) => {
    try {
      const filter = { firebase_id: user.firebase_id };
      return await User.findOneAndUpdate(filter, user);
    } catch (error) {
      return error;
    }
  },
  getFriendData: async (user) => {
    try {
      const filter = { username: user.username };
      return await User.find(filter);
    } catch (error) {
      return error;
    }
  },
  createRoom: async (room) => {
    try {
      return await Room.create(room);
    } catch (error) {
      return error;
    }
  },
  addPlayer: async (room, player) => {
    try {
      return await Room.updateOne(
        { room: room },
        { $addToSet: { players: player } }
      );
    } catch {
      return error;
    }
  },
  getRoomData: async (room) => {
    try {
      const filter = { room: room };
      return await Room.find(filter);
    } catch (error) {
      return error;
    }
  },
  getAllRooms: async () => {
    try {
      return await Room.find();
    } catch (error) {
      return error;
    }
  },
  deleteRoom: async (room) => {
    try {
      const filter = { room: room };
      return await Room.deleteOne(filter);
    } catch (error) {
      return error;
    }
  },
};

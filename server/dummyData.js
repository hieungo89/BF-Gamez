module.exports = {
  users: [
    {
      _id: "6379601c13a1460fe41c9cbf",
      __v: 0,
      firebase_id: '0.7774628866373077',
      avatar: '/static/media/sageCat.46855611c77aae86e191.png',
      email: 'JoshTest@gmail.com',
      firstName: 'Josh',
      username: 'Josh',
      lastName: 'Garza',
      friends: [],
      total_games: 9,
      total_wins: 10,
    },
    {
      _id: "6379604113a1460fe41c9cd2",
      __v: 0,
      firebase_id: '0.6022004814666602',
      avatar: '/static/media/sneakyCat.ce8da454cf502a5dd0ba.png',
      email: 'FernandoTest@gmail.com',
      firstName: 'Fernando',
      username: 'Fernando',
      lastName: 'Gamboa',
      friends: [],
      total_games: 22,
      total_wins: 30,
    },
    {
      _id: "6379606e13a1460fe41c9ce7",
      __v: 0,
      firebase_id: '0.05526058428859737',
      avatar: '/static/media/tongueCat.d81f4d0813f44ab3d58c.png',
      email: 'JonahTest@gmail.com',
      firstName: 'Jonah',
      username: 'Jonah',
      lastName: 'Choi',
      friends: [],
      total_games: 99,
      total_wins: 99,
    },
    {
      _id: "6379624213a1460fe41c9db5",
      __v: 0,
      firebase_id: '0.03844048322026472',
      avatar: '/static/media/vampireCat.4365d77b279018daa4b5.png',
      email: 'JoeTest@gmail.com',
      firstName: 'Joe',
      username: 'Joe',
      lastName: 'Redmond',
      friends: [],
      total_games: 5,
      total_wins: 7,
    },
    {
      _id: "6379626113a1460fe41c9dc4",
      __v: 0,
      firebase_id: '0.946024153399881',
      avatar: '/static/media/unhappyCat.b2eb973ef1b49ad56a6e.png',
      email: 'EricTest@gmail.com',
      firstName: 'Eric',
      username: 'Eric',
      lastName: 'Pei',
      friends: [],
      total_games: 14,
      total_wins: 19,
    },
    {
      _id: "6379627813a1460fe41c9dd0",
      __v: 0,
      firebase_id: '0.14438257512163855',
      avatar: '/static/media/madCat.7ed8246f766244faa4f5.png',
      email: 'HieuTest@gmail.com',
      firstName: 'Hieu',
      username: 'Hieu',
      lastName: 'Ngo',
      friends: [],
      total_games: 1,
      total_wins: 99,
    }
  ]


}

// Future exporting from DB to File
// mongoexport --db=braking_friendships --collection=users --type=csv --fields=_id,firebase_id,email,username,fir,stName,lastName,avatar,friends,total_wins,total_games --out=users.csv
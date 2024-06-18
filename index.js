const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');


// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpWoLxzEwA93vHht5InD3aLpFyTw6Nd84",
  authDomain: "examen-a9633.firebaseapp.com",
  projectId: "examen-a9633",
  storageBucket: "examen-a9633.appspot.com",
  messagingSenderId: "434903720542",
  appId: "1:434903720542:web:77f01dd17e531051724acf"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const {getAuth,createUserWithEmailAndPassword} = require('firebase/auth')


// Middleware para parsear JSON
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// Ruta de prueba
app.post('/createUser', async (req, res) => {
  const auth = getAuth(firebaseApp);
  const email = req.body.email;
  const password = req.body.password;
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
    res.status(200).send('Usuario creado con exito');
  } catch (error) {
    res.status(500).send('Usuario no creado con exito');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

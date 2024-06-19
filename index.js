const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const { initializeApp } = require("firebase/app");


const firebaseConfig = {
    apiKey: "AIzaSyDpWoLxzEwA93vHht5InD3aLpFyTw6Nd84",
    authDomain: "examen-a9633.firebaseapp.com",
    projectId: "examen-a9633",
    storageBucket: "examen-a9633.appspot.com",
    messagingSenderId: "434903720542",
    appId: "1:434903720542:web:77f01dd17e531051724acf"
};

const firebaseApp = initializeApp(firebaseConfig);
const { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut } = require('firebase/auth')


// Middleware para parsear JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para crear usuario, la ruta recibe el email y la password del usuario
app.post('/createUser', async (req, res) => {
    const auth = getAuth(firebaseApp);
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        res.status(200).send("Usuario creado con exito" + email);
    } catch (error) {
        res.status(500).send("Usuario no creado con exito");
    }
});

// Ruta para loguear usuario, la ruta recibe el email y la password del usuario
app.post('/logIn', async (req, res) => {
    const auth = getAuth(firebaseApp);
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        res.status(200).send("Sesión inciada con éxito! Bienvenido de vuelta " +email;
    } catch (err) {
        res.status(500).send("Error al iniciar sesion: " + err.message);
    }
});

app.post('/logOut', async (req, res) => {
    const auth = getAuth(firebaseApp);
    try {
        await signOut(auth);
        res.status(200).send("Sesión cerrada con éxito");
    } catch (err) {
        res.status(500).send('Error al cerrar sesión: ' + err.message);
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

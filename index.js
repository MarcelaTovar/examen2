const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const { initializeApp } = require("firebase/app");
const { CreateUserValidator, LogInValidator, createPostValidator, listarPostValidator, editarPostValidator, deletePostValidator } = require('./validators/Validators')

const firebaseConfig = {
    apiKey: "AIzaSyDpWoLxzEwA93vHht5InD3aLpFyTw6Nd84",
    authDomain: "examen-a9633.firebaseapp.com",
    projectId: "examen-a9633",
    storageBucket: "examen-a9633.appspot.com",
    messagingSenderId: "434903720542",
    appId: "1:434903720542:web:77f01dd17e531051724acf"
};

const firebaseApp = initializeApp(firebaseConfig);
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth')

//conexion de mongo
const dbConnect = async () => {
    const db_url = 'mongodb+srv://admin:6Ikry9U4a88k1ktY@mininetflixdatabase.kgwvbmp.mongodb.net/examen2?retryWrites=true&w=majority&appName=MiniNetflixDatabase';
    try {
        await mongoose.connect(db_url);
        console.log('La Base de datos se ha conectado correctamente');
    } catch (err) {
        console.log('La base de datos ha dado un error:', err);
    }
}
dbConnect();

// Middleware para parsear JSON
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//Esquemas de mongo, el id es el proporcionado por firebase
const postEsquema = new mongoose.Schema(
    {
        titulo: String,
        descripcion: String,
        usuarioEmail: String
    }
);

const postUsuario = mongoose.model('post', postEsquema);

/**
 * Ruta para crear usuario, la ruta recibe el email y la password del usuario
 */
app.post('/createUser', CreateUserValidator, async (req, res) => {
    const auth = getAuth(firebaseApp);
    const email = req.body.email;
    const password = req.body.password;
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        res.status(200).send("Usuario creado con exito");
    } catch (error) {
        res.status(500).send("Usuario no creado con exito");
    }
});
/**
 * Ruta para loguear usuario, la ruta recibe el email y la password del usuario
 */
app.post('/logIn', LogInValidator, async (req, res) => {
    const auth = getAuth(firebaseApp);
    const email = req.body.email;
    const password = req.body.password;

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        res.status(200).send("Sesión inciada con éxito! Bienvenido de vuelta ");
    } catch (err) {
        res.status(500).send("Error al iniciar sesion: " + err.message);
    }
});

/**
 * Ruta para cerrar sesion, la ruta no recibe parametros
 */
app.post('/logOut', async (req, res) => {
    const auth = getAuth(firebaseApp);
    try {
        await signOut(auth);
        res.status(200).send("Sesión cerrada con éxito! Nos vemos pronto :D");
    } catch (err) {
        res.status(500).send("Error al cerrar sesión: " + err.message);
    }
});

/**
 * Ruta para crear un post en mongo PREGUNTAR SI EL USUARIO DEBE MANDAR EL CORREO DEL USUARIO O SI ES EL USUARIO ACTUAL
 * Deberia revisar que el usuario existe en firebase primero
 */
app.post('/createPost', createPostValidator, async (req, res) => {
    const email = req.body.email;
    const titulo = req.body.titulo;
    const descripcion = req.body.descripcion;

    const post = new postUsuario({
        titulo: titulo,
        descripcion: descripcion,
        usuarioEmail: email,
        fechaPublicacion: { type: Date, default: Date.now }
    });

    const response = await post.save();
    res.status(200).send("Post creado con exito!");
})

/**
 * Ruta para listar todos los post de mongo
 */
app.get('/listarPost', listarPostValidator, async (req, res) => {
    const posts = await postUsuario.find();
    res.status(200).send(posts);
})
/**
 * Ruta para editar un post especifico en mongo
 */
app.put('/editarPost/:id', editarPostValidator, async (req, res) => {
    const { id } = req.params;
    const post = await postUsuario.findById(id);
    const { titulo, descripcion } = req.body;
    if (titulo) {
        post.titulo = titulo;
    }
    if (descripcion) {
        post.descripcion = descripcion;
    }
    await post.save();
    res.status(200).send("Actualizacion exitosa!")
})

/**
 * Ruta para eliminar un post en especifico en mongo
 */
app.delete('/eliminarPost/:id', deletePostValidator, async (req, res) => {
    const { id } = req.params;
    await postUsuario.deleteOne({ _id: id });
    res.status(200).send("Eliminado con éxito!");

})

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

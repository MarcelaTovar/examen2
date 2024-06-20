const { check, param } = require('express-validator');
const validateResult = require('./handleValidator');

const CreateUserValidator = [
    check("email").exists().notEmpty().withMessage('Email es requerido.'),
    check("password").exists().notEmpty().withMessage('Password es requerido.'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const LogInValidator = [
    check("email").exists().notEmpty().withMessage('Email es requerido.'),
    check("password").exists().notEmpty().withMessage('Password es requerido.'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const createPostValidator = [
    check("titulo").exists().notEmpty().withMessage('Titulo es requerido.'),
    check("descripcion").exists().notEmpty().withMessage('Descripcion es requerida.'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const listarPostValidator = [
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const editarPostValidator = [
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido.'),
    check('titulo').optional().isString().withMessage('El titulo debe ser una cadena de texto.'),
    check('descripcion').optional().isString().withMessage('La descripcion debe ser una cadena de texto.'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

const deletePostValidator = [
    param('id').isMongoId().withMessage('El ID debe ser un ID de MongoDB válido.'),
    (req, res, next) => {
        validateResult(req, res, next);
    }
];

module.exports = { CreateUserValidator, LogInValidator, createPostValidator, listarPostValidator, editarPostValidator, deletePostValidator };
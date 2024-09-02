"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("./userController");
const adminController_1 = require("./adminController");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/register', userController_1.registerUser);
app.post('/register-admin', adminController_1.registerAdmin); // Novo endpoint para cadastrar administrador
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

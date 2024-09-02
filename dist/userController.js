"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const userSchema_1 = require("./userSchema");
const registerUser = (req, res) => {
    const result = userSchema_1.userSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }
    const user = result.data;
    // Aqui você faria a lógica para salvar o usuário no banco de dados.
    res.status(201).json({ message: "Usuário cadastrado com sucesso", user });
};
exports.registerUser = registerUser;

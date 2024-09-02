"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAdmin = void 0;
const adminSchema_1 = require("./adminSchema");
const registerAdmin = (req, res) => {
    const result = adminSchema_1.adminSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }
    const admin = result.data;
    // Aqui faz a lógica para salvar o administrador no banco de dados.
    res.status(201).json({ message: "Administrador cadastrado com sucesso", admin });
};
exports.registerAdmin = registerAdmin;

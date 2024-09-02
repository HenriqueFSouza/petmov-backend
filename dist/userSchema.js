"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Nome é obrigatório"),
    email: zod_1.z.string().email("Email inválido"),
    phone: zod_1.z.string().regex(/^\d{11,12}$/, "Telefone deve ter o formato DDD+Celular"),
    password: zod_1.z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

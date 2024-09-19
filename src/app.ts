import express from "express";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";
import routes from "./routes/routes";

export const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Certifique-se de usar o domínio correto do front-end
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Inclua os métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"], // Inclua os cabeçalhos permitidos
  credentials: true, // Se você precisa enviar cookies, use isso
};

// Mova o CORS antes de express.json() e das rotas
app.use(cors(corsOptions));

// Certifique-se de que o app aceite JSON
app.use(express.json());

// Rota para lidar com a solicitação preflight OPTIONS
app.options('*', cors(corsOptions));

// Adicione as rotas da API
app.use(routes);

// Middleware para lidar com erros
app.use(errorHandler);
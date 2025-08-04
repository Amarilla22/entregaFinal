import express from "express"
import userRouter from "./routes/userRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import mongoose from "mongoose"
import { engine } from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

const app = express()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));


app.use(express.json())
app.use("/api", userRouter )
app.use("/", viewsRouter)

app.listen (8080, () => console.log("activo"))


const resultConnect = mongoose.connect("mongodb+srv://Main:CjOVMxkPNqPkfnzn@cluster0.9nmnjj9.mongodb.net/TEST?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("connect success"))
    .catch((e) => console.error("epic fail" + e))

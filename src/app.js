import express from "express"
import userRouter from "./routes/userRouter.js"
import mongoose from "mongoose"


const app = express()


app.use(express.json())
app.use("/users", userRouter )

app.listen (8080, () => console.log("activo"))


const resultConnect = mongoose.connect("mongodb+srv://Main:CjOVMxkPNqPkfnzn@cluster0.9nmnjj9.mongodb.net/TEST?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("connect success"))
    .catch((e) => console.error("epic fail" + e))

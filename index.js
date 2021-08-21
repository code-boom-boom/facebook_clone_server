const express = require("express");
const cors = require("cors");
const mongoose =require("mongoose");

require("dotenv").config();

const app = express();
const http = require("http");
const server = http.createServer(app);

const AuthRoutes = require("./routes/Auth");
const UserRoutes = require("./routes/User");

const { PORT, MONGODB_URI } = require("./config");

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
}).then(() => {
    console.log("database connected");
    server.listen(PORT, () => console.log(`Server started on port ${ PORT }`));
}).catch(error => console.log(error));
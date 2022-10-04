import express, { application } from "express";

const app = express();
console.log("dir: ", __dirname);
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

app.listen(3000, () => console.log("Listening on http://localhost:3000"));

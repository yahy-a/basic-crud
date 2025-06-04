import express from "express";
import { User } from "./user.js";
import morgan from "morgan";
import logger from "./logger.js";

const app = express();

app.use(express.json());

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let users = []

app.get("/user", (req, res) => {
  res.status(200).json(users);
});

app.post("/user", (req, res) => {
  const { name, age, place } = req.body;
  const user = new User(name, age, place);
  users.push(user);
  res.status(201).json({ message: "User created successfully", data: user });
});

app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ message: "User found", data: user });
});

app.put("/user/:id", (req, res) => {
  const { id } = req.params;
  const { name, age, place } = req.body;
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  name ? user.name = name : null;
  age ? user.age = age : null;
  place ? user.place = place : null;
  res.status(200).json({ message: "User updated successfully", data: user });
});

app.delete("/user/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  users = users.filter((user) => user.id !== id);
  res.status(200).json({ message: "User deleted successfully", data: users });
});

app.delete("/user", (req, res) => {
  users = [];
  res.status(200).json({ message: "All users deleted successfully", data: users });
});

app.listen(3000, () => {
  logger.info("Server is running on port 3000");
});

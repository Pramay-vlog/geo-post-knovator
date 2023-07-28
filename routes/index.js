const app = require("express")();

/* GET home page. */
app.get('/', function (req, res, next) {
  return res.status(200).send({
    success: true,
    message: "OK"
  })
});

app.use("/role", require("./role.routes"))
app.use("/user", require("./users.routes"))
app.use("/post", require("./posts.routes"))


module.exports = app;

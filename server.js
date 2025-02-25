const express = require("express");
const hbs = require("hbs");
const methodOverride = require("method-override");
const path = require("path");
const flash = require("express-flash");
const session = require("express-session");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3030;

// Import controller functions
const {
  renderHome,
  renderContact,
  renderTestimonials,
  renderLogin,
  renderRegister,
  authLogin,
  authRegister,
  authLogout,
  renderProject,
  renderDetailProject,
  renderCreateProject,
  renderEditProject,
  deleteProject,
  createProject,
  updateProject,
  renderError,
} = require("./controllers/controller-v2.js");

// Middleware untuk file upload (menggunakan multer)
const upload = require("./middlewares/uploads-file.js");

// Helper untuk menghitung durasi project
const { projectDuration } = require("./utils/projectDuration.js");

// Middleware autentikasi
const checkUser = require("./middlewares/auth.js");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "./views"));

app.use(express.static("assets"));
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(flash());
app.use(fileUpload());
app.use(
  session({
    name: "mySession",
    secret: "mySecret",
    resave: false,
    saveUninitialized: true,
  })
);

hbs.registerPartials(__dirname + "/views/partials", function (err) {});
hbs.registerHelper("equal", function (a, b) {
  return a === b;
});

hbs.registerHelper("projectDuration", projectDuration);
hbs.registerPartials(path.join(__dirname, "views/partials"));

hbs.registerHelper("includes", function(arr, value) {
  if (Array.isArray(arr)) {
    return arr.includes(value);
  }
  return false;
});

// Routing
app.get("/", renderHome);
app.get("/contact", renderContact);
app.get("/testimonials", renderTestimonials);

app.get("/projects", renderProject);
app.get("/project-create", renderCreateProject);
app.get("/project-detail/:id", renderDetailProject);
app.get("/project-edit/:id", renderEditProject);

app.post("/project-create", createProject);
app.patch("/project-update/:id", updateProject);
app.delete("/projects/:id", deleteProject);

app.get("/login", renderLogin);
app.get("/register", renderRegister);
app.post("/login", authLogin);
app.post("/register", authRegister);
app.get("/logout", authLogout);

app.get("/unauthorized", (req, res) => res.status(401).send("Unauthorized"));
app.get("*", renderError);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
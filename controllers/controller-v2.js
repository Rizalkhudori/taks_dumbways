// controllers/controller-v2.js
const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const config = require("../config/config.json");
const { Project, User } = require("../models");

const sequelize = new Sequelize(config.development);
const saltRounds = 10;

async function renderHome(req, res) {
  const user = req.session.user;
  res.render("index", { user });
}

async function renderContact(req, res) {
  const user = req.session.user;
  res.render("contact", { user });
}

async function renderTestimonials(req, res) {
  const user = req.session.user;
  res.render("testimonials", { user });
}

async function renderLogin(req, res) {
  const user = req.session.user;
  if (user) {
    req.flash("warning", "User sudah login.");
    return res.redirect("/");
  }
  res.render("auth-login", { user });
}

async function renderRegister(req, res) {
  const user = req.session.user;
  if (user) {
    return res.redirect("/");
  }
  res.render("auth-register", { user });
}

async function authLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    req.flash("error", "User tidak ditemukan.");
    return res.redirect("/login");
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    req.flash("error", "Password salah.");
    return res.redirect("/login");
  }
  let loggedInUser = user.toJSON();
  delete loggedInUser.password;
  req.session.user = loggedInUser;
  req.flash("success", `Selamat datang, ${loggedInUser.name}!`);
  res.redirect("/");
}

async function authRegister(req, res) {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    req.flash("error", "Password dan konfirmasi tidak cocok.");
    return res.redirect("/register");
  }
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    req.flash("error", "Email sudah digunakan.");
    return res.redirect("/register");
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await User.create({ name, email, password: hashedPassword });
  req.flash("success", "Registrasi berhasil. Silakan login.");
  res.redirect("/login");
}

async function authLogout(req, res) {
  req.session.user = null;
  res.redirect("/login");
}

const renderProject = async (req, res) => {
  const user = req.session.user;
  try {
    const projects = await Project.findAll({
      include: {
        model: User,
        as: "user",
        attributes: { exclude: ["password"] },
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("projects", { projects, user });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.render("projects", { projects: [], user });
  }
};

async function renderCreateProject(req, res) {
  const user = req.session.user;
  if (!user) return res.redirect("/login");
  res.render("project-create", { user });
}

async function renderDetailProject(req, res) {
  const user = req.session.user;
  const id = req.params.id;
  try {
    const project = await Project.findOne({
      include: {
        model: User,
        as: "user",
        attributes: { exclude: ["password"] },
      },
      where: { id },
    });
    if (!project) return res.render("page-404");
    // Perhatikan: pada template, properti tanggal sesuai dengan field di model (misal: startDate)
    res.render("project-detail", { project, user });
  } catch (err) {
    console.error("Error fetching project details:", err);
    res.render("page-404");
  }
}

async function renderEditProject(req, res) {
  const user = req.session.user;
  const id = req.params.id;
  if (!user) return res.redirect("/login");
  try {
    const project = await Project.findOne({ where: { id } });
    if (!project) return res.render("page-404");

    // Tangani field 'technologys'
    let techData = project.technologys || "[]";
    if (typeof techData === "string") {
      // Jika string tidak diawali dengan "[" anggap sebagai comma separated string
      if (techData.trim().charAt(0) !== "[") {
        techData = techData.split(",").map(item => item.trim());
      } else {
        techData = JSON.parse(techData);
      }
    }
    project.technologys = techData;

    // Konversi project ke objek plain
    const formattedProject = project.toJSON();

    // Format tanggal agar sesuai dengan input type="date" (YYYY-MM-DD)
    formattedProject.startDate = new Date(formattedProject.startDate)
      .toISOString()
      .split("T")[0];
    formattedProject.endDate = new Date(formattedProject.endDate)
      .toISOString()
      .split("T")[0];

    res.render("project-edit", { project: formattedProject, user });
  } catch (err) {
    console.error("Error fetching project for edit:", err);
    res.render("page-404");
  }
}


async function createProject(req, res) {
  const { projectName, startDate, endDate, description } = req.body;
  let technologies = req.body.technologies;
  // Pastikan technologies berbentuk array jika lebih dari satu checkbox tercentang
  if (!Array.isArray(technologies)) {
    technologies = technologies ? [technologies] : [];
  }
  // Default image
  let imagePath = "uploads/default-image.jpg";
  // Tangani file upload: gunakan req.files (express-fileupload menyediakan req.files)
  const file = req.files ? req.files["upload-image"] : null;
  if (file) {
    const uniqueFilename = `${Date.now()}-${file.name}`;
    imagePath = `uploads/${uniqueFilename}`;
    try {
      await file.mv(imagePath);
      console.log("File berhasil diupload ke:", imagePath);
    } catch (err) {
      console.error("Error saat upload file:", err);
    }
  } else {
    console.log("Tidak ada file yang diupload, gunakan default image.");
  }
  try {
    const newProject = await Project.create({
      projectName,
      startDate,
      endDate,
      description,
      technologys: technologies, // simpan sebagai array (atau string, sesuai preferensi)
      image: imagePath,
    });
    console.log("New Project:", newProject.toJSON());
    req.flash("success", "Project berhasil dibuat");
    res.redirect("/projects");
  } catch (err) {
    console.error("Error saat menyimpan project:", err);
    req.flash("error", "Gagal membuat project");
    res.redirect("/project-create");
  }
}

async function updateProject(req, res) {
  const id = req.params.id;
  // Untuk update, Anda dapat mengubah field sesuai form edit yang dikirimkan
  const { "project-name": projectName, "start-date": startDate, "end-date": endDate, description, technologies } = req.body;
  let techArray = Array.isArray(technologies) ? technologies : (technologies ? [technologies] : []);

  // Jika ada file baru diupload, proses file upload
  let imagePath;
  const file = req.files ? req.files["upload-image"] : null;
  if (file) {
    const uniqueFilename = `${Date.now()}-${file.name}`;
    imagePath = `uploads/${uniqueFilename}`;
    try {
      await file.mv(imagePath);
    } catch (err) {
      console.error("Error saat upload file:", err);
    }
  }
  try {
    // Persiapkan data update
    const updateData = {
      projectName,
      startDate,
      endDate,
      description,
      technologys: techArray,
    };
    if (imagePath) updateData.image = imagePath;
    await Project.update(updateData, { where: { id } });
    req.flash("success", "Project berhasil diupdate");
    res.redirect("/projects");
  } catch (err) {
    console.error("Error updating project:", err);
    req.flash("error", "Gagal mengupdate project");
    res.redirect(`/project-edit/${id}`);
  }
}

async function deleteProject(req, res) {
  const id = req.params.id;
  try {
    await Project.destroy({ where: { id } });
    req.flash("success", "Project berhasil dihapus");
    res.redirect("/projects");
  } catch (err) {
    console.error("Error deleting project:", err);
    req.flash("error", "Gagal menghapus project");
    res.redirect("/projects");
  }
}

async function renderError(req, res) {
  res.status(404).render("page-404", { user: req.session.user });
}

module.exports = {
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
  createProject,
  updateProject,
  deleteProject,
  renderError,
};
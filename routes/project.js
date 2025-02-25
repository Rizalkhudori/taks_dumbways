const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const ensureAuthenticated = require('../middleware/auth');

let projects = []; // This should be replaced with your database logic

router.post('/create', ensureAuthenticated, upload.single('upload-image'), (req, res) => {
    const { 'project-name': name, 'start-date': startDate, 'end-date': endDate, description, technologies } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    const newProject = {
        id: projects.length + 1,
        projectName: name,
        startProjectAt: startDate,
        endProjectAt: endDate,
        description,
        technologyNodeJs: technologies.includes('Node Js'),
        technologyNextJs: technologies.includes('Next Js'),
        technologyReactJs: technologies.includes('React Js'),
        technologyTypescript: technologies.includes('TypeScript'),
        image: imageUrl
    };

    projects.push(newProject);

    res.json({ success: true, project: newProject });
});

router.post('/project-create', upload.single('upload-image'), (req, res) => {
  const { 'project-name': projectName, 'start-date': startDate, 'end-date': endDate, description, technologies } = req.body;
  const image = req.file;

  // Simpan data proyek ke database
  // Contoh: Project.create({ projectName, startDate, endDate, description, technologies, image: image.path });

  res.redirect('/projects');
});

router.get('/projects', (req, res) => {
    res.json({ projects });
});

module.exports = router;
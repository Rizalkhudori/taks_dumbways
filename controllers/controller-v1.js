// // RENDER HOME PAGE
// function renderHomePage(req, res) {
//     const user = req.session.user;
//     res.render("index", { user: user });
//   }
  
//   // RENDER CONTACT PAGE
//   function renderContactPage(req, res) {
//     const user = req.session.user;
//     res.render("contact", { user });
//   }
  
//   // TESTIMONIALS PAGE
//   function renderTestimonialsPage(req, res) {
//     const user = req.session.user;
//     res.render("testimonials", { user });
//   }
  
//   // RENDER UNAUTHORIZED PAGE
//   function renderUnauthorizedPage(req, res) {
//     const user = req.session.user;
//     res.render("unauthorized", { user });
//   }
  
//   // RENDER 404 NOT FOUND PAGE
//   function render404NotFoundPage(req, res) {
//     const user = req.session.user;
//     res.render("404-not-found", { user });
//   }
  
//   module.exports = {
//     renderHomePage,
//     renderContactPage,
//     renderTestimonialsPage,
//     renderUnauthorizedPage,
//     render404NotFoundPage,
//   };

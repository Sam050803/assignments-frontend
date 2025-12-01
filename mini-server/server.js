// Mini serveur Web pour servir les fichiers statiques Angular
const express = require("express");
const path = require("path");
const app = express();

// Le frontend Angular sera compilé dans ../dist/assignment-app/browser
// Ce serveur sert ces fichiers statiques
// Le mini serveur est dans assignment-app/mini-server/
// Donc on remonte d'un niveau pour accéder à dist/
const staticPath = path.join(__dirname, "../dist/assignment-app/browser");

// Serve only the static files from the dist directory
app.use(express.static(staticPath));

// Handle Angular routes - serve index.html for all routes
app.use(function(req, res, next) {
  // If it's a file request (has extension), let express.static handle it
  if (path.extname(req.path).length > 0) {
    return next();
  }
  
  // Otherwise, serve the Angular app
  const indexPath = path.join(staticPath, "index.csr.html");
  const homeIndexPath = path.join(staticPath, "home/index.html");
  
  const fs = require("fs");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else if (fs.existsSync(homeIndexPath)) {
    res.sendFile(homeIndexPath);
  } else {
    // Fallback: redirect to home
    res.redirect("/home");
  }
});

// Start the app by listening on the default Heroku port
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Mini serveur Web running on port ${port}`);
  console.log(`Serving static files from: ${staticPath}`);
});


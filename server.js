//Install express server
const express = require("express");
const path = require("path");
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + "/dist/assignment-app/browser"));

// Handle Angular routes - serve index.html for all routes
// For Express 5.x, we need to use a different approach
app.use(function(req, res, next) {
  // If it's a file request (has extension), let express.static handle it
  if (path.extname(req.path).length > 0) {
    return next();
  }
  
  // Otherwise, serve the Angular app
  const indexPath = path.join(__dirname, "/dist/assignment-app/browser/index.csr.html");
  const homeIndexPath = path.join(__dirname, "/dist/assignment-app/browser/home/index.html");
  
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
  console.log(`Server running on port ${port}`);
});


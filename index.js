
const express = require('express');
const app = express();
const port = 3000;

const path = require('path');

const demo1Router = require('./routes/demo1/demo1');
const demo2Router = require('./routes/demo2/demo2');
const demo3Router = require('./routes/demo3/demo3');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'routes'));

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

//app.use('/demo1', demo1Router);
//app.use('/demo2', demo2Router);
//app.use('/demo3', demo3Router);

const webServerProfiles = {
  apache: {
    'Server': 'Apache/2.4.58 (Unix)',
    'X-Powered-By': 'PHP/8.2.12',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  nginx: {
    'Server': 'nginx/1.25.3',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block'
  },
  iis: {
    'Server': 'Microsoft-IIS/10.0',
    'X-Powered-By': 'ASP.NET',
    'X-AspNet-Version': '4.0.30319',
    'X-Content-Type-Options': 'nosniff'
  },
  express: {
    'X-Powered-By': 'Express',
    'ETag': 'W/"2-l9Fw4wK44N5N4yY3N4yY3N4yY3"',
    'Date': new Date().toUTCString()
  }
};

app.disable('etag'); // Disable ETag generation

const profiles = Object.keys(webServerProfiles);
const selectedProfileName = profiles[Math.floor(Math.random() * profiles.length)];
const selectedProfile = webServerProfiles[selectedProfileName];

app.use((req, res, next) => {
  res.set(selectedProfile);
  next();
});

app.use([demo1Router, demo2Router, demo3Router]);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en" data-bs-theme="dark">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Demo Framework</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
      <style>
        body {
          background-color: #1e1e2e;
          color: #cdd6f4;
          min-height: 100vh;
        }
        .card {
          background-color: #181825;
          border: 1px solid #313244;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
          border-color: #89b4fa;
        }
        .card-header {
          background-color: #11111b;
          border-bottom: 1px solid #313244;
        }
        .hero-section {
          background-color: #181825;
          border: 1px solid #313244;
          border-radius: 12px;
          padding: 3rem 2rem;
          margin-bottom: 3rem;
          text-align: center;
        }
        .demo-grid {
          gap: 2rem;
        }
        .demo-card {
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        .demo-card:hover {
          color: inherit;
          text-decoration: none;
        }
        .demo-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #89b4fa;
        }
        .vulnerability-badge {
          font-size: 0.7rem;
          margin-bottom: 0.5rem;
        }
        .server-info {
          background-color: #313244;
          border: 1px solid #45475a;
          border-radius: 8px;
          padding: 1rem;
          margin-top: 2rem;
        }
        .server-info code {
          background-color: #11111b;
          color: #b4befe;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
        }
        .btn-primary {
          background-color: #89b4fa;
          border-color: #89b4fa;
          color: #11111b;
        }
        .btn-primary:hover {
          background-color: #b4befe;
          border-color: #b4befe;
          color: #11111b;
        }
        .btn-outline-secondary {
          color: #cdd6f4;
          border-color: #313244;
        }
        .btn-outline-secondary:hover {
          background-color: #313244;
          border-color: #313244;
          color: #cdd6f4;
        }
      </style>
    </head>
    <body>
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-12" style="width: 80%;">
            <div class="hero-section">
              <h1 class="display-4 mb-3">Demo Framework</h1>
              <p class="text-muted">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                These demos contain intentional security vulnerabilities
              </p>
            </div>
          </div>
        </div>

        <div class="row demo-grid justify-content-center">
          <div class="col-3">
            <div class="card h-100">
              <div class="card-body text-center d-flex flex-column">
                <div class="demo-icon">
                  <i class="bi bi-car-front-fill"></i>
                </div>
                <h5 class="card-title">Demo 1: AutoFinder</h5>
                <p class="card-text text-muted flex-grow-1">Car search platform with IDOR vulnerabilities</p>
                <div class="mt-auto">
                  <a href="/demo1" class="btn btn-primary btn-sm me-2 mb-2">
                    <i class="bi bi-play-circle me-1"></i>Launch Demo
                  </a>
                  <a href="/demo1/docs" class="btn btn-outline-secondary btn-sm mb-2">
                    <i class="bi bi-book me-1"></i>Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-3">
            <div class="card h-100">
              <div class="card-body text-center d-flex flex-column">
                <div class="demo-icon">
                  <i class="bi bi-box-seam"></i>
                </div>
                <h5 class="card-title">Demo 2: ShopTracker</h5>
                <p class="card-text text-muted flex-grow-1">Order tracking with GraphQL vulnerabilities</p>
                <div class="mt-auto">
                  <a href="/demo2" class="btn btn-primary btn-sm me-2 mb-2">
                    <i class="bi bi-play-circle me-1"></i>Launch Demo
                  </a>
                  <a href="/demo2/docs" class="btn btn-outline-secondary btn-sm mb-2">
                    <i class="bi bi-book me-1"></i>Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div class="col-3">
            <div class="card h-100">
              <div class="card-body text-center d-flex flex-column">
                <div class="demo-icon">
                  <i class="bi bi-code-slash"></i>
                </div>
                <h5 class="card-title">Demo 3: XSS Demo</h5>
                <p class="card-text text-muted flex-grow-1">Cross-site scripting demonstration</p>
                <div class="mt-auto">
                  <a href="/demo3" class="btn btn-primary btn-sm me-2 mb-2">
                    <i class="bi bi-play-circle me-1"></i>Launch Demo
                  </a>
                  <a href="/demo3/docs" class="btn btn-outline-secondary btn-sm mb-2">
                    <i class="bi bi-book me-1"></i>Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-12" style="width: 80%;">
            <div class="server-info">
              <h6 class="text-primary mb-3">
                <i class="bi bi-server me-2"></i>Server Information
              </h6>
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-2"><strong>Framework:</strong> Node.js + Express</p>
                  <p class="mb-2"><strong>Port:</strong> <code>3000</code></p>
                  <p class="mb-0"><strong>Host:</strong> <code>0.0.0.0:3000</code></p>
                </div>
                <div class="col-md-6">
                  <p class="mb-2"><strong>Current Profile:</strong> <code>${selectedProfileName}</code></p>
                  <p class="mb-2"><strong>Cache Headers:</strong> <code>no-cache, no-store</code></p>
                  <p class="mb-0"><strong>Server Simulation:</strong> Randomized on startup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div style="padding-bottom: 3rem;"></div>

      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Demo app listening at http://0.0.0.0:${port}`);
  console.log(`Using "${selectedProfileName}" web server profile.`);
});

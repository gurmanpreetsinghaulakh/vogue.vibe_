const express = require('express') // Express for routing and middleware management
const path = require('path') // Path to handle file paths
const app = express()
const session = require('express-session');
const PORT = 8080

app.use(session({
  secret: 'your_super_secret_key', // change this for security
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true only if using HTTPS
}))



const morgan=require('morgan')//color codes to the status code
app.use(morgan('dev'))

const helmet = require('helmet');
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://cdnjs.cloudflare.com",// Allow CDN for GSAP
          "https://cdn.jsdelivr.net", 
        ],
        scriptSrcAttr: ["'unsafe-inline'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://github.com/",
          "https://raw.githubusercontent.com/",
          "https://sustainable.chitkara.edu.in/",
          "https://st4.depositphotos.com/",
          "https://images4.alphacoders.com/",
          "https://images.pexels.com",
          "https://assets.armani.com",
          "https://assets.burberry.com",
          "https://www.chanel.com",
          "https://assets.christiandior.com",
          "https://media.gucci.com",
          "https://in.louisvuitton.com",
          "https://www.prada.com",
          "https://saint-laurent.dam.kering.com",
          "https://images.unsplash.com"  
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com/",
          "https://cdnjs.cloudflare.com/", // Allow styles from CDN
          "https://cdn.jsdelivr.net",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com/", "https://cdnjs.cloudflare.com/"],
      },
    },
  })
);


// Protects against common vulnerabilities

const cors = require('cors');
app.use(cors()); // Enable all origins (for APIs)

const bodyParser=require('body-parser')
app.use(bodyParser.json());
// // Middleware to parse URL-encoded data (from HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

const rateLimit = require('express-rate-limit'); // Import the package

// Define a rate limit: Allow 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    headers: true, // Send rate limit info in headers
});

// Apply the rate limiter to all API routes
app.use('/api', limiter);

// Import middlewares-==
const logger = require('./middlewares/logger') // Import logger middleware
const errorHandler = require('./middlewares/errorHandler') // Import error handler middleware
// Middleware to handle JSON and URL-encoded data in POST requests
app.use(express.json()) // To parse JSON bodies
app.use(express.urlencoded({ extended: true })) // To parse URL-encoded data from incoming requests
// Use logger middleware for all incoming requests
app.use(logger) // Log each request
// Serve static files (HTML, CSS, JS) from the /public directory
app.use(express.static(path.join(__dirname, 'public')))
// Import API routes from apiRoutes.js
const apiRoutes = require('./api/apiRoutes') // Import the API routes for login and register functionality
app.use('/api', apiRoutes) // Mount the API routes on /api path
// Serve login.html at the root URL
app.get('/', (req, res) => {
  res.render(path.join(__dirname, 'views', 'new.ejs')) // Serve the login page at root URL
})
app.get('/login', (req, res) => {
    res.render(path.join(__dirname, 'views', 'login.ejs')) // Serve the login page at root URL
})
app.get('/contact', (req, res) => {
  res.render(path.join(__dirname, 'views', 'contact.ejs' ), {username: req.session.username}) // Serve the login page at root URL
})
app.get('/register', (req, res) => {
  res.render(path.join(__dirname, 'views', 'register.ejs')) // Serve the login page at root URL
})
// Serve dashboard.html when user is authenticated
app.get('/api/order', (req, res) => {
  res.render(path.join(__dirname, 'views', 'order.ejs'),{username: req.session.username}) // Serve the dashboard HTML file
})
// Serve register.html when user needs to register
app.get('/api/register', (req, res) => {
  res.render(path.join(__dirname, 'views', 'register.ejs', )) // Serve the register HTML file
})
app.get('/loui', (req, res) => {
    res.render(path.join(__dirname, 'views', 'loui.ejs'),{username: req.session.username}) // Serve the register HTML file
})
app.get('/armani', (req, res) => {
    res.render(path.join(__dirname, 'views', 'armani.ejs'),{username: req.session.username}) // Serve the register HTML file
})
app.get('/Burburry', (req, res) => {
    res.render(path.join(__dirname, 'views', 'Burburry.ejs'),{username: req.session.username}) // Serve the register HTML file
})
app.get('/Chanel', (req, res) => {
    res.render(path.join(__dirname, 'views', 'Chanel.ejs'),{username: req.session.username}) // Serve the register HTML file
})
app.get('/Dior', (req, res) => {
    res.render(path.join(__dirname, 'views', 'Dior.ejs'),{username: req.session.username}) // Serve the register HTML file
}) 
app.get('/gucci', (req, res) => {
    res.render(path.join(__dirname, 'views', 'gucci.ejs'),{username: req.session.username}) // Serve the register HTML file
})
app.get('/Prada', (req, res) => {
    res.render(path.join(__dirname, 'views', 'Prada.ejs'),{username: req.session.username}) // Serve the register HTML file
})
app.get('/Ysl', (req, res) => {
    res.render(path.join(__dirname, 'views', 'Ysl.ejs'),{username: req.session.username}) // Serve the register HTML file
})
app.get('/error', (req, res) => {
  errorHandler(new Error("An errror occured "),req,res);
})
// Use error handler middleware for catching and handling errors
app.use(errorHandler) // Handle errors globally
// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})


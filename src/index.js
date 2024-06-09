const dotenv = require("dotenv")
const express = require("express")
const app = express()
const loginRouter = require("./routes/auth/login")
const authDemoRouter = require("./routes/auth/auth-test")
const parsingErrorHandler = require("./middlewares/parsing")
const authHandler = require("./middlewares/auth")
const swaggerUi = require("swagger-ui-express")
const swaggerFile = require("./swagger/swagger-output.json")
const verifyConfiguration = require("./helper/startup")
const logger = require("./helper/logger")
const cors = require("cors")
const helmet = require("helmet")
const profileRouter = require("./routes/profile/profile")
const studentMarksRouter = require("./routes/student/student-marks")
const studentRoleHandler = require("./middlewares/student-role")
const tokenValidationHandler = require("./routes/auth/tokens")
const teacherRoleHandler = require("./middlewares/teacher-role")
const teacherCoursesRouter = require("./routes/teacher/teacher-courses")
const publicInfoRouter = require("./routes/public/public")

dotenv.config() // load .env config

// check for configuration at start
verifyConfiguration()

// Add cors support
app.use(
  cors({
    origin: "*",
  })
)
app.use(helmet())

app.options("*", cors())

app.use(helmet())

// TODO: proper CSP policy required
/*
const connectSrcUrls = [
  // Add your allowed URLs here
  "'self'",
  "http://localhost:9000",
  "http://localhost:5173",
]

Helmet prevents from sending response headers with explicit info
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      connectSrcUrls,
    },
  })
) 
*/

// enable json parsing middleware
app.use(express.json())

// use the json parsing error handling middleware
app.use(parsingErrorHandler)

app.use("/api/v1/login", loginRouter)

app.use("/api/v1/public", publicInfoRouter)

app.use("/api/v1/tokens", authHandler, tokenValidationHandler)

app.use("/api/v1/profile", authHandler, profileRouter)

app.use("/api/v1/students", authHandler, studentRoleHandler, studentMarksRouter)

app.use(
  "/api/v1/teachers",
  authHandler,
  teacherRoleHandler,
  teacherCoursesRouter
)

// A basic endpoint to verify token validity
// TODO: remove after project completion
app.use("/api/v1/auth", authHandler, authDemoRouter)

// Swagger documentation
// Keep it at the end
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(9000, () => {
  console.log("-".repeat(75))
  logger.info("⚡Started at 9000 : ", new Date().toLocaleString())
  console.log(
    "Did you seed the database?\nRun 'pnpm run seed' to seed the database."
  )
})

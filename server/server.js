require("dotenv").config()

const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")

app.use(cors())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once("open", () => console.log("Connected to Database"))

app.use(express.json())

const stationsRouter = require("./routes/stations")
app.use("/stations", stationsRouter)

const pathsRouter = require("./routes/paths")
app.use("/paths", pathsRouter)

const chargersRouter = require("./routes/chargers")
app.use("/chargers", chargersRouter)

const socRouter = require("./routes/values")
app.use("/soc", socRouter)

app.listen(process.env.PORT || 4000, () => console.log("Server Started"))
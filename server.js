const dotenv = require("dotenv");
const app = require("./app.js");

dotenv.config();

const { PORT = 4000 } = process.env;

app.listen(PORT, () => console.log(`App running on http://localhost:${PORT}`));

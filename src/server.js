const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 3000;
const {CLIENT_ORIGIN} = require('./config/main');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
 app.get('/api/*', (req, res) => {
   res.json({ok: true});
 });

 app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

 module.exports = {app};

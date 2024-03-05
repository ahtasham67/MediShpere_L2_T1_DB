const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/process-form', (req, res) => {
    // Process the form data from the POST request

    // Redirect to a different URL after processing
    res.redirect
});

app.get('/success-page', (req, res) => {
    // Render the success page
    res.send('Form successfully processed!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

const { Client } = require('pg'); // Usa require invece di import
const express = require('express');
app = express();

// Configurazione del database
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connesso al database PostgreSQL'))
    .catch(err => console.error('Errore di connessione al database', err.stack));

// Endpoint per il login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Users WHERE Nome = $1 AND Password = $2';
    const values = [username, password];

    try {
        const result = await client.query(query, values);
        if (result.rows.length > 0) {
            res.status(200).json({ success: true, message: 'Accesso riuscito' });
        } else {
            res.status(401).json({ success: false, message: 'Credenziali non valide' });
        }
    } catch (err) {
        console.error('Errore durante l\'esecuzione della query', err.stack);
        res.status(500).json({ success: false, message: 'Errore del server' });
    }
});

// Avvia il server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});

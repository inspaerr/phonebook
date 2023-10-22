var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectId = mongodb.ObjectId;
var CONTACTS_COLLECTION = "contacts";
var app = express();
app.use(bodyParser.json());

// Создайте переменную базы данных вне обратного вызова соединения 
//с базой данных, чтобы повторно использовать пул соединений в вашем 
//приложении.
const dbClient = new mongodb.MongoClient('mongodb://127.0.0.1:27017/');

// Инициализация приложения
port = 8080;
app.listen(port, async () => { 
    console.log(`server started, listening ${port}`);
    try {
        await dbClient.connect();
        app.locals.collection = dbClient.db("test").collection("contacts");
        console.log('db connected successfuly');
    }
    catch (err) {
        console.log(err);
    }
    
});

// Маршруты API
// API МАРШРУТЫ
// Общий обработчик ошибок, используемый всеми функциями конечных 
// точек
// handleError(res, reason, message, code) {
//     
//     console.log("Ошибка: " + reason);
//     res.status(code || 500).json({"error": message});
// }
/* "/api/contacts"
* GET: найти все контакты
* POST: создание нового контакта
*/
app.get("/api/contacts", async function(req, res) {
    const collection = req.app.locals.collection;
    try {
        const contacts = await collection.find({}).toArray();
        res.send(contacts);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.get("/api/contacts/:id", async (req, res) => {
    const collection = req.app.locals.collection;
    try {
        const contactId = new ObjectId(req.params.id);
        const contact = await collection.findOne({ _id: contactId});
        if (contact) res.send(contact);
        else res.sendStatus(404);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.post("/api/contacts", async (req, res) => {
    if (!req.body) {
        res.send({ message: "no data provided" });
        return res.sendStatus(400);
    }

    const username = req.body.username;
    const email = req.body.email;
    const mobile = req.body.telephone.mobile;
    const home = req.body.telephone.home;

    const contact = {
        username: username,
        email: email,
        telephone: {
            mobile: mobile,
            home: home
        }
    }

    const collection = req.app.locals.collection;

    try {
        await collection.insertOne(contact);
        res.send(contact);
    }

    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

app.put("/api/contacts/:id", async (req, res) => {
    if (!req.body || !req.params) return res.sendStatus(400);

    const username = req.body.username;
    const email = req.body.email;
    const mobile = req.body.telephone.mobile;
    const home = req.body.telephone.home;

    const collection = req.app.locals.collection;
    try {
        const contactId = new ObjectId(req.params.id);
        const result = await collection.findOneAndUpdate(
            { _id: contactId },
            {
                $set: {
                    username: username,
                    email: email,
                    'telephone.mobile': mobile,
                    'telephone.home': home
                }
            }
        );
        
        if (result) res.send(result);
        else res.sendStatus(404);
    }
    catch (err) {
        console.log(err);
        req.sendStatus(500);
    }
});

app.delete("/api/contacts/:id", async (req, res) => {
    if (!req.params) return res.sendStatus(400);
    const collection = req.app.locals.collection;
    try {
        const contactId = new ObjectId(req.params.id);
        const contact = await collection.findOneAndDelete({ _id: contactId});
        if (contact) res.send(contact);
        else res.sendStatus(404);
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

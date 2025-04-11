const { verify } = require("jsonwebtoken");

app.get('/users', (req, res) => {
    res.send(userList);
});

app.get('/users/:name', (req, res) => {
    const searchName = req.params.name;
    let user = userList.find(el => el.name === searchName)
    if(!user){
        res.status(404).json({
            message: "User with this name was not found."
        })
    }
    res.status(200).json({
        user: user
    })
});

app.post('/register', (req, res) => {
    console.log(req.body)
    let newUserID;
    if (userList.length > 0) {
        newUserID = (userList[userList.length - 1].ID + 1);
    } else {
        newUserID = 1;
    }
    if (req.body.name != undefined && req.body.password != undefined && req.body.email != undefined) {
        const newUser = Object.assign({ID: newUserID, name: req.body.name, password: req.body.password, email: req.body.email}, {role: "vasarlo", inCart: 0, inCartID: [0]});
        userList.push(newUser);
        fs.writeFile('./Data/users.json', JSON.stringify(userList), (err) => {
        res.status(201).json({
            user: newUser
        })
    })
    } else {
        res.status(404).json({
            message: "No data provided"
        })
        console.log("no data");
    }
    userList = JSON.parse(fs.readFileSync('./Data/users.json'));
})

app.get('/login', (req, res) => {
    let name = req.body.name;
    if (!req.body.name || !req.body.password) {
        res.status(404).json({
            message: "No data provided"
        })
        console.log("no data");
    }
    let user = userList.find(el => el.name === name)
    if(!user){
        res.status(404).json({
            message: "User with this name was not found."
        })
    }
    if (req.body.password != user.password) {
        res.send("Wrong password")
    } else {
        res.send("Correct password")
    }
});

app.patch('/users/:name', (req, res) => {
    let user = userList.find(el => el.name === req.params.name);

    if (!user) {
        return res.status(404).json({
            message: "User with this name was not found."
        });
    }
    if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({
            message: "Invalid or missing JSON body."
        });
    }
    let index = userList.indexOf(user);
    Object.assign(user, req.body);
    userList[index] = user;

    fs.writeFile('./Data/users.json', JSON.stringify(userList, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: "Error writing to file." });
        }
        
        res.status(201).json({
            user: user
        });
    });

    userList = JSON.parse(fs.readFileSync('./Data/users.json'));
});
app.get('/Items', (req, res)=> {
    res.json(itemList)
}) 

app.get('/Items/:id', (req, res) => {
    const searchID = req.params.id * 1;
    let item = itemList.find(el => el.ID === searchID)
    if(!item){
        res.status(404).json({
            message: "Item with this ID was not found."
        })
    }
    res.status(200).json({
        item: item
    })
});

app.get('/Items/Groups/:group/:type?/:priceFrom?/:priceTo?', (req, res) => {
    let item = itemList.find(el => el.group === req.params.group)
    if(!item){
        res.status(404).json({
            message: "Item with this group was not found."
        })
    }

    let items = []

    for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].group === req.params.group) {
            if (!req.params.type) {
                items.push(itemList[i]);
            } else {
                if (itemList[i].type === req.params.type) {
                    items.push(itemList[i]);
                }
            }
        }    
    }

    res.status(200).json({
        item: items
    })
});

app.get('/Items/Name/:name/:priceFrom?/:priceTo?', (req, res) => {
    let item = itemList.find(el => el.name === req.params.name)
    if(!item){
        res.status(404).json({
            message: "Item with this name was not found.",
            name: req.params.name
        })
    }

    let items = []

    for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].name === req.params.name) {
            items.push(itemList[i]);
        }    
    }

    res.status(200).json({
        item: items
    })
});

app.post('/Items', (req, res) => {
    let newItemID;
    if (itemList.length > 0) {
        newItemID = (itemList[itemList.length - 1].ID + 1);
    } else {
        newItemID = 1;
    }
    const newItem = Object.assign({ID: newItemID}, req.body);
    itemList.push(newItem);
    fs.writeFile('./Data/items.json', JSON.stringify(itemList), (err) => {
        itemList = JSON.parse(fs.readFileSync('./Data/items.json'))
        res.status(201).json({
            item: newItem
        })
    })
});

app.patch('/Items/:id', (req, res) => {
    try {
        const searchID = req.params.id * 1;
        let item = itemList.find(el => el.ID === searchID)
        if(!item){
            res.status(404).json({
                message: "Item with this ID was not found."
            })
        }
        let index = itemList.indexOf(item);
        Object.assign(item, req.body)
        itemList[index] = item;
    
        fs.writeFile('./Data/items.json', JSON.stringify(itemList), (err) => {
            itemList = JSON.parse(fs.readFileSync('./Data/items.json'))
            res.status(201).json({
                item: item
            })
        })
    } catch (error) {
        console.log(error);
    }
});

app.delete('/Items/:id', (req, res) => {
    const searchID = req.params.id * 1;
    let item = itemList.find(el => el.ID === searchID)
    if(!item){
        res.status(404).json({
            message: "Item with this ID was not found."
        })
    }

    let index = itemList.indexOf(item);
    itemList.splice(index, 1);

    fs.writeFile('./Data/items.json', JSON.stringify(itemList), (err) => {
        res.status(204).json({
            item: null
        })
    })

    for (let i = 0; i < itemList.length; i++) {
        if (itemList[i].ID != i + 1) {
            let j = i + 1
            itemList[i].ID = j
            fs.writeFile('./Data/items.json', JSON.stringify(itemList), (err) => {
                itemList = JSON.parse(fs.readFileSync('./Data/items.json'))  
            })
        }
    }
})

app.get('/images', (req, res) => {
    const imagesDir = path.join(__dirname, 'Data/Images');
  
    fs.readdir(imagesDir, (err, files) => {
      if (err) {
        return res.status(500).json({ error: 'Nem sikerült beolvasni a képeket.' });
      }
  
      const imageFiles = files.filter(file =>
        /\.(jpg|jpeg|png|gif)$/i.test(file)
      );
  
      const imagePaths = imageFiles.map(file => `/images/${file}`);
  
      res.json(imagePaths);
    });
  });
  
app.use('/images', express.static(path.join(__dirname, 'Data/Images')));
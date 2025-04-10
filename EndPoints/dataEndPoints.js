app.get('/Datas', (req, res)=> {
    res.json(dataList)
}) 

app.get('/Datas/:id', (req, res) => {
    const searchID = req.params.id * 1;
    let item = dataList.find(el => el.ID === searchID)
    if(!item){
        res.status(404).json({
            message: "Item with this ID was not found."
        })
    }
    res.status(200).json({
        item: item
    })
});

app.post('/Datas', (req, res) => {
    let newItemID;
    if (dataList.length > 0) {
        newItemID = (dataList[dataList.length - 1].ID + 1);
    } else {
        newItemID = 1;
    }
    const newItem = Object.assign({ID: newItemID}, req.body);
    dataList.push(newItem);
    fs.writeFile('./Data/datas.json', JSON.stringify(dataList), (err) => {
        res.status(201).json({
            item: newItem
        })
    })
});

app.get('/Graphs', (req, res)=> {
    res.json(graphList)
})
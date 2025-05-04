app.get('/Datas', (req, res)=> {
    res.json(orderList)
}) 

app.get('/Datas/:id', (req, res) => {
    const searchID = req.params.id * 1;
    let order = orderList.find(el => el.ID === searchID)
    if(!order){
        res.status(404).json({
            message: "Order with this ID was not found."
        })
    }
    res.status(200).json({
        order: order
    })
});

app.post('/Datas', (req, res) => {
    let orderID;
    if (orderList.length > 0) {
        orderID = (orderList[orderList.length - 1].ID + 1);
    } else {
        orderID = 1;
    }
    const newOrder = Object.assign({ID: orderID}, req.body);
    orderList.push(newItem);
    fs.writeFile('./Data/datas.json', JSON.stringify(orderList), (err) => {
        orderList = JSON.parse(fs.readFileSync('./Data/datas.json'));
        graphList = JSON.parse(fs.readFileSync('./Data/datas-graph.json'));
        res.status(201).json({
            order: newOrder
        })
    })
});

app.get('/Graphs', (req, res) => {
    res.json(graphList)
})

app.patch('/Datas/:id', (req, res) => {
    try {
        const searchID = req.params.id * 1;
        let order = orderList.find(el => el.ID === searchID)
        if(!order){
            res.status(404).json({
                message: "Order with this ID was not found."
            })
        }
        let index = orderList.indexOf(order);
        Object.assign(order, req.body)
        orderList[index] = order;
    
        fs.writeFile('./Data/orders.json', JSON.stringify(orderList), (err) => {
            orderList = JSON.parse(fs.readFileSync('./Data/orders.json'))
            res.status(201).json({
                order: order
            })
        })
    } catch (error) {
        console.log(error);
    }
})
const fs = require('fs');

let itemList = JSON.parse(fs.readFileSync('./Data/items.json'));

for (let i = 0; i < itemList.length; i++) {
    console.log(itemList[i].ID + " ID (Index: " + i +")")
    if (itemList[i].ID != i + 1) {
        let j = i + 1
        itemList[i].ID = j
        console.log(itemList[i].ID + " ID (Index: " + i +")")
        fs.writeFile('./Data/items.json', JSON.stringify(itemList), (err) => {
            console.log("ID Changed")
    })
    }
}  
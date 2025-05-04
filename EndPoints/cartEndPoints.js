app.post("/checkout", async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "huf",
            product_data: {
              name: "HofiShop fizetés",
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "https://bencecske.github.io/WebShop/mobile-sikeres.html?platform=set&id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://bencecske.github.io/WebShop/megszakitva.html?platform=set",
    });
  
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/get-checkout-session", async (req, res) => {
  try {
    const sessionId = req.query.id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
  
    res.json(session);
  } catch (error) {
    res.send(error)
  }
});

app.post('/succes', (req, res) => {
  try {
    let session = req.query.id;
    let newOrderID;
    if (orderList.length > 0) {
      newOrderID = orderList[orderList.length - 1].ID + 1;
    } else {
      newOrderID = 1;
    }
    if (1 == 1) {
      const searchUser = req.body.name;
      const user = userList.find(el => el.name === searchUser);
      const newOrder = {
        ID: newOrderID,
        session: session,
        customer: req.body.name,
        date: req.body.date,
        price: req.body.price,
        count: user.inCart,
        itemIDs: user.inCartID,
        status: 0
      };
      orderList.push(newOrder);
      fs.writeFile('./Data/orders.json', JSON.stringify(orderList), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Nem sikerült menteni a rendelést.' });
        }
        orderList = JSON.parse(fs.readFileSync('./Data/orders.json'));
        if (user) {
          if (!user.orders) user.orders = [];
          user.orders.push(newOrderID);
          user.inCartID = [];
          user.inCart = 0;
          fs.writeFileSync('./Data/users.json', JSON.stringify(userList, null, 2));
          userList = JSON.parse(fs.readFileSync('./Data/users.json'));
        }
        res.status(201).json({
          order: newOrder
        });
      });
    } else {
      res.status(404).json({
        message: "No data provided"
      });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/orders', (req, res) => {
  res.json(orderList)
});
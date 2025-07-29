
const express = require('express');
const { graphql, buildSchema } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');
const router = express.Router();

router.use(express.json());

const orders = [
  {
    number: 'R500160602',
    email: 'ac-appsec03@acmecorp.com',
    zipcode: '44333',
    firstName: 'AcmeCorp',
    lastName: 'AppSec',
    fullName: 'AcmeCorp AppSec',
    phone: '555-0103',
    address1: '123 Security St',
    address2: '',
    city: 'Cleveland',
    state: 'OH',
    lastFour: '1234',
    items: [
      { name: 'Security Assessment', price: 12500, quantity: 1 },
      { name: 'Penetration Test', price: 8500, quantity: 1 }
    ],
    total: 21000,
    status: 'Processing',
    orderDate: '2023-02-07',
    trackingNumber: 'SEC12345678'
  },
  {
    number: 'R500160603',
    email: 'john.doe@email.com',
    zipcode: '10001',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    phone: '555-0104',
    address1: '456 Main St',
    address2: 'Apt 2B',
    city: 'New York',
    state: 'NY',
    lastFour: '5678',
    items: [
      { name: 'Laptop Computer', price: 1299, quantity: 1 },
      { name: 'Mouse', price: 25, quantity: 1 }
    ],
    total: 1324,
    status: 'Shipped',
    orderDate: '2023-02-06',
    trackingNumber: 'TRK987654321'
  },
  {
    number: 'R500160604',
    email: 'jane.smith@email.com',
    zipcode: '90210',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    phone: '555-0105',
    address1: '789 Beverly Dr',
    address2: '',
    city: 'Beverly Hills',
    state: 'CA',
    lastFour: '9012',
    items: [
      { name: 'Designer Bag', price: 850, quantity: 1 },
      { name: 'Sunglasses', price: 200, quantity: 1 }
    ],
    total: 1050,
    status: 'Delivered',
    orderDate: '2023-02-05',
    trackingNumber: 'DLV456789123'
  }
];

// Generate larger dataset for realistic bruteforcing demonstration
// Orders from R500160600 to R500160999 (400 orders) with gaps to simulate real-world scenario
const names = [
  'Alice Johnson', 'Bob Wilson', 'Charlie Brown', 'Diana Garcia', 'Eva Martinez', 'Frank Lee',
  'Sarah Connor', 'Mike Davis', 'Lisa Anderson', 'Tom Wilson', 'Jennifer Taylor', 'David Moore',
  'Emily Clark', 'James White', 'Michelle Lewis', 'Robert Hall', 'Amanda Young', 'Kevin King',
  'Jessica Wright', 'Daniel Green', 'Rachel Adams', 'Mark Thompson', 'Nicole Miller', 'Ryan Garcia',
  'Stephanie Martinez', 'Joshua Rodriguez', 'Kimberly Jackson', 'Christopher Lee', 'Angela Scott',
  'Matthew Turner', 'Melissa Phillips', 'Andrew Campbell', 'Heather Parker', 'Brian Evans'
];

const cities = ['Cleveland', 'New York', 'Beverly Hills', 'Boston', 'Chicago', 'Los Angeles', 'Miami', 'Seattle'];
const states = ['OH', 'NY', 'CA', 'MA', 'IL', 'CA', 'FL', 'WA'];
const zipcodes = ['44333', '10001', '90210', '02201', '60601', '90028', '33101', '98101'];
const items = [
  'Security Assessment', 'Penetration Test', 'Laptop Computer', 'Designer Bag', 'Sunglasses',
  'Smartphone', 'Tablet', 'Headphones', 'Watch', 'Camera', 'Gaming Console', 'Monitor',
  'Keyboard', 'Mouse', 'Speaker', 'Router', 'Hard Drive', 'Memory Card', 'Charger', 'Cable'
];

// Generate orders with realistic gaps (simulate some orders being cancelled/deleted)
for (let i = 600; i <= 999; i++) {
  // Skip some numbers to create realistic gaps (about 30% missing)
  if (Math.random() < 0.3) continue;
  
  const orderNum = `R5001606${String(i).padStart(2, '0')}`;
  const randomName = names[Math.floor(Math.random() * names.length)];
  const [firstName, lastName] = randomName.split(' ');
  const cityIndex = Math.floor(Math.random() * cities.length);
  
  orders.push({
    number: orderNum,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    zipcode: zipcodes[cityIndex],
    firstName: firstName,
    lastName: lastName,
    fullName: randomName,
    phone: `555-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    address1: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Pine', 'Elm', 'Maple', 'Cedar'][Math.floor(Math.random() * 6)]} St`,
    address2: Math.random() > 0.7 ? `Apt ${Math.floor(Math.random() * 10) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}` : '',
    city: cities[cityIndex],
    state: states[cityIndex],
    lastFour: String(Math.floor(Math.random() * 9000) + 1000),
    items: [
      { 
        name: items[Math.floor(Math.random() * items.length)], 
        price: Math.floor(Math.random() * 2000) + 100, 
        quantity: Math.floor(Math.random() * 3) + 1 
      }
    ],
    total: Math.floor(Math.random() * 5000) + 100,
    status: ['Processing', 'Shipped', 'Delivered', 'Pending'][Math.floor(Math.random() * 4)],
    orderDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    trackingNumber: `${['TRK', 'SHP', 'DLV', 'PKG'][Math.floor(Math.random() * 4)]}${Math.floor(Math.random() * 900000000) + 100000000}`
  });
}

const schema = buildSchema(`
  type Item {
    name: String
    price: Int
    quantity: Int
  }

  type Order {
    number: String
    email: String
    zipcode: String
    firstName: String
    lastName: String
    fullName: String
    phone: String
    address1: String
    address2: String
    city: String
    state: String
    lastFour: String
    items: [Item]
    total: Int
    status: String
    orderDate: String
    trackingNumber: String
  }

  type Query {
    order(number: String!, zipcode: String!, guestToken: String): Order
  }
`);

const root = {
  order: ({ number, zipcode, guestToken }) => {
    console.log(`GraphQL Query: number=${number}, zipcode=${zipcode}, guestToken=${guestToken}`);
    
    const order = orders.find(o => o.number === number);
    if (!order) {
      return null;
    }
    
    if (order.zipcode.includes(zipcode)) {
      return order;
    }
    
    return null;
  }
};

router.get('/demo2', (req, res) => {
  res.render('demo2/index', { title: 'ShopTracker - Order Lookup' });
});

router.get('/demo2/docs', (req, res) => {
  res.render('demo2/docs', { title: 'ShopTracker Security Documentation' });
});

router.post('/api/platform/sales', async (req, res) => {
  const { query, variables, operationName } = req.body;
  
  console.log('GraphQL Request:', { query, variables, operationName });
  
  try {
    const result = await graphql({
      schema: schema,
      source: query,
      rootValue: root,
      variableValues: variables
    });
    
    res.json(result);
  } catch (error) {
    console.error('GraphQL Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/api/orders', (req, res) => {
  const publicOrders = orders.map(order => ({
    number: order.number,
    status: order.status,
    orderDate: order.orderDate,
    total: order.total
  }));
  
  res.json(publicOrders);
});

module.exports = router;

{/*require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const oracledb = require("oracledb");




const app = express();
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

function authenticateJWT(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Access denied" });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

function isLoggedIn(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "User not logged in" });
  next();
}

async function seller_signup(req, res)  {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { seller_id,seller_email, name, password } = req.body;

    let checkDuplicateId=await connection.execute('select * from user_table where user_id=:1',[user_id]);
    if(checkDuplicateId.rows.length>0) return res.json({message:'USER ID already exists. Please enter new one.'})

const address_id=null;
    await connection.execute(
      "INSERT INTO SELLER (seller_id,seller_email, address_id, name, password) VALUES (:1, :2, :3, :4)",
      [seller_id, seller_email,address_id, name, password],
      { autoCommit: true }
    );

    res.status(201).json({ message: "Seller registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

async function seller_login (req, res)  {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { seller_id, password } = req.body;
    const result = await connection.execute("select password from seller where seller_id = :1", [seller_id]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Seller not found" });
    const isMatch = password=== result.rows[0][0];
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ seller_id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

 async function user_signup (req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { user_id, user_name,  mobile_number,password} = req.body;
    
    let checkDuplicateId=await connection.execute('select * from user_table where user_id=:1',[user_id]);
    if(checkDuplicateId.rows.length>0) return res.json({message:'USER ID already exists. Please enter new one.'});
    const address_id=null;

    
    await connection.execute(
      "insert into user_table  VALUES (:1, :2,:3, :4, :5)",
      [user_id, user_name, address_id, mobile_number,password],
      { autoCommit: true }
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

 async function user_login (req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { user_id, password } = req.body;
    const result = await connection.execute(
      "SELECT password FROM USER_TABLE WHERE user_id = :1 ",
      [user_id]
    );
    if (result.rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });
   
    const isMatch = password=== result.rows[0][0];
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ user_id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};


module.exports={
    user_login,
    user_signup,
    seller_login,
    seller_signup,
    authenticateJWT,
    isLoggedIn
} */}

require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const oracledb = require("oracledb");

const app = express();
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECT_STRING
};

function authenticateJWT(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}

function isLoggedIn(req, res, next) {
  if (!req.user) return res.status(401).json({ message: "User not logged in" });
  next();
}

async function seller_signup(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { name, email,username,phone,password } = req.body;

    const checkDuplicateId = await connection.execute('SELECT seller_id FROM seller WHERE seller_id=:1', [username]);
    if (checkDuplicateId.rows.length > 0) return res.status(400).json({ message: 'Seller ID already exists.' });


    await connection.execute(
      "INSERT INTO SELLER (seller_id, seller_email, mobile,name, password) VALUES (:1, :2, :3, :4, :5)",
      [username,email, phone, name, password],
      { autoCommit: true }
    );

    res.status(201).json({ message: "Seller registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

async function seller_login(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { username, password } = req.body;
    
    const result = await connection.execute("SELECT password FROM seller WHERE seller_id = :1", [username]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Seller not found" });

    const isMatch =(password===result.rows[0][0]);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

async function user_signup(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { name,email,username,phone,password } = req.body;

   {/* const checkDuplicateId = await connection.execute('SELECT user_id FROM user_table WHERE user_id=:1', [username]);
    if (checkDuplicateId.rows.length > 0) return res.status(400).json({ message: 'User ID already exists.' });*/}


    await connection.execute(
      `INSERT INTO user_table (user_id, user_name, email,mobile_number, password) VALUES (:1, :2, :3, :4, :5)`,
      [username,name, email, phone, password],
      { autoCommit: true }
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

async function user_login(req, res) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const { username, password } = req.body;

    const result = await connection.execute("SELECT password FROM USER_TABLE WHERE user_id = :1", [username]);
    if (result.rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch =(password=== result.rows[0][0]);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (connection) await connection.close();
  }
};

module.exports = { user_login, user_signup, seller_login, seller_signup, authenticateJWT, isLoggedIn };

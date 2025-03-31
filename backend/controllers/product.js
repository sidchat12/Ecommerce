require('dotenv').config();
const oracledb = require('oracledb');

const { v4: uuidv4 } = require('uuid');

const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

//get product details by id
async function get_product(req, res) {
    const { product_id } = req.params;

    if (!product_id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `SELECT product_id, product_title, price, description, photo, category 
                     FROM product WHERE product_id = :product_id`;

        const result = await connection.execute(sql, { product_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};




async function add_product(req, res) {
    let product_id = uuidv4();
    let {seller_id}=req.params
    const { product_title, price, description, category } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!product_id || !product_title || !price || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `INSERT INTO product (product_id, product_title, price, description, photo, category) 
                     VALUES (:product_id, :product_title, :price, :description, :photo, :category)`;

        await connection.execute(sql, {
            product_id,
            product_title,
            price,
            description,
            photo,
            category
        }, { autoCommit: true });

            await connection.execute(`insert into sells (seller_id,product_id) values (:seller_id,:product_id)`,
                {
                    seller_id,product_id
                },{autoCommit:true}
            )
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function get_product_by_seller (req, res){
    const { seller_id } = req.params;

    if (!seller_id) {
        return res.status(400).json({ error: 'Seller ID is required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `
            SELECT p.product_id, p.product_title, p.price, p.description, p.photo, p.category
            FROM product p
            JOIN sells s ON p.product_id = s.product_id
            WHERE s.seller_id = :seller_id
        `;

        const result = await connection.execute(sql, { seller_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No products found for this seller' });
        }

        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

//get product by category
async function get_product_by_category (req, res) {
    const { category } = req.params;
    if(!category){
        return res.status(404).json({message:"Invalid category"});
    }

    try {
        const connection = await oracledb.getConnection(dbConfig);
        const query = `SELECT * FROM product WHERE category = :category`;
        const result = await connection.execute(query, [category], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        await connection.close();
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Database error", details: error.message });
    }
};

async function get_product_for_homepage(req,res){
  let connection;
    try{
        connection=await oracledb.getConnection(dbConfig);
        const query=`select p.photo,p.product_title,p.price from product p fetch first 20 rows only`;
        const result=await connection.execute(query,{ outFormat: oracledb.OUT_FORMAT_OBJECT });
        await connection.close();
        res.json(result.rows);

    }catch(error){
        res.status(500).json({error:"some error"});
    }
};



module.exports = { add_product,
     upload,
     get_product,
    get_product_by_seller,
    get_product_by_category,
    get_product_for_homepage
    };




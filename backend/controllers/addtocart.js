require('dotenv').config();
const oracledb = require('oracledb');



const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

async function add_to_cart (req, res) {
    const { product_id, user_id } = req.body;

    if (!product_id || !user_id) {
        return res.status(400).json({ error: 'Product ID and User ID are required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `INSERT INTO add_to_cart (product_id, user_id) VALUES (:product_id, :user_id)`;

        await connection.execute(sql, { product_id, user_id }, { autoCommit: true });

        res.status(201).json({ message: 'Product added to cart successfully' });

    } catch (error) {
        if (error.errorNum === 1) {
            res.status(409).json({ error: 'Product already in cart' });
        } else {
            res.status(500).json({ error: error.message });
        }
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


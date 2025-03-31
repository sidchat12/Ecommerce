require('dotenv').config();
const oracledb = require('oracledb');
const { v4: uuidv4 } = require('uuid');

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

async function add_address(req, res) {
    const { address_line_1, address_line_2, city, state, pincode } = req.body;
    let address_id = uuidv4(); 
    let { user_id } = req.params;

    if (!address_id || !address_line_1 || !city || !state || !pincode) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const check = await connection.execute(
            `SELECT * FROM lives l WHERE l.user_id = :user_id`,
            [user_id],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (check.rows.length > 0) return res.json({ message: `Address already added` }); // Added return

        await connection.execute(`INSERT INTO address (address_id, address_line_1, address_line_2, city, state, pincode) 
                                  VALUES (:address_id, :address_line_1, :address_line_2, :city, :state, :pincode)`, 
                                  { address_id, address_line_1, address_line_2, city, state, pincode }, 
                                  { autoCommit: true });

        await connection.execute(`INSERT INTO lives (user_id, address_id) VALUES (:user_id, :address_id)`, 
                                  { user_id, address_id }, 
                                  { autoCommit: true });

        res.status(201).json({ message: 'Address added successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports = { add_address };

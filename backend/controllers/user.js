require('dotenv').config();
const oracledb = require('oracledb');


const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};


//get user details
async function getuser(req, res){
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `select u.user_id,u.user_name,u.email,u.mobile_number,a.address_line_1,a.address_line_2,a.city,a.state,a.pincode from
        usert_table u,address a,lives l where l.address_id=a.address_id and l.user_id=u.user_id and u.user_id=:user_id`;

        const result = await connection.execute(sql, { user_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
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

//get seller details
async function getseller(req, res){
    const { seller_id } = req.params;

    if (!seller_id) {
        return res.status(400).json({ error: 'Seller ID is required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `SELECT s.seller_id,s.seller_email, s.name,s.mobile,s.password,a.address_line_1,a.address_line_2,a.city,a.state,
        a.pincode,a.state from seller s,address a,lives l where l.user_id=s.seller_id and l.address_id=a.address_id and s.seller_id=:seller_id`;

        const result = await connection.execute(sql, { seller_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Seller not found' });
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



async function update_user_id (req, res){
    const { old_user_id, new_user_id } = req.body;

    if (!old_user_id || !new_user_id) {
        return res.status(400).json({ error: 'Both old and new user IDs are required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const check=await oracledb.execute(`select * from user_table where user_id=:new_user_id`);
        if(check.rowsAffected>0) return res.json({message:'User ID already exists'});
        const sql = `UPDATE user_table SET user_id = :new_user_id WHERE user_id = :old_user_id`;

        const result = await connection.execute(sql, { new_user_id, old_user_id }, { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'User ID not found' });
        }

        res.status(200).json({ message: 'User ID updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};


//update user_address
async function update_user_address(req, res) {
    const { user_id, new_address_id } = req.body;

    if (!user_id || !new_address_id) {
        return res.status(400).json({ error: 'User ID and new address ID are required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        
        const sql = `UPDATE user_table SET address_id = :new_address_id WHERE user_id = :user_id`;

        const result = await connection.execute(sql, { new_address_id, user_id }, { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User address updated successfully' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};

module.exports={
    update_user_address,
    getuser,
    getseller,
    update_user_id
};



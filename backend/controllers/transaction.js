require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const oracledb = require('oracledb');


const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

async function initiate_purchase(req,res){
    const{user_id,product_id}=req.params;
    if (!user_id||!product_id) {
        return res.status(400).json({ error: 'Seller ID is required' });
    }


    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

    

        const sql = `
            select a.address_line_1,a.address_line_2,a.city,a.pincode,a.state,p.photo,p.product_title,p.price from product p,address a, lives l, user_table u 
            where a.address_id=l.address_id and l.user_id=u.user_id and p.product_id=:product_id and u.user_id=:user_id
        `;

         const result=await connection.execute(sql,{product_id,user_id},{ outFormat: oracledb.OUT_FORMAT_OBJECT });
       
        res.status(200).json(result.rows[0]);
      

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }

    
}
async function purchase (req, res){
    const { user_id,product_id } = req.params;
    const order_id=await uuidv4();

    if (!user_id||!product_id) {
        return res.status(400).json({ error: 'Seller ID is required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

    

        const sql = `
            insert into bought (order_id,product_id,user_id) values (:order_id,:product_id,:user_id)
        `;

         await connection.execute(sql, { order_id,product_id,user_id }, { outFormat: oracledb.OUT_FORMAT_OBJECT });

       

      

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function get_user_history (req, res){
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `
            select b.order_id,p.product_title,p.price,b.purchase_time from product p,bought b where p.product_id=b.product_id
        `;

        const result = await connection.execute(sql, { outFormat: oracledb.OUT_FORMAT_OBJECT });

       res.status(200).json({result});

      

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

async function get_order(req,res){
    let{order_id}=req.params;

    if (!order_id) {
        return res.status(400).json({ error: 'Order ID is required' });
    }



    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);

        const sql = `
           select p.product_title,p.price,p.photo,a.address_line_1,a.address_line_2,a.city,a.state,a.pincode,u.user_name from 
           product p,address a,bought b,user_table u where b.address_id=a.address_id and p.product_id=b.product_id and u.user_id=b.user_id and
           b.order_id=:order_id 
        `;

        const result = await connection.execute(sql, {order_id},{ outFormat: oracledb.OUT_FORMAT_OBJECT });

       res.status(200).json({result});

      

    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports={
    purchase,
    get_user_history,
    get_order,
    initiate_purchase
}
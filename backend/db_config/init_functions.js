require('dotenv').config();

const express = require('express');
const oracledb = require('oracledb');

const app = express();
app.use(express.json());

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING
};

async function createTables() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig).then(console.log("db connected"));

        const queries = [
            `CREATE TABLE ADDRESS (
                address_id VARCHAR2(200) PRIMARY KEY,
                address_line_1 VARCHAR2(200),
                address_line_2 VARCHAR2(200),
                city VARCHAR2(200),
                state VARCHAR2(200) CHECK (state IN ('Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Delhi', 'Puducherry')),
                pincode NUMBER(6)
            )`,
            
            `CREATE TABLE SELLER (
                seller_id VARCHAR2(200) PRIMARY KEY,
                seller_email varchar2(200),
                mobile number(10),
                name VARCHAR2(200) NOT NULL,
                password VARCHAR2(200) NOT NULL
            )`,
            `CREATE TABLE SELLS (
                seller_id VARCHAR2(200),
                product_id VARCHAR2(200)
            )`,
            `CREATE TABLE USER_TABLE (
                user_id VARCHAR2(200) PRIMARY KEY,
                user_name VARCHAR2(200) NOT NULL,
                email varchar2(200),
                mobile_number NUMBER(10) UNIQUE NOT NULL,
                password VARCHAR2(200) NOT NULL
            )`,
            `CREATE TABLE PRODUCT (
                product_id VARCHAR2(200) PRIMARY KEY,
                product_title VARCHAR2(200) NOT NULL,
                price NUMBER(10,2) CHECK (price >= 0),
                description VARCHAR2(200),
                photo VARCHAR2(200),
                category VARCHAR2(200) CHECK (category IN ('Mens','Womens','Kids','Books','Electronics','Sports','Stationary'))
            )`,
            `CREATE TABLE REVIEW_TABLE (
                review_id VARCHAR2(200) PRIMARY KEY,
                review_stars NUMBER(1) CHECK (review_stars BETWEEN 0 AND 5),
                review_text VARCHAR2(200),
                review_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE REVIEWS (
                review_id VARCHAR2(200),
                user_id VARCHAR2(200),
                product_id VARCHAR2(200)
            )`,
            `CREATE TABLE BOUGHT (
                order_id VARCHAR2(200) PRIMARY KEY,
                product_id VARCHAR2(200) NOT NULL,
                address_id VARCHAR2(200),
                user_id VARCHAR2(200) NOT NULL,
                purchase_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES PRODUCT(product_id),
                FOREIGN KEY (user_id) REFERENCES USER_TABLE(user_id),
                FOREIGN KEY (address_id) REFERENCES ADDRESS(address_id)
            )`,
            `CREATE TABLE LIVES (
                user_id VARCHAR2(200),
                address_id VARCHAR2(200),
                FOREIGN KEY (user_id) REFERENCES USER_TABLE(user_id),
                FOREIGN KEY (address_id) REFERENCES ADDRESS(address_id)
            )`,
        ];

        for (const query of queries) {
            try {
                await connection.execute(query);
            } catch (error) {
                if (error.errorNum !== 955) {
                    console.error("Error executing query:create table", error.message," query:",query);
                }
            }
        }

        console.log("Tables checked/created successfully");

    } catch (error) {
        console.error("Database connection error:drop table", error.message,"query :",query);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}


async function dropTables() {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig).then(console.log("db connected"));

        const queries = [
            
            
            `DROP TABLE BOUGHT CASCADE CONSTRAINTS`,
            `DROP TABLE REVIEW_TABLE CASCADE CONSTRAINTS`,
           ` DROP TABLE REVIEWS CASCADE CONSTRAINTS`,
            `DROP TABLE SELLS CASCADE CONSTRAINTS`,
            `DROP TABLE SELLER CASCADE CONSTRAINTS`,
            `DROP TABLE LIVES CASCADE CONSTRAINTS`,
            `DROP TABLE USER_TABLE CASCADE CONSTRAINTS`,
            `DROP TABLE PRODUCT CASCADE CONSTRAINTS`,
           `DROP TABLE ADDRESS CASCADE CONSTRAINTS`
            
        ];

        for (const query of queries) {
            try {
                await connection.execute(query);
            } catch (error) {
                if (error.errorNum !== 955) {
                    console.error("Error executing query:drop table", error.message);
                }
            }
        }

        console.log("Tables dropped successfully");

    } catch (error) {
        console.error("Database connection error:", error.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports={createTables,dropTables}
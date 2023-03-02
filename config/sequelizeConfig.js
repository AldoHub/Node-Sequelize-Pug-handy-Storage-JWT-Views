const conn = {
    "development": {
       database: "mynewdatabase",
       username: "root",
       password: "",
       host: "localhost",
       dialect: "mysql",
    },
    "test": {
       database: "posts",
       username: "root",
       password: "",
       host: "localhost",
       dialect: "mysql",
    },
    "production": {
       database: "posts",
       username: "root",
       password: "",
       host: "localhost",
       dialect: "mysql",
    }
       
}
   
module.exports = conn;
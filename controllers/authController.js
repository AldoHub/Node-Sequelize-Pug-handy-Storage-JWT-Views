const conn = require("../config/sequelizeConfig");
const fs = require("fs");
const bcrypt = require("bcrypt");
const userUpload = require("../libs/users");
const saltRounds = 10;
const {models} = require("../models/index");
const jwt = require("jsonwebtoken");
const storage = require("../libs/handyStorage");
const usersUpload = require("../libs/users");
const handle = require("../libs/promiseHandler");

const authController = {
    showRegister: (req, res) => {
        res.render("./register");
    },
    register: (req, res) => {
        if(conn.error){
            res.status(500);
        }else{
           userUpload(req, res, (err) => {
                if(err) {
                    res.status(500).render("./register", {err: `Error uploading image ${err}`})
                }else{
                    if(req.body.email === "" || req.body.password === ""){
                        //at this point the image is being uploaded for some reason***
                        //so we need to remove it
                        let avatarsPath = `./users/avatars/${req.file.filename}`;
                        fs.unlinkSync(avatarsPath, (err) => {
                            if(err){
                               console.log(`Error deleting ${req.file.filename}`);
                            }
                        });
                        res.status(500).render("./register", {err: "Please fill all the form elements"});    
                    }else{
                        //everything went OK, continue
                        //enctrypt the password
                        let hash = bcrypt.hashSync(req.body.password, saltRounds);

                        //save the user
                        models.User.create({
                            email: req.body.email,
                            password: hash,
                            avatarUrl: req.file.filename,
                            avatarname: req.file.filename
                        }).then((user) => {
                            console.log(user);
                            //set the token and user values
                            storage.setState({
                                token: jwt.sign({user: req.body.email}, "supersecretpassword", {expiresIn: '2h'}),
                                user:user.dataValues
                            })

                            res.status(201).redirect("/");
                        }).catch(err => {
                            console.log(err);
                            let avatarsPath = `./users/avatars/${req.file.filename}`;
                            fs.unlinkSync(avatarsPath, (err) => {
                               if(err){
                                 console.log(`Error deleting ${req.file.filename}`)
                               }
                            });
                            res.status(500).render("./register", {
                                err: `There was an error: ${err}`
                           })
                        })

                    }


                }
           }); 
        }



    },
    showLogin: (req, res) => {
        res.render("./login");
    },
    login: (req, res) => {
        usersUpload(req, res, async(err) => {
            if(err){
                console.log(err);
            }

            const [user, userError] = await handle(models.User.findOne({
                where: {email: req.body.email},
                include: [{model: models.Post }]
            })); 

            if(userError){
                res.status(500).render("./login", {
                    err: `Error reaching the user, please try again later`
                });
            }
            if(user){
                let password = req.body.password;
                let userHash = user.dataValues.password;

                bcrypt.compare(password, userHash, (err, success) =>{
                    if(!success){
                        res.status(500).render("./login", {err: "There was an error processing the request"})
                       
                    }else{
                        storage.setState({
                            token: jwt.sign({user: req.body.email}, "supersecretpassword", {expiresIn: "2h"}),
                            user: user.dataValues
                        });

                        user.Posts.map(p => {
                            console.log(p.dataValues);
                        });

                        //try to redirect the user back in this place, the where he/she was    
                        res.status(200).redirect("/");

                    }


                })

            }


        })



    },
    logout: (req, res) => {
      storage.setState({
          token: "",
          user: ""
      });
      res.redirect("/auth/login");
    },
    showDashboard: (req, res) => {

       models.User.findOne({
           where: {email: storage.state.user.email},
           include: [{
               model: models.Post
           }]
       }).then(user => {
        res.render("./dashboard", {user: user.dataValues});

       }).catch(err => {
           res.status(500);
       })
      
    }

}

module.exports = authController;
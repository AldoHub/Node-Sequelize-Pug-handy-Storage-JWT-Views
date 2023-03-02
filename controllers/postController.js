const coversUpload = require("../libs/covers");
const {models} = require("../models/index");
const storage = require("../libs/handyStorage");
const fs = require("fs");


const postController = {
    getAllPosts: (req, res) => {
       models.Post.findAll({
           include: [{
               model: models.User
           }]
       })
       .then((posts) => {
           let _posts = [];
           posts.map(p => {
            _posts.push(p.dataValues)
           });
           res.render("main", {posts: _posts})
       }).catch(err => {
           res.status(500).render("./main", {err: "There was an error fetching all the posts"});
       })

    },
    getSinglePost:(req, res) => {
       models.Post.findOne({
           where: {id: req.params.id},
           include: [{
               model: models.User
           }]
       })
       .then(post => {
           let _post = post.dataValues;
           res.status(200).render("single", {post: _post});
       }).catch(err => {
           console.log(err);
       })
    },
    showCreate:(req, res) => {
       res.render("create");
    },
    createPost:(req, res) => {
             
         coversUpload(req, res, (err) => {

            if(err){
                res.status(500).render("./craete", {err: `Error uploading image: ${err}`})
            }else{
                if(req.body.title === "" || req.body.content === ""){
                    let coversPath = `./covers/${req.file.filename}`;
                    fs.unlinkSync(coversPath, (err) =>{
                        if(err){
                            console.log(`Error deleting ${req.file.filename}`)
                        }
                    });
                    res.status(500).render("./create", {err: "Please fill all the form elements"})
                }else{
                    //create the post
                  
                   models.Post.create({
                        title: req.body.title,
                        content: req.body.content,
                        covername: req.file.filename,
                        coverUrl: `http://localhost:4000/covers/${req.file.filename}`,
                        UserId: storage.state.user.id
                    }).then((post) =>{
                        console.log(post);
                        res.status(201).render("./create");    
                    }).catch(err => {
                        let coversPath = `./covers/${req.file.filename}`;
                        fs.unlinkSync(coversPath, (err) => {
                            if(err){
                              console.log(`Error deleting ${req.file.filename}`)
                            }
                        })
                        res.status(500).render("./create", {
                             err: `There was an error: ${err}`
                        });
                    })




                }

            }

         })


    },
    updatePost:(req, res) => {
        coversUpload(req, res, (err) => {

            if(err){
                res.status(500).render(`./post/${req.params.id}`, {err: `Error uploading image: ${err}`});
            }else{
                if(req.body.title === "" || req.body.content === ""){
                    let coversPath = `./covers/${req.file.filename}`;
                    fs.unlinkSync(coversPath, (err) => {
                        if(err){
                          console.log(`Error deleting ${req.file.filename}`)
                        }
                    });
                    res.status(500).render(`./post/${req.params.id}`, {err: "Please fill all the form elements"});
                }else{
                    //find the post
                    models.Post.findOne({
                        where: {id: req.params.id}
                    })
                    .then(post => {
                        let title = req.body.title;
                        let content = req.body.content;
                        let covername = "";
                        let coverUrl = "";

                        if(req.file !== undefined){
                            covername = req.file.filename;
                            coverUrl = `http://localhost:4000/covers/${req.file.filename}`

                            let coversPath = `./covers/${req.body.imageUrl}`;
                            fs.unlinkSync(coversPath, (err) => {
                                if(err){
                                  console.log(`Error deleting ${req.body.imageUrl}`)
                                }
                            });


                        }else{
                            covername = req.body.imageUrl;
                            coverUrl= `http://localhost:4000/covers/${req.body.imageUrl}`;

                        }

                        post.update({
                            title,
                            content,
                            covername, 
                            coverUrl
                        }).then((post) => {
                            res.redirect(200, `/post/${req.params.id}`);
                        }).catch((err) => {
                            res.status(500).render(`/post/${req.params.id}`, {err: `Error: ${err}`});
                        });



                    }).catch(err => {
                        console.log(err);
                    })

                }
               
            }
        
        });


    },
    deletePost: async (req, res) => {
     
        let _p = await models.Post.findOne({
            where:{
                id: req.params.id
            }
        });

        const cn = _p.dataValues.covername;
        const coversPath = `./covers/${cn}`;
        console.log(coversPath);

        let d =  await models.Post.destroy({
            where: {
                id: req.params.id
            }
        });

        if(d === 1){
            fs.unlinkSync(coversPath, (err) => {
                if(err){
                  console.log(`Error deleting ${cn}`)
                }
            });
            res.redirect(200, "/");
        }else{
            console.log("post WASNT deleted");
            res.status(500).render(`./post/${req.params.id}`, {err: err.message});
        }

    },
}

module.exports = postController;
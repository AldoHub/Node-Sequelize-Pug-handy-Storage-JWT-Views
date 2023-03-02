const storage = require("../libs/handyStorage");
const jwt = require("jsonwebtoken");

const tokenHandler = () => {
    return(req, res, next) => {
       
        if(storage.state.token !== ""){
            jwt.verify(storage.state.token, "supersecretpassword", (err, decoded) =>{
                if(err){
                    //refresh token there too!!
                    //can also ssave the page to localstorage/res.locals
                    //then redirect the user back to where he/she was
                    res.redirect("auth/login");
                 
                }else{
                    console.log(decoded);
                    //save the decoded in a cookie, to check expired date later
                    return next();
                }

            })
        }else{
            res.redirect("auth/login");
        }


    }

}

module.exports = tokenHandler;
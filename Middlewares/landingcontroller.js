const landingcontroller = (req,res,next) => {
    console.log(req.session.user)
    res.render('landingpage',{
        user:req.session.user
    });
}


module.exports = landingcontroller;
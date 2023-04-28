module.exports={
    adminAuthentication:(req,res,next)=>{

        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        let title
        let title1
        title = title.split("")
        title1 = title.slice(0,11)
        title1 = title1.join("")

        if (title1=="103.214.235" || title1=="115.246.245") {
            
            next();  
        }
        else{
           
            res.redirect('/admin/login')
        }
    }
}
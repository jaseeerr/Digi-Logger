const multer=require('multer')

let Storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images/attendees')
    },
    filename:function(req,file,cb){
        
        let ext=file.originalname.substring(file.originalname.lastIndexOf('.'))
        
     
        cb(null,file.fieldname+'-'+Date.now()+'.png')
    }
})
module.exports=store=multer({storage:Storage})
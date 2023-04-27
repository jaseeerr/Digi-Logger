const User = require('../model/userSchema')
const Admin = require('../model/adminSchema')
const Attendance = require('../model/attendanceSchema')
const bcrypt = require('bcrypt')
const SU = require('../model/superuserSchema')


module.exports = {

    postsignup:(userdata)=>{
        return new Promise((resolve, reject) => {

            Admin.findOne({phone:userdata.phone}).then((pcheck)=>{
                if(pcheck)
                {
                    resolve({exphone:true})
                }
                else
                {
                    bcrypt.hash(userdata.password,10).then((pass)=>{

                        const admin = new Admin({
        
                        
                            name:userdata.name,
                            location:userdata.location,
                            phone:userdata.phone,
                            password:pass,
                            block:true
                            
            
                        })
            
                        admin.save().then(()=>{resolve({pass:true,exphone:false})})
                    })
                }
            })
            
            
        })
    },

    postlogin:(data)=>{
        return new Promise((resolve, reject) => {
            
            Admin.findOne({phone:data.phone}).then((pdata)=>{
                if(pdata!=null)
                {
                    bcrypt.compare(data.password,pdata.password).then((pass)=>{
                        if(pass)
                        {
                          
                                            
                          
  
                          if(pdata.block)
                          {
                              resolve({loginerr:true,block:true})
                          }
                          else
                          {
                              resolve({loginerr:false,pdata})
                          }
                        }
                        else
                        {
                          resolve({loginerr:true})
                        }
                      })
                }
                else
                {
                    resolve({loginerr:true})
                }
            })
        })
    }

    //superuser function below

    ,
    supostlogin:(data)=>{
        return new Promise((resolve, reject) => {

            SU.findOne({phone:data.phone}).then((pdata)=>{
                if(pdata!=null)
                {
                    if(pdata.password==data.password)
                    {
                        resolve({loginerr:false,pdata})
                    }
                    else
                    {
                        resolve({loginerr:true})
                    }
                }
                else
                {
                    resolve({loginerr:true})
                }
            })
            
        })
    },

    getStudents:()=>{
        return new Promise((resolve, reject) => {
            User.find({}).then((data)=>{
                resolve(data)
            })
        })
    },

    getAdmins:()=>{
        return new Promise((resolve, reject) => {
            Admin.find({}).then((data)=>{
                resolve(data)
            })
        })
    },

    unblockadmin:(id)=>{

        return new Promise((resolve, reject) => {
            
            Admin.findByIdAndUpdate(id,{
                $set:{
                    block:false
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    blockadmin:(id)=>{
        return new Promise((resolve, reject) => {
            Admin.findByIdAndUpdate(id,{
                $set:{
                    block:true
                }
            }).then(()=>{
                resolve()
            })
        })
    },

    getAbsentees:()=>{

        return new Promise((resolve, reject) => {
            let list = []
            let std = []
            Attendance.find({}).then((data)=>{

                

                data.forEach(element => {
                    if(element.attendance<50)
                    {
                        list.push(element.sid)
                    }

                    if(list.length==0)
                    {
                        resolve(list)
                    }
                    
                });

                list.forEach(element => {

                    User.findById(element).then((data)=>{
                   
                        std.push(data)
                    }).then(()=>{
                  
                        if(list.length==std.length)
                        {
                            resolve(std)
                        }
                    })
                    
                })
                    
               
                    
             

                

              
            })
        })
    },

    getTodayabsent:()=>{
        return new Promise((resolve, reject) => {

            function isBeforeToday9AM(date) {
                const now = new Date();
                if (date.getDate() !== now.getDate()) { // check if the day is not the same as today's day
                  return false;
                }
                const today9AM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0, 0); // set time to today 9:00 AM
                return date.getTime() < today9AM.getTime();
              }
            

          let list = []
          let std = []
            Attendance.find({}).then((data)=>{

                

                data.forEach(element => {

                    let last = element.checkin[element.checkin.length-1]
                 
                    let time  = last.getTime()

                    
                   if(!isBeforeToday9AM(last))
                   {
                    console.log("KITTII");
                    list.push(element.sid)
                   }
                   


           
                    
                     
                })
                if(list.length==0)
                {
                    console.log("LIST EMPTY");
                    resolve()
                }


                
            }).then(()=>{

                list.forEach(element => {

                    User.findById(element).then((data)=>{

                         std.push(data)

                    }).then(()=>{

                        if(list.length==std.length)
                        {
                            console.log(std);
                            resolve(std)
                        }
                    })
                    
                });
                
            })

            
          

        })
    },

    details:(req,res)=>{

        let userdata = req.session.superuserdata
        let id = req.params.id
        console.log(id);
        userHelper.checkattendance(id).then((data1)=>{



      
        userHelper.checklate(id).then((late) => { 


          userHelper.graphdata(id).then((graphdata)=>{

            userHelper.getUser(id).then((user)=>{

                

                    let daily = graphdata.monthly
                    let overall = graphdata.overall
                    overall.splice(12)
        
                    let percentage =  data1.percentage 
                    percentage = Math.round(percentage)
        
                    let absent = data1.absent
                    res.render('superuser/details', {userdata, late, percentage, absent,daily,overall,user});

               
 

               

            })

          

          })

           
          


        })
      })


    }
}
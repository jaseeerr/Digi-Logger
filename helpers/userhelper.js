const User = require('../model/userSchema')
const Attendance = require('../model/attendanceSchema')
const bcrypt = require('bcrypt')
const fs = require('fs');
const path = require('path');



module.exports = {

    postsignup:(userdata)=>{
        let batch1 = userdata.batch
        batch1 = batch1.toUpperCase()

        let Name = userdata.name.toUpperCase()

        return new Promise((resolve, reject) => {

            User.findOne({phone:userdata.phone}).then((pcheck)=>{
                if(pcheck)
                {
                    resolve({exphone:true})
                }
                else
                {
                    bcrypt.hash(userdata.password,10).then((pass)=>{

                        const user = new User({
        
                        
                            name:Name,
                            batch:batch1,
                            phone:userdata.phone,
                            domain:userdata.domain,
                            password:pass,
                            checkin:false
                            
            
                        })
            
                        user.save().then((userdata1)=>{

                            const attend = new Attendance({

                                sid:userdata1._id,
                                checkin:undefined,
                                checkout:undefined
 
                            })

                            attend.save().then(()=>{resolve({exphone:false})})
                        })
                    })
                }
            })
            

        })
    },

    postlogin:(userdata)=>{

        return new Promise((resolve, reject) => {

            User.findOne({phone:userdata.phone}).then((pdata)=>{
                if(pdata!=null)
                {
                    bcrypt.compare(userdata.password,pdata.password).then((pass)=>{
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

    },

    checkin:(data1,img)=>{
        return new Promise((resolve, reject) => {

            User.findById(data1.sid).then((user)=>{

                
            let image = user.checkinImg
            image.push(img)

                User.findByIdAndUpdate(data1.sid,{
                    $set:{
                        checkinImg:image
                    }
                }).then(()=>{
    
    
                    Attendance.findOne({sid:data1.sid}).then((data2)=>{
    
                    
    
    
                        if(!data2)
                        {
                            let arr = []
                             arr[0] = data1.date
                            
        
                             const attend = new Attendance({
                
                                
                                sid:data1.sid,
                                checkin:arr,
                                limit:1,
                                
                                
                                
                                
                
                            })
                
                            attend.save().then((data)=>{resolve(data)})
                        }
                        else
                        {
                            let lastin = data2.checkin[data2.checkin.length-1]
                            let current = data1.date
                           
         
        
                            if(lastin.getDate()==current.getDate() && lastin.getMonth==current.getMonth && lastin.getFullYear == current.getFullYear)
                            {
                                userdata = false
                                resolve(userdata)
                            }
                            else
                            {
                            let arr = data2.checkin
                            let limit = data2.limit +1
        
                            let attend1 = data2.attendance
                            
                            
                            
                            arr.push(data1.date)
        
                         
        
                            Attendance.findByIdAndUpdate(data2._id,{
                                $set:{
                                    checkin:arr,
                                    limit:limit,
                                   
                                }
                            }).then(()=>{
        
                                User.findByIdAndUpdate(data1.sid,{
                                    $set:{
                                        checkin:true
                                    }
                                }).then(()=>{
        
                                   User.findById(data1.sid).then((userdata1)=>{
        
                                   
                                    resolve(userdata1)
                                   })
        
                                 
                                })
        
                              
                                
                                
                            })
                            }
        
                            
                        }
         
                        
        
                        
        
                    })
    
    
    
    
                })
    

            })


            

            
            

        })
    },


    checkout:(data1,img)=>{
        return new Promise((resolve, reject) => {

            function isBefore5_30pm(date) {
                // Set the target time as 5:30 PM
                const targetTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 00, 0);
                
                // Compare the given time with the target time
                if(date.getTime() < targetTime.getTime())
                {
                    return false

                }
                else
                {
                    return true
                }
              }
            

            Attendance.findOne({sid:data1.sid}).then((data2)=>{

               
                let lastin = data2.checkin[data2.checkin.length-1]
                let checkin = data2.checkin
                let out = data1.date
                let absent = false

                console.log("LASTT INNNNNNNNNNNN");
                console.log(lastin)
                console.log(out);

                if(lastin.getDate()!=out.getDate())
                {
                    absent = true
                    checkin.pop()
                }
                else
                {
                    if(isBefore5_30pm(out))
                    {
                        

                        absent = true
                        checkin.pop()
                    }
                }

                if(absent===true)
                {
                    console.log("ABSENT");
                    Attendance.findByIdAndUpdate(data2._id,{
                        $set:{
                            checkin:checkin
                        }
                    }).then(()=>{
                        User.findById(data1.sid).then((data3)=>{

                            let img1 = data3.checkinImg
                            let del = img1[img1.length-1]


                            const filePath = path.join(__dirname, '..', 'public', 'images', 'attendees', del);

                            fs.unlink(filePath, (err) => {
                                if (err) {
                                  console.error(err);
                                  return;
                                }
                                
                                console.log('File deleted successfully'+del);
                              });


                            img1.pop()
                            
                            User.findByIdAndUpdate(data1.sid,{
                                $set:{
                                    checkin:false,
                                    checkinImg:img1
                                }
                            }).then(()=>{
                                User.findById(data1.sid).then((userdata1)=>{
    
                                    resolve(userdata1)
    
                                })
                            })

                        })

                        
                        
                    })
                }
                else
                {
                    console.log("faailed");
                    let id = data2._id

                let arr = data2.checkout
                arr.push(data1.date)

                Attendance.findByIdAndUpdate(id,{
                    $set:{
                        checkout:arr,
                        
                    }
                   }).then(()=>{

                    User.findByIdAndUpdate(data1.sid,{
                        $set:{
                            checkin:false,
                            checkoutImg:img
                        }
                    }).then(()=>{
                        User.findById(data1.sid).then((userdata)=>{

                            resolve(userdata)

                        })
                        
                    })
                   
                   })
                }


                
                

            })
            
           
        })
    },

    linkdevice:(id,dev)=>{
        return new Promise((resolve, reject) => {
            
            User.findById(id).then((data)=>{


                if(data.dev1==undefined)
                {
                    User.findByIdAndUpdate(id,{
                        $set:{
                            dev1:dev
                        }
                    }).then(()=>{
                        User.findById(id).then((user)=>{
                            resolve(user)
                        })
                        
                    })
                }
                else if(data.dev2==undefined)
                {
                    User.findByIdAndUpdate(id,{
                        $set:{
                            dev2:dev
                        }
                    }).then(()=>{
                        User.findById(id).then((user)=>{
                            resolve(user)
                        })
                    })
                }
                else
                {
                    let linked = true
                    resolve({linked})
                }

                

            })
            
        })
    },

    

    graphdata:(id)=>{
        return new Promise((resolve, reject) => {
            let monthly = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            let overall = [0,0,0,0,0,0,0,0,0,0,0,0]
            let arr3 = []
            let absent = 0
            let percentage =0

            Attendance.findOne({sid:id}).then((data)=>{

                if(data!=null)
                {
                    let arr = data.checkin
                let arr1 = data.checkin
            
                for(let i=0;i<arr.length;i++)
                {
                    let temp = new Date()
                    let time = new Date();
                    time.setHours(9, 30, 0, 0);
                    let time1 = arr[i]
                    let month = time1.getMonth()
                    let month1 = temp.getMonth()

                    if(month==month1)
                    {
                        
                        if(time1<=time)
                        {
                            let temp = arr[i].toISOString().substring(0, 10) 
                        
                        temp = temp[8] + temp[9] 
                        
                        let day = Number(temp)
    
                        monthly[day-1] = 1
                        }
                    }
                    
                    if(time1<time)
                    {
                        arr1[i] = arr[i].toISOString().substring(0, 10);
                        arr3.push(arr1[i])
                    }
                    
                

                }

                const arr2 = [...new Set(arr1)];
              
                 //oevrall data

                

                 const arr4 = [...new Set(arr3)];

              
               

                 for(let i=0;i<arr4.length;i++)
                 {
                    
                    let counter = 0
                    for(let j=0;j<arr4.length;j++)
                    {
                        let temp = new Date(arr2[j])
                    temp = temp.getMonth()
                 
                        if(i==temp)
                        {
                            counter++
                        }
                       
                    }

                    overall[i] = counter
                 }
                      

              let present = 0
              monthly.forEach(element => {

                present = present+element
                
              });

              absent = 0
              let now = new Date
              let day = now+""
              day = day[8] + day[9]
              let day1 = Number(day) 
              absent = day1 - present
           
              percentage = (present/day1)*100


                resolve({monthly,overall,absent,percentage})
                }
                else
                {
                    resolve({monthly,overall,absent,percentage})
                }

            })
        })
    },

    getUser:(id)=>{
        return new Promise((resolve, reject) => {

            User.findById(id).then((data)=>{
                resolve(data)
            })
            
        })
    }

    
}
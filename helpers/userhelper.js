const User = require('../model/userSchema')
const Attendance = require('../model/attendanceSchema')
const bcrypt = require('bcrypt')



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

    checkin:(data1)=>{
        return new Promise((resolve, reject) => {

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
                    
                    let arr = data2.checkin
                    let limit = data2.limit +1

                    let attend1 = data2.attendance
                    
                    
                    
                    arr.push(data1.date)

                 

                    Attendance.findByIdAndUpdate(data2._id,{
                        $set:{
                            checkin:arr,
                            limit:limit
                        }
                    }).then((data)=>{

                        User.findByIdAndUpdate(data1.sid,{
                            $set:{
                                checkin:true
                            }
                        }).then((userdata)=>{

                            resolve(userdata)
                        })

                      
                        
                        
                    })
                }
 
                

                

            })


            
            

        })
    },


    checkout:(data1)=>{
        return new Promise((resolve, reject) => {

            Attendance.findOne({sid:data1.sid}).then((data2)=>{

               

                



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
                            checkin:false
                        }
                    }).then((userdata)=>{
                        resolve(userdata)
                    })
                   
                   })

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

    checklate:(id)=>{
        return new Promise((resolve, reject) => {
            Attendance.findOne({sid:id}).then((data)=>{

                let late = 0
                let x
                let arr1 = []
                if(data!=null)
                {
                    
               
                let checkin = data.checkin
                

                for(let i=0;i<checkin.length;i++)
                {
                    let time = new Date();
                    time.setHours(3, 30, 0, 0);
                    

                    let time1 = checkin[i]
                   
                    let day = time+""
                    day = day[8]+day[9]

                    let day1 = time1+""
                    
               
                    
                    


                    if(time1>time && day1!=day )
                    {
                        day1 = day1[8] + day1[9]
                        x = checkin[i].toISOString().substring(0, 10);
                      
                        arr1.push(x)
                        
                     
                        late++
                    }
                }

                const arr2 = [...new Set(arr1)];
                    // 
                
                }
                
                

                resolve(late)
            })
        })
    },

    checkattendance:(id)=>{
        return new Promise((resolve, reject) => {
         
                
        let date = new Date()
            
            Attendance.findOne({sid:id}).then((data)=>{
 
               if(data!=null)
               {
                let arr = data.checkin
               
                let arr1 = []

                arr.forEach(element => {

                    let time = new Date();
                      time.setHours(3, 30, 0, 0);
                    let time1 = element
                  let m = time.getMonth()
                  let m1 = element.getMonth()
                  

                    let x = element.toISOString().substring(0, 10);
                 
                    if(m==m1)
                    {
                        if(time1<=time)
                        {
                        
                            arr1.push(x)
                        }
    
                    }
                   
                   
                    
                 

                    
                    
                });
             
                const arr2 = [...new Set(arr1)];

               

             

                let count = arr2.length
                //(12 / 30) x 100

                let days = date+""
                days = days[8] + days[9]
                let day = Number(days) 
                let percentage = 0  
                percentage = (count/day)*100
                percentage = Math.round(percentage)
                let absent = 0
                absent = day - count


                

                

                Attendance.findByIdAndUpdate(data._id,{
                    $set:{
                        attendance:percentage
                    }
                }).then(()=>{
                    resolve({percentage,absent})
                })

                
               }
               else
               {
                let percentage = 0  
                let absent = 0
                resolve({percentage,absent})
               }


                
               
              



            })
        })

    },

    graphdata:(id)=>{
        return new Promise((resolve, reject) => {
            let monthly = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            let overall = [0,0,0,0,0,0,0,0,0,0,0,0]
            let arr3 = []

            Attendance.findOne({sid:id}).then((data)=>{

                if(data!=null)
                {
                    let arr = data.checkin
                let arr1 = data.checkin
            
                for(let i=0;i<arr.length;i++)
                {
                    let temp = new Date()
                    let time = new Date();
                    time.setHours(9, 0, 0, 0);
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
                      
             

                resolve({monthly,overall})
                }
                else
                {
                    resolve({monthly,overall})
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
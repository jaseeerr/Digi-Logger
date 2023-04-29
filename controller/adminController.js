const adminHelper = require('../helpers/adminHelper')
const userHelper = require('../helpers/userhelper')

module.exports = {
    

    home:(req,res)=>{

        let userdata = req.session.admindata
      

         adminHelper.getAbsentees().then((data)=>{

            adminHelper.getTodayabsent().then((todays)=>{

                req.session.todays = todays
                let batches = []
                todays.forEach(element => {
                    batches.push(element.batch)
                });

                console.log(batches);

                res.render('admin/index',{userdata,data,todays,batches})
            })

           


        })
        
    },

    login:(req,res)=>{


        if(req.session.admin)
        {
res.redirect('/admin')
        }
        else
        {
            let loginerr = req.session.adminloginerr
            let blockerr = req.session.adminblock
   
            req.session.adminloginerr = false
            req.session.adminblock = false
   
           res.render('admin/login',{loginerr,blockerr})
        }
     
    },

    postlogin:(req,res)=>{


        adminHelper.postlogin(req.body).then((response)=>{


            console.log(response);
            if(response.block)
            {
                req.session.adminblock = true
                res.redirect("/admin/login")
            }
            else if(response.loginerr)
            {
                req.session.adminloginerr = true
                res.redirect("/admin/login")
            }
            
            else
            {
                req.session.admindata =  response.pdata
                req.session.admin = true
                res.redirect("/admin")
            }

            

        })

    },

    signup:(req,res)=>{

       if(req.session.admin)
       {
        res.redirect('/admin')
       }
       else
       {
        let exphone = req.session.exphone
        req.session.exphone = false

        res.render('admin/signup',{exphone})
       }
    },

    postsignup:(req,res)=>{


        adminHelper.postsignup(req.body).then((response)=>{

            if(response.exphone)
            {
                req.session.exphone = true
                res.redirect('/signup')
            }
            else
            {
                req.session.pass = true
                res.redirect('/admin/login')
            }

        })


    },

    students:(req,res)=>{

        adminHelper.getStudents().then((data)=>{

            let userdata = req.session.admindata

            res.render('admin/students',{data,userdata})
        })

    },

    absenteestable:(req,res)=>{

        let data = req.session.todays


        res.render('admin/absenttable',{data})
        

    },

    absentbatch:(req,res)=>{

        let todays = req.session.todays
        let batch = req.params.id

        let data = []

        todays.forEach(element => {

            if(element.batch==batch)
            {
                data.push(element)
            }
            
        });

        res.render('admin/absenttable',{data})


    },

    details:(req,res)=>{

        let userdata = req.session.admindata
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
                    res.render('admin/details', {userdata, late, percentage, absent,daily,overall,user});

               
 

               

            })

          

          })

           
          


        })
      })


    },

    logout:(req,res)=>{

        req.session.admin = false
        req.session.admindata = null
        res.redirect('/admin/login')
    }
}
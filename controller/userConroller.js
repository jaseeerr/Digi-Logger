const userHelper = require('../helpers/userhelper')


module.exports = {

  

    homepage: (req, res) => {

      function executeTaskIfLate() {
        const now = new Date();
        const tenPM = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0); // set time to 10:00 PM
      
        if (now.getTime() >= tenPM.getTime()) {
          // execute task here
          console.log("Executing task at 10:00 PM or later");
        }
      
        // check again in 1 minute
        setTimeout(executeTaskIfLate, 60000);
      }
      
      executeTaskIfLate();

        let userdata = req.session.userdata
        let signedin = req.session.signedin
        userHelper.checkattendance(userdata._id).then((data1)=>{



      
        userHelper.checklate(userdata._id).then((late) => { 


          userHelper.graphdata(userdata._id).then((graphdata)=>{

            let daily = graphdata.monthly
            let overall = graphdata.overall
            overall.splice(12)

            let percentage =  data1.percentage 
            percentage = Math.round(percentage)

            let absent = data1.absent
            res.render('user/index', {userdata, signedin, late, percentage, absent,daily,overall});

          })

           
          


        })
      })

    },


    login: (req, res) => {

        if (req.session.user) {
            res.redirect('/')
        } else {
            let loginerr = req.session.loginerr
            let blockerr = req.session.block
            let signup = req.session.signup
            req.session.block = false
            req.session.loginerr = false
            req.session.signup = false
           


            res.render('user/login', {loginerr, blockerr, signup})
        }


    },

    postlogin: (req, res) => {

      if(req.session.user)
      {
        res.redirect('/')
      }
      else
      {
        userHelper.postlogin(req.body).then((response) => {

          req.session.block = response.block
          req.session.loginerr = response.loginerr

          if (!response.loginerr) {
              req.session.userdata = response.pdata
              req.session.user = true
              res.redirect('/')
          } else {
              req.session.user = false
              res.redirect('/login')
          }

      })
      }

        


    },

    signup: (req, res) => {

      if(req.session.user)
      {
     res.redirect('/')
      }
      else
      {
        let exphone = req.session.exphone
        req.session.exphone = false

        res.render('user/signup', {exphone})
      }
        
    },

    postsignup: (req, res) => {

        if(req.session.user)
        {
           res.redirect('/')
        }
        else
        {
          userHelper.postsignup(req.body).then((response) => {

            if (response.exphone) {
                req.session.exphone = true
                res.redirect('/signup')
            } else {
                req.session.signup = true
                res.redirect('/login')
            }


        })
        }

    },

    checkin: (req, res) => {

        
       
              

       
           
         
            const date = new Date();

            

            // Output the timezone date and time

            let data = {
                date: date,
                sid: req.session.userdata._id
            }
       
          
           

            userHelper.checkin(data).then(() => {


              
             
                

               

                req.session.signedin = true
                res.redirect('/')
 
            })
        


    },

    checkout: (req, res) => {
        const date = new Date();

        // Get the UTC timestamp in milliseconds
        const utcTimestamp = date.getTime();

        // Calculate the desired timezone offset in milliseconds (+5:30 = 5.5 hours = 5.5 * 60 * 60 * 1000 ms)
        const timezoneOffsetMs = 5.5 * 60 * 60 * 1000;

        // Create a new date object with the desired timezone offset
        const timezoneDate = new Date(utcTimestamp + timezoneOffsetMs);

        let data = {
            date: timezoneDate,
            sid: req.session.userdata._id
        }

        userHelper.checkout(data).then(() => {

            req.session.signedin = false
            res.redirect('/')

        })


    },


    logout:(req,res)=>{

      req.session.user = false
      req.session.userdata = null
      res.redirect('/')
    }

}

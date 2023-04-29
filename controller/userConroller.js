const userHelper = require('../helpers/userhelper')


module.exports = {

  

    homepage: (req, res) => {

      let thisfp = req.session.thisfp
      

      let noip = req.session.noip
      req.session.noip = false
      let ip = req.session.ip

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
            res.render('user/index', {userdata, signedin, late, percentage, absent,daily,overall,noip,ip,thisfp});

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

        
       
              
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

      let title = ipAddress
      let title1
      title = title.split("")
      title1 = title.slice(0,11)
      title1 = title1.join("")

      req.session.ip = ipAddress
      // title1=="103.214.235" || title1=="115.246.245"

      if (title1=="103.214.235" || title1=="115.246.245") {
            
        const date = new Date();
        let data = {
            date: date,
            sid: req.session.userdata._id
        }
   
      
       

        userHelper.checkin(data).then((userdata) => {

          req.session.userdata = userdata

            req.session.signedin = true
            res.redirect('/')

        })


         }
    else{
      req.session.noip = true
       
        res.redirect('/')
        }   
       
           
         
           

            

            // Output the timezone date and time
           
      
    },

    checkout: (req, res) => {
        const date = new Date();

       

        let data = {
            date: date,
            sid: req.session.userdata._id
        }

        userHelper.checkout(data).then(() => {

            req.session.signedin = false
            res.redirect('/')

        })


    },


    linkdevice:(req,res)=>{

      
      let id = req.session.userdata._id
      let fp = req.body.visitorId
      userHelper.linkdevice(id,fp).then((user)=>{

        req.session.userdata = user


        res.redirect('/')
      })

    },

    getfingerprint:(req,res)=>{

      req.session.thisfp = req.body.visitorId
      

      res.redirect('/')

    },

    logout:(req,res)=>{

      req.session.user = false
      req.session.userdata = null
      res.redirect('/')
    }

}

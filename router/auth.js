const express=require('express');
const User = require( '../model/user' );
const router = express.Router();
router.use(express.json());    


// post request using promises

router.post('/register',(req,res)=>{
    // console.log("entered");
    // console.log(req.body);
  const {name, email,phone,work,password,cpassword}=req.body;
  if(!name || !email || !phone || !work || !password || !cpassword){
      res.status(422).json({err: "plz fill all the details"});
  }
   User.findOne({email: email})
   .then((userExist)=>{
       if(userExist){
           return res.status(422).json({err: "Email already exist"});
       }
       else if(password!=cpassword){
        return res.status(422).json({err: "Password not matching"});
       }
       else{
       const user=new User({name,email,phone,work,password,cpassword});
       //    hashing the password before saving
       user.save().then(()=>{
           res.status(201).json({message: "user registered successfully"});
       }).catch((err)=> res.status(500).json({err: "user not registered"}));
    }
   }).catch((err)=>{console.log(err)});
})

// post request using async await

router.post('/signin',async (req,res)=>{
  try{
    const {email , password}=req.body;
    if(!email || !password){
        return res.status(400).json({err: "Plz filled the data"});
    }
    const userlogin=User.findOne({email:email});
    if(!userlogin){
        return res.status(400).json({err: "Plz register"});
    }
    else{
        res.json({message: "User Signin successfully"});
    }
  }
  catch{

  }
})



module.exports=router;
const validator = require("../../validators/reqValidator"),
  mongoose = require('mongoose'),
  jwt = require('jsonwebtoken'),
  UserModel = require('../model/user'),
  config = require('../../config/env'),
  bcrypt = require('bcrypt-nodejs');

//Employee Registration
function register(req, res) {
  // validating request params
  validator.userRegValidate(req.body).then((data) => {
    return UserModel.findOne({ emp_id: req.body.emp_id });
  }).then((userData) => {
    if(!userData && userData==null){
      var user = new UserModel({
        emp_id: req.body.emp_id,
        emp_name: req.body.emp_name,
        dept_name: req.body.dept_name,
        emp_countrycode: req.body.countrycode,
        emp_contactnumber: req.body.emp_contactnumber,
        emp_address: req.body.emp_address,
        role: req.body.role,
        isActive: true,
        password: req.body.emp_contactnumber
      });
      return user.save();
    }else{
      throw "User is already registered!!"
    }
  }).then((userDet) => {
    userDet = userDet.toObject();
    delete userDet.__v;
    delete userDet.hash;
    delete userDet.salt
    delete userDet.otptime;
    return res.status(200).send({success:true,data:userDet});
  }).catch((err) => {
    return res.status(400).send({success:false,message: err.errmsg || err });
  })
}

// Employee Login
function login(req, res) {
  // Validating the request params
  validator.loginValidator(req.body).then((data) => {
    return UserModel.findOne({emp_id: req.body.emp_id, isActive:true});
  }).then((user)=>{
    if(user!=null){
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          UserModel.findOneAndUpdate({emp_id:req.body.emp_id},{$set:{lastlogin:new Date()}},{new:true}).exec(function(err,userDet){
            if(err){
              throw err;
            }
            userDet = userDet.toObject();
            delete userDet.__v;
            delete userDet.hash;
            delete userDet.salt
            delete userDet.otptime;
            // Generating token
            var result = {};
            result._id = userDet._id;
            result.token =  __generateToken(userDet);
            return res.status(200).send({success:true,data:result})
          });
        }else{
          return res.status(400).send({success:true,message:"Invalid Credentials!!"});
        }
      });
    }else{
      return res.status(400).send({success:true,message:"User not found!!"})
    }
  }).catch((err)=>{
    return res.status(400).send({ message: err.errmsg || err });
  })
}
    
// Forgot password
var forgotPassword = function (req, res, next) {
  // Validating request params
  validator.forgotPasswordValidator(req.body).then((data) => {
    var randomOtp = randomString();
    return UserModel.findOneAndUpdate({emp_id: req.body.emp_id,isActive:true},{$set:{otp: randomOtp, otptime: new Date()}},{new: true});
  }).then((result)=>{
    if(result && result!=null){
      return res.status(200).send({ success: true,otp:result.otp});
    }
    throw "User not found!!";
  }).catch((err) => {
    return res.status(400).send({ message: err.errmsg || err });
  });
}

// Verify Otp
var verifyOtp = function (req, res, next) {
  // Validating request params
  validator.verifyOtpValidator(req.body).then((data) => {
    return UserModel.findOne({emp_id: req.body.emp_id});
  }).then((user)=>{
    if(user && user!=null){
      if (user.otp && user.otptime) {
        //Checking if otp is expired 
        var gd = parseInt(new Date(user.otptime).getTime());
        var cd = parseInt(new Date().getTime());
        if (parseInt(cd - gd) < 300000) {
          // Checking if otp match 
          if (req.body.otp === user.otp) {
            // Setting the new password 
            var hash = bcrypt.hashSync(req.body.newPassword, user.salt);
            return UserModel.findOneAndUpdate({emp_id: req.body.emp_id},{$set:{hash:hash,otp:undefined,otptime:undefined}});
          }else{
            throw "Invalid otp!!"
          }
        }else{
          throw "Otp has been expired.Click to generate new otp!!"
        }  
      }else{
        throw "Otp not found.Click to generate new otp!!"
      }
    }else{
      throw "User not found!!"
    }
  }).then((updateDet)=>{
    return res.status(200).send({success:true,message:"Password changed successfully."})
  }).catch((err) => {
    return res.status(400).send({ message: err.errmsg || err });
  });
}


function __generateToken(user) {
  var token = jwt.sign(user, config.secret, {
    expiresIn: '24hr' // expires in 1 day
  });
  return token;
}

function randomString() {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = 8; i > 0; --i) {
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  }
  return result;
}
  
module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp
}

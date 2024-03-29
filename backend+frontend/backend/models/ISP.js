const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { ObjectID } = require('mongodb');


var ISPSchema = new mongoose.Schema({
    name : {
        required : true,
        type : String,
        minlength : 1,
        trim : true,
    },
    password : {
        type : String,
        minlength : 6,
        required : true,
        trim : true
    },
    license_id : {
        type : String,
        minlength : 6,
        required : true,
        trim : true
    },
    physical_connection_establishment_time:{
        type: Date,
        default: null
    },
    connection_establishment_time: {
        type: Date,
        default: null
    },
    connection_status : {
        type : Boolean,
        default : false
    },
    remaining_bandwidth : {
        type : Number,
        default : null,
    },
    expiration_date : {
        type : Date,
        default : null
    },
    average_rating : {
        type : Number,
        default : null
    },
    physical_connection_details : [{
        connection_id : {
            type : ObjectID,
            default : null,
            required : true
        }
    }],
    tokens : [{
        access : {
            type : String,
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
})

ISPSchema.pre('save', function(next) {
    var isp = this;

    if(isp.isModified('password')){
        bcrypt.genSalt(10,  (err, salt) => {
            bcrypt.hash(isp.password, salt, (err, hash) => {
                isp.password = hash;
                next();
            })
        })
        
    } else {
        next();
    }
})
var ISP = mongoose.model('ISP', ISPSchema);


module.exports = {ISP};

var env = process.env.NODE_ENV || "development";

if(env === "development"){
    process.env.PORT = 7000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/EasyInternetService'
} 


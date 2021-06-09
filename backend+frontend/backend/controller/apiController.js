const { District } = require('./../models/District');
const { Division } = require('./../models/Division');
const { SubDistrict } = require('./../models/Subdistrict');
const { Union } = require('./../models/Union');
const { Area } = require('./../models/Area');
const { ISP } = require('./../models/ISP');
const { User } = require('./../models/User');
const { Package } = require('./../models/Package');
const { Feedback } = require('./../models/Feedback');

const findAreaFromUnion = async(union) => {
    let areas = await Area.find({
        union_id : union
    });

    return areas;
}

const findAreaFromSubDistrict = async (subdistrict) => {
    let unions = await Union.find({
        upazilla_id : subdistrict
    });

    let areas = await Area.find({
        union_id : { $in : unions.map(union => union.union_id) }
    });

    return areas;
}

const findAreaFromDistrict = async (district) => {
    let subdistricts = await SubDistrict.find({
        district_id : district
    });
    let unions = await Union.find({
        upazilla_id : { $in : subdistricts.map(subdistrict => subdistrict.upazilla_id)}
    });
    let areas = await Area.find({
        union_id : { $in : unions.map(union => union.union_id) }
    });

    return areas;
}

const findAreaFromDivision = async (division) => {
    let districts = await District.find({
        division_id : division
    });
    let subdistricts = await SubDistrict.find({
        district_id : { $in : districts.map(district => district.district_id)}
    });
    let unions = await Union.find({
        upazilla_id : { $in : subdistricts.map(subdistrict => subdistrict.upazilla_id)}
    });
    let areas = await Area.find({
        union_id : { $in : unions.map(union => union.union_id) }
    });

    return areas;
}

const findUnionFromSubDistrict = async (subdistrict) => {
    let unions = await Union.find({
        upazilla_id : subdistrict
    });

    return unions;
}

const findUnionFromDistrict = async (district) => {
    let subdistricts = await SubDistrict.find({
        district_id : district
    });

    let unions = await Union.find({
        upazilla_id : { $in : subdistricts.map(subdistrict => subdistrict.upazilla_id) }
    });

    return unions;
}

const findUnionFromDivision = async (division) => {
    let districts = await District.find({
        division_id : division
    });
    let subdistricts = await SubDistrict.find({
        district_id : { $in : districts.map(district => district.district_id)}
    });
    let unions = await Union.find({
        upazilla_id : { $in : subdistricts.map(subdistrict => subdistrict.upazilla_id) }
    });

    return unions;
}

const getISP = async (request, response) => {
   
    try{
        let isp = await ISP.find();
        if(!isp){
            return response.status(404).send({
                message : "Not found",
                data : []
            })
        }
        response.status(200).send({
            message : "Found",
            data : isp
        })
    } catch (e) {
        return response.status(500).send({
            message : "EXCEPTION",
            data : []
        })
    }
   
}

const getUnion = async (request, response) => {
    
    try{
        let union = await Union.find();
        if(!union){
            return response.status(404).send({
                message : "Not found",
                data : []
            })
        }
        response.status(200).send({
            message : "Found",
            data : union
        })
    } catch (e) {
        return response.status(500).send({
            message : "EXCEPTION",
            data : []
        })
    }
   
}

const getArea = async (request, response) => {
   
    try{
        let area = await Area.find();
        if(!area){
            return response.status(404).send({
                message : "Not found",
                data : []
            })
        }
        response.status(200).send({
            message : "Found",
            data : area
        })
    } catch (e) {
        return response.status(500).send({
            message : "EXCEPTION",
            data : []
        })
    }
   
}

const getRating = async (request, response) => {
   
    try{
        if(!request.body.isp_id){
            return response.status(404).send({
                message : "Not found",
                data : []
            })
        }
        let isp = await ISP.findById(request.body.isp_id);
        if(!isp){
            return response.status(404).send({
                message : "Not found",
                data : []
            })
        }
        let feedbacks = await Feedback.find({
            isp_id : request.body.isp_id
        });
        if(!feedbacks){
            return response.status(200).send({
                message : "Found",
                data : {
                    rating : 5
                }
            })
        }
        let avg = 0;
        feedbacks.forEach((feedback) => {
            avg += feedback.rating;
        })

        avg = avg/feedbacks.length;

        response.status(200).send({
            message : "Found",
            data : {
                rating : avg
            }
        })
    } catch (e) {
        return response.status(500).send({
            message : "EXCEPTION",
            data : []
        })
    }
   
}

const getPackage = async (request, response) => {
   
    try{
        let package = await Package.find();
        if(!package){
            return response.status(404).send({
                message : "Not found",
                data : []
            })
        }
        response.status(200).send({
            message : "Found",
            data : package
        })
    } catch (e) {
        return response.status(500).send({
            message : "EXCEPTION",
            data : []
        })
    }
   
}

const getUser = async (request, response) => {
   
    try{
        let user = await User.find();
        if(!user){
            return response.status(404).send({
                message : "Not found",
                data : []
            })
        }
        response.status(200).send({
            message : "Found",
            data : user
        })
    } catch (e) {
        return response.status(500).send({
            message : "EXCEPTION",
            data : []
        })
    }
   
}



module.exports = {
    findUnionFromSubDistrict,
    findUnionFromDistrict,
    findUnionFromDivision,
    findAreaFromDistrict,
    findAreaFromDivision,
    findAreaFromSubDistrict,
    findAreaFromUnion,
    getISP,
    getArea,
    getUnion,
    getPackage,
    getUser,
    getRating
}
let { ISP } = require('../models/ISP');
let { Report } = require('../models/Report');
let apiController = require('./apiController');
const {ObjectID} = require('mongodb');
const { request, response } = require('express');


//insert an entry in report table
const handleReporting = async (request, response) => {

    try{
        let request_type = 0;
        let isp_id = ObjectID(request.body.isp_id);
        let union_id = request.body.union_id ;
        let details = request.body.details;
        let category = request.body.category;

        
    
        let newReport = new Report ({
            request_type,
            isp_id,
            union_id,
            details,
            category
        })
    
        let data = await newReport.save();
    
        if(data.nInserted === 0){
            return response.send({
                message : "Insertion Failed",
                data : []
            })
        }
    
        return response.send({
            message : "Insertion Successful",
            data
        })
    } catch(e) {
        return response.send({
            message : e.message,
            data : []
        })
    }

   
}


const viewOwnReports = async (request, response) => {
    let isp_id = request.body.isp_id;
    //console.log("called");
    if(!isp_id){
        return response.send({
            message : "No Report Found",
            data : []
        })
    }

    isp_id = ObjectID(request.body.isp_id);

    
    try{
        let reports = await Report.find({
            isp_id
        }).sort({"report_arrival_time": 1});
        
        if(reports.length === 0){
            return response.send({
                message : "No Report Found",
                data : []
            })
        }
        reports = reports.filter((report) => report.request_type === 0);
        //console.log(reports);
        return response.status(200).send({
            message : "Reports Found",
            data : reports

        })
    } catch (e) {
        return response.send({
            message : e.message,
            data : []
        })
    }
}

const viewUserReports = async (request, response) => {
    let isp_id = request.body.isp_id;
    //console.log("called");
    if(!isp_id){
        return response.send({
            message : "No Report Found",
            data : []
        })
    }

    isp_id = ObjectID(request.body.isp_id);

    
    try{
        let reports = await Report.find({
            isp_id
        }).sort({"report_arrival_time": 1});
        
        if(reports.length === 0){
            return response.send({
                message : "No Report Found",
                data : []
            })
        }
        reports = reports.filter((report) => report.request_type === 1);
        console.log(reports);
        return response.status(200).send({
            message : "Reports Found",
            data : reports

        })
    } catch (e) {
        return response.send({
            message : e.message,
            data : []
        })
    }
}

const handleReportFetchingSortedUser = async (request, response) => {
    let sortByDistrict = request.body.district_id;
    let sortByDivision = request.body.division_id;
    let sortBySubDistrict = request.body.upazilla_id;
    let sortByUnion = request.body.union_id;
    let sortByArea = request.body.area_id;
    let resolve_status = request.body.resolve_status;
    let problem_category = request.body.problem_category;
    let isp_id = request.body.isp_id;

    //console.log(resolve_status);
    isp_id = ObjectID(request.body.isp_id);
    try{
        let reports;

        if(sortByArea){
            reports = await Report.find({
                area_id : sortByArea, isp_id
            }).sort({"report_arrival_time": 1});
        }
        else if(sortByUnion){
            let areas = await apiController.findAreaFromUnion(sortByUnion);
            reports = await Report.find({
                area_id : { "$in": areas.map(area => area._id) }
                , isp_id
            }).sort({"report_arrival_time": 1});

        } else if(sortBySubDistrict){

            let areas = await apiController.findAreaFromSubDistrict(sortBySubDistrict);
            reports = await Report.find({
                area_id : { "$in": areas.map(area => area._id) }
                , isp_id
            }).sort({"report_arrival_time": 1});

        } else if(sortByDistrict){

            let areas = await apiController.findAreaFromDistrict(sortByDistrict);
            reports = await Report.find({
                area_id : { "$in": areas.map(area => area._id) }
                , isp_id
            }).sort({"report_arrival_time": 1});

        } else if(sortByDivision){

            let areas = await apiController.findAreaFromDivision(sortByDivision);
            reports = await Report.find({
                area_id : { "$in": areas.map(area => area._id) }
                , isp_id
            }).sort({"report_arrival_time": 1});


        }

        if(!reports){
            if(sortByDistrict || sortBySubDistrict || sortByArea || sortByUnion || sortByDivision ){
                //empty
                return response.send({
                    message : "No Reports Found",
                    data : []
                })
            } else {
                
                reports = await Report.find({
                    isp_id
                }).sort({"report_arrival_time": 1});
                
            }
            
            
        }

        if(!reports || reports.length === 0){
            return response.send({
                message : "No Reports Found",
                data : []
            })
        }
        
        if(resolve_status !== undefined){
            reports = reports.filter((report)=> report.resolve_status === resolve_status);
        }
        if(!reports || reports.length === 0){
            return response.send({
                message : "No Reports Found",
                data : []
            })
        }

        if(problem_category){
            reports = reports.filter((report)=> report.category === problem_category);
        }
        if(!reports || reports.length === 0){
            return response.send({
                message : "No Reports Found",
                data : []
            })
        }
        
        reports = reports.filter((report) => report.request_type === 1);

        if(!reports || reports.length === 0){
            return response.send({
                message : "No Reports Found",
                data : []
            })
        }
        return response.status(200).send({
            message : "Reports Found",
            data : reports
        })
    } catch (e) {
        return response.send({
            message : e.message,
            data : []
        })
    }

    

}


const handleReportFetchingSorted = async (request, response) => {
    let sortByDistrict = request.body.district_id;
    let sortByDivision = request.body.division_id;
    let sortBySubDistrict = request.body.upazilla_id;
    let sortByUnion = request.body.union_id;
    let resolve_status = request.body.resolve_status;
    let problem_category = request.body.problem_category;
    let isp_id = request.body.isp_id;
    //console.log(resolve_status);
    isp_id = ObjectID(request.body.isp_id);
    try{
        let reports;

        if(sortByUnion){
            reports = await Report.find({
                union_id : sortByUnion, isp_id
                
            }).sort({"report_arrival_time": 1});

        } else if(sortBySubDistrict){

            let unions = await apiController.findUnionFromSubDistrict(sortBySubDistrict);
            reports = await Report.find({
                union_id : { "$in": unions.map(union => union.union_id) }
                , isp_id
            }).sort({"report_arrival_time": 1});

        } else if(sortByDistrict){

            let unions = await apiController.findUnionFromDistrict(sortByDistrict);
            
            reports = await Report.find({
                union_id : { "$in": unions.map(union => union.union_id) }
                , isp_id
            }).sort({"report_arrival_time": 1});

        } else if(sortByDivision){

            let unions = await apiController.findUnionFromDivision(sortByDivision);
            
            reports = await Report.find({
                union_id : { "$in": unions.map(union => union.union_id) }
                , isp_id
            }).sort({"report_arrival_time": 1});


        }

        if(!reports){
            if(sortByDistrict || sortByDivision || sortBySubDistrict || sortByUnion){
                //empty
                return response.send({
                    message : "No Report Found",
                    data : []
                })
            } else {
             
                reports = await Report.find({
                    isp_id
                }).sort({"report_arrival_time": 1});
         
            }
        }

        if(!reports || reports.length === 0){
            return response.send({
                message : "No Reports Found",
                data : []
            })
        }
        
        if(resolve_status !== undefined){
            reports = reports.filter((report)=> report.resolve_status === resolve_status);
        }

        if(problem_category){
            reports = reports.filter((report)=> report.category === problem_category);
        }
        
        reports = reports.filter((report) => report.request_type === 0);

       
        return response.status(200).send({
            message : "Reports Found",
            data : reports
        })
    } catch (e) {
        return response.send({
            message : e.message,
            data : []
        })
    }

    

}

const handleSolvedReport = async (request, response) => {
    let report_id = request.body.report_id;
    let employee_id = ObjectID(request.body.employee_id);
    if(!report_id){
        return response.send({
            message : "Report ID invalid",
            data : []
        })
    }
    try{
        let report = await Report.findById(report_id);
        if(!report || report.request_type !== 1){
            return response.send({
                message : "Report not found",
                data : []
            })
        }
        report.resolve_status = true;
        report.report_resolve_time = new Date();
        report.employee_id = employee_id;

        let updatedReport = await report.save();
        return response.status(200).send({
            message : "Report updated",
            data : updatedReport
        })
    } catch(e){
        return response.send({
            message : "EXCEPTION",
            data : []
        })
    }
}

module.exports = {
    handleReporting, 
    viewOwnReports,  
    handleReportFetchingSorted,
    viewUserReports,
    handleReportFetchingSortedUser,
    handleSolvedReport
}
import Activity from "../models/Activity.js";

export const logActivity = async(project=null,task=null,user,activity)=>{
    try{
        await Activity.create({
            project,
            task,
            user,
            activity
        });
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
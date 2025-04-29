import { match } from "assert";
import { Responsesuccess } from "../interface";

class baseResponse{
    _success (message: string, data?: any): Responsesuccess {
        return {
            status: "success",
            message:message,
            data: data || {},
        }
    }



  
    


    // _pagination( message: string, data: any,total: number,page:number,pageSize:number,): ResponsePagination{
    //     return {
    //         status: "success",
    //         message: message,
    //         data: data || {},
    //         pagination: {
    //             total: total,
    //             Page: page,
    //             pageSize: pageSize,
    //             totalpage: Math.ceil(total/pageSize)
    //         },
    //     }

        
    // }

    
    

   
}



export default baseResponse



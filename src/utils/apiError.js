class apiError extends Error{
    constructor(statuscode,message){
        super(message)
        this.statuscode=statuscode
    }
}


export default apiError
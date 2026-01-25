const userAuth = (req,res,next)=>{
    const token = 'abcc';
    const isValid = token == 'abc' ? true : false;
    
    if(!isValid){
        res.status(401).send('Unauthorized')
    }else{
        next()
    }
}

module.exports = {
    userAuth
}
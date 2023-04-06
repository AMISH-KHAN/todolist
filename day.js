let daydis=()=>{
    const day = new Date();
    
    var options = {
        day: "numeric",
        weekday: "long",
        month:"long"
    }
    var days = day.toLocaleString('en-us', options)
    return days;
}
let dayname=()=>{
    const day = new Date();
    
    var options = {
       
        weekday: "long"
       
    }
    var days = day.toLocaleString('en-us', options)
    return days;
}
module.exports = { daydis,dayname };
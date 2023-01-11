const debounce =(func,delay=500)=>{
    let timeoutID;
    return (...args)=>{
        if(timeoutID)
        {
            clearInterval(timeoutID);
        }
        timeoutID=setTimeout(()=>{
            func.apply(null,args);

        },delay)
    }
}
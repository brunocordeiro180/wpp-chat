export const maskPhone = phone => {
    var phoneClean = phone ? phone.substring(2,12) : ""; 

    if(phone){
        phoneClean = [phoneClean.slice(0, 0), "(", phoneClean.slice(0)].join('');
        phoneClean = [phoneClean.slice(0, 3), ") ", phoneClean.slice(3)].join('');
        phoneClean = [phoneClean.slice(0, 9), "-", phoneClean.slice(9)].join('');
    }

    return phoneClean;
};
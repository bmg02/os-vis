function check_field(field) {
    return field !== undefined && field !== null && field !== '' ? true : false;
}

function capitalizeEachWord(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    return splitStr.join(' '); 
}

export { check_field, capitalizeEachWord };
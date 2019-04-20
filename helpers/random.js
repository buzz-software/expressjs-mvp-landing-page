


function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function leftPad (str, length) {
    str = str == null ? '' : String(str);
    length = ~~length;
    pad = '';
    padLength = length - str.length;

    while(padLength--) {
        pad += '0';
    }

    return pad + str;
}

exports.random_digits = function(digits) {
    if (digits > 10)
        digits = 10;    // limit the value for errors.
	return leftPad(randomInt(0, Math.pow(10,digits)), digits);
}

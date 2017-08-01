module.exports = function cssClassNameGenerator() {
    var lastId = 0;
    var alphabet = "abcefghijklmnopqrstuvwxyz0123456789";

    return function() {
        var  nextId;
        do {
            nextId = generateId();
        } while (/^[0-9]/.test(nextId));
        return nextId;
    };

    function generateId() {
        var idNum = (lastId ++);
        var strId = "";
        do {
            var c = idNum % alphabet.length;
            strId =  alphabet[c] + strId;
            idNum = (idNum - c) / alphabet.length;
        } while (idNum > 0);
        return strId;
    }
};

export default class Exception {
    constructor(message){
        this.code = null;
        this.message = message;
    }

    toString(){
        return 'Exception ' + this.code + ':' + this.message;
    }
}
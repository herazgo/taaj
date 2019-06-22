import Exception from './Exception';

export default class ViewNotFoundException extends Exception{
    constructor(name){
        super();
        
        this.message = 'View not found: '+name;
        this.code = 40415;
    }
}
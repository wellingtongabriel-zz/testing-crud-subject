import {observable, action} from 'mobx';

export default class LoaderStore {
    constructor(){
        window.loader = this;
    }

    /*
    Change state for notification Open or close
     */
    @observable loading = false;

    @action
    dismiss(){
        this.loading = false;
    }


    @action
    start(){
        this.loading = true;
    }
}

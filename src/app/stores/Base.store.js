import {observable, action} from 'mobx';

export default class BaseStore {
    @observable notification = {
        isOpen: false,
        message: '',
        variant: ''
    };

    @action openNotification(message, variant = null) {
        this.notification.isOpen = true;
        this.notification.message = message;
        this.notification.variant = variant;
    }

    @action closeNotification(event, reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.notification.isOpen = false;
    }

    @action resetNotification() {
        this.notification = {
            isOpen: false,
            message: '',
            variant: ''
        };
    }
}

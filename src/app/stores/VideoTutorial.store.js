import {observable, action} from 'mobx';

export default class VideoTutorialStore {
    
    @observable player = {
        isOpen: false,
        videoId: null,
        title: null,
    };

    @action openPlayer(videoInfo) {
        this.player = {
            isOpen: true,
            videoId: videoInfo.videoId,
            title: videoInfo.title,
        }
    };

    @action closePlayer() {
        this.player = {
            isOpen: false,
            videoId: null,
            title: null,
        }
    };
}

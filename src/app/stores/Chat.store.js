import React from "react";
import { action, observable } from "mobx";
import sortBy from 'sort-by';
import Avatar from "react-avatar";
import moment from "moment";
import { toast } from 'react-toastify';
import * as ChatAPI from "../utils/ChatAPI";
import DisconnectedIcon from '../assets/img/svg/chat-disconnected-icon.svg';
import { getPushNotificationToken, askForPermissionToReceiveNotifications } from "../../push-notification";
import { isSafari } from "../utils/Navigator";
import { db } from "../config/config";

const defaultNotification = {
  isActive: false,
  title: '',
  description: '',
  icon: '',
  color: '#ffffff',
  onClick: () => {},
};

export default class ChatStore {
  @observable user = null;
  @observable selectedRoomId = null;
  @observable lastRoomUpdated = null;
  @observable contacts = [];
  @observable rooms = [];
  @observable chatWindows = [];
  @observable userTypingMap = {};
  @observable userTypingTimerMap = {};
  @observable unreadMessages = 0;
  @observable notification = {
    ...defaultNotification,
  };
  
  constructor() {
    // Socket event handlers
    ChatAPI.socket.on('disconnect', this.onDisconnect.bind(this));
    ChatAPI.socket.on('reconnect', this.onReconnect.bind(this));
    
    // API event handlers
    ChatAPI.rooms.on('patched', this.onRoomUpdated.bind(this));
    ChatAPI.messages.on("created", this.onMessageCreated.bind(this));
    ChatAPI.client.once("logout", this.onLogout.bind(this));

    this.loadChatWindows();
  }

  async loadChatWindows() {
    try {
      this.chatWindows = JSON.parse(await db.get('chatWindows', []));
    } catch (error) {
      //
    }
  }

  @action removeChatWindow(roomId) {
    const chatWindows = this.chatWindows.filter(c => c._id !== roomId);

    this.chatWindows = [...chatWindows];
    
    db.set('chatWindows', JSON.stringify(this.chatWindows));
  }

  @action async authenticate() {
    let response = null;

    try {
      // Authenticate the user at chat server
      response = await ChatAPI.authenticate();
      this.authenticationSuccess(response);
    } catch (error) {
      this.authenticationFailed(error);
    }
    
    this.setupPushNotification();

    return response;
  }

  @action async createMessage({ data, type, room }) {
    try {
      return ChatAPI.client.service('messages').create({ data, type, room });
    } catch (error) {
      throw error;
    }
  }

  @action async upload({ data, type, room }) {
    try {
      return ChatAPI.uploadService.create(
          {
              uri: data
          }, 
          {
              query: {
                  room,
                  type,
              }
          }
      );
    } catch (error) {
      throw error;
    }
  }

  authenticationSuccess(response) {
    console.log("Chat onAutheticate");
    this.user = response;
    
    // Get all rooms available for the logged user
    ChatAPI.getRooms().then( (rooms) => {
      this.rooms = rooms.sort(sortBy('_id'));
      this.contacts = [...rooms];
      this.contacts.forEach(room => {
        this.updateUnreadMessages(room);
      });
    });
  }

  authenticationFailed(e) {
    console.error("Authentication error", e);
  }

  onLogout() {
    console.log("Chat onLogout");
  }

  onMessageCreated(message) {
    const room = this.rooms.filter(room => room._id === message.room)[0];
    const isChatPage = window.location.href.search('/chat') !== -1;
    const roomActive = isChatPage && message.room === this.selectedRoomId;

    if (this.user && this.user._id !== message.user && !roomActive) {
      let notificationMessage = "";
      const { name } = room.users.filter(u => u.user._id === message.user)[0].user;
      switch (message.type) {
        case "audio":
          notificationMessage = "Enviou um áudio";
          break;
        case "image":
          notificationMessage = "Enviou uma imagem";
          break;
        default:
          notificationMessage = message.data;
      }
      
      this.notifyNewMessage(
        notificationMessage,
        name,
        moment(message.createdAt).format("HH:mm")
      );

      const chatWindows = this.chatWindows.filter(chatWindow => chatWindow._id !== room._id);
      this.chatWindows = [...chatWindows, room];
      db.set('chatWindows', JSON.stringify(this.chatWindows));
    }
    
    if ((this.user && this.user._id === message.user) || message.room === this.selectedRoomId) {
      ChatAPI.updateLastMessageSeen(this.selectedRoomId, message._id);
    }
    
    room.messages = room.messages.concat([message]).sort(sortBy('createdAt'));
    
    this.rooms = this.rooms.filter(r => r._id !== room._id).concat([room]).sort(sortBy('_id'));
  }
  
  onRoomUpdated(room) {
    const currentUserId = this.user?._id;
  
    // Setup contact typing text logic
    const contact = room.users.filter(u => u.user._id !== currentUserId)[0];
    this.userTyping(contact);
    
    this.updateUnreadMessages(room);

    this.lastRoomUpdated = room;

    this.contacts = this.rooms.filter(r => r._id !== room._id).concat([room]).sort(sortBy('_id'));
  };
  
  onDisconnect() {
      console.log('Chat onDisconnect');
      // Show notification with disconnect info
      this.notification = {
        ...this.notification,
        isActive: true,
        title: 'Chat desconectado',
        description: 'Tenha certeza de que seu computador possui uma conexão ativa com a internet',
        icon: DisconnectedIcon,
        color: '#fed859',
      };        
  };

  onReconnect = () => {
      console.log('Chat onReconnect');
      this.authenticate();
      
      // Reset notification state
      this.notification = {
        ...defaultNotification,
      };
  };
  
  updateUnreadMessages(room) {
    const currentUserId = this.user?._id;
    let unreadMessages = 0;
    room.users.forEach(item => {
      if (currentUserId && item?.user?._id === currentUserId) {
        unreadMessages += item.unreadMessages || 0;
      }
    });
    this.unreadMessages = unreadMessages;
  }
  
  userTyping(contact) {
    if(!contact.draftUpdatedAt) {
      return;
    }
    const timeDiff = (moment()).diff(moment(contact.draftUpdatedAt), 'seconds');
    if( timeDiff <= 2) {
        this.userTypingMap[contact.user._id] = timeDiff;
        if(contact.user._id in this.userTypingTimerMap) clearInterval(this.userTypingTimerMap[contact.user._id]);
        this.userTypingTimerMap[contact.user._id] = setInterval(() => this.removeUserTypingMessage(contact.user._id), 500);
    }
  }
  
  removeUserTypingMessage(userId) {
    if(userId in this.userTypingMap) {
      delete this.userTypingMap[userId]; 
      clearInterval(this.userTypingTimerMap[userId])
      delete this.userTypingTimerMap[userId];
    }
  }

  @action async logout() {
    this.user = null;
    this.rooms = [];
    this.selectedRoomId = null;
    this.chatWindows = [];
    return ChatAPI.logout();
  }
  
  @action async updateLastMessageSeenByRoom(room) {
    const messages = room.messages.filter(message => !message.draft).sort(sortBy('createdAt'));
    if(messages.length === 0) {
      return;
    }
    return ChatAPI.updateLastMessageSeen(room._id, messages[messages.length-1]._id);
  }
  
  @action async setupPushNotification() {
    try {
      if (isSafari()) {
        Notification.requestPermission(function (status) {
          if (Notification.permission !== status) {
            Notification.permission = status;
          }
        });
      }
      
      const currentToken = await getPushNotificationToken();
      
      if (!currentToken) {
        const responsePermission = await askForPermissionToReceiveNotifications();
        
        if (responsePermission.error) {
          throw responsePermission.error;
        }
        
        return;
      }
      
      ChatAPI.updatePushNotification(currentToken);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Dispatch a toast message with a message
   */
  notifyNewMessage = (message, name, date) => {
    const options = {
      autoClose: 5000,
      type: toast.TYPE.INFO,
      hideProgressBar: false,
      position: toast.POSITION.TOP_RIGHT,
      pauseOnHover: true,
    };

    if (isSafari() && document.hidden && Notification.permission === 'granted') {
      const notification = new Notification(name, {
        body: `disse: ${message}`,
      });
      notification.onclick = function() {
        parent.focus();
        this.close();
      };
    }
    
    toast(
      <div>
        <div style={{ display: "block", margin: "0 auto" }}>
          <Avatar
            size={40}
            /*src={picture}*/
            name={name}
            round={true}
            style={{ fontSize: 8, marginRight: 10 }}
          />
          <span>{name.length > 30 ? `${name.substring(0, 28)}...` : name}</span>
        </div>
        <div style={{ margin: 10 }}>
          {
            message /*(message.length > 40) ? `${message.substring(0, 40)}...` : message*/
          }
        </div>
        <div style={{ textAlign: "right", width: "100%", fontSize: 12 }}>
          {date}
        </div>
      </div>,
      options
    );
  };
}

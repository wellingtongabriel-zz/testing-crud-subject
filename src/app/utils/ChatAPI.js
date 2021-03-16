import io from 'socket.io-client';
import feathers from '@feathersjs/client';
import localStorageService, { ACCESS_TOKEN_KEY } from '../services/storage';

const socket = io('https://chat.homolog.apphealth.com.br');
const client = feathers();

// Setup websocket
client.configure(feathers.socketio(socket));
// Setup auth
client.configure(feathers.authentication());

// Chat API services
export const messages = client.service('messages');
export const contacts = client.service('contacts');
export const rooms = client.service('rooms');
export const connections = client.service('user-connections');
export const uploadService = client.service('uploads');
// Special timeout value for uploadService (needed for audio and image audio) (default is 5000)
uploadService.timeout = 30000;

/**
 * @description Chat login - Check access token and start socket.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const authenticate = async () => {
    // Logged user access token
    const accessToken = await localStorageService.get(ACCESS_TOKEN_KEY);
    return client.authenticate({
        strategy: 'accessToken',
        token: accessToken
    });
};

/**
 * @description Chat logout.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const logout = () => {
    return client.logout();
};

/**
 * @description Get the list of contacts of the logged user.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const getContacts = () => {
    return contacts.find();
};

/**
 * @description Get the list of available chat rooms that the logged user is a participant.
 *      Note: We only support 1:1 room at the moment.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const getRooms = () => {
    return rooms.find();
};

/**
 * @description Get all the messages available for the logged user.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const getMessages = () => {
    return messages.find({
        query: {
            $sort: {createdAt: -1},
        }
    });
};

/**
 * @description Update logged user room draft.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const updateRoomDraft = (roomId, draft) => {
    return rooms.patch(roomId, {
        draft
    });
};

/**
 * @description Update logged user push notification token.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const updatePushNotification = (token) => {
    return connections.patch(null, {
        pushNotificationToken: token
    });
};

/**
 * @description Update logged user room last message seen.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const updateLastMessageSeen = (roomId, messageId) => {
    return rooms.patch(roomId, {
        lastMessageViewed: messageId
    });
};

/**
 * @description Update logged user room last message received.
 * @returns {*|PromiseLike<T>|Promise<T>}
 */
export const updateLastMessageReceived = (roomId, messageId) => {
    return rooms.patch(roomId, {
        lastMessageReceived: messageId
    });
};

export const getPreviousMessages = (roomId, message) => {
    let query = {
        room: roomId,
        $limit: 20,
        $sort: {createdAt: -1}
    };
    if (message) {
        query = Object.assign(query, {
            createdAt: {
                $lt: message.createdAt
            }
        });
    }
    return messages.find({query});
};

/**
 * Export feathers client, socket instances
 */
export { client, socket };
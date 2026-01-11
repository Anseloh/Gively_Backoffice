import axios from '@axios'
import request from '@/services/request';
import baseUrl from '@/services/baseUrl';
import utils from '@/utils';

const moduleUrl = `${baseUrl.main}/im/v1`;
// const moduleUrl = `http://localhost:3002/v1`;

function mapConversation(conversation, orgId) {
  if (!conversation || !conversation._id) return null;

  /**
   * Remove me in users array and set it at top level in conversation.
   */
  const meIdx = conversation.users.findIndex(u => u.orgId == orgId);
  if (meIdx < 0) return;
  /**
   * Freeze the me object. It cannot be changed.
   */
  conversation.me = Object.freeze(conversation.users.splice(meIdx, 1)[0]);

  conversation.initiator = conversation.users.find(u => u.orgId == conversation.chatInitiator);
  conversation.avatar = conversation.initiator?.avatar;
  /**
   * Mapping stuff.
   */
  conversation._ui = {};
  conversation.messages = [];
  conversation.unseenMsgs = 0;
  /**
   * Build conversation Name from user's fullnames.
   */
  conversation._ui.fullName = conversation.users.reduce((r, c) => `${r}, ${c.fullName}`, "").substring(2);
  conversation._ui.isChatContact = true;
}

function handleConversationsResponse(response) {
  const chats = response.data?.chats || [];

  const user = utils.localStorage.get("userData");

  chats.forEach(x => mapConversation(x, user?.orgId));

  return chats;
}

function mapMessage(message, userOrgId) {
  message.id = message._id;
  message.senderId = message.postedByUserId;
  message.time = new Date(message.createdAt);
  message.parentMessage = message.parent;
  message.shouldResend = false;
  if (message.message.mediaDuration && message.message.mediaDuration > 0) {
    message.message.duration = utils.secondsToDisplayTime(message.message.mediaDuration);
  }

  const read = message.readByRecipients.find(x => x.readByUserId == userOrgId);
  message.isRead = Boolean(read);
  message.isOwned = message.postedByOrgId == userOrgId;

  return message.isRead ? 1 : 0;
}

function handleMessagesResponse(response) {
  const messages = response.data?.conversation || [];

  const user = utils.localStorage.get("userData");

  messages.forEach(m => mapMessage(m, user?.orgId));

  return messages;
}

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    filterConversations({ commit, state } = {}, params = {
      fullName: null,
      page: 1,
      limit: 20,
      hideLoadingSpinner: false
    }) {
      return new Promise((resolve, reject) => {
        const hideLoadingSpinner = params.hideLoadingSpinner;
        delete params.hideLoadingSpinner;

        request
          .post(`${moduleUrl}/room/bo/list`, params, { hideLoadingSpinner })
          .then(response => {
            if (!response.success) {
              return reject(response.errorMsg);
            }
            resolve(handleConversationsResponse(response));
          })
          .catch(error => reject(error));
      });
    },
    getMessages(ctx, {
      roomId,
      page,
      limit,
      hideLoadingSpinner
    }) {
      return new Promise((resolve, reject) => {
        request
          .get(`${moduleUrl}/room/bo/all/${roomId}?page=${page || null}&limit=${limit || null}`, { hideLoadingSpinner })
          .then(response => {
            console.log(response);
            if (!response.success) {
              return reject(response.errorMsg);
            }

            resolve(handleMessagesResponse(response));
          })
          .catch(error => reject(error))
      });
    },
    sendMessage(ctx, { roomId, message }) {
      return new Promise((resolve, reject) => {
        request
          .post(`${moduleUrl}/room/bo/${roomId}/message`, { ...message }, { hideLoadingSpinner: true })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    deleteMessage(ctx, { id }) {
      return new Promise((resolve, reject) => {
        request
          .post(`${moduleUrl}/room/bo/delete/message/${id}`)
          .then(response => {
            if (!response.success) {
              return reject(response.errorMsg);
            }

            resolve(response.data.delete);
          })
          .catch(error => reject(error))
      })
    },
    getConversation(ctx, { id: roomId }) {
      return new Promise((resolve, reject) => {
        request
          .get(`${moduleUrl}/room/bo/details/${roomId}`, { hideLoadingSpinner: true })
          .then(response => {
            if (!response.success) {
              return reject(response.errorMsg);
            }

            resolve(mapConversation(response.data.room));
          })
          .catch(error => reject(error))
      });
    },
    markMessageAsRead(ctx, { messageId }) {
      return new Promise((resolve, reject) => {
        request.put(`${moduleUrl}/room/bo/message/${messageId}/mark-read`, {}, { hideLoadingSpinner: true })
          .then(response => {
            if (!response.success) return reject(response.errorMsg);

            resolve(true);
          })
          .catch(error => reject(error))
      });
    },
    markConversationAsRead(ctx, { roomId }) {
      return new Promise((resolve, reject) => {
        request.put(`${moduleUrl}/room/bo/${roomId}/mark-read`, {}, { hideLoadingSpinner: true })
          .then(response => {
            if (!response.success) return reject(response.errorMsg);

            resolve(true);
          })
          .catch(error => reject(error))
      });
    },
    countUnreadMessages(ctx, { roomIds }) {
      return new Promise((resolve, reject) => {
        request.post(`${moduleUrl}/room/bo/count-unread`, { ids: roomIds }, { hideLoadingSpinner: true })
          .then(response => {
            if (!response.success) return reject(response.errorMsg);

            resolve(response.data.counts);
          })
          .catch(error => reject(error))
      });
    }
  }
}

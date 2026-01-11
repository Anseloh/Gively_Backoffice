import constants from "@/services/constants";
import eventBus from "@/services/event-bus";
import store from "@/store";
import utils from "@/utils";
import { ref, Ref } from "@vue/composition-api";
import Api from "./api";

/**
 * 
 * @param {Ref<Object>} activeConversation 
 * @param {Ref<String>} chatInputMessage 
 * @param {Ref<Number>} newMessageType 
 * @param {Ref<Array>} selectedImagesToSend 
 * @param {Ref<{ audioUrl: String; fileSize: Number; mediaDuration: Number; data: Blob  }>} recordedAudioInfos 
 * @param {Function} scrollInChatLog 
 * @param {Ref<Array>} conversations 
 * @returns 
 */
export default function useMessaging(
  activeConversation,
  chatInputMessage,
  newMessageType,
  selectedImagesToSend,
  recordedAudioInfos,
  scrollInChatLog,
  conversations
) {
  /**
   * Reference to the parent message. Used for replies.
   */
  const parentMessage = ref(null);

  /**
   * Process updates on message that match the given `pendingMsgId` on the ui.
   * 
   * @param {*} response Data recieved from the server.
   * @param {string} pendingMsgId pending id of the message to update.
   */
  const handleMessageSentResponse = (response, pendingMsgId) => {
    const chatLogMsgIdx = activeConversation.value.messages.findIndex(x => x.pendingMsgId == pendingMsgId);

    const message = response.data.post;
    message.pending = false;
    message.isOwned = true;
    message.shouldResend = false;
    message.parentMessage = message.parent;
    message.time = new Date(message.createdAt);
    activeConversation.value.lastActive = message.createdAt;

    const msgs = activeConversation.value.messages;

    msgs[chatLogMsgIdx] = Object.assign(msgs[chatLogMsgIdx], message, { pending: false });
    activeConversation.value.messages = msgs;
    activeConversation.value.lastMessage = message;
  };

  const handleMessageSentErrorResponse = (msg, pendingMsgId) => {
    /**
     * Set message props values.
     */
    msg.shouldResend = true;
    msg.pending = true;

    /**
     * Save unsent message in local storage.
     */
    try {
      let unsentMessages = utils.localStorage.get('TZ_UNSENT_MESSAGES');
      if (!unsentMessages) unsentMessages = [];
      const targetConversation = unsentMessages.find(x => x.id == activeConversation.value._id);
      if (targetConversation) targetConversation.msgQueue.push(msg);
      else unsentMessages.push({ id: activeConversation.value._id, msgQueue: [msg] });

      utils.localStorage.set('TZ_UNSENT_MESSAGES', unsentMessages);
    } catch (error) {
      console.log(error);
    }
  };

  const removeUnsentMessage = async (pendingMsgId, conversationId) => {
    if (
      !pendingMsgId ||
      !conversationId ||
      typeof pendingMsgId != 'string' ||
      typeof conversationId != 'string'
    ) return;

    try {
      let unsentMessages = utils.localStorage.get('TZ_UNSENT_MESSAGES');
      if (!unsentMessages) return;

      const targetConversation = unsentMessages.find(x => x.id == conversationId);
      if (!targetConversation || !Array.isArray(targetConversation.msgQueue)) return;

      const msgIdx = targetConversation.msgQueue.findIndex(x => x.pendingMsgId == pendingMsgId);
      if (msgIdx < 0) return;

      targetConversation.msgQueue.splice(msgIdx, 1);

      utils.localStorage.set('TZ_UNSENT_MESSAGES', unsentMessages);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * Send audio message to backend.
   * 
   * @returns {void}
   */
  const sendAudioMessage = async () => {
    let _message = {};
    try {
      if (!recordedAudioInfos ||
        !recordedAudioInfos.value.audioUrl ||
        isNaN(recordedAudioInfos.value.fileSize) ||
        recordedAudioInfos.value.fileSize <= 0 ||
        isNaN(recordedAudioInfos.value.mediaDuration) ||
        recordedAudioInfos.value.mediaDuration <= 0
      ) {
        utils.showErrorToast(eventBus, 'No audio found. Please try to record before sending.');
        return;
      }

      const msg = {
        pendingMsgId: utils.getUUID(),
        ...recordedAudioInfos.value,
        msgType: utils.messageTypes.AUDIO,
        parent: parentMessage.value?._id || null
      };

      const url = await Api.uploadAudios(msg.data);
      delete msg.data;
      msg.audioUrl = url;

      const viewMsg = {
        pending: true,
        time: new Date(),
        shouldResend: false,
        parentMessage: parentMessage.value,
        pendingMsgId: msg.pendingMsgId,
        msgType: utils.messageTypes.AUDIO,
        message: recordedAudioInfos.value,
        postedByUserId: activeConversation.value.me.id
      }
      _message = viewMsg;

      activeConversation.value.messages.push(viewMsg);

      /**
       * Scroll to bottom
       */
      if (scrollInChatLog) scrollInChatLog();

      const response = await store.dispatch('app-chat/sendMessage', { roomId: activeConversation.value._id, message: msg })
      handleMessageSentResponse(response, msg.pendingMsgId);

      newMessageType.value = utils.messageTypes.TEXT;

      eventBus.$emit('AUDIO_MESSAGE_SENT');
    } catch (error) {
      console.log(error);
      handleMessageSentErrorResponse(_message);
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
    }
  };

  /**
   * Send text message to backend.
   */
  const sendTextMessage = async () => {
    let _message = {};
    try {
      if (`${chatInputMessage.value}`.trim().length == 0) {
        utils.showErrorToast(eventBus, 'Empty message');
        return;
      }

      const msg = {
        pendingMsgId: utils.getUUID(),
        pending: true,
        shouldResend: false,
        textContent: chatInputMessage.value,
        msgType: utils.messageTypes.TEXT,
        time: new Date(),
        postedByUserId: activeConversation.value.me.id,
        message: {
          textContent: chatInputMessage.value
        },
        parent: parentMessage.value?._id
      };

      _message = msg;
      chatInputMessage.value = null;
      activeConversation.value.messages.push(msg);

      /**
       * Scroll to bottom
       */
      if (scrollInChatLog) scrollInChatLog();

      const response = await store.dispatch('app-chat/sendMessage', { roomId: activeConversation.value._id, message: msg });
      handleMessageSentResponse(response, msg.pendingMsgId);

    } catch (error) {
      handleMessageSentErrorResponse(_message);
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
      console.log(error);
    }
  };

  /**
   * Send selected images to the backend as messages.
   */
  const sendImageMessages = () => {
    if (!selectedImagesToSend.value || selectedImagesToSend.value.length <= 0) {
      utils.showErrorToast(eventBus, 'No image selected');
      return;
    }

    const messages = selectedImagesToSend.value.map(x => ({
      pendingMsgId: utils.getUUID(),
      pending: true,
      shouldResend: false,
      time: new Date(),
      msgType: utils.messageTypes.IMAGE,
      postedByUserId: activeConversation.value.me.id,
      ...x,
      message: { ...x },
      parent: parentMessage.value?._id
    }));

    messages.forEach(async msg => {
      try {

        const url = await Api.uploadImages(msg.originalData);
        msg.imageUrl = url;
        msg.message.imageUrl = url;
        msg.message.extension = url.split('.').pop();

        delete msg.originalData;

        const response = await store.dispatch('app-chat/sendMessage', { roomId: activeConversation.value._id, message: msg });

        handleMessageSentResponse(response, msg.pendingMsgId);

      } catch (err) {
        handleMessageSentErrorResponse(msg);
        utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
        console.log(err);
      }
    });

    eventBus.$emit('IMAGE_MESSAGES_SENT');

    activeConversation.value.messages.push(...messages);

    /**
     * Scroll to bottom
     */
    if (scrollInChatLog) scrollInChatLog();
  }

  const sendMessage = () => {
    switch (newMessageType.value) {
      case utils.messageTypes.TEXT:
        sendTextMessage();
        break;

      case utils.messageTypes.IMAGE:
        sendImageMessages();
        break;

      case utils.messageTypes.AUDIO:
        sendAudioMessage();
        break;

      default:
        utils.showErrorToast(eventBus, 'Invalid message');
        break;
    }

    parentMessage.value = null;
  };

  /**
   * Attemp to resend a message in case a previous try has failed.
   * 
   * @param {*} message Message to resend.
   */
  const resendMessage = async message => {
    /**
     * Security stuff.
     */
    if (!message || message._id || !message.pendingMsgId) return;

    try {
      const conversationId = activeConversation.value._id;
      message.shouldResend = false;
      message.pending = true;

      const response = await store.dispatch('app-chat/sendMessage', { roomId: conversationId, message });
      handleMessageSentErrorResponse(response);
      removeUnsentMessage(message.pendingMsgId, conversationId);
    } catch (error) {
      handleMessageSentErrorResponse(message);
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
      console.log(error);
    }
  };

  /**
   * Deltes a message.
   * 
   * @param {Object} message Message object.
   * @param {string|Date} _id Unique id of the message comming from the backend.
   * @param {string|Date} pendingMsgId Unique temp id of the message here generated.
   * @param {string|Date} createdAt Posted date of the message.
   * @returns 
   */
  const deleteMessage = async message => {
    try {
      if (!message || !message.createdAt) return;
      /**
       * If the message is not yet saved to the backend,
       * just remove it.
       */
      if (message.pendingMsgId && !message._id) {
        const idx = activeConversation.value.messages.findIndex(x => x.pendingMsgId == message.pendingMsgId);
        if (idx >= 0) activeConversation.value.messages.splice(idx, 1);

        return;
      }

      await store.dispatch('app-chat/deleteMessage', { id: message._id });

      const idx = activeConversation.value.messages.findIndex(m => m._id == message._id);
      if (idx >= 0) activeConversation.value.messages.splice(idx, 1);


      /**
       * If the deleted message is the last message of the conversation...
       */
      if (message._id == activeConversation.value.lastMessage._id) {
        /**
         * Refresh last message of conversation.
         */
        activeConversation.value.lastMessage = activeConversation.value.messages[activeConversation.value.messages.length - 1];
        /**
         * Refresh last Active too.
         * 
         * If the conversation has no more message, just put current date as lastActive.
         */
        activeConversation.value.lastActive =
          activeConversation.value.lastMessage ? activeConversation.value.lastMessage.createdAt : new Date();
      }

    } catch (error) {
      console.log(error);
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
    }
  }

  const showReplyFor = message => {
    parentMessage.value = message;
  }

  return {
    sendMessage,
    deleteMessage,
    parentMessage,
    showReplyFor,
    resendMessage
  };
}
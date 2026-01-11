/* eslint-disable no-unreachable */
import Vue from "vue";
import { ref, Ref } from "@vue/composition-api";
import utils from "@/utils";
import store from "@/store";
import eventBus from "@/services/event-bus";
import constants from "@/services/constants";

/**
 * @callback scrollInChatLog
 * 
 * @param {Object} message
 * @param {string} message._id
 */

/**
 * 
 * @param {Ref<Object>} activeConversation Reference of active conversation.
 * @param {scrollInChatLog} scrollInChatLog Method to call when wanted to scroll in chatlog, once messages have been loaded.
 */
export default function useSingleConversation(
  mqShallShowLeftSidebar,
  activeConversation,
  scrollInChatLog
) {
  /**
   * Text typed by user in chat area.
   * 
   * @type Ref<String>
   */
  const chatInputMessage = ref('');
  /**
   * `FLAG`.
   * 
   * Indicates whether to display the picker for image, record, ...
   * 
   * @type Ref<Boolean>
   */
  const shallDisplayMessageTypePicker = ref(false);
  /**
   * Reference to the open image-file button.
   * 
   * In order to use this method, there must be a HTML input tag with the following attributes :
   * 
   * `type="file"`
   * `accept="image/*"`
   * `ref="msgImageInput"`
   * 
   * @type Ref<HTMLElement>
   */
  const msgImageInput = ref(null);
  /**
   * Pagination stuff.
   * 
   * @type { limit: Number; page: Number; }
   */
  const pagination = {
    limit: 20,
    page: 1
  };
  /**
   * @type Boolean
   */
  let hasMore = true;
  /**
   * Type of the new message to be sent.
   * Default is {@link utils.messageTypes.TEXT}.
   * 
   * @type Ref<Number>
   */
  const newMessageType = ref(utils.messageTypes.TEXT);
  /**
   * `FLAG`. 
   * 
   * Indicates whether to display the active conversation details or not.
   */
  const shallShowActiveChatContactSidebar = ref(false)

  /**
   * Set all messaging temp variables to their initial values.
   */
  const resetMessaging = () => {
    chatInputMessage.value = '';

    shallDisplayMessageTypePicker.value = false;

    newMessageType.value = utils.messageTypes.TEXT;

    eventBus.$emit('AUDIO_MESSAGE_SENT');
    eventBus.$emit('IMAGE_MESSAGES_SENT');
  };
  /**
   * Adds or updates items in the active conversation messages queue.
   * 
   * @param {...any} income Array of messages to add to the current queue.
   * @returns {void}
   */
  const safelyPushMessages = (income, target) => {
    /**
     * Security checks.
     */
    if (!income || income.length <= 0 || !Array.isArray(income)) return;
    /**
     * Init target value in case it is `null` or `undefined`.
     */
    if (!target) target = [];

    income.forEach(input => {
      /**
       * Check if the current item already exists in target array.
       */
      const concurent = target.find(x => x._id == input._id);
      if (concurent) {
        /**
         * If yes, softly update the founded item.
         */
        Object.assign(concurent, input);
      } else {
        /**
         * If not, just add it at the end of the array.
         */
        target.push(input);
      }
    })

  }
  /**
   * Marks a set of mesages as read.
   * 
   * @param {Object} conversation - Target conversation.
   * @param {string} conversation._id Unique identifier of the conversation.
   * @param  {...{_id: String; isRead: Boolean; msgType: Number; }} messages Messages to mark as read.
   * 
   * @returns {Boolean} `true` if job well done, `false` otherwise.
   */
  const markMessagesAsRead = async (conversation, ...messages) => {
    try {
      /**
       * 0. Security stuff.
       */
      if (!conversation || !conversation._id || !messages || messages.length <= 0) return false;
      /**
       * 1. Make API call.
       */
      await store.dispatch('app-chat/markConversationAsRead', { roomId: conversation._id })
      /**
       * 2. Toggle read status on messages.
       */
      messages.forEach(x => {
        if (x.msgType != utils.messageTypes.AUDIO) x.isRead = true;
      });

      /**
       * 3. Reset conversation unseen count.
       */
      conversation.unseenMsgs = 0;

      return true;

    } catch (error) {
      console.log(error);
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);

      return false;
    }
  }
  /**
   * Mark one message as read.
   * 
   * @param {Object} message 
   * @param {String} message._id
   * @param {Boolean} message.isRead
   * 
   * @returns {Boolean} `true` if job well done, `false` otherwise.
   */
  const markSingleMessageRead = async message => {
    try {
      /**
       * 0. Security stuff.
       */
      if (!message || !message._id || message.isRead) return false;

      const activeChat = activeConversation.value;
      /**
       * 1. Make API call.
       */
      await store.dispatch('app-chat/markMessageAsRead', { messageId: message._id })
      /**
       * 2. Toggle read status on message.
       */
      message.isRead = true;
      /**
       * 3. Decrease chat unseen messages count.
       */
      if (activeChat && activeChat.unseenMsgs && activeChat.unseenMsgs > 0) {
        activeChat.unseenMsgs -= 1;
      }

      return true;
    } catch (error) {
      console.log(error);
      /**
       * 
       */
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);

      return false;
    }
  };

  const fetchMessages = async (roomId, resetPagination = false, hideLoadingSpinner = false) => {
    try {
      /**
       * Prevent querying when no more results to get.
       */
      if (!hasMore) return [];

      /**
       * Pagination stuff.
       */
      if (resetPagination) {
        pagination.limit = 20;
        pagination.page = 1;
        hasMore = true;
      }
      /**
       * Perform api call.
       */
      const messages = await store.dispatch('app-chat/getMessages', { roomId, ...pagination, hideLoadingSpinner });

      /**
       * Increment pagination for next query.
       */
      pagination.page += 1;
      hasMore = messages.length >= pagination.limit;
      /**
       * Return data.
       */
      return messages;
    } catch (error) {
      console.error(error);
      /**
       * Dispay generic error message.
       */
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
      return [];
    }
  }

  /**
   * Open an image picker dialog for `msgImageInput`.
   */
  const openSelectImageDialog = () => msgImageInput.value.click();

  const loadUnsentMessages = conversation => {
    try {
      const unSentMessages = utils.localStorage.get('TZ_UNSENT_MESSAGES');

      if (!unSentMessages) return;

      const target = unSentMessages.find(x => x.id == conversation._id);

      if (!target || !Array.isArray(target.msgQueue)) return;

      conversation.messages.push(...target.msgQueue)
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * 
   * @param {Object} conversation 
   * @returns {void}
   */
  const openConversation = async conversation => {
    /**
     * 0. Security stuff.
     */
    if (!conversation || !conversation._id) return;
    /**
     * 1. Reset messaging temp variables.
     */
    resetMessaging();
    /**
     * 2. If some messages where already loaded, ...
     */
    const canLoadSilently = conversation.messages && conversation.messages.length > 0;
    if (canLoadSilently) {
      /**
       * 2.' Show them first
       */
      activeConversation.value = conversation;
      /**
       * If SM device =>  Close Chat & Contacts left sidebar.
       */
      if (mqShallShowLeftSidebar) mqShallShowLeftSidebar.value = false;
    }
    /**
     * 3. Load messages from server.
     */
    hasMore = true;
    const loadedMessages = await fetchMessages(conversation._id, true, canLoadSilently);
    /**
     * 4. Append messages
     */
    await safelyPushMessages(loadedMessages, conversation.messages);
    /**
     * If SM device =>  Close Chat & Contacts left sidebar.
     */
    if (mqShallShowLeftSidebar) mqShallShowLeftSidebar.value = false;
    /**
     * 5. Display messages.
     * 
     * In case, there were already some messages loaded (2.),
     * as the reference is not changing, nothing will happen.
     */
    activeConversation.value = conversation;
    /**
     * 6. Scroll in messages log.
     */
    const unseenMessages = loadedMessages.filter(x => !x.isOwned && !x.isRead);

    if (scrollInChatLog) {
      setTimeout(scrollInChatLog.call(this, unseenMessages[0] || null), 500);
    }
    /**
     * 7. Mark messages as read.
     */
    markMessagesAsRead(conversation, ...unseenMessages);
    /**
     * 8. Load unsent messages from local storage.
     */
    loadUnsentMessages(conversation);
  }

  const messagesScrollReachedEnd = () => {

  }

  const messagesScrollReachedStart = async () => {
    /**
     * 1. Load messages from server.
     */
    const loadedMessages = await fetchMessages(activeConversation.value._id, false);
    /**
     * 2. Append messages
     */
    await safelyPushMessages(loadedMessages, activeConversation.value.messages);
  }

  eventBus.$on('IMAGE_MESSAGES_SENT', () => {
    if (msgImageInput && msgImageInput.value) msgImageInput.value.files = [];
  });

  return {
    chatInputMessage,
    msgImageInput,
    newMessageType,
    shallDisplayMessageTypePicker,

    openConversation,
    openSelectImageDialog,
    markSingleMessageRead,

    messagesScrollReachedEnd,
    messagesScrollReachedStart,
    shallShowActiveChatContactSidebar
  };
}

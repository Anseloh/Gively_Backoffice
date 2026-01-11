import store from "@/store";
import { ref } from "@vue/composition-api";
import utils from "@/utils";
import eventBus from "@/services/event-bus";
import constants from "@/services/constants";

export default function useConversations() {
  /**
   * List of conversations.
   */
  const conversations = ref([]);
  /**
   * `FLAG`. Indicates whether conversations are being fetched or not.
   */
  const isChatsLoading = ref(false);
  /**
   * Reference of the current selected conversation.
   */
  const activeConversation = ref({});
  /**
   * Used to track filter changes between two consecutives requests.
   */
  const filterTracker = {
    current: null,
    previous: null
  };
  /**
   * Pagination stuff.
   */
  const pagination = {
    limit: 20,
    page: 1
  };
  /**
   * `FLAG`. Indicates whether there are more results to fetch.
   */
  let hasMore = true;

  /**
   * Adds or updates items in the conversations list.
   * 
   * @param {...any} income Array of conversations to add to the current conversations list.
   * @returns {void}
   */
  const safelyPushConversations = income => {
    /**
     * Security checks.
     */
    if (!income || income.length <= 0 || !Array.isArray(income)) return;
    /**
     * Init target value in case it is `null` or `undefined`.
     */
    if (!conversations.value) conversations.value = [];

    income.forEach(input => {
      /**
       * Check if the current item already exists in target array.
       */
      const concurent = conversations.value.find(x => x._id == input._id);
      if (concurent) {
        /**
         * If yes, softly update the founded item.
         */
        Object.assign(concurent, input);
      } else {
        /**
         * If not, just add it at the end of the array.
         */
        conversations.value.push(input);
      }
    })
  };
  /**
   * Load unseen messages count for the just loaded conversations.
   */
  const fetchUnseenMessagesCounts = async income => {
    try {
      /**
       * 0. Security stuff.
       */
      if (!income || !income.length) return;
      /**
       * 1. Perform query
       */
      const counts = await store.dispatch('app-chat/countUnreadMessages', { roomIds: income.map(x => x._id) });
      /**
       * 2. Update conversations
       */
      counts.forEach(c => {
        const item = income.find(x => x._id == c._id);
        if (item) {
          item.unseenMsgs = c.count;
        }
      });
    } catch (error) {
      console.log(error);
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
    }

    return income;
  };

  /**
   * Retrieves conversations from the backend, according to the given parameters.
   * 
   * @param {Object} params
   * @param {String} params.search Name or phone pattern of a desired contact.
   * @param {boolean} params.resetPagination - .
   * 
   * @returns {void}
   */
  const fetchConversations = async ({ search, resetPagination } = { search: null, resetPagination: true }) => {
    try {
      /**
       * Prevent fetch while another call is pending.
       */
      if (isChatsLoading.value) return;
      /**
       * Let th view know that conversations are being loaded.
       */
      isChatsLoading.value = true;
      /**
       * While loading, there is no active conversation.
       */
      activeConversation.value = {};
      /**
       * Init filter tracker for this query.
       */
      filterTracker.current = search || null;
      /**
       * Check if the filter changed from the previous request.
       */
      if ((filterTracker.current != filterTracker.previous) || resetPagination) {
        //New filter applied, reset pagination stuffs.
        hasMore = true;
        pagination.page = 1;
        pagination.limit = 20;
      }
      /**
       * Build query params.
       */
      const params = {
        fullName: filterTracker.current,
        ...pagination
      }
      /**
       * Perform API call.
       */
      const response = await store.dispatch('app-chat/filterConversations', params);
      /**
       * Verify if there are older conversations.
       */
      hasMore = response.length >= pagination.limit;
      /**
       * Append conversations to current array.
       */
      safelyPushConversations(response);
      /**
       * Init filter tracker for next query.
       */
      filterTracker.previous = filterTracker.current;
      filterTracker.current = null;
      /**
       * Init pagination for next query
       */
      pagination.page += 1;
      /**
       * Load unseen counts.
       */
      fetchUnseenMessagesCounts(response);
    } catch (error) {
      console.log(error);
      utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
    } finally {
      /**
       * Tell the view chat load ended
       */
      isChatsLoading.value = false;
    }
  };

  const getChatDisplay = function (message) {
    switch (message.msgType) {
      case utils.messageTypes.AUDIO:
        return "[Audio]";
      case utils.messageTypes.IMAGE:
        return "[Photo]";
      case utils.messageTypes.VIDEO:
        return "[Video]";
      case utils.messageTypes.CASH:
        return "[Cash]";
      default:
        return message?.textContent?.substr(0, 24) + '...';
    }
  }

  /**
   * 
   * @param {*} message 
   * @returns 
   */
  const onNewMessageRecieved = async message => {

    console.log('NES_ESSAJvsdhgvdksh', message)

    /**
     * Security checks.
     */
    if (!message) return;
    /**
     * Load current user.
     */
    const user = utils.localStorage.get('userData');

    const { chatRoomId, postedByUserId } = message;

    /**
     * If the current user is the message author, ignore it.
     */
    if (postedByUserId == user.userId) return;

    message.time = new Date(message.createdAt);
    const activeChat = activeConversation.value;

    /**
     * Find the matching conversation.
     */
    let conversation = conversations.value.find(x => x._id == chatRoomId);
    /**
     * If match found, ...
     */
    if (conversation) {
      /**
       * Update conversation itself.
       */
      conversation.lastActive = message.createdAt;
      if (message.postedByOrgId != conversation.me?.orgId) conversation.unseenMsgs += 1;
      conversation.lastMessage = message;
      conversation.messages.push(message);

      /**
       * If the founded conversation is actually opened, scroll to new mesages.
       */
      if (conversation._id == activeChat?._id) {
        setTimeout(() => eventBus.$emit('NEW_MESSAGE_GOT_IN_ACTIVE_CONVERSATION', message), 500);
        utils.showInfoToast(eventBus, getChatDisplay(message), 'New message');
      }

    } else { // if none found,
      try {
        /**
         * Query the full conversation
         */
        conversation = await store.dispatch('app-chat/getConversation', { id: chatRoomId });
        /**
         * Append if to the current conversation stack.
         */
        conversations.value.push(conversation);
        eventBus.$emit('SUBSCRIBE_NEW_CONVERSATION', conversation);
      } catch (error) {
        console.log(error);
        utils.showErrorToast(eventBus, constants.DEFAULT_ERR_MESSAGE);
      }
    }
  };

  const loadPeviousConversations = () => {
    if (hasMore) {
      console.log('LOADING PREVIOUS CONVERSATIONS');
      fetchConversations({
        resetPagination: false
      });
    }
  };

  return {
    conversations,
    isChatsLoading,
    activeConversation,
    fetchConversations,
    onNewMessageRecieved,
    loadPeviousConversations
  };
}
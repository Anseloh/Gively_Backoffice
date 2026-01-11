<template>
  <!-- Need to add height inherit because Vue 2 don't support multiple root ele -->
  <div style="height: inherit">
    <div
      class="body-content-overlay"
      :class="{'show': shallShowActiveChatContactSidebar || mqShallShowLeftSidebar}"
      @click="mqShallShowLeftSidebar=shallShowActiveChatContactSidebar=false"
    />

    <!-- Main Area -->
    <section class="chat-app-window" :style="[shallDisplayMessageTypePicker || parentMessage ? {'position': 'relative'} : {}]">

      <!-- Start Chat Logo -->
      <div
        v-if="!(activeConversation._id)"
        class="start-chat-area"
      >
        <div class="mb-1 start-chat-icon d-lg-none">
          <feather-icon
            icon="MessageSquareIcon"
            size="56"
          />
        </div>
        <h4
          class="sidebar-toggle start-chat-text d-lg-none"
          @click="startConversation"
        >
          Start Conversation
        </h4>
      </div>

      <!-- Chat Content -->
      <div
        v-else
        class="active-chat"
      >
        <!-- Chat Navbar -->
        <div class="chat-navbar">
          <header class="chat-header">

            <!-- Avatar & Name -->
            <div class="d-flex align-items-center">

              <!-- Toggle Icon -->
              <div class="sidebar-toggle d-block d-lg-none mr-1">
                <feather-icon
                  icon="MenuIcon"
                  class="cursor-pointer"
                  size="21"
                  @click="mqShallShowLeftSidebar = true"
                />
              </div>

              <b-avatar
                size="36"
                :src="activeConversation.avatar"
                class="mr-1 cursor-pointer badge-minimal"
                :class="{defaultBadge: !activeConversation.avatar}"
                badge
                :badge-variant="resolveAvatarBadgeVariant(activeConversation.status)"
                @click.native="shallShowActiveChatContactSidebar=true"
              />
              <h6 class="mb-0">
                {{ activeConversation._ui.fullName }}
              </h6>
            </div>
          </header>
        </div>

        <!-- User Chat Area -->
        <vue-perfect-scrollbar
          ref="refChatLogPS"
          :settings="perfectScrollbarSettings"
          class="user-chats scroll-area"
          infinite-scroll
          :style="[parentMessage ? {'padding-bottom': '45px'} : {}]"
          @ps-y-reach-end="messagesScrollReachedEnd"
          @ps-y-reach-start="messagesScrollReachedStart"
        >
          <chat-log
            :chat-data="activeConversation"
            :audio-player-options-fn="getAudioPlayerOptions"
            @MESSAGE_REPLY_CLICKED="showReplyFor"
            @MESSAGE_DELETE_CLICKED="deleteMessage"
            :profile-user-avatar="profileUserDataMinimal.avatar"
          />
        </vue-perfect-scrollbar>

        <!-- Message Input -->
        <div :class="{'pciker-shown': shallDisplayMessageTypePicker, 'parent-mesage-shown': parentMessage, 'picker-and-reply-shown': shallDisplayMessageTypePicker && parentMessage }">
          <!-- Message reply preview -->
          <div v-if="parentMessage" class="parent-message justify-content-between">
            <!-- TEXT -->
            <span v-if="parentMessage.msgType == messageTypes.TEXT" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; margin: 0 1rem; align-self: center">{{parentMessage.message.textContent}}</span>
            <!-- TEXT -->
            <span v-if="parentMessage.msgType == messageTypes.AUDIO" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; margin: 0 1rem; align-self: center">[Audio]</span>
            <!-- IMAGE -->
            <img v-if="parentMessage.msgType == messageTypes.IMAGE" style="max-height: 40px;"  :src="parentMessage.message.imageUrl"/>
            <!-- CASH -->
            <span v-if="parentMessage.msgType == messageTypes.CASH" style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; margin: 0 1rem; align-self: center"> [CASH OF]] {{parentMessage.message.amount}} XAF</span>
             <button type="button" class="close float-right" aria-label="Close" @click="parentMessage = null">
                <span aria-hidden="true">×</span>
            </button>
          </div>

          <!-- Text form -->
          <b-form
            class="chat-app-form"
            @submit.prevent="sendMessage"
            v-if="newMessageType != messageTypes.AUDIO"
          >
              <b-input-group v-if="newMessageType == messageTypes.TEXT" class="input-group-merge form-send-message mr-1">
                <b-form-input
                  v-model="chatInputMessage"
                  @focus="shallDisplayMessageTypePicker = false"
                  @paste="onContentPastedInChatInput"
                  placeholder="Enter your message"
                />
              </b-input-group>
              <!-- Selected images -->
              <b-input-group v-if="newMessageType == messageTypes.IMAGE" class="d-flex mr-1">
                <div 
                  class="mr-1 border"
                  :style="{'background-image': 'url(' + img.imageUrl + ')'}"
                  style="width: 44px; height: 44px; display: inline-block; background-size: cover;"
                  v-for="(img, idx) in selectedImagesToSend" 
                  :key="'TZ_SELECTED_IMG_' + idx"
                  >
                  <!-- <img width="44" height="44" :src="img.imageUrl" class="selected-image"> -->
                  <span
                    @click="removeSelectedImage(img, idx)"
                    style="width: 16px; height: 16px; text-align: center; padding: 2px; cursor: pointer;"
                  class="btn-danger float-right font-small-1">
                    X
                  </span>
                </div>
              </b-input-group>

              <b-button style="padding: 8px;"
                variant="primary"
                type="submit"
                :style="[isUserBusy ? {} : {'margin-right': '4px' }]"
              >
                <b-icon-cursor />
              </b-button>
              <b-button style="padding: 8px;"
                variant="primary"
                v-if="!isUserBusy"
                @click="shallDisplayMessageTypePicker = !shallDisplayMessageTypePicker"
                >
                <b-icon-three-dots-vertical />
              </b-button>
          </b-form>

          <!-- Messages Type Picker -->
          <div v-if="shallDisplayMessageTypePicker" class="chat-app-message-type-picker justify-content-center">
            <b-button class="btn-msg-picker"
              variant="primary"
              type="submit"
              @click="startRecording"
            >
              <b-icon-mic size="24" />
            </b-button>

            <b-button class="btn-msg-picker"
              variant="primary"
              type="submit"
              @click="openSelectImageDialog"
            >
              <b-icon-image />
            </b-button>
            <input
              type="file"
              class="d-none"
              ref="msgImageInput"
              accept="image/*"
              multiple
              @change="onImagesSelected"/>

            <b-button class="btn-msg-picker"
              variant="primary"
              type="submit"
            >
              <b-icon-soundwave />
            </b-button>

          </div>

          <!-- Audio Recorder tools -->
          <div class="d-flex flex-row justify-content-between align-items-center chat-app-form" v-if="newMessageType == messageTypes.AUDIO">
            <audio ref="tzRecorderPreView" style="display: none;"></audio>
            <b-icon-mic size="36" class="text-primary pulse mr-1" />
            <span>{{ audioTime }}</span>
            <div class="d-flex">
            <b-button @click="stopRecording(true)" style="padding: 8px; float: right; margin-right: 4px;" variant="danger">
              <b-icon-stop-circle />
            </b-button>
              <b-button style="padding: 8px;"
                variant="primary"
                @click="stopRecording(false)"
              >
                <b-icon-cursor />
              </b-button>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Active Chat Contact Details Sidebar -->
    <chat-active-chat-content-details-sidedbar
      :shall-show-active-chat-contact-sidebar.sync="shallShowActiveChatContactSidebar"
      :contact="activeConversation.contact || {}"
    />

    <!-- Sidebar -->
    <portal to="content-renderer-sidebar-left">
        <chat-left-sidebar
          :conversations="conversations"
          :active-chat-contact-id="activeConversation._id"
          :profile-user-minimal-data="profileUserDataMinimal"
          :active-conversation-id="activeConversation._id"
          @open-chat="openConversation"
          @filter-chats="fetchConversations"
          @LOAD_PREVIOUS_CONVERSATIONS="loadPeviousConversations"
          :mq-shall-show-left-sidebar.sync="mqShallShowLeftSidebar"
        />
      <!-- <b-overlay :show="isChatsLoading">
      </b-overlay> -->
    </portal>
  </div>
</template>

<script>
import store from '@/store'
import eventBus from "@/services/event-bus";

import {
  ref, onUnmounted, nextTick, computed,
} from '@vue/composition-api'
import {
  BAvatar, BDropdown, BDropdownItem, BForm, BInputGroup, BFormInput, BButton,
  BIcon, BIconCursor, BIconThreeDotsVertical, BIconSoundwave, BIconImage, BIconMic,
  BIconStopCircle
} from 'bootstrap-vue'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { $themeBreakpoints } from '@themeConfig'
import { useResponsiveAppLeftSidebarVisibility } from '@core/comp-functions/ui/app'
import Utils from '@/utils/index';
import constants from '@/services/constants';
import ChatLeftSidebar from './chat-list/ChatLeftSidebar.vue'
import chatStoreModule from './chat.module.store'
import ChatActiveChatContentDetailsSidedbar from './ChatActiveChatContentDetailsSidedbar.vue'
import ChatLog from './ChatLog.vue'
import useConversations from './chat-list/useConversations';
import useSingleConversation from './useSingleConversation';
import useMessaging from './useMessaging';
import useMessagingImages from './useMessaging.image';
import useChat from './useChat'
import 'vue-plyr/dist/vue-plyr.css';
import useMessagingAudio from './useMessaging.audio';

export default {
  components: {

    // BSV
    BAvatar,
    BDropdown,
    BDropdownItem,
    BForm,
    BInputGroup,
    BFormInput,
    BButton,
    BIconCursor,
    BIconThreeDotsVertical,
    BIconSoundwave, 
    BIconImage,
    BIconMic,
    BIcon,
    BIconStopCircle,
    // 3rd Party
    VuePerfectScrollbar,

    // SFC
    ChatLeftSidebar,
    ChatActiveChatContentDetailsSidedbar,
    ChatLog,
  },
  computed:{
    /**
     * Tells the ui wheter the user has active work.
     */
    isUserBusy: function() {
      switch (this.newMessageType) {
        case Utils.messageTypes.TEXT:
          return this.chatInputMessage?.length > 0 || false
        case Utils.messageTypes.IMAGE:
          return this.selectedImagesToSend?.length > 0 || false
        case Utils.messageTypes.AUDIO:
          return this.isRecording
                
        default:
          return false;
      }
    },
    audioTime() {
      return Utils.secondsToDisplayTime(this.audioElapsedTime);
    },
  },
  mounted() {
    eventBus.$on(constants.events.NEW_MESSAGE, this.onNewMessageRecieved);
    eventBus.$on('AUDIO_RECORD_FINISHED', this.sendMessage);
    eventBus.$on('TRY_RESEND_MESSAGE', this.resendMessage);
  },
  beforeDestroy() {
    eventBus.$off(constants.events.NEW_MESSAGE);
  },
  methods: {
    chatLogEndReached() {
      console.log('END REACHED');
    }
  },
  setup(props, context) {
    /**
     * 1. Define store module name.
     */
    const CHAT_APP_STORE_MODULE_NAME = 'app-chat';

    /**
     * 2. Register module
     */
    if (!store.hasModule(CHAT_APP_STORE_MODULE_NAME)) store.registerModule(CHAT_APP_STORE_MODULE_NAME, chatStoreModule);

    /**
     * 3. UnRegister on leave
     */
    onUnmounted(() => {
      if (store.hasModule(CHAT_APP_STORE_MODULE_NAME)) store.unregisterModule(CHAT_APP_STORE_MODULE_NAME)
    })

    /**
     * 4. Prepare utilities
     */
    // Scroll to Bottom ChatLog
    const refChatLogPS = ref(null)
    const scrollToBottomInChatLog = () => {
      const scrollEl = refChatLogPS.value?.$el || refChatLogPS.value
      if(scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight
    }
    const scrollFn = msg => {
      console.log(msg)
      if(msg) eventBus.$emit('SCROLL_IN_CHAT_LOG', msg);
      else nextTick(() => scrollToBottomInChatLog());
    };

    // Message types
    const messageTypes = ref(Utils.messageTypes);

    // Left Sidebar Responsiveness
    const { mqShallShowLeftSidebar } = useResponsiveAppLeftSidebarVisibility()
    const startConversation = () => {
      if (store.state.app.windowWidth < $themeBreakpoints.lg) {
        mqShallShowLeftSidebar.value = true
      }
    }

    /**
     * 5. Load dependant hooks.
     */
    const { resolveAvatarBadgeVariant } = useChat()
    //conversations list
    const { 
      conversations, 
      isChatsLoading, 
      activeConversation, 
      fetchConversations,
      onNewMessageRecieved,
      loadPeviousConversations
    } = useConversations();
    //single conversation
    const {
      chatInputMessage,
      msgImageInput,
      newMessageType,
      shallDisplayMessageTypePicker,
      openConversation,
      markSingleMessageRead,
      openSelectImageDialog,
      messagesScrollReachedEnd,
      messagesScrollReachedStart,
      shallShowActiveChatContactSidebar
    } = useSingleConversation(
      mqShallShowLeftSidebar,
      activeConversation,
      scrollFn
    );
    //images management
    const {
      selectedImagesToSend,
      onImagesSelected,
      removeSelectedImage
    } = useMessagingImages(
      newMessageType,
      shallDisplayMessageTypePicker
    );
    //audio management
    const {
      startRecording,
      stopRecording,
      isRecording,
      audioElapsedTime,
      tzRecorderPreView,
      recordedAudioInfos,
      getAudioPlayerOptions
    } = useMessagingAudio(
      newMessageType,
      shallDisplayMessageTypePicker
    );
    //messaging
    const {
      sendMessage,
      deleteMessage,
      parentMessage,
      showReplyFor,
      resendMessage,
    } = useMessaging(
      activeConversation,
      chatInputMessage,
      newMessageType,
      selectedImagesToSend,
      recordedAudioInfos,
      scrollFn,
      conversations
    );

    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    }
    // ? Will contain id, name and avatar & status
    const profileUserDataMinimal = ref({})

    const localUserInfo = Utils.localStorage.get("userData") || {};
    profileUserDataMinimal.value = {
      avatar: localUserInfo.avatar || "",
      name: localUserInfo.fullName || localUserInfo.firstName || localUserInfo.lastName || "",
      id: localUserInfo.userId,
    };

    console.log('profileUserDataMinimal', profileUserDataMinimal.value);


    // UI + SM Devices

    //TODO: #012 Implement this method in order to handle image or sound pasting.
    const onContentPastedInChatInput = event => {
      console.log(event);
    }

    const delaySingleMessageReadStatus = message => {
      setTimeout(function() {
        markSingleMessageRead(message);
      }, 5000);
    }

    /**
     * 6. Fetch conversations initally
     */
    fetchConversations()
      .then(() => {
        if(!localUserInfo?.avatar) {
          const conversationUser = (conversations.value[0] || {}).me;
  
          if(conversationUser) profileUserDataMinimal.value.avatar = conversationUser.avatar;
        }
      });

    eventBus.$on(['AUDIO_STARTED_PLAYING', 'NEW_MESSAGE_GOT_IN_ACTIVE_CONVERSATION'], delaySingleMessageReadStatus);
    return {
      // Filters
      // formatDate,

      messageTypes,

      // useChat
      resolveAvatarBadgeVariant,

      // Chat & Contacts
      conversations,
      fetchConversations,
      isChatsLoading,
      onNewMessageRecieved,
      loadPeviousConversations,

      // Single Chat
      refChatLogPS,
      activeConversation,
      chatInputMessage,
      openConversation,
      msgImageInput,
      newMessageType,
      markSingleMessageRead,
      shallDisplayMessageTypePicker,
      shallShowActiveChatContactSidebar,

      openSelectImageDialog,
      selectedImagesToSend,
      onImagesSelected,
      removeSelectedImage,

      startRecording,
      stopRecording,
      recordedAudioInfos,
      isRecording,
      audioElapsedTime,
      tzRecorderPreView,
      getAudioPlayerOptions,

      messagesScrollReachedEnd,
      messagesScrollReachedStart,

      sendMessage,
      deleteMessage,
      parentMessage,
      showReplyFor,

      // Profile User Minimal Data
      profileUserDataMinimal,

      // UI
      perfectScrollbarSettings,
      scrollToBottomInChatLog,

      // UI + SM Devices
      startConversation,
      mqShallShowLeftSidebar,
      onContentPastedInChatInput
    }
  },
}
</script>

<style lang="scss" scoped>
  .selected-image {
    width: 44px; 
    height: 44px; 
    display: inline-block;
    background-size: cover;
  }

  .selected-image .close-icon {
    padding: 2px;
    width: 16px;
    cursor: pointer;
    height: 16px;
    text-align: center;
    padding: 2px;
    cursor: pointer;
  }

  .parent-message {
    border-left: 4px solid purple;
    display: flex;
    padding: 4px;
    margin: 0 1rem;
    height: 40px;
    align-content: center;
  }

  .break-line {
    flex-basis: 100%;
    height: 0;
    width: 100%;
  }

  .picker-and-reply-shown {
    margin-top: -160px !important;
  }

  .parent-mesage-shown {
    margin-top: -40px;
    position: absolute;
    width: 100%;
    display: flex;
    background: white;
    flex-direction: column;
  }

  .pulse {
    overflow: visible;
    position: relative;
  }
  .pulse:before {
    content: '';
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: inherit;
    border-radius: inherit;
    transition: opacity .3s, transform .3s;
    animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;
    z-index: -1;
  }
  @keyframes pulse-animation {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0;
      transform: scale(1.5);
    }
    100% {
      opacity: 0;
      transform: scale(1.5);
    }
  }
</style>

<style lang="scss">
@import "~@core/scss/base/pages/app-chat.scss";
@import "~@core/scss/base/pages/app-chat-list.scss";
// @import '~@node_modules/vue-plyr/dist/vue-plyr.css';
  .plyr__controls {
    padding: o !important;
  }

  .pciker-shown {
    margin-top: -120px;
    position: absolute;
    width: 100%;
  }

  .btn-msg-picker {
    padding: 24px;
    margin: 12px;;
  }
</style>

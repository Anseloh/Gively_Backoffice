<template>
  <div class="chats" ref="tzTChatscontainer">
    <div v-for="(group) in groupedChats" :key="group.date" class="chat-date-group">
      <div class="chat-date">
        <span class="badge badge-light-primary">{{ group.date }}</span>
      </div>
      <div v-for="(msgGroup, index) in group.msgGroups" :key="'chatlog_' + msgGroup.userId + '_' + index" class="chat"
        :class="{ 'chat-left': !msgGroup.isOwned }">
        <div class="chat-avatar">
          <b-avatar size="36" class="avatar-border-2 box-shadow-1 defaultBadge" variant="transparent"
            :src="(msgGroup.isChatsLoading ? profileUserAvatar : msgGroup.userAvatar) || ''" />
        </div>
        <div class="chat-body">
          <div v-for="msgData in msgGroup.messages" :key="msgData.id" :id="'tz_msg_' + msgData._id"
            class="chat-content">
            <!-- Action bar -->
            <div class="chat-content-action-bar">
              <span :id="'tz_msg_ctx_mnu_' + (msgData._id || msgData.pendingMsgId)" style=""
                class="float-right text-center chat-content-action-bar-btn">
                <b-icon-chevron-down style="coloe: #CCC;" class="font-small-2" />
              </span>
              <b-popover :target="'tz_msg_ctx_mnu_' + (msgData._id || msgData.pendingMsgId)" triggers="click blur"
                placement="auto" :ref="'tz_msg_ctx_mnu_pop' + (msgData._id || msgData.pendingMsgId)">
                <div>
                  <ul ref="tzContextMenu" class="chat-mgs-ctx-menu">
                    <li class="chat-mgs-ctx-menu-item" @click="onReplyClicked(msgData)">Reply</li>
                    <li class="chat-mgs-ctx-menu-item disabled">Foward</li>
                    <li class="chat-mgs-ctx-menu-item" v-if="msgData.isOwned" @click="onDeleteClicked(msgData)">Delete
                    </li>
                  </ul>
                </div>
              </b-popover>
            </div>

            <div class="message-sender-name">{{ msgData.sender.fullName }}</div>

            <!-- Parent message -->
            <div v-if="msgData.parentMessage" class="message-to-reply" @click="scorllToMessage(msgData.parentMessage)">
              <!-- TEXT -->
              <span v-if="msgData.parentMessage.msgType == messageTypes.TEXT"
                style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; align-self: center">{{ msgData.parentMessage.message.textContent }}</span>
              <!-- AUDIO -->
              <span v-if="msgData.parentMessage.msgType == messageTypes.AUDIO"
                style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; align-self: center">[Audio]</span>
              <!-- IMAGE -->
              <img v-if="msgData.parentMessage.msgType == messageTypes.IMAGE" style="max-height: 40px;"
                :src="msgData.message.imageUrl" />
              <!-- CASH -->
              <span v-if="msgData.parentMessage.msgType == messageTypes.CASH"
                style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; align-self: center"> [CASH OF]]
                {{ parentMessage.message.amount }} XAF</span>
            </div>

            <!-- TEXT message template -->
            <template v-if="msgData.msgType == messageTypes.TEXT">
              <p style="min-width: 52px;">{{ msgData.message.textContent }}</p>
            </template>
            <!-- IMAGE message template -->
            <template v-if="msgData.msgType == messageTypes.IMAGE">
              <img @click="displayImageInFullScreen(msgData.message.imageUrl)" :src="msgData.message.imageUrl" alt=""
                class="chat-content-image" style="margin: -0.4rem -0.8rem;">
              <div class="clearfix"></div>
              <!-- Fullscreen Modal -->
              <b-modal size="md" id="img-full-screen-modal" centered hide-footer hide-header>
                <div class="d-flex flex-column h-100 w-100">
                  <div class="d-flex mb-1 mx-4 align-items-center justify-content-end p-1">
                    <b-button variant="" class="btn-icon"
                      style="background: transparent !important; border: none !important; margin-right: -44px; margin-bottom: -32px;"
                      @click="closeImageInFullScreen">
                      <feather-icon icon="XCircleIcon" size="24" style="color: #cccccc;" />
                    </b-button>
                  </div>
                  <div class="d-flex justify-content-center align-items-center">
                    <img :src="currentFullScreenItem.url" alt="" class="chat-content-image-full-screen">
                  </div>
                </div>
              </b-modal>
            </template>
            <!-- AUDIO message template -->
            <template v-if="msgData.msgType == messageTypes.AUDIO">
              <vue-plyr :class="{ 'unread': !msgData.isRead }" :options="audioPlayerOptionsFn(msgData)">
                <audio :data-idx="msgData._id">
                  <source :src="msgData.message.audioUrl" :type="'audio/' + msgData.message.extension">
                </audio>
              </vue-plyr>
            </template>
            <!-- VIDEO message template -->
            <template v-if="msgData.msgType == messageTypes.VIDEO">
              <vue-plyr :options="{}">
                <video>
                  <source :src="msgData.message.videoUrl" :type="'audio/' + msgData.message.extension">
                </video>
              </vue-plyr>
            </template>
            <!-- CASH message template -->
            <template v-if="msgData.msgType == messageTypes.CASH">
              <div class="d-flex align-items-center tz-cash-msg-first"
                style="min-width: 120px; border-radius: 4px 4px 0 0; padding: 8px; margin: -0.7rem -1rem 0; background-color: #cc00cc;">
                <b-img style="width: 48px;" :src="require('@/assets/images/logo/logo.png')"></b-img>
                <div class="ml-1 text-white font-weight-light">
                  <p class="font-weight-bolder font-medium-2">
                    {{ msgData.message.amount }} Fcfa
                  </p>
                  <span>Recieved</span>
                </div>
              </div>
              <!-- <div style="margin-top: 2px; display: flex; align-items: baseline; margin-bottom: -.5rem;">
                <span class="mr-2 font-small-2">Tranzak Transfer</span>
                <span class="float-right font-small-1">{{ msgData.sendTime }}</span>
              </div> -->
            </template>

            <!-- Common items -->
            <template v-if="msgData.msgType != messageTypes.CASH">
              <span class="float-right text-center chat-content-action-bar-btn" v-if="msgData.shouldResend"
                @click="resendMessage(msgData)">
                <b-icon-arrow-repeat style="color: #CCC; cursor: pointer;" />
              </span>
              <span class="float-right font-small-1" v-else-if="msgData.pending">
                <loader-icon size="1.5x" class="spinner"></loader-icon>
              </span>
              <span class="float-right font-small-1"
                :style="[msgData.msgType == messageTypes.IMAGE ? { 'margin-bottom': '-6px', 'margin-top': '6px' } : {}]"
                v-else>{{ msgData.sendTime }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from "@vue/composition-api";
import {
  BAvatar,
  BIconCheck2Circle,
  BModal,
  BButton,
  BImg,
  BIconChevronDown,
  BPopover,
  BIconArrowRepeat
} from "bootstrap-vue";
import { LoaderIcon } from "vue-feather-icons";
import utils from '@/utils/index';
import constants from '@/services/constants';
import eventBus from '@/services/event-bus';

export default {
  components: {
    BImg,
    BAvatar,
    BModal,
    BButton,
    LoaderIcon,
    BIconCheck2Circle,
    BIconChevronDown,
    BPopover,
    BIconArrowRepeat
  },
  props: {
    chatData: {
      type: Object,
      required: true,
    },
    profileUserAvatar: {
      type: String,
      default: null,
    },
    audioPlayerOptionsFn: {
      type: Function,
      required: false,
      default: () => (msg => ({}))
    }
  },
  data: () => ({
    currentFullScreenItem: {},
    pageSize: 20,
    pageIndex: 1
  }),
  created() {
    /**
     * Remove global click event on body.
     */
    document.getElementsByTagName('body')[0].addEventListener('click', this.forceClosePopover);
  },
  mounted() {

  },
  beforeDestroy() {
    /**
     * Remove global click event on body.
     */
    document.getElementsByTagName('body')[0].removeEventListener('click', this.forceClosePopover);
  },
  methods: {
    displayImageInFullScreen: function (url) {
      this.currentFullScreenItem = { url };

      this.$bvModal.show('img-full-screen-modal');
    },
    closeImageInFullScreen: function () {
      this.$bvModal.hide('img-full-screen-modal');
      setTimeout(() => {
        this.currentFullScreenItem = {};
      }, 200);
    },
    onDeleteClicked: function (message) {
      const messageDate = new Date(message.createdAt);
      const now = new Date();

      const msDiff = now - messageDate;
      const minutes = Math.floor(msDiff / 1000 / 60);

      if (minutes > 5 && !message.shouldResend) {
        utils.showErrorToast(this, 'Cannot delete message');
        return;
      }

      this.$bvModal.msgBoxConfirm('Delete message ?', {
        size: "sm",
        buttonSize: 'sm',
        okVariant: 'primary',
        okTitle: 'Yes',
        cancelTitle: 'No',
        hideHeaderClose: false,
        centered: true
      }).then(result => {
        if (result) this.$emit(constants.events.MESSAGE_DELETE_CLICKED, message);
      }).catch(err => {
        console.log(err);
        utils.showErrorToast(this, constants.DEFAULT_ERR_MESSAGE);
      });
    },
    onReplyClicked: function (message) {
      this.$emit(constants.events.MESSAGE_REPLY_CLICKED, message);
    },
    forceClosePopover: function () {
      this.$root.$emit('bv::hide::popover');
    },
    resendMessage: function (message) {
      eventBus.$emit('TRY_RESEND_MESSAGE', message);
    }
  },
  setup(props, context) {
    /**
     * 1. UI items references.
     */

    /**
     * 2. Utils
     */
    const messageTypes = utils.messageTypes;
    const language = context.root?.$i18n?.locale || navigator.language || navigator.userLanguage || "en";

    const groupedChats = computed(() => {
      let previousUserId = null;
      const dateGroups = props.chatData.messages.sort((a, b) => a.time - b.time).reduce((r, c) => {
        c.sendTime = c.time.toLocaleString(language, { timeStyle: 'short' });
        switch (c.msgType) {
          case messageTypes.AUDIO:
            c.message.extension = c.message.audioUrl.split('.').pop();
            c.message.tracks = [
              { src: c.message.audioUrl, format: c.message.extension }
            ];
            break;
          case messageTypes.IMAGE:
            c.message.extension = c.message.imageUrl.split('.').pop();
            break;
          case messageTypes.VIDEO:
            c.message.extension = c.message.videoUrl.split('.').pop();
            c.message.videos = [
              { src: c.message.videoUrl, format: c.message.extension }
            ];
            break;

          default:
            c.message.extension = null;
            break;
        }

        const date = c.time.toLocaleString(language, {
          dateStyle: "short",
        });

        let group = r.find(x => x.date == date);

        if (!group) {
          group = { date, msgGroups: [] };
          r.push(group);
        }

        const user = props.chatData.users.find(userItem => userItem.orgId == c.postedByOrgId) || props.chatData.me;
        c.sender = user;
        const msgGroup = group.msgGroups[group.msgGroups.length - 1];
        if (previousUserId == c.postedByUserId && msgGroup) {
          msgGroup.messages.push(c);
        } else {
          group.msgGroups.push({
            userAvatar: user.avatar || "",
            userId: c.postedByUserId,
            isOwned: c.pending || (c.postedByOrgId == props.chatData.me.orgId),
            messages: [c]
          });
        }

        previousUserId = c.postedByUserId;

        return r;
      }, []);

      return dateGroups;
    });

    const scorllToMessage = message => {
      /**
       * Build HTML id of the message.
       */
      const id = `tz_msg_${message._id}`;
      /**
       * Get the element from DOM.
       */
      const htmlElement = document.getElementById(id);
      /**
       * If the element don't exists...
       */
      if (!htmlElement) { // The message is not yet loaded.
        context.emit('LOAD_PREVIOUS_MESSAGES')
      } else {
        htmlElement.scrollIntoView(true)
      }
    };

    eventBus.$on('SCROLL_IN_CHAT_LOG', scorllToMessage);

    return {
      groupedChats,
      messageTypes,
      scorllToMessage
    };
  },
};
</script>

<style lang="scss">
@media screen and (max-width: 575px) {
  .chat-content-image {
    max-width: 60vw;
  }
}

.message-to-reply {
  padding: 4px;
  display: flex;
  cursor: pointer;
  margin-top: -24px;
  border-radius: 4px;
  border-left: 4px solid #e1e1e1;
  background: rgba(0, 0, 0, 0.03);
}

.chat-left .message-to-reply {
  border-left: 4px solid purple;
}

.popover.b-popover .arrow {
  display: none !important;
}

.chat-mgs-ctx-menu {
  // display: none;
  padding: 8px 0;
  background: white;
  width: max-content;
  min-width: 140px;
  list-style-position: outside;
  list-style-image: none;
  list-style-type: none;
  border-radius: 4px;
  box-shadow: 0 2px 5px 0 rgb(0 0 0 / 26%);
  position: relative;
  margin: -0.65rem -1.21rem !important; // padding of the popover-body

  .chat-mgs-ctx-menu-item {
    padding: 12px;
    cursor: pointer;
  }

  .chat-mgs-ctx-menu-item:hover {
    background: #F3E0F3;
    color: purple;
  }
}

.chat-content-action-bar {
  right: 0;
  // left: -1rem;
  height: 20px;
  top: -0.7rem;
  opacity: 0;
  position: relative;
  // width: calc(100% + 2rem);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  width: fit-content;
  margin-left: calc(100% - 0.4rem);

  .chat-content-action-bar-btn {
    cursor: pointer;
    background: rgba(0, 0, 0, .1);
    width: 20px;
  }

  .chat-left .chat-content-action-bar-btn {
    color: #aaa;
  }

  .dropdown-toggle {
    padding: 0;
    background: transparent !important;
    border: 0;
  }
}

.chat-content {
  .chat-content-action-bar {
    display: block;
  }

  .chat-content-action-bar+p,
  .chat-content-action-bar+.plyr {
    margin-top: -20px !important;
  }

  .chat-content-action-bar+img {
    margin-top: -25.7px !important;
  }

  .chat-content-action-bar+div.tz-cash-msg-first {
    margin-top: -30px !important;
  }
}

.chat-content:hover {
  .chat-content-action-bar {
    opacity: 1;
  }
}

.chat-content-image-full-screen {
  max-width: 80vw;
  max-height: calc(100vh - 120px);
}

.chat-content-image {
  max-width: 220px;
  cursor: pointer;
}

.message-to-reply+.chat-content-image {
  margin-top: 2px !important;
}

.message-sender-name {
  margin-top: -20px;
  margin-bottom: 8px;
  font-style: normal;
  font-weight: 500;
  text-decoration: underline;
}

.plyr__controls {
  padding: 0 !important;

  .plyr__controls__item.plyr__control[data-plyr=play]:hover {
    background-color: purple !important;
  }
}

.chat:not(.chat-left) .plyr__controls {
  background: linear-gradient(80deg, #e44f25, #e6af0d);

  .plyr__controls__item .plyr__progress {
    input[type=range]::-webkit-slider-thumb {
      background: #ccc !important;
    }

    input[type=range]::-moz-range-thumb {
      background: #ccc !important;
    }

    input[type=range]::-ms-thumb {
      background: #ccc !important;
    }
  }
}

.plyr__progress {
  input[type=range] {
    border-bottom-color: purple !important;
    border-left-color: purple !important;
    border-right-color: purple !important;
    border-top-color: purple !important;
    color: purple !important;
    -webkit-tap-highlight-color: purple !important;
  }
}

.plyr__control[data-plyr=settings] {
  display: none !important;
}

.plyr__controls__item.plyr__volume {
  display: none !important;

  button[data-plyr=mute]:hover {
    background-color: purple !important;
  }

  input[type=range] {
    border-bottom-color: purple !important;
    border-left-color: purple !important;
    border-right-color: purple !important;
    border-top-color: purple !important;
    color: purple !important;
  }
}

#img-full-screen-modal___BV_modal_content_ {
  background: transparent !important;
  box-shadow: none;
}

#img-full-screen-modal___BV_modal_body_ {
  padding: 0 !important;
}
</style>

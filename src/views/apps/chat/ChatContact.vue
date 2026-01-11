<template>
  <component
    :is="tag"
    v-on="$listeners"
  >
    <b-avatar
      size="42"
      :src="conversation.avatar"
      :badge="isChatContact"
      class="badge-minimal"
      :class="{defaultBadge: !conversation.avatar}"
      :badge-variant="resolveAvatarBadgeVariant(conversation.status)"
      variant="transparent"
    />
    <div class="chat-info flex-grow-1">
      <h5 class="mb-0">
        {{ conversation._ui.fullName }}
      </h5>
      <p class="card-text text-truncate" v-if="conversation.lastMessage">
        {{ isChatContact ? getChatDisplay(conversation.lastMessage.msgType, conversation.lastMessage.message) : conversation.about }}
      </p>
      <p class="card-text text-truncate text-italic" style="color: #CCC" v-else>
        Message deleted
      </p>
    </div>
    <div
      v-if="isChatContact"
      class="chat-meta text-nowrap"
    >
      <small class="float-right mb-25 chat-time">{{ formatDateToMonthShort(conversation.lastMessage.createdAt, { hour: 'numeric', minute: 'numeric' }) }}</small>
      <b-badge
        v-if="conversation.unseenMsgs"
        pill
        variant="primary"
        class="float-right font-small-1"
      >
        {{ conversation.unseenMsgs || 0 }}
      </b-badge>
    </div>
  </component>
</template>

<script>
import { BAvatar, BBadge } from 'bootstrap-vue'
import { formatDateToMonthShort } from '@core/utils/filter'
import utils from '@/utils/index';
import useChat from './useChat'


export default {
  components: {
    BAvatar,
    BBadge,
  },
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    conversation: {
      type: Object,
      required: true,
    },
    isChatContact: {
      type: Boolean,
      dedfault: false,
    },
  },
  setup() {
    const messageTypes = utils.messageTypes;
    const { resolveAvatarBadgeVariant } = useChat()

    const getChatDisplay = function(type, message) {
      switch (type) {
        case messageTypes.AUDIO:
            return "[Audio]";
        case messageTypes.IMAGE:
            return "[Photo]";
        case messageTypes.VIDEO:
            return "[Video]";
        case messageTypes.CASH:
            return "[Cash]";
        default:
          return message?.textContent;
      }
    }

    return { formatDateToMonthShort, resolveAvatarBadgeVariant, getChatDisplay }
  },
}
</script>

<style>

</style>

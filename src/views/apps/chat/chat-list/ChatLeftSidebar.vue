<template>
  <div class="sidebar-left h-100">
    <div class="sidebar">
      <!-- Logged In User Profile Sidebar -->
      <!-- <user-profile-sidebar
        :shall-show-user-profile-sidebar="shallShowUserProfileSidebar"
        :profile-user-data="profileUserData"
        @close-sidebar="$emit('update:shall-show-user-profile-sidebar', false)"
      /> -->

      <!-- Sidebar Content -->
      <div class="sidebar-content" :class="{'show': mqShallShowLeftSidebar}">
        <!-- Header -->
        <div class="chat-fixed-search">
          <div class="d-flex align-items-center w-100">
            <div class="sidebar-profile-toggle">
              <b-avatar
                size="42"
                :class="{ defaultBadge: !profileUserMinimalData.avatar }"
                class="cursor-pointer badge-minimal avatar-border-2"
                :src="profileUserMinimalData.avatar"
                variant="transparent"
                badge
                badge-variant="success"
              />
            </div>
            <!-- Search -->
            <b-input-group class="input-group-merge ml-1 w-100 round">
              <b-input-group-prepend is-text>
                <feather-icon icon="SearchIcon" class="text-muted" />
              </b-input-group-prepend>
              <b-form-input
                ref="searchQuery"
                placeholder="Search..."
                @keyup="filterChatsFn"
              />
            </b-input-group>
          </div>
        </div>

        <!-- ScrollArea: Chat & Contacts -->
        <vue-perfect-scrollbar
          :settings="perfectScrollbarSettings"
          @ps-y-reach-end="conversationListReachedEnd"
          class="chat-user-list-wrapper list-group scroll-area"
        >
          <!-- Chats Title -->
          <h4 class="chat-list-title"> Chats </h4>

          <!-- Chats -->
          <ul class="chat-users-list chat-list media-list">
            <chat-contact
              v-for="conversation in filteredConversations"
              :key="conversation.id"
              :conversation="conversation"
              tag="li"
              :class="{ active: activeConversationId === conversation._id }"
              is-chat-contact
              @click="$emit('open-chat', conversation)"
            />
          </ul>
        </vue-perfect-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BAvatar,
  BInputGroup,
  BInputGroupPrepend,
  BFormInput,
} from "bootstrap-vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { computed, ref } from "@vue/composition-api";
import ChatContact from "../ChatContact.vue";
import UserProfileSidebar from "../UserProfileSidebar.vue";

export default {
  components: {
    // BSV
    BAvatar,
    BInputGroup,
    BInputGroupPrepend,
    BFormInput,

    // 3rd party
    VuePerfectScrollbar,

    // SFC
    ChatContact,
    UserProfileSidebar,
  },
  props: {
    conversations: {
      type: Array,
      required: true,
    },
    profileUserMinimalData: {
      type: Object,
      required: true,
    },
    activeConversationId: {
      type: String,
      default: null,
    },
    mqShallShowLeftSidebar: {
      type: Boolean,
      required: true,
    }
  },
  setup(props, context) {
    const perfectScrollbarSettings = {
      maxScrollbarLength: 150,
    };

    // Search Query
    const searchQuery = ref(null);

    const filterChatsFn = event => {
      if (event.which === 13 || event.code == "Enter") {
        context.emit("filter-chats", { search: searchQuery.value?.value });
      }
    };

    //TODO: #006 Optimize date sort.
    const filteredConversations = computed(() => props.conversations.filter(x => x._ui).sort((a, b) => new Date(b) - new Date(a)));

    const conversationListReachedEnd = () => {
      context.emit('LOAD_PREVIOUS_CONVERSATIONS');
    };

    return {
      // Conversations
      filteredConversations,

      // Search Query
      searchQuery,
      filterChatsFn,

      // UI
      perfectScrollbarSettings,
      conversationListReachedEnd
    };
  },
};
</script>

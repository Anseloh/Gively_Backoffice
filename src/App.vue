<template>
  <div
    id="app"
    class="h-100"
    :class="[skinClasses]"
  >
    <component :is="layout">
      <router-view />
    </component>

    <scroll-to-top v-if="enableScrollToTop" />

    <!-- Global modal -->
    <b-modal v-show="showLoader" size="md" id="tz-app-loader" centered hide-footer hide-header no-close-on-backdrop>
      <div class="d-flex flex-row justify-content-center align-items-center">
        <span class="text-primary">
          <loader-icon size="3x" class="spinner"></loader-icon>
        </span>
      </div>
    </b-modal>

  </div>
</template>

<script>
import ScrollToTop from '@core/components/scroll-to-top/ScrollToTop.vue'
import { BModal } from 'bootstrap-vue';
import { LoaderIcon } from "vue-feather-icons";

// This will be populated in `beforeCreate` hook
import { $themeColors, $themeBreakpoints, $themeConfig } from '@themeConfig';
import { provideToast } from 'vue-toastification/composition';
import { watch, ref } from '@vue/composition-api';
import useAppConfig from '@core/app-config/useAppConfig';
import commonApi from "@/services/api";
import { useWindowSize, useCssVar, useWebSocket } from '@vueuse/core';
import io from "socket.io-client";

import store from '@/store'
import chatModuleStore from '@/views/apps/chat/chat.module.store';
import utils from "@/utils";
import constants from "@/services/constants";
import eventBus from "@/services/event-bus";

const LayoutVertical = () => import('@/layouts/vertical/LayoutVertical.vue')
const LayoutHorizontal = () => import('@/layouts/horizontal/LayoutHorizontal.vue')
const LayoutFull = () => import('@/layouts/full/LayoutFull.vue')

export default {
  components: {
    // BV Components
    BModal,

    LoaderIcon,

    // Layouts
    LayoutHorizontal,
    LayoutVertical,
    LayoutFull,

    ScrollToTop,
  },
  data() {
    return {
      showLoader: false,
      isLoaderVisible: false
    };
  },
  // ! We can move this computed: layout & contentLayoutType once we get to use Vue 3
  // Currently, router.currentRoute is not reactive and doesn't trigger any change
  computed: {
    layout() {
      if (this.$route.meta.layout === 'full') return 'layout-full'
      return `layout-${this.contentLayoutType}`
    },
    contentLayoutType() {
      return this.$store.state.appConfig.layout.type
    },
  },
  beforeCreate() {
    // Set colors in theme
    const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = colors.length; i < len; i++) {
      $themeColors[colors[i]] = useCssVar(`--${colors[i]}`, document.documentElement).value.trim()
    }

    // Set Theme Breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl']

    // eslint-disable-next-line no-plusplus
    for (let i = 0, len = breakpoints.length; i < len; i++) {
      $themeBreakpoints[breakpoints[i]] = Number(useCssVar(`--breakpoint-${breakpoints[i]}`, document.documentElement).value.slice(0, -2))
    }

    // Set RTL
    const { isRTL } = $themeConfig.layout
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  },
  created() {
   this.initSocket();

   eventBus.$on('REQUEST_PENDING_INVOKE_LOADER', this.toggleLoader);
  },
  
  beforeUnmount() {
    // eslint-disable-next-line no-unused-expressions
    this.socketio?.disconnect();
  },
  mounted() {},
  methods: {
    initSocket() {
      setTimeout(() => {
        try {
          const socket =  io(process.env.NODE_ENV != 'production' ? `https://staging-im.givelycf.com`: `https://im.givelycf.com`, { transports: ["websocket", "polling"] });
          socket.connect()
          const user = utils.localStorage.get('userData');

          socket.on('connect', async () => {
            this.socketio = socket;
            console.log(this.socketio);

            if(!this.socketio) return;

            this.socketio.emit('identify', {
              socketId: this.socketio.id,
              orgId: user?.orgId
            });

            const conversations =
              await chatModuleStore.actions.filterConversations(
                {},
                { hideLoadingSpinner: true }
              );

            conversations.forEach(c => {
              const otherUsers = c.users.filter(x => x.orgId != user?.orgId);

              this.socketio.emit('subscribe', {
                "room": c._id,
                "otherUserOrgId": otherUsers.map(x => x.orgId),
                "orgId": user?.orgId
              }, () => console.log('SUBSCRIBED'));
            });

            this.socketio.on('new_message', data => {
              console.log('new_message', data);
              eventBus.$emit(constants.events.NEW_MESSAGE, data);
            });

            eventBus.$on('SUBSCRIBE_NEW_CONVERSATION', conversation => {
               const otherUsers = conversation.users.filter(x => x.orgId != user?.orgId);

              this.socketio.emit('subscribe', {
                "room": conversation._id,
                "otherUserOrgId": otherUsers.map(x => x.orgId),
                "orgId": user?.orgId
              }, () => console.log('SUBSCRIBED'));
            });

          });

        } catch (err) {
          console.log(err);
        }
      }, 10000);
    },
    toggleLoader(show) {
      if(show) {
        /**
         * Prevent displaying multiple modals.
         */
        if(this.isLoaderVisible) return;
        /**
         * Display loader.
         */
        this.$bvModal.show('tz-app-loader');
        /**
         * Toggle view params;
         */
        this.isLoaderVisible = true;
        this.showLoader = true;
      } else {
        /**
         * Stop execution if loader is visible.
         */
        if(!this.isLoaderVisible) return;
        /**
         * Hide loader.
         */
        this.$bvModal.hide('tz-app-loader');
        /**
         * Toggle view params;
         */
        this.isLoaderVisible = false;
        this.showLoader = false;
      }
    }
  },
  setup() {
    const socketio = ref(null);
    const { skin, skinClasses } = useAppConfig()
    const { enableScrollToTop } = $themeConfig.layout

    // If skin is dark when initialized => Add class to body
    if (skin.value === 'dark') document.body.classList.add('dark-layout')

    // Provide toast for Composition API usage
    // This for those apps/components which uses composition API
    // Demos will still use Options API for ease
    provideToast({
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      icon: false,
      timeout: 3000,
      transition: 'Vue-Toastification__fade',
    })

    // Set Window Width in store
    store.commit('app/UPDATE_WINDOW_WIDTH', window.innerWidth)
    const { width: windowWidth } = useWindowSize()
    watch(windowWidth, val => {
      store.commit('app/UPDATE_WINDOW_WIDTH', val)
    })

    // file access token;
    // commonApi.setDynamicToken();

    return {
      skinClasses,
      socketio,
      enableScrollToTop,
    }
  },
}
</script>
<style lang="scss">
  #tz-app-loader * {
    background: transparent;
    box-shadow: none;
  }
  #tz-app-loader+.modal-backdrop {
    background: rgba(0, 0, 0, .3) !important;
  }
</style>

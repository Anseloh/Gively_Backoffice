import constants from "@/services/constants";
import eventBus from "@/services/event-bus";
import utils from "@/utils";
import { Ref, ref } from "@vue/composition-api";

/**
 * 
 * @param {Ref<Number>} newMessageType 
 * @param {Ref<Boolean>} shallDisplayMessageTypePicker 
 * @returns 
 */
export default function useMessagingAudio(
  newMessageType,
  shallDisplayMessageTypePicker
) {
  /**
   * Recoder object to get what the user is saying.
   * 
   * @type MediaRecorder
   */
  let audioRecorder = null;
  /**
   * Raw data parts collected from {@link audioRecorder}.
   * 
   * @type Array<Blob>
   */
  let collectedAudioChunks = [];
  /**
   * Final audio data recorded.
   * 
   * @type Blob
   */
  let recordedAudioBlob = null;
  /**
   * FLAG. Indicates whether the recorder is currently active.
   * 
   * @type Ref<Boolean>
   */
  const isRecording = ref(false);
  /**
   * 
   * @type Ref<Number>
   */
  const audioElapsedTime = ref(0);
  /**
   * @type Number|null
   */
  let currentIntervalId = null;
  /**
   * Reference to the HTML elment preview
   * 
   * @type Ref<HTMLElement>
   */
  const tzRecorderPreView = ref(null);
  /**
   * Record infos.
   * 
   * @type Ref<{ audioUrl: String; fileSize: Number; mediaDuration: Number; data: Blob  }>
   */
  const recordedAudioInfos = ref({});
  /**
   * FLAG. Tells whether the recording was cancelled by the user or not.
   */
  let userHasManuallyStopedTheRecord = false;

  /**
   * 
   * @param {*} message 
   * @returns 
   */
  const getAudioPlayerOptions = message => {
    const options = {
      controls: ['play', 'progress', 'duration'],
      displayDuration: true,
      listeners: {
        play: message.isOwned ? null : () => eventBus.$emit('AUDIO_STARTED_PLAYING', message)
      }
    }

    return options;
  };

  /**
   * Attemps to connect to the user's browser audio stream, and 
   * create an instance of MediaRecorder binded on that stream.
   * 
   * Internally check and ask for user permission to access microphone.
   * 
   * @returns An instance of `MediaRecorder` or `null` if permission denied.
   */
  const createMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      window.localStream = stream;

      return new MediaRecorder(stream, { mimeType: 'audio/webm' });
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  /**
   * Set correct definitive values for {@link recordedAudioInfos}.
   * 
   * @param {String} url 
   */
  const prepareRecordedAudioProps = url => {
    const audio =
      tzRecorderPreView?.value ?
        tzRecorderPreView.value :
        new HTMLAudioElement();

    audio.addEventListener('loadedmetadata', () => {
      /**
       * Handle chrome bug. 
       * 
       * On Chrome, duration is always set to Infinity. 
       */
      if (audio.duration == Infinity) {
        audio.currentTime = 1e101;
        audio.ontimeupdate = function () {
          this.ontimeupdate = () => {
            console.log('CHROME DURATION BUG HANDLED');
            // eslint-disable-next-line no-useless-return
            return;
          };
          recordedAudioInfos.value = {
            audioUrl: url,
            fileSize: recordedAudioBlob.size,
            mediaDuration: Math.ceil(Math.round(audio.duration)),
            data: recordedAudioBlob
          };
          eventBus.$emit('AUDIO_RECORD_FINISHED');
        };
      } else {
        recordedAudioInfos.value = {
          audioUrl: url,
          fileSize: recordedAudioBlob.size,
          mediaDuration: Math.ceil(Math.round(audio.duration)),
          data: recordedAudioBlob
        };
        eventBus.$emit('AUDIO_RECORD_FINISHED');
      }
    });

    audio.src = url;
  };

  /**
   * Handle `stop` event triggered on {@link audioRecorder}
   * @param {Event} event 
   */
  const onStopRecordAudioTriggered = event => {
    if (userHasManuallyStopedTheRecord) {
      eventBus.$emit('AUDIO_MESSAGE_SENT');
      return;
    }

    /**
     * Create the final audio data from the collected chunks
     */
    recordedAudioBlob = new Blob(collectedAudioChunks, { type: 'audio/mp3' });
    /**
     * Create temp URL
     */
    const url = URL.createObjectURL(recordedAudioBlob);
    /**
     * Update record result infos.
     */
    prepareRecordedAudioProps(url);
  };

  const resetAudio = () => {
    userHasManuallyStopedTheRecord = false;
    recordedAudioInfos.value = {};

    currentIntervalId = null;

    audioRecorder = null;
    collectedAudioChunks = [];
    recordedAudioBlob = null;
    isRecording.value = false;
    audioElapsedTime.value = 0;

    newMessageType.value = utils.messageTypes.TEXT;

    if (tzRecorderPreView && tzRecorderPreView.value) {
      tzRecorderPreView.value.src = null;

      /**
       * Disabling all events on node.
       */
      const newNode = tzRecorderPreView.value.cloneNode(true);
      tzRecorderPreView.value.parentNode.replaceChild(newNode, tzRecorderPreView.value);

      tzRecorderPreView.value = newNode;
    }
  };

  /**
   * Start the recording proccess.
   * 
   * @returns void
   */
  const startRecording = async () => {
    audioRecorder = await createMediaRecorder();

    if (!audioRecorder) {
      utils.showErrorToast(eventBus, 'Unable to start the recorder. Please check permissions');
      return;
    }

    /**
     * Attach handler to significant events
     */
    audioRecorder.addEventListener('dataavailable', event => {
      collectedAudioChunks.push(event.data);
    });

    audioRecorder.addEventListener('stop', onStopRecordAudioTriggered);

    /**
     * Start recording.
     */
    audioRecorder.start();

    /**
     * Set current message type to {@link utils.messageTypes.AUDIO}
     */
    newMessageType.value = utils.messageTypes.AUDIO;

    /**
     * Set time counter. Usefull for view purpose only.
     */
    currentIntervalId = setInterval(() => {
      audioElapsedTime.value += 1;
    }, 950);

    /**
     * Tell the view record has started.
     */
    isRecording.value = true;

    /**
     * Hide message type picker
     */
    if (shallDisplayMessageTypePicker) shallDisplayMessageTypePicker.value = false;
  };

  /**
   * Stops the recorder and fill the `audioTempUrl` with a valid path to read the audio.
   */
  const stopRecording = userStopedIt => {

    if (!audioRecorder || audioRecorder.state == 'inactive') return;
    userHasManuallyStopedTheRecord = userStopedIt;
    audioRecorder.stop();

    clearInterval(currentIntervalId);
  }

  eventBus.$on('AUDIO_MESSAGE_SENT', resetAudio)

  return {
    /**
     * Start the recording proccess.
     */
    startRecording,
    /**
     * Stops the recorder and fill the `audioTempUrl` with a valid path to read the audio.
     */
    stopRecording,
    /**
     * FLAG. Indicates whether the recorder is currently active.
     * 
     * @type Ref<Boolean>
     */
    isRecording,
    /**
     * 
     */
    audioElapsedTime,
    /**
     * 
     */
    tzRecorderPreView,
    /**
     * Record infos.
     * 
     * @type Ref<{ audioUrl: String; fileSize: Number; mediaDuration: Number;  }>
     */
    recordedAudioInfos,
    /**
     * 
     */
    getAudioPlayerOptions
  }
}
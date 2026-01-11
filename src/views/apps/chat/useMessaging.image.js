import { ref, Ref } from "@vue/composition-api";
import utils from "@/utils";
import eventBus from "@/services/event-bus";

/**
 * 
 * @param {Ref<Number>} newMessageType 
 * @param {Ref<boolean>} shallDisplayMessageTypePicker 
 */
export default function useMessagingImages(
  newMessageType,
  shallDisplayMessageTypePicker
) {
  /**
   * List of images selected by the user.
   */
  const selectedImagesToSend = ref([]);

  /**
   * `Handler`
   * 
   * Process image file when loaded.
   * @param {Event} event
   */
  const onImagesSelected = event => {
    /**
     * Get files
     */
    const files = [...(event.target.files)];
    /**
     * Ensure at list one image 
     */
    if (files.length <= 0) {
      utils.showErrorToast(eventBus, 'No image selected.');
      return;
    }
    /**
     * Ensure all selected files are images.
     */
    const notOnlyImages = files.reduce((r, c) => r && (c.type.indexOf('image') < 0), true);
    if (notOnlyImages) {
      utils.showErrorToast(eventBus, 'Not only images choosen.');
      return;
    }
    /**
     * Load each file and build image data.
     */
    files.forEach(file => {
      const fileReader = new FileReader();

      fileReader.addEventListener('load', () => {
        const img = new Image();

        img.onload = evt => {
          selectedImagesToSend.value.push({
            imageUrl: fileReader.result,
            msgType: utils.messageTypes.IMAGE,
            fileSize: file.size,
            height: img.height,
            width: img.width,
            originalData: file
          });
        };
        img.src = fileReader.result;
      });

      fileReader.readAsDataURL(file);
    });
    /**
     * Set current message type.
     */
    newMessageType.value = utils.messageTypes.IMAGE;
    /**
     * Hide picker
     */
    shallDisplayMessageTypePicker.value = false;
  };
  /**
   * Removes the selected image from the selected ones.
   */
  const removeSelectedImage = (image, idx) => {
    /**
     * Remove item
     */
    selectedImagesToSend.value.splice(idx, 1);
    /**
     * If no more selected image, display text input
     */
    if (selectedImagesToSend.value.length == 0) {
      newMessageType.value = utils.messageTypes.TEXT;
    }
  };

  const resetImages = () => {
    selectedImagesToSend.value = [];
    newMessageType.value = utils.messageTypes.TEXT;
  }

  eventBus.$on('IMAGE_MESSAGES_SENT', resetImages);

  return {
    selectedImagesToSend,
    onImagesSelected,
    removeSelectedImage
  }

}
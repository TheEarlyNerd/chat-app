import { Helper } from 'react-native-maestro';
import ImagePicker from 'react-native-image-crop-picker';
import { CameraIcon, ImageIcon } from '../../components/icons';

export default class AttachmentsHelper extends Helper {
  static get instanceKey() {
    return 'attachmentsHelper';
  }

  async selectMedia({ sources, onMediaSelected, imagePickerOptions }) {
    const { interfaceHelper } = this.maestro.helpers;
    const actions = [];
    const selectMedia = async source => {
      try {
        const result = (source === 'camera')
          ? await ImagePicker.openCamera(imagePickerOptions)
          : await ImagePicker.openPicker(imagePickerOptions);

        onMediaSelected(result);
      } catch { /* noop */ }
    };

    if (sources.includes('camera')) {
      actions.push({
        iconComponent: CameraIcon,
        text: 'Open Camera',
        onPress: () => selectMedia('camera'),
      });
    }

    if (sources.includes('library')) {
      actions.push({
        iconComponent: ImageIcon,
        text: 'Open Photo Library',
        onPress: () => selectMedia('library'),
      });
    }

    interfaceHelper.showOverlay({
      name: 'ActionSheet',
      data: { actions },
    });
  }

  async uploadAttachment(uri) {
    const { apiHelper } = this.maestro.helpers;
    const response = await apiHelper.uploadFiles({
      method: 'PUT',
      path: '/attachments',
      files: [
        {
          uri,
          name: 'file',
        },
      ],
    });

    if (response.code !== 200) {
      throw new Error(response.body);
    }

    return response.body;
  }
}

import { Helper } from 'react-native-maestro';

export default class AttachmentsHelper extends Helper {
  static get instanceKey() {
    return 'attachmentsHelper';
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

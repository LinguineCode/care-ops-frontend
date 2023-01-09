import Store from 'backbone.store';
import BaseCollection from 'js/base/collection';
import BaseModel from 'js/base/model';

const TYPE = 'files';

function selectFile(contentType) {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = contentType;

    input.onchange = () => {
      const files = Array.from(input.files);
      resolve(files[0]);
    };

    input.click();
  });
}

const _Model = BaseModel.extend({
  defaults: {
    path: '',
  },
  type: TYPE,
  urlRoot() {
    if (this.isNew()) {
      const actionId = this.get('_action');

      return `/api/actions/${ actionId }/relationships/files?urls=upload`;
    }
    return '/api/files';
  },
  fetchFile() {
    return this.fetch({ data: { urls: ['view', 'download'] } });
  },
  createUpload(fileName) {
    const path = `patient/${ this.get('_patient') }/${ fileName }`;
    return this.save({ path });
  },
  upload() {
    selectFile('.pdf').then(file => {
      this.createUpload(file.name).then(() => {
        const uploadUrl = this.get('_upload');

        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status !== 200) {
              // alert('UPLOAD FAILED');
              this.destroy();

              return;
            }
            this.set({ _progress: 100 });
            this.fetchFile();
          }
        };

        xhr.upload.onprogress = e => {
          if (e.lengthComputable) {
            this.set({ _progress: (e.loaded / file.size) * 100 });
          }
        };

        xhr.open('PUT', uploadUrl);
        xhr.send(file);
      });
    });
  },
  getFilename() {
    return this.get('path').split('/').pop();
  },
});

const Model = Store(_Model, TYPE);
const Collection = BaseCollection.extend({
  model: Model,
});

export {
  _Model,
  Model,
  Collection,
};

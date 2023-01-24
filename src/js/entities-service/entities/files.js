import { get, first } from 'underscore';
import Store from 'backbone.store';
import BaseCollection from 'js/base/collection';
import BaseModel from 'js/base/model';

const TYPE = 'files';

// Adds `-copy` to the filename before the extension
function dedupeFile(fileName) {
  const extIndex = fileName.lastIndexOf('.');
  return `${ fileName.slice(0, extIndex) }-copy${ fileName.slice(extIndex) }`;
}

const _Model = BaseModel.extend({
  defaults: {
    path: '',
    _progress: 0,
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
    return this.fetch({
      url: `${ this.url() }?urls=download,view`,
    });
  },
  createUpload(fileName) {
    const path = `patient/${ this.get('_patient') }/${ fileName }`;
    const promise = this.save({ path, _progress: 0 }, {}, { type: 'PUT' });

    return promise.catch((/* istanbul ignore next */{ responseData } = {}) => {
      const error = get(first(responseData.errors), 'detail', '');

      /* istanbul ignore else */
      if (error.includes('Another file exists')) {
        return this.createUpload(dedupeFile(fileName));
      }

      /* istanbul ignore next */
      throw responseData;
    });
  },
  upload(file) {
    this.createUpload(file.name)
      .then(() => this.putFile(file))
      .then(() => this.fetchFile())
      .catch(() => {
        this.trigger('upload:failed');
        this.destroy();
      });
  },
  putFile(file) {
    const fileSize = file.size;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) {
          reject();

          return;
        }
        this.set({ _progress: 100 });
        resolve();
      };

      xhr.upload.onprogress = e => {
        /* istanbul ignore if */
        if (!e.lengthComputable) return;
        this.set({ _progress: Math.round((e.loaded / fileSize) * 100) });
      };

      xhr.open('PUT', this.get('_upload'));
      xhr.send(file);
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

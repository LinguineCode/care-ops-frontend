import { isObject } from 'underscore';
import Backbone from 'backbone';
import { MnObject } from 'marionette';
import { cacheIncluded } from './jsonapi-mixin';
import fetcher from 'js/base/fetch';

export default MnObject.extend({
  channelName: 'entities',

  Entity: Backbone,

  constructor: function(options) {
    this.mergeOptions(options, ['Entity']);

    MnObject.apply(this, arguments);
  },
  getCollection(models, options = {}) {
    return new this.Entity.Collection(models, options);
  },
  getModel(attrs, options) {
    if (attrs && !isObject(attrs)) attrs = { id: attrs };
    return new this.Entity.Model(attrs, options);
  },
  fetchCollection(options) {
    const collection = new this.Entity.Collection();

    return collection.fetch(options);
  },
  fetchModel(modelId, options) {
    const model = new this.Entity.Model({ id: modelId });

    return model.fetch(options);
  },
  async fetchBy(url) {
    const response = await fetcher(url);

    if (!response.ok) return Promise.reject(response);

    const { included, data } = await response.json();

    cacheIncluded(included);

    const model = new this.Entity.Model({ id: data.id });
    model.set(model.parseModel(data));

    return Promise.resolve(model);
  },
});


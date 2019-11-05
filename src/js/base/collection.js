import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';

import { getActiveXhr, registerXhr } from './control';
import JsonApiMixin from './jsonapi-mixin';

export default Backbone.Collection.extend(_.extend({
  fetch(options) {
    const baseUrl = _.result(this, 'url');
    let xhr = getActiveXhr(baseUrl, options);

    /* istanbul ignore if */
    if (!xhr) {
      xhr = Backbone.Collection.prototype.fetch.call(this, options);

      registerXhr(baseUrl, xhr);
    }

    // On success resolves the entity instead of the jqxhr success
    const d = $.Deferred();

    $.when(xhr)
      .fail(_.bind(d.reject, d))
      .done(_.bind(d.resolve, d, this));

    return d;
  },
  parse(response) {
    /* istanbul ignore if */
    if (!response || !response.data) return response;

    this.cacheIncluded(response.included);

    return _.map(response.data, this.parseModel, this);
  },
}, JsonApiMixin));

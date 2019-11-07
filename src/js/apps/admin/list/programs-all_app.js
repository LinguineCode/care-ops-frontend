import Radio from 'backbone.radio';

import App from 'js/base/app';
import { ListView, LayoutView } from 'js/views/admin/list/programs-all_views';

export default App.extend({
  viewTriggers: {
    'click:add': 'click:add',
  },
  onBeforeStart() {
    this.showView(new LayoutView());
    this.getRegion('list').startPreloader();
  },
  beforeStart() {
    return Radio.request('entities', 'fetch:programs:collection');
  },
  onStart(options, collection) {
    this.programs = collection;
    this.showChildView('list', new ListView({ collection }));
  },
  onClickAdd() {
    const program = Radio.request('entities', 'programs:model', {});
    const sidebar = Radio.request('sidebar', 'start', 'program', { program });

    this.listenTo(sidebar, 'stop', () => {
      if (!program.isNew()) this.programs.add(program);
    });
  },
});

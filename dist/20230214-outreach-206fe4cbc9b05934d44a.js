/*! For license information please see 20230214-outreach-206fe4cbc9b05934d44a.js.LICENSE.txt */
(self.webpackChunkcare_ops_frontend=self.webpackChunkcare_ops_frontend||[]).push([[585],{2909:(t,e,n)=>{"use strict";n.d(e,{Z:()=>h});var i=n(7198),r=n(8088),s=n.n(r),o=n(7739),a=n.n(o),l=n(4737),u=n.n(l),c=n(8895);const h=c.Z.extend({routerAppName:"",constructor:function(){this.initRouter(),this.listenTo(this.router,"noMatch",this.onNoMatch),this.on("before:stop",this.stopCurrent),c.Z.apply(this,arguments)},initRouter(){this._routes=(0,i.result)(this,"eventRoutes");const t=this.getRouteTriggers();this.router=new(u())({routeTriggers:t}),this.bindRouteEvents()},onNoMatch(){this.stop(),this._currentRoute=null},getRouteTriggers(){return(0,i.reduce)(this._routes,(function(t,e,n){let{route:i}=e;return t[n]=i,t}),{})},getEventActions:(t,e)=>(0,i.reduce)(t,(function(t,n,r){let{action:s}=n;return t[r]=(0,i.partial)(e,r,s),t}),{}),bindRouteEvents(){const t=this.getEventActions(this._routes,this.routeAction);this.listenTo(this.router.getChannel(),t)},routeAction(t,e){this.isRunning()||this.start();for(var n=arguments.length,r=new Array(n>2?n-2:0),o=2;o<n;o++)r[o-2]=arguments[o];this.triggerMethod("before:appRoute",t,...r),a().request("sidebar","close"),a().request("nav","select",this.routerAppName,t,r),this.setLatestList(t,r),this._currentRoute={event:t,eventArgs:r},(0,i.isFunction)(e)||(e=this[e]),e.apply(this,r),s().history.trigger("current",t,...r),this.triggerMethod("appRoute",t,...r)},setLatestList(t,e){this._routes[t].isList?a().request("history","set:latestList",t,e):this._routes[t].clearLatestList&&a().request("history","set:latestList",!1)},startCurrent(t,e){this.stopCurrent(),this._currentAppName=t,this._currentAppOptions=e,e=(0,i.extend)({currentRoute:this._currentRoute},e);const n=this.startChildApp(t,e);return this._current=n,n},startRoute(t,e){return this.isCurrent(t,e)?this.getCurrent().startRoute(this.getCurrentRoute()):this.startCurrent(t,e)},getCurrent(){return this._current},isCurrent(t,e){return t===this._currentAppName&&(0,i.isEqual)(e,this._currentAppOptions)},getCurrentRoute(){return this._currentRoute},stopCurrent(){this._current&&(this._current.stop(),this._current=null,this._currentAppName=null,this._currentAppOptions=null)},translateEvent(t){const e=this.router.getDefaultRoute(t);return this.router.translateRoute(e,(0,i.rest)(arguments))},replaceRoute(){const t=this.translateEvent.apply(this,arguments);s().history.navigate(t,{trigger:!1,replace:!0})},navigateRoute(){const t=this.translateEvent.apply(this,arguments);s().history.navigate(t,{trigger:!1})}})},7885:(t,e,n)=>{"use strict";n.d(e,{Z:()=>l});var i=n(5291),r=n.n(i),s=n(7198),o=n(7739),a=n.n(o);const l=n(6718).Behavior.extend({ui:{iframe:"iframe"},onInitialize(){this.channel=a().channel(`form${this.view.model.id}`)},replies:{send(t){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.ui.iframe[0].contentWindow.postMessage({message:t,args:e},window.origin)},focus(){a().trigger("user-activity","iframe:focus",this.ui.iframe[0])}},onAttach(){this.channel.reply(this.replies,this),r()(window).on("message",(t=>{let{originalEvent:e}=t;const{data:n,origin:i}=e;i===window.origin&&n&&n.message&&this.channel.request(n.message,n.args)}))},onBeforeDetach(){r()(window).off("message"),this.channel.stopReplying((0,s.keys)(this.replies).join(" "))}})},8665:(t,e,n)=>{"use strict";n.r(e),n.d(e,{startOutreachApp:()=>D});var i=n(5291),r=n.n(i),s=(n(9306),n(7198)),o=n(8088),a=n.n(o),l=n(7739),u=n.n(l),c=n(2083),h=(n(4615),n(2814)),d=n(5710),p=(n(8380),n(2909)),m=n(8895),g=n(9230),f=n.n(g),v=n(6718),_=n(7885),w=n(2182);const b=v.View.extend({template:f().template({compiler:[8,">= 4.3.0"],main:function(t,e,n,i,r){var s,o=null!=e?e:t.nullContext||{},a=t.hooks.helperMissing,l=t.escapeExpression,u=t.lookupProperty||function(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]};return'\n    <div><h1 class="site-title">'+l("function"==typeof(s=null!=(s=u(n,"name")||(null!=e?u(e,"name"):e))?s:a)?s.call(o,{name:"name",hash:{},data:r,loc:{start:{line:2,column:32},end:{line:2,column:42}}}):s)+'</h1></div>\n    <div class="dialog" data-content-region>\n      <div class="dialog__icon--success">'+l((u(n,"fas")||e&&u(e,"fas")||a).call(o,"circle-check",{name:"fas",hash:{},data:r,loc:{start:{line:4,column:41},end:{line:4,column:63}}}))+"</div>\n      <div>You’ve submitted the form. Nice job.</div>\n    </div>\n  "},useData:!0}),templateContext:()=>({name:w.yQ.name}),regions:{content:"[data-content-region]"}}),y=v.View.extend({behaviors:[_.Z],regions:{formAction:"[data-action-region]"},template:f().template({compiler:[8,">= 4.3.0"],main:function(t,e,n,i,r){var s,o=t.lookupProperty||function(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]};return'\n  <div class="form__header">\n    <div class="form__title">'+t.escapeExpression("function"==typeof(s=null!=(s=o(n,"name")||(null!=e?o(e,"name"):e))?s:t.hooks.helperMissing)?s.call(null!=e?e:t.nullContext||{},{name:"name",hash:{},data:r,loc:{start:{line:3,column:29},end:{line:3,column:39}}}):s)+'</div>\n    <div data-action-region></div>\n  </div>\n  <div class="form__content">\n    <iframe src="/formapp/"></iframe>\n  </div>\n  '},useData:!0})}),R=v.View.extend({isDisabled:!1,tagName:"button",className:"button--green",attributes(){return{disabled:this.getOption("isDisabled")}},template:f().template({compiler:[8,">= 4.3.0"],main:function(t,e,n,i,r){return"Save"},useData:!0}),triggers:{click:"click"},onClick(){this.$el.prop("disabled",!0)}}),k=v.View.extend({ui:{date:".js-date",submit:".js-submit"},triggers:{"change @ui.date":"change:date","blur @ui.date":"blur:date","click @ui.submit":"click:submit"},modelEvents:{"change:hasError":"render"},template:f().template({1:function(t,e,n,i,r){return" has-error"},3:function(t,e,n,i,r){return'<div class="dialog__error">That date of birth does not match our records. Please try again.</div>'},5:function(t,e,n,i,r){return"disabled"},compiler:[8,">= 4.3.0"],main:function(t,e,n,i,r){var s,o,a=null!=e?e:t.nullContext||{},l=t.hooks.helperMissing,u=t.escapeExpression,c=t.lookupProperty||function(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]};return'\n    <div class="dialog__icon">'+u((c(n,"far")||e&&c(e,"far")||l).call(a,"lock-keyhole",{name:"far",hash:{},data:r,loc:{start:{line:2,column:30},end:{line:2,column:52}}}))+'</div>\n    <div>Enter your date of birth to access this form.</div>\n    <div><input type="date" class="js-date dialog__input'+(null!=(s=c(n,"if").call(a,null!=e?c(e,"hasError"):e,{name:"if",hash:{},fn:t.program(1,r,0),inverse:t.noop,data:r,loc:{start:{line:4,column:56},end:{line:4,column:89}}}))?s:"")+'" required pattern="d{4}-d{2}-d{2}" placeholder="Your Date of Birth" value="'+u("function"==typeof(o=null!=(o=c(n,"dob")||(null!=e?c(e,"dob"):e))?o:l)?o.call(a,{name:"dob",hash:{},data:r,loc:{start:{line:4,column:165},end:{line:4,column:174}}}):o)+'"></div>\n    '+(null!=(s=c(n,"if").call(a,null!=e?c(e,"hasError"):e,{name:"if",hash:{},fn:t.program(3,r,0),inverse:t.noop,data:r,loc:{start:{line:5,column:4},end:{line:5,column:124}}}))?s:"")+'\n    <div><button class="button--green dialog__button js-submit" '+(null!=(s=c(n,"unless").call(a,null!=e?c(e,"dob"):e,{name:"unless",hash:{},fn:t.program(5,r,0),inverse:t.noop,data:r,loc:{start:{line:6,column:64},end:{line:6,column:98}}}))?s:"")+">Continue to Form "+u((c(n,"fas")||e&&c(e,"fas")||l).call(a,"right-to-bracket",{name:"fas",hash:{},data:r,loc:{start:{line:6,column:116},end:{line:6,column:142}}}))+"</button></div>\n  "},useData:!0}),onChangeDate(){const t=this.ui.date.val();this.model.set({dob:t}),this.ui.submit.prop("disabled",!t)},onBlurDate(){this.model.set({hasError:!1})}}),x=v.View.extend({template:f().template({compiler:[8,">= 4.3.0"],main:function(t,e,n,i,r){var s=t.lookupProperty||function(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]};return'\n    <div class="dialog__icon--success">'+t.escapeExpression((s(n,"fas")||e&&s(e,"fas")||t.hooks.helperMissing).call(null!=e?e:t.nullContext||{},"circle-check",{name:"fas",hash:{},data:r,loc:{start:{line:2,column:39},end:{line:2,column:61}}}))+"</div>\n    <div>This form has already been submitted.</div>\n  "},useData:!0})}),C=v.View.extend({template:f().template({compiler:[8,">= 4.3.0"],main:function(t,e,n,i,r){var s=t.lookupProperty||function(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]};return'\n    <div class="dialog__icon--warn">'+t.escapeExpression((s(n,"far")||e&&s(e,"far")||t.hooks.helperMissing).call(null!=e?e:t.nullContext||{},"octagon-minus",{name:"far",hash:{},data:r,loc:{start:{line:2,column:36},end:{line:2,column:59}}}))+"</div>\n    <div>This form is no longer shared. Nothing else to do here.</div>\n  "},useData:!0})}),T=v.View.extend({template:f().template({compiler:[8,">= 4.3.0"],main:function(t,e,n,i,r){var s=t.lookupProperty||function(t,e){if(Object.prototype.hasOwnProperty.call(t,e))return t[e]};return'\n    <div class="dialog__icon--error">'+t.escapeExpression((s(n,"far")||e&&s(e,"far")||t.hooks.helperMissing).call(null!=e?e:t.nullContext||{},"circle-exclamation",{name:"far",hash:{},data:r,loc:{start:{line:2,column:37},end:{line:2,column:65}}}))+"</div>\n    <div>Uh-oh, there was an error. Try reloading the page.</div>\n  "},useData:!0})});function A(t,e){return{data:{type:e,id:t}}}const E=m.Z.extend({onStart(t){let{actionId:e}=t;const n=new b;this.showLogin(e,n.getRegion("content")),this.showView(n)},showLogin(t,e){const n=new k({model:this.getState()});this.listenTo(n,"click:submit",(()=>{(function(t){let{dob:e,actionId:n}=t;const i={type:"patient-tokens",id:(0,c.Z)(),attributes:{reason:"outreach",birth_date:e},relationships:{action:A(n,"patient-actions")}};return(0,h.ZP)("/api/patient-tokens",{method:"POST",data:JSON.stringify({data:i})}).then(h.sx).then((t=>{let{data:{attributes:e}}=t;return(0,d.setToken)(e.token),Promise.resolve(e.token)}))})({actionId:t,dob:this.getState("dob")}).then((()=>{this.stop({isAuthed:!0})})).catch((t=>{switch(t.status){case 400:this.setState({hasError:!0});break;case 409:e.show(new x);break;case 404:case 403:case 401:e.show(new C);break;default:e.show(new T)}}))})),e.show(n)}}),O=m.Z.extend({beforeStart(t){let{actionId:e}=t;return[u().request("entities","fetch:forms:byAction",e),u().request("entities","fetch:forms:definition:byAction",e),u().request("entities","fetch:forms:fields",e)]},onFail(){const t=new b;t.showChildView("content",new T),this.showView(t)},onStart(t,e,n,i){let{actionId:r}=t;this.actionId=r,this.form=e,this.definition=n,this.fields=i,this.setView(new y({model:this.form})),this.startService(),this.showFormSaveDisabled(),this.showView()},startService(){this.channel=u().channel(`form${this.form.id}`),this.channel.reply({"ready:form":this.showFormSave,"submit:form":this.submitForm,"fetch:form:data":this.getFormPrefill},this)},getFormPrefill(){this.channel.request("send","fetch:form:data",{definition:this.definition,formData:(0,s.get)(this.fields,"data.attributes".split("."),{}),formSubmission:{},...this.form.getContext()})},showFormSaveDisabled(){this.form.isReadOnly()||this.showChildView("formAction",new R({isDisabled:!0}))},showFormSave(){if(this.form.isReadOnly())return;const t=this.showChildView("formAction",new R);this.listenTo(t,"click",(()=>{this.channel.request("send","form:submit")}))},submitForm(t){let{response:e}=t;(function(t){let{formId:e,actionId:n,response:i}=t;const r={type:"form-responses",id:(0,c.Z)(),attributes:{response:i},relationships:{action:A(n,"patient-actions"),form:A(e,"forms")}};return(0,h.ZP)(`/api/actions/${n}/relationships/form-responses`,{method:"POST",data:JSON.stringify({data:r})}).then(h.sx)})({formId:this.form.id,actionId:this.actionId,response:e}).then((()=>{this.showView(new b)})).catch((async t=>{const e=await t.json();if(this.showFormSave(),!e)return;const n=(0,s.map)(e.errors,"detail");this.channel.request("send","form:errors",n)}))}}),P=p.Z.extend({childApps:{login:E,form:O},routerAppName:"PatientsApp",eventRoutes:{outreach:{action:"show",route:"outreach/:id"}},show(t){this.actionId=t,this.startLogin()},startLogin(){const t=this.startCurrent("login",{actionId:this.actionId});this.listenTo(t,"stop",(()=>{this.startForm()}))},startForm(){this.startCurrent("form",{actionId:this.actionId})}});function D(){r()("meta[name=viewport]").attr("content","width=device-width, initial-scale=1.0, maximum-scale=1.0"),new P({region:{el:document.getElementById("root")}}),a().history.start({pushState:!0})}},4737:function(t,e,n){t.exports=function(t,e,n){"use strict";t="default"in t?t.default:t,e="default"in e?e.default:e;var i=/(\(\?)?:\w+/,r=e.EventRouter=e.Router.extend({constructor:function(n){t.extend(this,t.pick(n,["channelName","routeTriggers"])),this._ch=e.Radio.channel(t.result(this,"channelName")),this.listenTo(this._ch,"all",this.navigateFromEvent),e.Router.apply(this,arguments),this._initRoutes()},channelName:"event-router",getChannel:function(){return this._ch},_initRoutes:function(){this._routeTriggers=t.result(this,"routeTriggers",{}),t.each(this._routeTriggers,this._addRouteTrigger,this)},_addRouteTrigger:function(e,n){e=t.isArray(e)?e:[e],t.each(e,(function(e){this.route(e,n,t.bind(this._ch.trigger,this._ch,n))}),this)},addRouteTrigger:function(t,e){return this._routeTriggers[e]=t,this._addRouteTrigger(t,e),this},route:function(n,i,r){var s=e.Router.prototype.route;if(t.isFunction(i)||!r)return s.call(this,n,i,r);var o=t.bind((function(){var e=t.drop(arguments,0);this.trigger("before:route",i,e),this.trigger.apply(this,["before:route:"+i].concat(e)),this._storeRouteTrigger([i].concat(e)),r.apply(this,e),this._clearRouteTrigger()}),this);return s.call(this,n,i,o)},_storeRouteTrigger:function(t){this._routeArgs=this._routeArgs||[],this._routeArgs.push(t)},_getCurrentRouteTrigger:function(){return t.last(this._routeArgs)||[]},_clearRouteTrigger:function(){this._routeArgs.pop()},_isTriggeredFromRoute:function(){var e=this._getCurrentRouteTrigger();return arguments.length===e.length&&arguments.length===t.union(arguments,this.currentRoute).length},navigateFromEvent:function(e){var n=this.getDefaultRoute(e);if(!n){var i=t.drop(arguments,0);return this.trigger.apply(this,["noMatch"].concat(i)),this}if(this._isTriggeredFromRoute.apply(this,arguments))return this;var r=t.drop(arguments,1),s=this.translateRoute(n,r);return this.navigate(s,{trigger:!1})},getDefaultRoute:function(e){var n=this._routeTriggers[e];return t.isArray(n)?n[0]:n},_replaceParam:function(t,e){return t.replace(i,e)},translateRoute:function(e,n){return t.reduce(n,this._replaceParam,e)}});return r}(n(7198),n(8088),n(7739))}}]);
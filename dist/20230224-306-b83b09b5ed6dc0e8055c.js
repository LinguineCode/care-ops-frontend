"use strict";(self.webpackChunkcare_ops_frontend=self.webpackChunkcare_ops_frontend||[]).push([[306],{3306:(e,t,i)=>{var s=i(4822),o=i(8088),n=i.n(o),r=i(7198),a=i(7739),l=i.n(a),c=i(7027),h=i(9203),d=i.n(h),p=i(4257),u=i(3018),g=i(1267),m=i(4861),f=i(1441),w=i(1188);const _="patient-actions",{parseRelationship:y}=g.Z,v=function(e,t){return e&&"owner"!==t?y(e,t):e},R=u.Z.extend({urlRoot(){if(this.isNew()){const e=this.get("_flow");return e?`/api/flows/${e}/relationships/actions`:`/api/patients/${this.get("_patient")}/relationships/actions`}return"/api/actions"},type:_,validate(e){let{name:t}=e;if(!(0,f.Z)(t))return"Action name required"},hasTag(e){return(0,r.contains)(this.get("tags"),e)},getForm(){const e=this.get("_form");if(e)return l().request("entities","forms:model",e)},getFormResponses(){return l().request("entities","formResponses:collection",this.get("_form_responses"),{comparator:(e,t)=>(0,m.XQ)("desc",e.get("_created_at"),t.get("_created_at"))})},getPatient(){return l().request("entities","patients:model",this.get("_patient"))},getOwner(){const e=this.get("_owner");return l().request("entities",`${e.type}:model`,e.id)},getFlow(){if(this.get("_flow"))return l().request("entities","flows:model",this.get("_flow"))},getState(){return l().request("entities","states:model",this.get("_state"))},isDone(){return this.getState().isDone()},isOverdue(){if(this.isDone())return!1;const e=this.get("due_date"),t=this.get("due_time");if(!t)return d()(e).isBefore(d()(),"day");const i=d()(`${e} ${t}`);return i.isBefore(d()(),"day")||i.isBefore(d()(),"minute")},isAdHoc(){return!this.get("_program_action")&&!this.get("_flow")},hasOutreach(){return this.get("outreach")!==w.Ww.DISABLED},saveDueDate(e){return e?this.save({due_date:e.format("YYYY-MM-DD")}):this.save({due_date:null,due_time:null})},saveDueTime(e){return e?this.save({due_time:e}):this.save({due_time:null})},saveState(e){const t={_state:e.id},i=this.get("sharing");return e.isDone()&&![w.q$.DISABLED,w.q$.RESPONDED].includes(i)&&(t.sharing=w.q$.CANCELED),this.save(t,{relationships:{state:this.toRelation(e)}})},saveOwner(e){return this.save({_owner:e},{relationships:{owner:this.toRelation(e)}})},saveAll(e){this.isNew()&&(e=(0,r.extend)({},this.attributes,e));const t={flow:this.toRelation(e._flow,"flows"),form:this.toRelation(e._form,"forms"),owner:this.toRelation(e._owner),state:this.toRelation(e._state,"states"),"program-action":this.toRelation(e._program_action,"program-actions")};return this.save(e,{relationships:t},{wait:!0})},hasAttachments(){return!!(0,r.size)(this.get("_files"))},parseRelationship:v}),Z=(0,c.Z)(R,_),C=p.Z.extend({url:"/api/actions",model:Z,parseRelationship:v,save(e){const t=this.invoke("saveAll",e);return Promise.all(t)},getPatients(){return l().request("entities","patients:collection",this.invoke("getPatient"))},groupByDate(){const e=this.groupBy("due_date");return(0,r.reduce)((0,r.keys)(e),((t,i)=>(t.add({date:i,actions:new C(e[i])}),t)),new(n().Collection)([]))}});new(s.Z.extend({Entity:{_Model:R,Model:Z,Collection:C},radioRequests:{"actions:model":"getModel","actions:collection":"getCollection","fetch:actions:model":"fetchAction","fetch:actions:collection":"fetchActions","fetch:actions:collection:byPatient":"fetchActionsByPatient","fetch:actions:collection:byFlow":"fetchActionsByFlow"},fetchAction(e){const t=["program-action.program","flow.program-flow.program"].join();return this.fetchModel(e,{data:{include:t}})},fetchActions(e){let{filter:t,include:i}=e;const s={filter:t,include:i};return this.fetchCollection({data:s})},fetchActionsByPatient(e){let{patientId:t,filter:i}=e;const s={filter:i},o=`/api/patients/${t}/relationships/actions`;return this.fetchCollection({url:o,data:s})},fetchActionsByFlow(e){const t=`/api/flows/${e}/relationships/actions`;return this.fetchCollection({url:t})}}));var q=i(7948),x=i(7201);const A="clinicians",M=u.Z.extend({type:A,urlRoot:"/api/clinicians",preinitialize(){this.on("change:_team",this.onChangeTeam)},validate:e=>(0,f.Z)(e.name)?(0,f.Z)(e.email)?e._role?void 0:"A clinician role is required":"A clinician email address is required":"A clinician name is required",onChangeTeam(){const e=l().request("entities","teams:model",this.previous("_team"));e.set("_clinicians",(0,r.reject)(e.get("_clinicians"),{id:this.id}));const t=l().request("entities","teams:model",this.get("_team"));t.set("_clinicians",(0,r.union)(t.get("_clinicians"),[{id:this.id}]))},getWorkspaces(){return l().request("entities","workspaces:collection",this.get("_workspaces"))},addWorkspace(e){const t=this.getWorkspaces();t.add(e),this.set("_workspaces",this.toRelation(t,"workspaces").data)},removeWorkspace(e){const t=this.getWorkspaces();t.remove(e),this.set("_workspaces",this.toRelation(t,"workspaces").data)},getTeam(){return this.hasTeam()?l().request("entities","teams:model",this.get("_team")):l().request("entities","teams:model",{name:x.ZP.patients.sidebar.action.activityViews.systemTeam})},hasTeam(){const e=this.get("_team");return e&&e!==q.Z},getRole(){return l().request("entities","roles:model",this.get("_role"))},can(e){const t=this.getRole().get("permissions");return(0,r.includes)(t,e)},saveRole(e){const t={_role:e.id};return this.save(t,{relationships:{role:this.toRelation(e)}})},saveTeam(e){const t=`/api/clinicians/${this.id}/relationships/team`;this.set({_team:e.id}),this.sync("update",this,{url:t,data:JSON.stringify(this.toRelation(e))})},saveAll(e){e=(0,r.extend)({},this.attributes,e);const t={workspaces:this.toRelation(e._workspaces,"workspaces"),team:this.toRelation(e._team,"teams"),role:this.toRelation(e._role,"roles")};return this.save(e,{relationships:t},{wait:!0})},getInitials(){const e=String(this.get("name")).split(" ");return 1===e.length?(0,r.first)(e).charAt(0):`${(0,r.first)(e).charAt(0)}${(0,r.last)(e).charAt(0)}`},isEditable(){return!this.get("last_active_at")},isActive(){const e=this.hasTeam(),t=!!(0,r.size)(this.get("_workspaces")),i=this.get("last_active_at");return e&&t&&i}}),k=(0,c.Z)(M,A),b=p.Z.extend({url:"/api/clinicians",model:k,comparator:"name"}),P=(new(s.Z.extend({Entity:{_Model:M,Model:k,Collection:b},radioRequests:{"clinicians:model":"getModel","clinicians:collection":"getCollection","fetch:clinicians:collection":"fetchCollection","fetch:clinicians:current":"fetchCurrentClinician","fetch:clinicians:model":"fetchModel","fetch:clinicians:byWorkspace":"fetchByWorkspace"},fetchCurrentClinician(){return this.fetchBy("/api/clinicians/me")},fetchByWorkspace(e){const t=`/api/workspaces/${e}/relationships/clinicians`;return this.fetchCollection({url:t})}})),"comments"),E=u.Z.extend({type:P,urlRoot(){return this.isNew()?`/api/actions/${this.get("_action")}/relationships/comments`:"/api/comments"},validate(e){let{message:t}=e;if(!(0,f.Z)(t))return"Comment message required."},getClinician(){return l().request("entities","clinicians:model",this.get("_clinician"))}}),F=(0,c.Z)(E,P),D=p.Z.extend({model:F}),S=(new(s.Z.extend({Entity:{_Model:E,Model:F,Collection:D},radioRequests:{"comments:model":"getModel","fetch:comments:collection:byAction":"fetchCommentsByAction"},fetchCommentsByAction(e){const t=`/api/actions/${e}/relationships/comments`;return this.fetchCollection({url:t})}})),"dashboards"),$=u.Z.extend({type:S,urlRoot:"/api/dashboards"}),B=(0,c.Z)($,S),I=p.Z.extend({url:"/api/dashboards",model:B}),O=(new(s.Z.extend({Entity:{_Model:$,Model:B,Collection:I},radioRequests:{"dashboards:model":"getModel","dashboards:collection":"getCollection","fetch:dashboards:model":"fetchModel","fetch:dashboards:collection":"fetchCollection"}})),u.Z.extend({type:"directories",url(){return`/api/directory/${this.get("slug")}`},getOptions(){if(this.options)return this.options;const e=(0,r.map)(this.get("value"),(e=>({name:e,id:e})));return this.options=new p.Z(e),this.options}})),T=p.Z.extend({url:"/api/directories",model:O}),N=(new(s.Z.extend({Entity:{Model:O,Collection:T},radioRequests:{"directories:collection":"getCollection","fetch:directories:model":"fetchDirectory","fetch:directories:filterable":"fetchFilterable"},fetchDirectory:(e,t)=>new O({slug:e}).fetch({data:t}),fetchFilterable(){return this.fetchCollection({data:{filter:{filterable:!0}}})}})),"events"),W=u.Z.extend({type:N,getClinician(){return l().request("entities","clinicians:model",this.get("_clinician"))},getRecipient(){if(this.get("_recipient"))return l().request("entities","patients:model",this.get("_recipient"))},getEditor(){return this.get("_editor")?l().request("entities","clinicians:model",this.get("_editor")):l().request("entities","clinicians:model",{name:"RoundingWell"})},getTeam(){return l().request("entities","teams:model",this.get("_team"))},getState(){return l().request("entities","states:model",this.get("_state"))},getProgram(){if(this.get("_program"))return l().request("entities","programs:model",this.get("_program"))},getForm(){if(this.get("_form"))return l().request("entities","forms:model",this.get("_form"))}}),L=(0,c.Z)(W,N),U=p.Z.extend({model:L}),H=(new(s.Z.extend({Entity:{_Model:W,Model:L,Collection:U},radioRequests:{"events:model":"getModel","events:collection":"getCollection","fetch:actionEvents:collection":"fetchActionEvents","fetch:flowEvents:collection":"fetchFlowEvents"},fetchActionEvents(e){return this.fetchCollection({url:`/api/actions/${e}/activity`})},fetchFlowEvents(e){return this.fetchCollection({url:`/api/flows/${e}/activity`})}})),"files");function j(e){const t=e.lastIndexOf(".");return`${e.slice(0,t)}-copy${e.slice(t)}`}const z=u.Z.extend({defaults:{path:"",_progress:0},type:H,urlRoot(){return this.isNew()?`/api/actions/${this.get("_action")}/relationships/files?urls=upload`:"/api/files"},fetchFile(){return this.fetch({url:`${this.url()}?urls=download,view`})},createUpload(e){var t=this;const i=`patient/${this.get("_patient")}/${e}`;return this.save({path:i,_progress:0},{},{type:"PUT"}).catch((function(){let{responseData:i}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const s=(0,r.get)((0,r.first)(i.errors),"detail","");if(s.includes("Another file exists"))return t.createUpload(j(e));throw i}))},upload(e){this.createUpload(e.name).then((()=>this.putFile(e))).then((()=>this.fetchFile())).catch((()=>{this.trigger("upload:failed"),this.destroy()}))},putFile(e){const t=e.size;return new Promise(((i,s)=>{const o=new XMLHttpRequest;o.onreadystatechange=()=>{4===o.readyState&&(200===o.status?(this.set({_progress:100}),i()):s())},o.upload.onprogress=e=>{e.lengthComputable&&this.set({_progress:Math.round(e.loaded/t*100)})},o.open("PUT",this.get("_upload")),o.send(e)}))},getFilename(){return this.get("path").split("/").pop()}}),J=(0,c.Z)(z,H),Y=p.Z.extend({model:J});new(s.Z.extend({Entity:{_Model:z,Model:J,Collection:Y},radioRequests:{"files:model":"getModel","fetch:files:collection:byAction":"fetchFilesByAction"},fetchFilesByAction(e){const t=`/api/actions/${e}/relationships/files?urls=download,view`;return this.fetchCollection({url:t})}}));var Q=i(2814);const V="flows",{parseRelationship:X}=g.Z,G=function(e,t){return e&&"owner"!==t?X(e,t):e},K=u.Z.extend({urlRoot(){return this.isNew()?`/api/patients/${this.get("_patient")}/relationships/flows`:"/api/flows"},type:V,getPatient(){return l().request("entities","patients:model",this.get("_patient"))},getOwner(){const e=this.get("_owner");return l().request("entities",`${e.type}:model`,e.id)},getState(){return l().request("entities","states:model",this.get("_state"))},getProgramFlow(){return l().request("entities","programFlows:model",this.get("_program_flow"))},isDone(){return this.getState().isDone()},isAllDone(){const{complete:e,total:t}=this.get("_progress");return e===t},saveState(e){return this.save({_state:e.id},{relationships:{state:this.toRelation(e)}})},saveOwner(e){return this.save({_owner:e},{relationships:{owner:this.toRelation(e)}})},applyOwner(e){const t=`${this.url()}/relationships/actions`,i={owner:this.toRelation(e)};return(0,Q.ZP)(t,{method:"PATCH",data:JSON.stringify({data:{relationships:i}})})},saveAll(e){this.isNew()&&(e=(0,r.extend)({},this.attributes,e));const t={state:this.toRelation(e._state,"states"),owner:this.toRelation(e._owner),"program-flow":this.toRelation(e._program_flow,"program-flows")};return this.save(e,{relationships:t},{wait:!0})},parseRelationship:G}),ee=(0,c.Z)(K,V),te=p.Z.extend({url:"/api/flows",model:ee,parseRelationship:G,save(e){const t=this.invoke("saveAll",e);return Promise.all(t)},applyOwner(e){const t=this.invoke("applyOwner",e);return Promise.all(t)},getPatients(){return l().request("entities","patients:collection",this.invoke("getPatient"))}});new(s.Z.extend({Entity:{_Model:K,Model:ee,Collection:te},radioRequests:{"flows:model":"getModel","flows:collection":"getCollection","fetch:flows:model":"fetchFlow","fetch:flows:collection":"fetchFlows","fetch:flows:collection:byPatient":"fetchFlowsByPatient"},fetchFlow(e){const t=["program-flow","program-flow.program","program-flow.program-actions"].join();return this.fetchModel(e,{data:{include:t}})},fetchFlows(e){let{filter:t,include:i}=e;const s={filter:t,include:i};return this.fetchCollection({data:s})},fetchFlowsByPatient(e){let{patientId:t,filter:i}=e;const s={filter:i},o=`/api/patients/${t}/relationships/flows`;return this.fetchCollection({url:o,data:s})}})),i(8380);const ie="form-responses",se=u.Z.extend({type:ie,urlRoot:"/api/form-responses",saveAll(){const e=this.attributes,t={form:this.toRelation(e._form,"forms"),patient:this.toRelation(e._patient,"patients"),action:this.toRelation(e._action,"patient-actions")};return this.save(e,{relationships:t},{wait:!0})}}),oe=(0,c.Z)(se,ie),ne=p.Z.extend({url:"/api/form-responses",model:oe}),re=(new(s.Z.extend({Entity:{_Model:se,Model:oe,Collection:ne},radioRequests:{"formResponses:model":"getModel","formResponses:collection":"getCollection","fetch:formResponses:submission":"fetchSubmission","fetch:formResponses:latestSubmission":"fetchLatestSubmission"},fetchSubmission:e=>e?(0,Q.ZP)(`/api/form-responses/${e}/response`).then(Q.sx):[{}],fetchLatestSubmission:(e,t,i)=>i?(0,Q.ZP)(`/api/patients/${e}/form-responses/latest?filter[form]=${t}&filter[flow]=${i}`).then(Q.sx):(0,Q.ZP)(`/api/patients/${e}/form-responses/latest?filter[form]=${t}`).then(Q.sx)})),"patient-fields"),ae=u.Z.extend({type:re,getValue(){const e=this.get("value");return(0,r.isObject)(e)&&(0,r.isEmpty)(e)?null:e}}),le=(0,c.Z)(ae,re),ce=p.Z.extend({model:le}),he=(new(s.Z.extend({Entity:{_Model:ae,Model:le,Collection:ce},radioRequests:{"patientFields:model":"getModel","patientFields:collection":"getCollection","fetch:patientFields:model":"fetchPatientField"},fetchPatientField(e,t){const i=`/api/patients/${e}/fields/${t}`;return this.fetchModel(t,{url:i,abort:!1}).then((e=>{this.getModel(e.attributes)}))}})),"patients"),de=u.Z.extend({type:he,urlRoot:"/api/patients",validate(e){let{first_name:t,last_name:i,birth_date:s,sex:o,_workspaces:n}=e;const a={};if(t&&i||(a.name="required"),o||(a.sex="required"),n&&n.length||(a.workspaces="required"),s?d()(s).isAfter()&&(a.birth_date="invalidDate"):a.birth_date="required",!(0,r.isEmpty)(a))return a},getWorkspaces(){return l().request("entities","workspaces:collection",this.get("_workspaces"))},getFields(){return l().request("entities","patientFields:collection",this.get("_patient_fields"))},getField(e){return this.getFields().find({name:e})},addWorkspace(e){const t=this.getWorkspaces();t.add(e),this.set("_workspaces",t.map((e=>e.pick("id"))))},removeWorkspace(e){const t=this.getWorkspaces();t.remove(e),this.set("_workspaces",t.map((e=>e.pick("id"))))},saveAll(e){e=(0,r.extend)({},this.attributes,e);const t={workspaces:this.toRelation(e._workspaces,"workspaces")};return this.save(e,{relationships:t},{wait:!0})},canEdit(){return this.isNew()||"manual"===this.get("source")},getSortName(){return(this.get("last_name")+this.get("first_name")).toLowerCase()}}),pe=(0,c.Z)(de,he),ue=p.Z.extend({url:"/api/patients",model:pe,getSharedWorkspaces(){const e=(0,r.pluck)(this.invoke("getWorkspaces"),"models");return l().request("entities","workspaces:collection",(0,r.intersection)(...e))}}),ge=(new(s.Z.extend({Entity:{_Model:de,Model:pe,Collection:ue},radioRequests:{"patients:model":"getModel","patients:collection":"getCollection","fetch:patients:model":"fetchModel","fetch:patients:model:byAction":"fetchPatientByAction","fetch:patients:model:byFlow":"fetchPatientByFlow"},fetchPatientByAction(e){return this.fetchBy(`/api/actions/${e}/patient`)},fetchPatientByFlow(e){return this.fetchBy(`/api/flows/${e}/patient`)}})),u.Z.extend({type:"patients-search-results"})),me=p.Z.extend({url:"/api/patients",model:ge,initialize(){this._debouncedSearch=(0,r.debounce)(this._debouncedSearch,150)},prevSearch:"",fetcher:{abort:r.noop},search(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(e.length<3)return e.length&&this.prevSearch.includes(e)||(delete this._hasIdentifiers,this.reset(),this.prevSearch=""),this._debouncedSearch.cancel(),void this.fetcher.abort();this.prevSearch=e,this.isSearching=!0,this._debouncedSearch(e)},hasIdentifiers(){return(0,r.isBoolean)(this._hasIdentifiers)||(this._hasIdentifiers=!!this.find((e=>(0,r.get)(e.get("identifiers"),"length")))),this._hasIdentifiers},_debouncedSearch(e){const t={search:e};delete this._hasIdentifiers,this.fetcher=this.fetch({data:{filter:t}}),this.fetcher.then((()=>{this.isSearching=!1,this.trigger("search",this)}))}});new(s.Z.extend({Entity:{Model:ge,Collection:me},radioRequests:{"searchPatients:collection":"getCollection"}}));var fe=i(1962);const we="program-actions",{parseRelationship:_e}=g.Z,ye=function(e,t){return e&&"owner"!==t?_e(e,t):e},ve=u.Z.extend({urlRoot:"/api/program-actions",type:we,validate(e){let{name:t}=e;if(!(0,f.Z)(t))return"Action name required"},getTags(){return l().request("entities","tags:collection",(0,fe.Z)(this.get("tags"),"text"))},addTag(e){const t=this.getTags();return t.add(e),this.save({tags:t.map("text")})},removeTag(e){const t=this.getTags();return t.remove(e),this.save({tags:t.map("text")})},getAction(e){let{patientId:t,flowId:i}=e;const s=l().request("bootstrap","currentUser"),o=l().request("bootstrap","currentWorkspace").getStates();return l().request("entities","actions:model",{name:this.get("name"),_flow:i,_patient:t,_state:o.at(0).id,_owner:this.get("_owner")||{id:s.id,type:"clinicians"},_program_action:this.id})},getOwner(){const e=this.get("_owner");if(e)return l().request("entities","teams:model",e.id)},saveOwner(e){return e=this.toRelation(e),this.save({_owner:e.data},{relationships:{owner:e}})},getForm(){const e=this.get("_form");if(e)return l().request("entities","forms:model",e)},hasOutreach(){return this.get("outreach")!==w.Ww.DISABLED},saveForm(e){const t={_form:(e=this.toRelation(e)).data};return e.data||(t.outreach=w.Ww.DISABLED),this.save(t,{relationships:{form:e}})},saveAll(e){e=(0,r.extend)({},this.attributes,e);const t={owner:this.toRelation(e._owner,"teams"),form:this.toRelation(e._form,"forms"),"program-flow":this.toRelation(e._program_flow,"program-flows"),program:this.toRelation(e._program,"programs")};return this.save(e,{relationships:t},{wait:!0})},parseRelationship:ye}),Re=(0,c.Z)(ve,we),Ze=p.Z.extend({initialize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.flowId=t.flowId,this.flowId&&(this.comparator="sequence")},url(){return this.flowId?`/api/program-flows/${this.flowId}/actions`:"/api/program-actions"},model:Re,parseRelationship:ye,updateSequences(){const e=this.map(((e,t)=>(e.set({sequence:t}),e.toJSONApi({sequence:t}))));return this.sync("patch",this,{url:this.url(),data:JSON.stringify({data:e})})}}),Ce=(new(s.Z.extend({Entity:{_Model:ve,Model:Re,Collection:Ze},radioRequests:{"programActions:model":"getModel","programActions:collection":"getCollection","fetch:programActions:model":"fetchModel","fetch:programActions:collection:byProgram":"fetchProgramActionsByProgram","fetch:programActions:collection":"fetchProgramActions","fetch:programActions:collection:byProgramFlow":"fetchProgramActionsByFlow"},fetchProgramActionsByProgram(e){let{programId:t}=e;const i=`/api/programs/${t}/relationships/actions`;return this.fetchCollection({url:i})},fetchProgramActions(){let{filter:e={status:w.t0.PUBLISHED}}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t={filter:e};return this.fetchCollection({data:t})},fetchProgramActionsByFlow:(e,t)=>new Ze([],{flowId:e}).fetch(t)})),"program-flows"),{parseRelationship:qe}=g.Z,xe=function(e,t){return e&&"owner"!==t?qe(e,t):e},Ae=u.Z.extend({urlRoot(){return this.isNew()?`/api/programs/${this.get("_program")}/relationships/flows`:"/api/program-flows"},type:Ce,validate(e){let{name:t}=e;if(!(0,f.Z)(t))return"Flow name required"},getTags(){return l().request("entities","tags:collection",(0,fe.Z)(this.get("tags"),"text"))},addTag(e){const t=this.getTags();return t.add(e),this.save({tags:t.map("text")})},removeTag(e){const t=this.getTags();return t.remove(e),this.save({tags:t.map("text")})},getOwner(){const e=this.get("_owner");if(e)return l().request("entities","teams:model",e.id)},getFlow(e){const t=l().request("bootstrap","currentWorkspace").getStates();return l().request("entities","flows:model",{_patient:e,_program_flow:this.get("id"),_state:t.at(0).id})},saveOwner(e){return e=this.toRelation(e),this.save({_owner:e.data},{relationships:{owner:e}})},saveAll(e){e=(0,r.extend)({},this.attributes,e);const t={owner:this.toRelation(e._owner,"teams")};return this.save(e,{relationships:t},{wait:!0})},getActions(){return l().request("entities","programActions:collection",this.get("_program_actions"),{flowId:this.id})},parseRelationship:xe}),Me=(0,c.Z)(Ae,Ce),ke=p.Z.extend({url:"/api/program-flows",model:Me,parseRelationship:xe}),be=(new(s.Z.extend({Entity:{_Model:Ae,Model:Me,Collection:ke},radioRequests:{"programFlows:model":"getModel","programFlows:collection":"getCollection","fetch:programFlows:model":"fetchModel","fetch:programFlows:collection:byProgram":"fetchProgramFlowsByProgram","fetch:programFlows:collection":"fetchProgramFlows"},fetchProgramFlowsByProgram(e){let{programId:t}=e;const i=`/api/programs/${t}/relationships/flows`;return this.fetchCollection({url:i})},fetchProgramFlows(){let{filter:e={status:w.t0.PUBLISHED}}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t={filter:e};return this.fetchCollection({data:t})}})),"programs"),Pe=u.Z.extend({type:be,validate(e){let{name:t}=e;if(!(0,f.Z)(t))return"Program name required"},urlRoot:"/api/programs",getPublished(){const e=l().request("entities","programActions:collection",this.get("_program_actions")),t=l().request("entities","programFlows:collection",this.get("_program_flows")),i=w.t0.PUBLISHED,s=l().request("entities","programActions:collection",e.filter({status:i})),o=l().request("entities","programFlows:collection",t.filter({status:i}));return new(n().Collection)([...o.models,...s.models],{comparator:"name"})}}),Ee=(0,c.Z)(Pe,be),Fe=p.Z.extend({url:"/api/programs",model:Ee}),De=(new(s.Z.extend({Entity:{_Model:Pe,Model:Ee,Collection:Fe},radioRequests:{"programs:model":"getModel","programs:collection":"getCollection","fetch:programs:model":"fetchModel","fetch:programs:collection":"fetchCollection","fetch:programs:model:byProgramFlow":"fetchProgramByProgramFlow"},fetchProgramByProgramFlow(e){return this.fetchBy(`/api/program-flows/${e}/program`)}})),"roles"),Se=u.Z.extend({type:De,urlRoot:"/api/roles"}),$e=(0,c.Z)(Se,De),Be=p.Z.extend({url:"/api/roles",model:$e}),Ie=(new(s.Z.extend({Entity:{_Model:Se,Model:$e,Collection:Be},radioRequests:{"roles:model":"getModel","roles:collection":"getCollection","fetch:roles:collection":"fetchCollection"}})),"settings"),Oe=u.Z.extend({type:Ie,urlRoot:"/api/settings"}),Te=(0,c.Z)(Oe,Ie),Ne=p.Z.extend({url:"/api/settings",model:Te}),We=(new(s.Z.extend({Entity:{_Model:Oe,Model:Te,Collection:Ne},radioRequests:{"settings:model":"getModel","fetch:settings:collection":"fetchCollection"}})),"states"),Le=u.Z.extend({type:We,isDone(){return this.get("status")===w.lO.DONE}}),Ue=(0,c.Z)(Le,We),He=p.Z.extend({url:"/api/states",model:Ue,groupByDone(){const{done:e,notDone:t}=this.groupBy((e=>e.isDone()?"done":"notDone"));return{done:new He(e),notDone:new He(t)}},getFilterIds(){return this.map("id").join(",")}}),je=(new(s.Z.extend({Entity:{_Model:Le,Model:Ue,Collection:He},radioRequests:{"states:model":"getModel","states:collection":"getCollection","fetch:states:collection":"fetchCollection"}})),"tags"),ze=u.Z.extend({type:je,idAttribute:"text"}),Je=(0,c.Z)(ze,je),Ye=p.Z.extend({url:"/api/tags",model:Je,parse:e=>(0,r.map)(e.data,(e=>({text:e}))),comparator:"text"});let Qe;const Ve=(new(s.Z.extend({Entity:{_Model:ze,Model:Je,Collection:Ye},radioRequests:{"tags:model":"getModel","tags:collection":"getCollection","fetch:tags:collection":"fetchTags"},fetchTags(){return Qe||this.fetchCollection().then((e=>(Qe=e,e)))}})),"teams"),Xe=u.Z.extend({type:Ve,urlRoot:"/api/teams",hasClinicians(){const e=this.get("_clinicians");return e&&e.length}}),Ge=(0,c.Z)(Xe,Ve),Ke=p.Z.extend({url:"/api/teams",model:Ge,comparator:"name"}),et=(new(s.Z.extend({Entity:{_Model:Xe,Model:Ge,Collection:Ke},radioRequests:{"teams:model":"getModel","teams:collection":"getCollection","fetch:teams:collection":"fetchCollection"}})),"widgets"),tt=u.Z.extend({type:et}),it=(0,c.Z)(tt,et),st=p.Z.extend({url:"/api/widgets",model:it,modelId:e=>(0,r.uniqueId)(`${e.id}-`)}),ot=(new(s.Z.extend({Entity:{_Model:tt,Model:it,Collection:st},radioRequests:{"widgets:model":"getModel","widgets:collection":"getCollection","fetch:widgets:collection":"fetchWidgets"},fetchWidgets(){let{filter:e={}}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t={filter:e};return this.fetchCollection({data:t})}})),"workspaces"),nt=u.Z.extend({type:ot,urlRoot:"/api/workspaces",getStates(){return l().request("entities","states:collection",this.get("_states"))},getForms(){return l().request("entities","forms:collection",this.get("_forms"))},getAssignableClinicians(){const e=l().request("entities","clinicians:collection",this.get("_clinicians")),t=e.filter((e=>e.isActive()&&e.get("enabled")&&e.can("work:own")));return e.reset(t),e},addClinician(e){const t=`/api/workspaces/${this.id}/relationships/clinicians`,i=e.get("_workspaces");return e.set({_workspaces:(0,r.union)(i,[{id:this.id}])}),this.set({_clinicians:(0,r.union)(this.get("_clinicians"),[{id:e.id}])}),this.sync("create",this,{url:t,data:JSON.stringify({data:[{id:e.id,type:e.type}]})})},removeClinician(e){const t=`/api/workspaces/${this.id}/relationships/clinicians`;return e.set({_workspaces:(0,r.reject)(e.get("_workspaces"),{id:this.id})}),this.set({_clinicians:(0,r.reject)(this.get("_clinicians"),{id:e.id})}),this.sync("delete",this,{url:t,data:JSON.stringify({data:[{id:e.id,type:e.type}]})})}}),rt=(0,c.Z)(nt,ot),at=p.Z.extend({url:"/api/workspaces",model:rt});new(s.Z.extend({Entity:{_Model:nt,Model:rt,Collection:at},radioRequests:{"workspaces:model":"getModel","workspaces:collection":"getCollection","fetch:workspaces:collection":"fetchCollection"}}))},1188:(e,t,i)=>{i.d(t,{Ww:()=>s,cB:()=>r,lO:()=>a,q$:()=>o,t0:()=>n});const s={DISABLED:"disabled",PATIENT:"patient"},o={DISABLED:"disabled",PENDING:"pending",SENT:"sent",RESPONDED:"responded",CANCELED:"canceled",ERROR_NO_PHONE:"error_no_phone",ERROR_OPT_OUT:"error_opt_out",ERROR_SMS_FAILED:"error_sms_failed"},n={CONDITIONAL:"conditional",DRAFT:"draft",PUBLISHED:"published"},r=[{id:"today",unit:"day",prev:0},{id:"yesterday",unit:"day",prev:1},{id:"thisweek",unit:"week",prev:0},{id:"lastweek",unit:"week",prev:1},{id:"thismonth",unit:"month",prev:0},{id:"lastmonth",unit:"month",prev:1}],a={STARTED:"started",QUEUED:"queued",DONE:"done"}},4861:(e,t,i)=>{i.d(t,{XQ:()=>n,oC:()=>a});var s=i(7198);function o(e,t){return"desc"===e?-1*t:t}function n(e,t,i){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";return t||(t=s),i||(i=s),o(e,t.localeCompare(i))}function r(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return(0,s.isNumber)(e)?e:t}function a(e,t,i){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:Number.NEGATIVE_INFINITY;t||(t=s),i||(i=s);const n=r(t,s)>r(i,s)?1:-1;return o(e,n)}}}]);
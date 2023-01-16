"use strict";(globalThis.webpackChunkcare_ops_frontend=globalThis.webpackChunkcare_ops_frontend||[]).push([[694],{2694:(e,t,i)=>{var s=i(4822),o=i(8088),n=i.n(o),r=i(7198),a=i(7739),l=i.n(a),c=i(7027),d=i(9203),h=i.n(d),u=i(4257),p=i(3018),g=i(1267),m=i(4861),f=i(1441),w=i(1188);const _="patient-actions",{parseRelationship:y}=g.Z,v=function(e,t){return e&&"owner"!==t?y(e,t):e},Z=p.Z.extend({urlRoot(){if(this.isNew()){const e=this.get("_flow");return e?`/api/flows/${e}/relationships/actions`:`/api/patients/${this.get("_patient")}/relationships/actions`}return"/api/actions"},type:_,validate(e){let{name:t}=e;if(!(0,f.Z)(t))return"Action name required"},hasTag(e){return(0,r.contains)(this.get("tags"),e)},getForm(){const e=this.get("_form");if(e)return l().request("entities","forms:model",e)},getFormResponses(){return l().request("entities","formResponses:collection",this.get("_form_responses"),{comparator:(e,t)=>(0,m.XQ)("desc",e.get("_created_at"),t.get("_created_at"))})},getPatient(){return l().request("entities","patients:model",this.get("_patient"))},getOwner(){const e=this.get("_owner");return l().request("entities",`${e.type}:model`,e.id)},getFlow(){if(this.get("_flow"))return l().request("entities","flows:model",this.get("_flow"))},getState(){return l().request("entities","states:model",this.get("_state"))},isDone(){return this.getState().isDone()},isOverdue(){if(this.isDone())return!1;const e=this.get("due_date"),t=this.get("due_time");if(!t)return h()(e).isBefore(h()(),"day");const i=h()(`${e} ${t}`);return i.isBefore(h()(),"day")||i.isBefore(h()(),"minute")},isAdHoc(){return!this.get("_program_action")&&!this.get("_flow")},hasOutreach(){return this.get("outreach")!==w.Ww.DISABLED},saveDueDate(e){return e?this.save({due_date:e.format("YYYY-MM-DD")}):this.save({due_date:null,due_time:null})},saveDueTime(e){return e?this.save({due_time:e}):this.save({due_time:null})},saveState(e){const t={_state:e.id},i=this.get("sharing");return e.isDone()&&![w.q$.DISABLED,w.q$.RESPONDED].includes(i)&&(t.sharing=w.q$.CANCELED),this.save(t,{relationships:{state:this.toRelation(e)}})},saveOwner(e){return this.save({_owner:e},{relationships:{owner:this.toRelation(e)}})},saveAll(e){this.isNew()&&(e=(0,r.extend)({},this.attributes,e));const t={flow:this.toRelation(e._flow,"flows"),form:this.toRelation(e._form,"forms"),owner:this.toRelation(e._owner),state:this.toRelation(e._state,"states"),"program-action":this.toRelation(e._program_action,"program-actions")};return this.save(e,{relationships:t},{wait:!0})},hasAttachments(){return!!(0,r.size)(this.get("_files"))},parseRelationship:v}),R=(0,c.Z)(Z,_),C=u.Z.extend({url:"/api/actions",model:R,parseRelationship:v,save(e){const t=this.invoke("saveAll",e);return Promise.all(t)},getPatients(){return l().request("entities","patients:collection",this.invoke("getPatient"))},groupByDate(){const e=this.groupBy("due_date");return(0,r.reduce)((0,r.keys)(e),((t,i)=>(t.add({date:i,actions:new C(e[i])}),t)),new(n().Collection)([]))}});new(s.Z.extend({Entity:{_Model:Z,Model:R,Collection:C},radioRequests:{"actions:model":"getModel","actions:collection":"getCollection","fetch:actions:model":"fetchAction","fetch:actions:collection":"fetchActions","fetch:actions:collection:byPatient":"fetchActionsByPatient","fetch:actions:collection:byFlow":"fetchActionsByFlow"},fetchAction(e){const t=["program-action.program","flow.program-flow.program"].join();return this.fetchModel(e,{data:{include:t}})},fetchActions(e){let{filter:t,include:i}=e;const s={filter:t,include:i};return this.fetchCollection({data:s})},fetchActionsByPatient(e){let{patientId:t,filter:i}=e;const s={filter:i},o=`/api/patients/${t}/relationships/actions`;return this.fetchCollection({url:o,data:s})},fetchActionsByFlow(e){const t=`/api/flows/${e}/relationships/actions`;return this.fetchCollection({url:t})}}));var q=i(7948),x=i(7201);const M="clinicians",A=p.Z.extend({type:M,urlRoot:"/api/clinicians",preinitialize(){this.on("change:_team",this.onChangeTeam)},validate:e=>(0,f.Z)(e.name)?(0,f.Z)(e.email)?e._role?void 0:"A clinician role is required":"A clinician email address is required":"A clinician name is required",onChangeTeam(){const e=l().request("entities","teams:model",this.previous("_team"));e.set("_clinicians",(0,r.reject)(e.get("_clinicians"),{id:this.id}));const t=l().request("entities","teams:model",this.get("_team"));t.set("_clinicians",(0,r.union)(t.get("_clinicians"),[{id:this.id}]))},getGroups(){return l().request("entities","groups:collection",this.get("_groups"))},addGroup(e){const t=this.getGroups();t.add(e),this.set("_groups",this.toRelation(t,"workspaces").data)},removeGroup(e){const t=this.getGroups();t.remove(e),this.set("_groups",this.toRelation(t,"workspaces").data)},getTeam(){return this.hasTeam()?l().request("entities","teams:model",this.get("_team")):l().request("entities","teams:model",{name:x.ZP.patients.sidebar.action.activityViews.systemTeam})},hasTeam(){const e=this.get("_team");return e&&e!==q.Z},getRole(){return l().request("entities","roles:model",this.get("_role"))},can(e){const t=this.getRole().get("permissions");return(0,r.includes)(t,e)},saveRole(e){const t={_role:e.id};return this.save(t,{relationships:{role:this.toRelation(e)}})},saveTeam(e){const t=`/api/clinicians/${this.id}/relationships/team`;this.set({_team:e.id}),this.sync("update",this,{url:t,data:JSON.stringify(this.toRelation(e))})},saveAll(e){e=(0,r.extend)({},this.attributes,e);const t={groups:this.toRelation(e._groups,"workspaces"),team:this.toRelation(e._team,"teams"),role:this.toRelation(e._role,"roles")};return this.save(e,{relationships:t},{wait:!0})},getInitials(){const e=String(this.get("name")).split(" ");return 1===e.length?(0,r.first)(e).charAt(0):`${(0,r.first)(e).charAt(0)}${(0,r.last)(e).charAt(0)}`},isEditable(){return!this.get("last_active_at")},isActive(){const e=this.hasTeam(),t=!!(0,r.size)(this.get("_groups")),i=this.get("last_active_at");return e&&t&&i}}),b=(0,c.Z)(A,M),E=u.Z.extend({url:"/api/clinicians",model:b,comparator:"name"}),P=(new(s.Z.extend({Entity:{_Model:A,Model:b,Collection:E},radioRequests:{"clinicians:model":"getModel","clinicians:collection":"getCollection","fetch:clinicians:collection":"fetchCollection","fetch:clinicians:current":"fetchCurrentClinician","fetch:clinicians:model":"fetchModel"},fetchCurrentClinician(){return this.fetchBy("/api/clinicians/me")}})),"comments"),F=p.Z.extend({type:P,urlRoot(){return this.isNew()?`/api/actions/${this.get("_action")}/relationships/comments`:"/api/comments"},validate(e){let{message:t}=e;if(!(0,f.Z)(t))return"Comment message required."},getClinician(){return l().request("entities","clinicians:model",this.get("_clinician"))}}),S=(0,c.Z)(F,P),D=u.Z.extend({model:S}),B=(new(s.Z.extend({Entity:{_Model:F,Model:S,Collection:D},radioRequests:{"comments:model":"getModel","fetch:comments:collection:byAction":"fetchCommentsByAction"},fetchCommentsByAction(e){const t=`/api/actions/${e}/relationships/comments`;return this.fetchCollection({url:t})}})),"dashboards"),$=p.Z.extend({type:B,urlRoot:"/api/dashboards"}),I=(0,c.Z)($,B),T=u.Z.extend({url:"/api/dashboards",model:I}),O=(new(s.Z.extend({Entity:{_Model:$,Model:I,Collection:T},radioRequests:{"dashboards:model":"getModel","dashboards:collection":"getCollection","fetch:dashboards:model":"fetchModel","fetch:dashboards:collection":"fetchCollection"}})),p.Z.extend({type:"directories",url(){return`/api/directory/${this.get("slug")}`},getOptions(){if(this.options)return this.options;const e=(0,r.map)(this.get("value"),(e=>({name:e,id:e})));return this.options=new u.Z(e),this.options}})),N=u.Z.extend({url:"/api/directories",model:O}),k=(new(s.Z.extend({Entity:{Model:O,Collection:N},radioRequests:{"fetch:directories:model":"fetchDirectory","fetch:directories:filterable":"fetchFilterable"},fetchDirectory:(e,t)=>new O({slug:e}).fetch({data:t}),fetchFilterable(){return this.fetchCollection({data:{filter:{filterable:!0}}})}})),"events"),L=p.Z.extend({type:k,getClinician(){return l().request("entities","clinicians:model",this.get("_clinician"))},getRecipient(){if(this.get("_recipient"))return l().request("entities","patients:model",this.get("_recipient"))},getEditor(){return this.get("_editor")?l().request("entities","clinicians:model",this.get("_editor")):l().request("entities","clinicians:model",{name:"RoundingWell"})},getTeam(){return l().request("entities","teams:model",this.get("_team"))},getState(){return l().request("entities","states:model",this.get("_state"))},getProgram(){if(this.get("_program"))return l().request("entities","programs:model",this.get("_program"))},getForm(){if(this.get("_form"))return l().request("entities","forms:model",this.get("_form"))}}),G=(0,c.Z)(L,k),U=u.Z.extend({model:G}),z=(new(s.Z.extend({Entity:{_Model:L,Model:G,Collection:U},radioRequests:{"events:model":"getModel","events:collection":"getCollection","fetch:actionEvents:collection":"fetchActionEvents","fetch:flowEvents:collection":"fetchFlowEvents"},fetchActionEvents(e){return this.fetchCollection({url:`/api/actions/${e}/activity`})},fetchFlowEvents(e){return this.fetchCollection({url:`/api/flows/${e}/activity`})}})),"files"),H=p.Z.extend({defaults:{path:""},type:z,urlRoot(){return this.isNew()?`/api/actions/${this.get("_action")}/relationships/files?urls=upload`:"/api/files"},fetchFile(){return this.fetch({data:{urls:["view","download"]}})},createUpload(e){const t=`patient/${this.get("_patient")}/${e}`;return this.save({path:t})},upload(){(".pdf",new Promise((e=>{const t=document.createElement("input");t.type="file",t.accept=".pdf",t.onchange=()=>{const i=Array.from(t.files);e(i[0])},t.click()}))).then((e=>{this.createUpload(e.name).then((()=>{const t=this.get("_upload"),i=new XMLHttpRequest;i.onreadystatechange=()=>{if(4===i.readyState){if(200!==i.status)return void this.destroy();this.set({_progress:100}),this.fetchFile()}},i.upload.onprogress=t=>{t.lengthComputable&&this.set({_progress:t.loaded/e.size*100})},i.open("PUT",t),i.send(e)}))}))},getFilename(){return this.get("path").split("/").pop()}}),j=(0,c.Z)(H,z),W=u.Z.extend({model:j});new(s.Z.extend({Entity:{_Model:H,Model:j,Collection:W},radioRequests:{"files:model":"getModel","fetch:files:collection:byAction":"fetchFilesByAction"},fetchFilesByAction(e){const t=`/api/actions/${e}/relationships/files?urls=download,view`;return this.fetchCollection({url:t})}}));var J=i(2814);const Y="flows",{parseRelationship:Q}=g.Z,V=function(e,t){return e&&"owner"!==t?Q(e,t):e},X=p.Z.extend({urlRoot(){return this.isNew()?`/api/patients/${this.get("_patient")}/relationships/flows`:"/api/flows"},type:Y,getPatient(){return l().request("entities","patients:model",this.get("_patient"))},getOwner(){const e=this.get("_owner");return l().request("entities",`${e.type}:model`,e.id)},getState(){return l().request("entities","states:model",this.get("_state"))},getProgramFlow(){return l().request("entities","programFlows:model",this.get("_program_flow"))},isDone(){return this.getState().isDone()},isAllDone(){const{complete:e,total:t}=this.get("_progress");return e===t},saveState(e){return this.save({_state:e.id},{relationships:{state:this.toRelation(e)}})},saveOwner(e){return this.save({_owner:e},{relationships:{owner:this.toRelation(e)}})},applyOwner(e){const t=`${this.url()}/relationships/actions`,i={owner:this.toRelation(e)};return(0,J.ZP)(t,{method:"PATCH",data:JSON.stringify({data:{relationships:i}})})},saveAll(e){this.isNew()&&(e=(0,r.extend)({},this.attributes,e));const t={state:this.toRelation(e._state,"states"),owner:this.toRelation(e._owner),"program-flow":this.toRelation(e._program_flow,"program-flows")};return this.save(e,{relationships:t},{wait:!0})},parseRelationship:V}),K=(0,c.Z)(X,Y),ee=u.Z.extend({url:"/api/flows",model:K,parseRelationship:V,save(e){const t=this.invoke("saveAll",e);return Promise.all(t)},applyOwner(e){const t=this.invoke("applyOwner",e);return Promise.all(t)},getPatients(){return l().request("entities","patients:collection",this.invoke("getPatient"))}});new(s.Z.extend({Entity:{_Model:X,Model:K,Collection:ee},radioRequests:{"flows:model":"getModel","flows:collection":"getCollection","fetch:flows:model":"fetchFlow","fetch:flows:collection":"fetchFlows","fetch:flows:collection:byPatient":"fetchFlowsByPatient"},fetchFlow(e){const t=["program-flow","program-flow.program","program-flow.program-actions"].join();return this.fetchModel(e,{data:{include:t}})},fetchFlows(e){let{filter:t,include:i}=e;const s={filter:t,include:i};return this.fetchCollection({data:s})},fetchFlowsByPatient(e){let{patientId:t,filter:i}=e;const s={filter:i},o=`/api/patients/${t}/relationships/flows`;return this.fetchCollection({url:o,data:s})}})),i(8380);const te="form-responses",ie=p.Z.extend({type:te,urlRoot:"/api/form-responses",saveAll(){const e=this.attributes,t={form:this.toRelation(e._form,"forms"),patient:this.toRelation(e._patient,"patients"),action:this.toRelation(e._action,"patient-actions")};return this.save(e,{relationships:t},{wait:!0})}}),se=(0,c.Z)(ie,te),oe=u.Z.extend({url:"/api/form-responses",model:se}),ne=(new(s.Z.extend({Entity:{_Model:ie,Model:se,Collection:oe},radioRequests:{"formResponses:model":"getModel","formResponses:collection":"getCollection","fetch:formResponses:submission":"fetchSubmission","fetch:formResponses:latestSubmission":"fetchLatestSubmission"},fetchSubmission:e=>e?(0,J.ZP)(`/api/form-responses/${e}/response`).then(J.sx):[{}],fetchLatestSubmission:(e,t,i)=>i?(0,J.ZP)(`/api/patients/${e}/form-responses/latest?filter[form]=${t}&filter[flow]=${i}`).then(J.sx):(0,J.ZP)(`/api/patients/${e}/form-responses/latest?filter[form]=${t}`).then(J.sx)})),"workspaces"),re=p.Z.extend({type:ne,urlRoot:"/api/groups",getAssignableClinicians(){const e=l().request("entities","clinicians:collection",this.get("_clinicians")),t=e.filter((e=>e.isActive()&&e.get("enabled")&&e.can("work:own")));return e.reset(t),e},addClinician(e){const t=`/api/groups/${this.id}/relationships/clinicians`,i=e.get("_groups");return e.set({_groups:(0,r.union)(i,[{id:this.id}])}),this.set({_clinicians:(0,r.union)(this.get("_clinicians"),[{id:e.id}])}),this.sync("create",this,{url:t,data:JSON.stringify({data:[{id:e.id,type:e.type}]})})},removeClinician(e){const t=`/api/groups/${this.id}/relationships/clinicians`;return e.set({_groups:(0,r.reject)(e.get("_groups"),{id:this.id})}),this.set({_clinicians:(0,r.reject)(this.get("_clinicians"),{id:e.id})}),this.sync("delete",this,{url:t,data:JSON.stringify({data:[{id:e.id,type:e.type}]})})}}),ae=(0,c.Z)(re,ne),le=u.Z.extend({url:"/api/groups",model:ae}),ce=(new(s.Z.extend({Entity:{_Model:re,Model:ae,Collection:le},radioRequests:{"groups:model":"getModel","groups:collection":"getCollection","fetch:groups:collection":"fetchCollection"}})),"organizations"),de=p.Z.extend({getStates(){return this.get("states").clone()},getActiveTeams(){const e=this.getTeams();return e.reset(e.filter((e=>e.hasClinicians()))),e},getTeams(){return this.get("teams").clone()},getForms(){return this.get("forms").clone()},getSetting(e){return this.get("settings").get(e)},getDirectories(){return this.get("directories").clone()},type:ce}),he=(0,c.Z)(de,ce),ue=(new(s.Z.extend({Entity:{_Model:de,Model:he},radioRequests:{"organizations:model":"getModel"}})),"patient-fields"),pe=p.Z.extend({type:ue,getValue(){const e=this.get("value");return(0,r.isObject)(e)&&(0,r.isEmpty)(e)?null:e}}),ge=(0,c.Z)(pe,ue),me=u.Z.extend({model:ge}),fe=(new(s.Z.extend({Entity:{_Model:pe,Model:ge,Collection:me},radioRequests:{"patientFields:model":"getModel","patientFields:collection":"getCollection","fetch:patientFields:model":"fetchPatientField"},fetchPatientField(e,t){const i=`/api/patients/${e}/fields/${t}`;return this.fetchModel(t,{url:i,abort:!1}).then((e=>{this.getModel(e.attributes)}))}})),"patients"),we=p.Z.extend({type:fe,urlRoot:"/api/patients",validate(e){let{first_name:t,last_name:i,birth_date:s,sex:o,_groups:n}=e;const a={};if(t&&i||(a.name="required"),o||(a.sex="required"),n&&n.length||(a.groups="required"),s?h()(s).isAfter()&&(a.birth_date="invalidDate"):a.birth_date="required",!(0,r.isEmpty)(a))return a},getGroups(){return l().request("entities","groups:collection",this.get("_groups"))},getFields(){return l().request("entities","patientFields:collection",this.get("_patient_fields"))},getField(e){return this.getFields().find({name:e})},addGroup(e){const t=this.getGroups();t.add(e),this.set("_groups",t.map((e=>e.pick("id"))))},removeGroup(e){const t=this.getGroups();t.remove(e),this.set("_groups",t.map((e=>e.pick("id"))))},saveAll(e){e=(0,r.extend)({},this.attributes,e);const t={groups:this.toRelation(e._groups,"workspaces")};return this.save(e,{relationships:t},{wait:!0})},canEdit(){return this.isNew()||"manual"===this.get("source")},getSortName(){return(this.get("last_name")+this.get("first_name")).toLowerCase()}}),_e=(0,c.Z)(we,fe),ye=u.Z.extend({url:"/api/patients",model:_e,getSharedGroups(){const e=(0,r.pluck)(this.invoke("getGroups"),"models");return l().request("entities","groups:collection",(0,r.intersection)(...e))}}),ve=(new(s.Z.extend({Entity:{_Model:we,Model:_e,Collection:ye},radioRequests:{"patients:model":"getModel","patients:collection":"getCollection","fetch:patients:model":"fetchModel","fetch:patients:model:byAction":"fetchPatientByAction","fetch:patients:model:byFlow":"fetchPatientByFlow"},fetchPatientByAction(e){return this.fetchBy(`/api/actions/${e}/patient`)},fetchPatientByFlow(e){return this.fetchBy(`/api/flows/${e}/patient`)}})),p.Z.extend({type:"patients-search-results"})),Ze=u.Z.extend({url:"/api/patients",model:ve,initialize(){this._debouncedSearch=(0,r.debounce)(this._debouncedSearch,150)},prevSearch:"",fetcher:{abort:r.noop},search(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(e.length<3)return e.length&&this.prevSearch.includes(e)||(delete this._hasIdentifiers,this.reset(),this.prevSearch=""),this._debouncedSearch.cancel(),void this.fetcher.abort();this.prevSearch=e,this.isSearching=!0,this._debouncedSearch(e)},hasIdentifiers(){return(0,r.isBoolean)(this._hasIdentifiers)||(this._hasIdentifiers=!!this.find((e=>(0,r.get)(e.get("identifiers"),"length")))),this._hasIdentifiers},_debouncedSearch(e){const t={search:e};delete this._hasIdentifiers,this.fetcher=this.fetch({data:{filter:t}}),this.fetcher.then((()=>{this.isSearching=!1,this.trigger("search",this)}))}});new(s.Z.extend({Entity:{Model:ve,Collection:Ze},radioRequests:{"searchPatients:collection":"getCollection"}}));var Re=i(1962);const Ce="program-actions",{parseRelationship:qe}=g.Z,xe=function(e,t){return e&&"owner"!==t?qe(e,t):e},Me=p.Z.extend({urlRoot:"/api/program-actions",type:Ce,validate(e){let{name:t}=e;if(!(0,f.Z)(t))return"Action name required"},getTags(){return l().request("entities","tags:collection",(0,Re.Z)(this.get("tags"),"text"))},addTag(e){const t=this.getTags();return t.add(e),this.save({tags:t.map("text")})},removeTag(e){const t=this.getTags();return t.remove(e),this.save({tags:t.map("text")})},getAction(e){let{patientId:t,flowId:i}=e;const s=l().request("bootstrap","currentUser"),o=l().request("bootstrap","currentOrg").getStates();return l().request("entities","actions:model",{name:this.get("name"),_flow:i,_patient:t,_state:o.at(0).id,_owner:this.get("_owner")||{id:s.id,type:"clinicians"},_program_action:this.id})},getOwner(){const e=this.get("_owner");if(e)return l().request("entities","teams:model",e.id)},saveOwner(e){return e=this.toRelation(e),this.save({_owner:e.data},{relationships:{owner:e}})},getForm(){const e=this.get("_form");if(e)return l().request("entities","forms:model",e)},hasOutreach(){return this.get("outreach")!==w.Ww.DISABLED},saveForm(e){const t={_form:(e=this.toRelation(e)).data};return e.data||(t.outreach=w.Ww.DISABLED),this.save(t,{relationships:{form:e}})},saveAll(e){e=(0,r.extend)({},this.attributes,e);const t={owner:this.toRelation(e._owner,"teams"),form:this.toRelation(e._form,"forms"),"program-flow":this.toRelation(e._program_flow,"program-flows"),program:this.toRelation(e._program,"programs")};return this.save(e,{relationships:t},{wait:!0})},parseRelationship:xe}),Ae=(0,c.Z)(Me,Ce),be=u.Z.extend({initialize(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};this.flowId=t.flowId,this.flowId&&(this.comparator="sequence")},url(){return this.flowId?`/api/program-flows/${this.flowId}/actions`:"/api/program-actions"},model:Ae,parseRelationship:xe,updateSequences(){const e=this.map(((e,t)=>(e.set({sequence:t}),e.toJSONApi({sequence:t}))));return this.sync("patch",this,{url:this.url(),data:JSON.stringify({data:e})})}}),Ee=(new(s.Z.extend({Entity:{_Model:Me,Model:Ae,Collection:be},radioRequests:{"programActions:model":"getModel","programActions:collection":"getCollection","fetch:programActions:model":"fetchModel","fetch:programActions:collection:byProgram":"fetchProgramActionsByProgram","fetch:programActions:collection":"fetchProgramActions","fetch:programActions:collection:byProgramFlow":"fetchProgramActionsByFlow"},fetchProgramActionsByProgram(e){let{programId:t}=e;const i=`/api/programs/${t}/relationships/actions`;return this.fetchCollection({url:i})},fetchProgramActions(){let{filter:e={status:w.t0.PUBLISHED}}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t={filter:e};return this.fetchCollection({data:t})},fetchProgramActionsByFlow:(e,t)=>new be([],{flowId:e}).fetch(t)})),"program-flows"),{parseRelationship:Pe}=g.Z,Fe=function(e,t){return e&&"owner"!==t?Pe(e,t):e},Se=p.Z.extend({urlRoot(){return this.isNew()?`/api/programs/${this.get("_program")}/relationships/flows`:"/api/program-flows"},type:Ee,validate(e){let{name:t}=e;if(!(0,f.Z)(t))return"Flow name required"},getTags(){return l().request("entities","tags:collection",(0,Re.Z)(this.get("tags"),"text"))},addTag(e){const t=this.getTags();return t.add(e),this.save({tags:t.map("text")})},removeTag(e){const t=this.getTags();return t.remove(e),this.save({tags:t.map("text")})},getOwner(){const e=this.get("_owner");if(e)return l().request("entities","teams:model",e.id)},getFlow(e){const t=l().request("bootstrap","currentOrg").getStates();return l().request("entities","flows:model",{_patient:e,_program_flow:this.get("id"),_state:t.at(0).id})},saveOwner(e){return e=this.toRelation(e),this.save({_owner:e.data},{relationships:{owner:e}})},saveAll(e){e=(0,r.extend)({},this.attributes,e);const t={owner:this.toRelation(e._owner,"teams")};return this.save(e,{relationships:t},{wait:!0})},getActions(){return l().request("entities","programActions:collection",this.get("_program_actions"),{flowId:this.id})},parseRelationship:Fe}),De=(0,c.Z)(Se,Ee),Be=u.Z.extend({url:"/api/program-flows",model:De,parseRelationship:Fe}),$e=(new(s.Z.extend({Entity:{_Model:Se,Model:De,Collection:Be},radioRequests:{"programFlows:model":"getModel","programFlows:collection":"getCollection","fetch:programFlows:model":"fetchModel","fetch:programFlows:collection:byProgram":"fetchProgramFlowsByProgram","fetch:programFlows:collection":"fetchProgramFlows"},fetchProgramFlowsByProgram(e){let{programId:t}=e;const i=`/api/programs/${t}/relationships/flows`;return this.fetchCollection({url:i})},fetchProgramFlows(){let{filter:e={status:w.t0.PUBLISHED}}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t={filter:e};return this.fetchCollection({data:t})}})),"programs"),Ie=p.Z.extend({type:$e,validate(e){let{name:t}=e;if(!(0,f.Z)(t))return"Program name required"},urlRoot:"/api/programs",getPublished(){const e=l().request("entities","programActions:collection",this.get("_program_actions")),t=l().request("entities","programFlows:collection",this.get("_program_flows")),i=w.t0.PUBLISHED,s=l().request("entities","programActions:collection",e.filter({status:i})),o=l().request("entities","programFlows:collection",t.filter({status:i}));return new(n().Collection)([...o.models,...s.models],{comparator:"name"})}}),Te=(0,c.Z)(Ie,$e),Oe=u.Z.extend({url:"/api/programs",model:Te}),Ne=(new(s.Z.extend({Entity:{_Model:Ie,Model:Te,Collection:Oe},radioRequests:{"programs:model":"getModel","programs:collection":"getCollection","fetch:programs:model":"fetchModel","fetch:programs:collection":"fetchCollection","fetch:programs:model:byProgramFlow":"fetchProgramByProgramFlow"},fetchProgramByProgramFlow(e){return this.fetchBy(`/api/program-flows/${e}/program`)}})),"roles"),ke=p.Z.extend({type:Ne,urlRoot:"/api/roles"}),Le=(0,c.Z)(ke,Ne),Ge=u.Z.extend({url:"/api/roles",model:Le}),Ue=(new(s.Z.extend({Entity:{_Model:ke,Model:Le,Collection:Ge},radioRequests:{"roles:model":"getModel","roles:collection":"getCollection","fetch:roles:collection":"fetchCollection"}})),"settings"),ze=p.Z.extend({type:Ue,url:"/api/settings",parseModel(e){const t=e.reduce(((e,t)=>(e[t.id]=t.attributes.value,e)),{});return{id:"settings",...t}}}),He=(0,c.Z)(ze,Ue),je=u.Z.extend({url:"/api/settings",model:He}),We=(new(s.Z.extend({Entity:{_Model:ze,Model:He,Collection:je},radioRequests:{"settings:model":"getModel","fetch:settings:model":"fetchModel"}})),"states"),Je=p.Z.extend({type:We,isDone(){return this.get("status")===w.lO.DONE}}),Ye=(0,c.Z)(Je,We),Qe=u.Z.extend({url:"/api/states",model:Ye,groupByDone(){const{done:e,notDone:t}=this.groupBy((e=>e.isDone()?"done":"notDone"));return{done:new Qe(e),notDone:new Qe(t)}},getFilterIds(){return this.map("id").join(",")}}),Ve=(new(s.Z.extend({Entity:{_Model:Je,Model:Ye,Collection:Qe},radioRequests:{"states:model":"getModel","states:collection":"getCollection","fetch:states:collection":"fetchCollection"}})),"tags"),Xe=p.Z.extend({type:Ve,idAttribute:"text"}),Ke=(0,c.Z)(Xe,Ve),et=u.Z.extend({url:"/api/tags",model:Ke,parse:e=>(0,r.map)(e.data,(e=>({text:e}))),comparator:"text"});let tt;const it=(new(s.Z.extend({Entity:{_Model:Xe,Model:Ke,Collection:et},radioRequests:{"tags:model":"getModel","tags:collection":"getCollection","fetch:tags:collection":"fetchTags"},fetchTags(){return tt||this.fetchCollection().then((e=>(tt=e,e)))}})),"teams"),st=p.Z.extend({type:it,urlRoot:"/api/teams",hasClinicians(){const e=this.get("_clinicians");return e&&e.length}}),ot=(0,c.Z)(st,it),nt=u.Z.extend({url:"/api/teams",model:ot,comparator:"name"}),rt=(new(s.Z.extend({Entity:{_Model:st,Model:ot,Collection:nt},radioRequests:{"teams:model":"getModel","teams:collection":"getCollection","fetch:teams:collection":"fetchCollection"}})),"widgets"),at=p.Z.extend({type:rt}),lt=(0,c.Z)(at,rt),ct=u.Z.extend({url:"/api/widgets",model:lt,modelId:e=>(0,r.uniqueId)(`${e.id}-`)});new(s.Z.extend({Entity:{_Model:at,Model:lt,Collection:ct},radioRequests:{"widgets:model":"getModel","widgets:collection":"getCollection","fetch:widgets:collection":"fetchWidgets"},fetchWidgets(){let{filter:e={}}=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t={filter:e};return this.fetchCollection({data:t})}}))},1188:(e,t,i)=>{i.d(t,{Ww:()=>s,cB:()=>r,lO:()=>a,q$:()=>o,t0:()=>n});const s={DISABLED:"disabled",PATIENT:"patient"},o={DISABLED:"disabled",PENDING:"pending",SENT:"sent",RESPONDED:"responded",CANCELED:"canceled",ERROR_NO_PHONE:"error_no_phone",ERROR_OPT_OUT:"error_opt_out",ERROR_SMS_FAILED:"error_sms_failed"},n={CONDITIONAL:"conditional",DRAFT:"draft",PUBLISHED:"published"},r=[{id:"today",unit:"day",prev:0},{id:"yesterday",unit:"day",prev:1},{id:"thisweek",unit:"week",prev:0},{id:"lastweek",unit:"week",prev:1},{id:"thismonth",unit:"month",prev:0},{id:"lastmonth",unit:"month",prev:1}],a={STARTED:"started",QUEUED:"queued",DONE:"done"}},4861:(e,t,i)=>{i.d(t,{XQ:()=>n,oC:()=>a});var s=i(7198);function o(e,t){return"desc"===e?-1*t:t}function n(e,t,i){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";return t||(t=s),i||(i=s),o(e,t.localeCompare(i))}function r(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1;return(0,s.isNumber)(e)?e:t}function a(e,t,i){let s=arguments.length>3&&void 0!==arguments[3]?arguments[3]:Number.NEGATIVE_INFINITY;t||(t=s),i||(i=s);const n=r(t,s)>r(i,s)?1:-1;return o(e,n)}}}]);
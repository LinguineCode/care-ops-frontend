"use strict";(self.webpackChunkcare_ops_frontend=self.webpackChunkcare_ops_frontend||[]).push([[624],{1075:(e,t,s)=>{s.r(t),s.d(t,{startFormServiceApp:()=>c}),s(9306);var r=s(8088),n=s.n(r),o=s(7739),i=s.n(o),a=s(8895);s(2694);const d=a.Z.extend({beforeStart(e){let{formId:t,patientId:s,responseId:r}=e;return[i().request("entities","fetch:forms:model",t),i().request("entities","fetch:forms:definition",t),i().request("entities","fetch:forms:fields",null,s,t),i().request("entities","fetch:formResponses:submission",r)]},onStart(e,t,s,r,n){parent.postMessage({message:"form:pdf",args:{definition:s,formData:r.data.attributes||{},formSubmission:n.data,contextScripts:t.getContextScripts(),reducers:t.getReducers()}},window.origin)}}),f=n().Router.extend({routes:{"formservice/:formId/:patientId(/:responseId)":"startFormService"},startFormService(e,t,s){(new d).start({formId:e,patientId:t,responseId:s})}});function c(){new f,n().history.start({pushState:!0})}},7948:(e,t,s)=>{s.d(t,{Z:()=>r});const r="00000000-0000-0000-0000-000000000000"}}]);
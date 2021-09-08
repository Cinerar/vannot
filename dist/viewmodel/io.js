const{merge,omit,difference,fromPairs}=require("ramda"),{capture}=require("../render/capture"),{notify}=require("../render/chrome"),{getQuerystringValue}=require("../util"),deepEqual=require("deep-equal"),doSave=(e,a={})=>{if(null!=e.saveUrl){const t=new FormData;t.set("data.json",JSON.stringify(e));for(const e of Object.keys(a))t.set(`frames/${e}`,a[e]);return $.ajax({method:"POST",url:e.saveUrl,data:t,cache:!1,contentType:!1,processData:!1})}return localStorage.setItem("vannot",JSON.stringify(e)),Promise.resolve(null)},save=(e,a=[])=>{notify("Saving, please wait.");const t=normalizeData(e);return null==e.saveUrl||0===a.length?doSave(t):capture(e.video,a).then((e=>doSave(t,e)))},checkpoint=e=>{const a=JSON.parse(JSON.stringify(e));return e.save=()=>{const t=omit(["save","changed"],e),r=difference(e.frames.map((e=>e.frame)),a.frames.map((e=>e.frame)));return save(t,r).then((()=>{checkpoint(e)}))},e.changed=()=>{const t=omit(["save","changed"],e);return!deepEqual(normalizeData(t),normalizeData(a))},e},exportAllFrames=e=>save(e,e.frames.map((e=>e.frame))),normalizeData=e=>{if(null==e._seqId&&(e._seqId=0),null==e.objects&&(e.objects=[]),e.objects.some((e=>-1===e.id))||e.objects.unshift({id:-1,title:"Unassigned",color:"#aaa",system:!0}),null==e.frames&&(e.frames=[]),null==e.labels&&(e.labels=[]),e.frames=e.frames.filter((e=>e.shapes.length>0)),null==e.instances){e.instances=[];for(const a of e.frames)for(const t of a.shapes)null==t.instanceId||e.instances.some((e=>e.id===t.instanceId))||e.instances.push({id:t.instanceId})}return null==e.instanceClasses&&(e.instanceClasses=[]),e},getData=e=>{const a=getQuerystringValue("data");if("local"===a){const a=localStorage.getItem("vannot");null!=a&&e(JSON.parse(a))}else try{const t=new URL(a,window.location.origin);$.get(t,e)}catch(e){console.error("given data parameter is not a valid url!")}};module.exports={save,checkpoint,exportAllFrames,normalizeData,getData};
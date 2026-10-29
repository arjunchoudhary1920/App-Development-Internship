(() => {
"use strict";
const $ = id => document.getElementById(id);
const STORAGE_KEY = "studymate-final-tasks-v1";
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const demoTasks = [
{id:"demo-1",title:"Revise database normalization",subject:"Computer Science",dueDate:today(),priority:"High",notes:"Review 1NF, 2NF and 3NF.",completed:false,createdAt:1},
{id:"demo-2",title:"Practice Java programming",subject:"Programming",dueDate:"",priority:"Medium",notes:"Solve two loop exercises.",completed:false,createdAt:2},
{id:"demo-3",title:"Read lecture notes",subject:"General",dueDate:"",priority:"Low",notes:"",completed:true,createdAt:3}
];
let tasks=loadTasks(), activeFilter="all", toastTimer;
function loadTasks(){try{const saved=localStorage.getItem(STORAGE_KEY);if(saved===null){localStorage.setItem(STORAGE_KEY,JSON.stringify(demoTasks));return demoTasks.map(t=>({...t}));}const parsed=JSON.parse(saved);if(!Array.isArray(parsed))throw new Error("Invalid saved tasks");return parsed.filter(t=>t&&typeof t.id==="string"&&typeof t.title==="string").map(t=>({...t,completed:Boolean(t.completed)}));}catch(e){return demoTasks.map(t=>({...t}));}}
function saveTasks(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(tasks));}catch(e){showToast("Could not save data. Check your browser storage settings.");}}
function escapeHTML(value){return String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));}
function formatDate(value){if(!value)return "";const parts=value.split("-").map(Number);return new Date(parts[0],parts[1]-1,parts[2]).toLocaleDateString(undefined,{month:"short",day:"numeric"});}
function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);}
function render(){
const done=tasks.filter(t=>t.completed).length,todo=tasks.length-done,pct=tasks.length?Math.round(done/tasks.length*100):0;
$("totalCount").textContent=tasks.length;$("doneCount").textContent=done;$("todoCount").textContent=todo;$("progressLabel").textContent=pct+"%";$("progressBar").style.width=pct+"%";
const query=$("searchInput").value.trim().toLowerCase();
const filtered=tasks.filter(t=>(activeFilter==="all"||(activeFilter==="todo"&&!t.completed)||(activeFilter==="done"&&t.completed))&&[t.title,t.subject,t.notes].some(v=>String(v||"").toLowerCase().includes(query)));
$("visibleCount").textContent=filtered.length+" "+(filtered.length===1?"task":"tasks");$("clearCompleted").hidden=done===0;$("footerMessage").textContent=tasks.length?done+" of "+tasks.length+" tasks completed":"Start small — add your first task.";
if(!filtered.length){const trulyEmpty=tasks.length===0;const heading=query?"No matching tasks":trulyEmpty?"Your list is a blank page":"Nothing to show here";const message=query?"Try another search term.":trulyEmpty?"Add a task with the form to get started.":activeFilter==="done"?"Complete a task and it will appear here.":"All caught up for this filter. Try another view."; $("taskList").innerHTML='<div class="empty-state"><span class="empty-icon">'+(query?"⌕":"✓")+'</span><strong>'+heading+'</strong><p>'+message+'</p></div>';return;}
$("taskList").innerHTML=filtered.map(t=>{
const overdue=!t.completed&&t.dueDate&&t.dueDate<today();
const due=t.dueDate?'<span class="due '+(overdue?"overdue":"")+'">'+(overdue?"Overdue · ":"Due ")+escapeHTML(formatDate(t.dueDate))+'</span>':"";
const subject=t.subject?'<span class="tag">'+escapeHTML(t.subject)+'</span>':"";
return '<article class="task-card '+(t.completed?"completed":"")+'"><input class="check-task" type="checkbox" data-action="toggle" data-id="'+escapeHTML(t.id)+'" aria-label="Mark '+escapeHTML(t.title)+' complete" '+(t.completed?"checked":"")+'><div class="task-main"><div class="task-title">'+escapeHTML(t.title)+'</div>'+(t.notes?'<div class="task-notes">'+escapeHTML(t.notes)+'</div>':"")+'<div class="task-meta">'+subject+'<span class="tag '+t.priority.toLowerCase()+'">'+escapeHTML(t.priority)+'</span>'+due+'</div></div><button class="delete-task" type="button" data-action="delete" data-id="'+escapeHTML(t.id)+'" aria-label="Delete '+escapeHTML(t.title)+'" title="Delete task">×</button></article>';
}).join("");
}
$("taskForm").addEventListener("submit",event=>{
event.preventDefault();const title=$("taskTitle").value.trim(),subject=$("taskSubject").value.trim()||"General",dueDate=$("taskDue").value,priority=$("taskPriority").value,notes=$("taskNotes").value.trim();const error=$("titleError");error.textContent="";
if(title.length<3){error.textContent="Please enter at least 3 characters.";$("taskTitle").focus();return;}
if(tasks.some(t=>!t.completed&&t.title.toLowerCase()===title.toLowerCase())){error.textContent="An active task with this title already exists.";$("taskTitle").focus();return;}
if(dueDate&&dueDate<today()){showToast("Choose today or a future date for the due date.");$("taskDue").focus();return;}
const id=window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():"task-"+Date.now();
tasks.unshift({id,title,subject,dueDate,priority,notes,completed:false,createdAt:Date.now()});saveTasks();activeFilter="all";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));$("taskForm").reset();$("taskPriority").value="Medium";render();showToast("Task added to your list!");
});
$("taskTitle").addEventListener("input",()=>$("titleError").textContent="");
$("searchInput").addEventListener("input",render);
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));render();}));
$("taskList").addEventListener("change",event=>{const control=event.target.closest('[data-action="toggle"]');if(!control)return;const task=tasks.find(t=>t.id===control.dataset.id);if(task){task.completed=control.checked;saveTasks();render();showToast(task.completed?"Nice work — task completed!":"Task moved back to your to-do list.");}});
$("taskList").addEventListener("click",event=>{const button=event.target.closest('[data-action="delete"]');if(!button)return;const task=tasks.find(t=>t.id===button.dataset.id);if(task&&window.confirm('Delete "'+task.title+'"?')){tasks=tasks.filter(t=>t.id!==task.id);saveTasks();render();showToast("Task deleted.");}});
$("clearCompleted").addEventListener("click",()=>{if(tasks.some(t=>t.completed)&&window.confirm("Remove all completed tasks?")){tasks=tasks.filter(t=>!t.completed);saveTasks();render();showToast("Completed tasks cleared.");}});
$("resetDemo").addEventListener("click",()=>{if(window.confirm("Reset the planner to its original demo tasks? Your current task list will be replaced.")){tasks=demoTasks.map(t=>({...t}));saveTasks();activeFilter="all";$("searchInput").value="";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));render();showToast("Demo tasks restored.");}});
$("jumpToForm").addEventListener("click",()=>{$("taskTitle").focus();$("addTaskPanel").scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});});
render();
})();
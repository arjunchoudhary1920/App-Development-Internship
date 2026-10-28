(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const now = new Date();
  const toISO = value => {
    const date = new Date(value);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  };
  const today = toISO(now);
  const STORAGE_KEY = "studymate-task2-tasks";
  const SETTINGS_KEY = "studymate-task2-settings";
  const seedTasks = [
    {id:1,title:"Finish data structures assignment",subject:"Computer Science",due:today,priority:"High",done:false},
    {id:2,title:"Revise algebra formulas",subject:"Mathematics",due:today,priority:"Medium",done:false},
    {id:3,title:"Read chapter 4 notes",subject:"General",due:toISO(now.getTime()+86400000),priority:"Low",done:true},
    {id:4,title:"Prepare project presentation",subject:"Project",due:toISO(now.getTime()+172800000),priority:"High",done:false},
    {id:5,title:"Practice Java exercises",subject:"Computer Science",due:toISO(now.getTime()+259200000),priority:"Medium",done:true},
    {id:6,title:"Review database normalization",subject:"Computer Science",due:toISO(now.getTime()+345600000),priority:"Medium",done:false},
    {id:7,title:"Write English summary",subject:"English",due:toISO(now.getTime()+432000000),priority:"Low",done:true},
    {id:8,title:"Plan next week study goals",subject:"General",due:toISO(now.getTime()+518400000),priority:"Low",done:false}
  ];
  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return seedTasks;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : seedTasks;
    } catch (error) { return seedTasks; }
  }
  let tasks = loadTasks();
  let nextId = tasks.reduce((max, task) => Math.max(max, Number(task.id) || 0), 0) + 1;
  let filter = "all";
  let toastTimer;
  function saveTasks() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
    catch (error) { toast("Browser storage is unavailable; changes may not persist after refresh."); }
  }
  function esc(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[character]);
  }
  function labelDate(value) {
    if (value === today) return "Today";
    if (value === toISO(now.getTime()+86400000)) return "Tomorrow";
    return new Date(value + "T12:00:00").toLocaleDateString(undefined,{month:"short",day:"numeric"});
  }
  $("dateLabel").textContent = now.toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
  $("dueDate").value = today;
  function taskHTML(task) {
    return '<div class="task '+(task.done?'is-done':'')+'">'+
      '<input class="check" type="checkbox" data-task="'+esc(task.id)+'" aria-label="Mark '+esc(task.title)+' complete" '+(task.done?'checked':'')+'>'+
      '<div class="task-main"><div class="task-title">'+esc(task.title)+'</div><span class="task-meta">'+esc(task.subject)+' · Due '+labelDate(task.due)+'</span></div>'+
      '<span class="priority '+esc(task.priority)+'">'+esc(task.priority)+'</span>'+
      '<button class="delete-task" type="button" data-delete="'+esc(task.id)+'" aria-label="Delete '+esc(task.title)+'" title="Delete task">×</button></div>';
  }
  function renderTasks() {
    const upcoming = tasks.filter(task=>!task.done).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,5);
    $("homeTasks").innerHTML = upcoming.length ? upcoming.map(taskHTML).join("") : '<div class="empty">All caught up! Add a task when you are ready.</div>';
    const visible = tasks.filter(task=>filter==="all"||(filter==="done"?task.done:!task.done)).sort((a,b)=>a.due.localeCompare(b.due));
    $("allTasks").innerHTML = visible.length ? visible.map(taskHTML).join("") : '<div class="empty">No tasks in this view. Add a task to get started.</div>';
  }
  function renderStats() {
    const total=tasks.length, done=tasks.filter(task=>task.done).length, due=tasks.filter(task=>!task.done&&task.due===today).length;
    const rate=total?Math.round(done/total*100):0;
    $("total").textContent=total; $("done").textContent=done; $("due").textContent=due;
    $("rate").textContent=rate+"%"; $("ring").style.setProperty("--progress",rate+"%");
    $("legendDone").textContent=done; $("remaining").textContent=total-done;
    $("pDone").textContent=done; $("pLeft").textContent=total-done; $("pRate").textContent=rate+"%";
    $("barFill").style.width=rate+"%"; $("summary").textContent=done+" of "+total+" tasks completed.";
  }
  function renderCalendar() {
    const start=new Date(now);
    start.setDate(now.getDate()-((now.getDay()+6)%7));
    const names=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    $("monthTitle").textContent=start.toLocaleDateString(undefined,{month:"long",year:"numeric"});
    $("calendarGrid").innerHTML=names.map((name,index)=>{
      const date=new Date(start); date.setDate(start.getDate()+index);
      const key=toISO(date);
      const items=tasks.filter(task=>task.due===key).slice(0,3);
      return '<div class="day '+(key===today?'today':'')+'"><span class="day-name">'+name+'</span><span class="day-number">'+date.getDate()+'</span>'+
        items.map(task=>'<span class="event '+(task.done?'green':'')+'">'+esc(task.title)+'</span>').join("")+'</div>';
    }).join("");
  }
  function render() { renderTasks(); renderStats(); renderCalendar(); }
  function toast(message) {
    const element=$("toast"); element.textContent=message; element.classList.add("show");
    clearTimeout(toastTimer); toastTimer=setTimeout(()=>element.classList.remove("show"),2400);
  }
  function view(name) {
    document.querySelectorAll(".view").forEach(section=>section.classList.toggle("active",section.id===name));
    document.querySelectorAll(".nav").forEach(button=>button.classList.toggle("active",button.dataset.view===name));
    $("crumb").textContent=({home:"Overview",tasks:"My tasks",calendar:"Calendar",progress:"Progress",settings:"Settings"})[name]||"Overview";
    window.scrollTo({top:0,behavior:"smooth"});
  }
  document.querySelectorAll("[data-view]").forEach(button=>button.addEventListener("click",()=>view(button.dataset.view)));
  document.querySelectorAll("[data-goto]").forEach(button=>button.addEventListener("click",()=>view(button.dataset.goto)));
  document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
    filter=button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach(item=>item.classList.toggle("active",item===button));
    renderTasks();
  }));
  document.addEventListener("change",event=>{
    if(event.target.matches("[data-task]")) {
      const task=tasks.find(item=>String(item.id)===event.target.dataset.task);
      if(task) { task.done=event.target.checked; saveTasks(); render(); toast(task.done?"Task completed — nice work!":"Task moved back to your list."); }
      return;
    }
    if(event.target.id==="reminder"||event.target.id==="compact") {
      saveSettings();
      if(event.target.id==="compact") document.body.classList.toggle("compact",event.target.checked);
      toast("Your preference has been saved.");
    }
  });
  document.addEventListener("click",event=>{
    const deleteButton=event.target.closest("[data-delete]");
    if(!deleteButton)return;
    const id=deleteButton.dataset.delete;
    const task=tasks.find(item=>String(item.id)===id);
    if(!task)return;
    if(!window.confirm('Delete "'+task.title+'" from your tasks?'))return;
    tasks=tasks.filter(item=>String(item.id)!==id);
    saveTasks(); render(); toast("Task deleted.");
  });
  const dialog=$("dialog");
  document.querySelectorAll(".add").forEach(button=>button.addEventListener("click",()=>{
    $("dueDate").value=today;
    dialog.showModal();
    setTimeout(()=>$("title").focus(),30);
  }));
  function closeDialog(){dialog.close();}
  $("close").addEventListener("click",closeDialog);
  $("cancel").addEventListener("click",closeDialog);
  $("taskForm").addEventListener("submit",event=>{
    event.preventDefault();
    const title=$("title").value.trim();
    if(!title){$("title").focus();return;}
    tasks.unshift({
      id:nextId++,title,subject:$("subject").value,
      due:$("dueDate").value||today,priority:$("priority").value,done:false
    });
    saveTasks(); $("taskForm").reset(); $("dueDate").value=today;
    closeDialog(); render(); view("tasks"); toast("Your new task has been added.");
  });
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY))||{reminder:true,compact:false}; }
    catch(error) { return {reminder:true,compact:false}; }
  }
  function saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY,JSON.stringify({reminder:$("reminder").checked,compact:$("compact").checked})); }
    catch(error) { /* Settings remain available for this session. */ }
  }
  const settings=loadSettings();
  $("reminder").checked=settings.reminder;
  $("compact").checked=settings.compact;
  document.body.classList.toggle("compact",settings.compact);
  render();
})();
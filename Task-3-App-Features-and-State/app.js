(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const STORAGE_KEY = "studymate-task3-tasks-v1";
  const today = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().slice(0, 10);
  };
  const demoTasks = [
    {id:"demo-1",title:"Revise database normalization",subject:"Computer Science",dueDate:today(),priority:"High",notes:"Review 1NF, 2NF and 3NF.",completed:false,createdAt:1},
    {id:"demo-2",title:"Practice Java programming",subject:"Programming",dueDate:today(),priority:"Medium",notes:"Solve two loop exercises.",completed:false,createdAt:2},
    {id:"demo-3",title:"Read lecture notes",subject:"General",dueDate:"",priority:"Low",notes:"",completed:true,createdAt:3}
  ];
  let tasks = loadTasks();
  let activeFilter = "all";
  let toastTimer;
  function loadTasks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTasks));
        return demoTasks.map(task => ({...task}));
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) throw new Error("Invalid saved data");
      return parsed.filter(task => task && typeof task.id === "string" && typeof task.title === "string");
    } catch (error) {
      return demoTasks.map(task => ({...task}));
    }
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      $("footer-message").textContent = "Your latest changes are saved.";
      return true;
    } catch (error) {
      $("footer-message").textContent = "Browser storage is unavailable; changes may not persist.";
      showToast("Could not save changes. Check browser storage settings.");
      return false;
    }
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  function formatDate(value) {
    if (!value) return "No due date";
    if (value === today()) return "Due today";
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate()+1);
    const t = new Date(tomorrow); t.setMinutes(t.getMinutes()-t.getTimezoneOffset());
    if (value === t.toISOString().slice(0,10)) return "Due tomorrow";
    const date = new Date(value+"T12:00:00");
    return "Due "+date.toLocaleDateString(undefined,{month:"short",day:"numeric",year:date.getFullYear()===new Date().getFullYear()?undefined:"numeric"});
  }
  function renderCounts() {
    const completed = tasks.filter(task=>task.completed).length;
    const pending = tasks.length-completed;
    $("total-count").textContent = tasks.length;
    $("completed-count").textContent = completed;
    $("pending-count").textContent = pending;
    $("list-count").textContent = tasks.length;
    $("pill-all").textContent = tasks.length;
    $("pill-pending").textContent = pending;
    $("pill-completed").textContent = completed;
    $("clear-completed").disabled = completed === 0;
  }
  function taskMarkup(task) {
    return '<article class="task-row '+(task.completed?"is-complete":"")+'">'+
      '<button class="check-btn" type="button" data-toggle="'+escapeHTML(task.id)+'" aria-pressed="'+Boolean(task.completed)+'" aria-label="'+(task.completed?"Mark incomplete: ":"Mark complete: ")+escapeHTML(task.title)+'">'+(task.completed?"✓":"")+'</button>'+
      '<div class="task-body"><div class="task-title">'+escapeHTML(task.title)+'</div>'+
      '<div class="task-meta"><span>'+escapeHTML(task.subject||"General")+'</span><span>·</span><span>'+escapeHTML(formatDate(task.dueDate))+'</span></div>'+
      (task.notes?'<p class="task-notes">'+escapeHTML(task.notes)+'</p>':"")+'</div>'+
      '<span class="priority '+escapeHTML(task.priority)+'">'+escapeHTML(task.priority)+'</span>'+
      '<button class="delete-btn" type="button" data-delete="'+escapeHTML(task.id)+'" aria-label="Delete task: '+escapeHTML(task.title)+'" title="Delete task">×</button></article>';
  }
  function render() {
    renderCounts();
    const query = $("search").value.trim().toLocaleLowerCase();
    const visible = tasks.filter(task => {
      const statusMatch = activeFilter==="all" || (activeFilter==="pending"?!task.completed:task.completed);
      const queryMatch = [task.title,task.subject,task.notes].some(value=>String(value||"").toLocaleLowerCase().includes(query));
      return statusMatch && queryMatch;
    }).sort((a,b)=>Number(a.completed)-Number(b.completed) || (a.dueDate||"9999").localeCompare(b.dueDate||"9999") || b.createdAt-a.createdAt);
    $("task-list").innerHTML = visible.map(taskMarkup).join("");
    const empty = visible.length===0;
    $("empty-state").classList.toggle("visible",empty);
    if (empty) {
      if (tasks.length===0) {
        $("empty-title").textContent="Your list is a blank page.";
        $("empty-copy").textContent="Add your first task using the form to start making progress.";
        $("empty-add").hidden=false;
      } else {
        $("empty-title").textContent=query?"No matching tasks found.":"Nothing in this filter yet.";
        $("empty-copy").textContent=query?"Try a different search term.":"Choose another filter or add a task to this list.";
        $("empty-add").hidden=true;
      }
    }
    $("footer-message").textContent = tasks.length ? tasks.filter(task=>task.completed).length+" of "+tasks.length+" tasks completed." : "Ready when you are.";
  }
  function showToast(message) {
    const element=$("toast");
    element.textContent=message;
    element.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>element.classList.remove("show"),2600);
  }
  function setError(message) {
    $("title-error").textContent=message;
    $("task-title").setAttribute("aria-invalid",message?"true":"false");
  }
  $("task-title").addEventListener("input",()=>{if($("task-title").value.trim())setError("");});
  $("task-notes").addEventListener("input",()=>{$("notes-count").textContent=$("task-notes").value.length+"/180";});
  $("task-form").addEventListener("submit",event=>{
    event.preventDefault();
    const title=$("task-title").value.trim();
    if (!title) {
      setError("Please enter a task title.");
      $("task-title").focus();
      return;
    }
    if (title.length<3) {
      setError("Use at least 3 characters for the task title.");
      $("task-title").focus();
      return;
    }
    if (tasks.some(task=>task.title.toLocaleLowerCase()===title.toLocaleLowerCase()&&!task.completed)) {
      setError("An active task with this title already exists.");
      $("task-title").focus();
      return;
    }
    setError("");
    const dueDate=$("task-date").value;
    if (dueDate && dueDate<today()) {
      $("form-status").textContent="Choose today or a future due date.";
      $("task-date").focus();
      return;
    }
    const task={
      id: typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"task-"+Date.now()+"-"+Math.random().toString(16).slice(2),
      title,subject:$("task-subject").value.trim(),dueDate,priority:$("task-priority").value,
      notes:$("task-notes").value.trim(),completed:false,createdAt:Date.now()
    };
    tasks.unshift(task);
    persist();
    $("task-form").reset();
    $("notes-count").textContent="0/180";
    $("form-status").textContent="Task added successfully!";
    activeFilter="all";
    $("filter").value="all";
    document.querySelectorAll("[data-filter]").forEach(button=>button.classList.toggle("active",button.dataset.filter==="all"));
    $("search").value="";
    render();
    $("task-title").focus();
    showToast("Task added to your list.");
  });
  $("search").addEventListener("input",render);
  $("filter").addEventListener("change",()=>{
    activeFilter=$("filter").value;
    document.querySelectorAll("[data-filter]").forEach(button=>button.classList.toggle("active",button.dataset.filter===activeFilter));
    render();
  });
  document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
    activeFilter=button.dataset.filter;
    $("filter").value=activeFilter;
    document.querySelectorAll("[data-filter]").forEach(item=>item.classList.toggle("active",item===button));
    render();
  }));
  $("task-list").addEventListener("click",event=>{
    const toggle=event.target.closest("[data-toggle]");
    const remove=event.target.closest("[data-delete]");
    if(toggle) {
      const task=tasks.find(item=>item.id===toggle.dataset.toggle);
      if(task) {task.completed=!task.completed;persist();render();showToast(task.completed?"Task completed — nice work!":"Task marked as to do.");}
    }
    if(remove) {
      const task=tasks.find(item=>item.id===remove.dataset.delete);
      if(!task)return;
      if(!window.confirm('Delete "'+task.title+'" from your list?'))return;
      tasks=tasks.filter(item=>item.id!==task.id);
      persist();render();showToast("Task deleted.");
    }
  });
  $("clear-completed").addEventListener("click",()=>{
    const count=tasks.filter(task=>task.completed).length;
    if(!count)return;
    if(!window.confirm("Remove all "+count+" completed task(s)?"))return;
    tasks=tasks.filter(task=>!task.completed);
    persist();render();showToast("Completed tasks cleared.");
  });
  $("empty-add").addEventListener("click",()=>{
    $("task-title").focus();
    $("task-title").scrollIntoView({behavior:"smooth",block:"center"});
  });
  $("task-date").min=today();
  render();
})();
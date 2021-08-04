const socket=io()
let room;
let name;
let textarea=document.querySelector("textarea");
let messagearea=document.querySelector('.message__area');
let brand=document.querySelector('.brand')
do{
    name=prompt("enter your name");
    
}while(!name);



socket.emit("new-user-joined",name)
//console.log(textarea)
socket.emit("history",name)
textarea.addEventListener('keyup',(e)=>{
   if(e.key == "Enter"){
      sendmessage(e.target.value)
     // console.log(e.target.value)
   }
})

function sendmessage(message){
      let msg={
          user:name,
          Message:message.trim()
      }
      
      appendmessage(msg,'outgoing')
      scroll()
      textarea.value=''
      socket.emit("message",msg)
      //socket.emit("room",room)
}

function appendmessage(msg,type){
    let mainDiv =document.createElement("div");
    let c=type
    mainDiv.classList.add(c,'message')
    let markup = `
     <h4>${msg.user}</h4>
     <p>${msg.Message}</p>
    
    `
  mainDiv.innerHTML=markup
  messagearea.appendChild(mainDiv)  
}
function room1(room){
    let h =document.createElement("h2");
    let markup=`You have Joined ${room}`
    h.innerHTML=markup
    brand.appendChild(h)
}
socket.on("message",(msg)=>{
    
    appendmessage(msg,'incoming')
    scroll()
})
socket.on("user-joined",(name)=>{
    let m={
        user:`new user`,
        Message:`${name.user} has joined the chat`
       }
    appendmessage(m,'incoming')
})
socket.on('left',name1=>{
    let m={
        user:name1,
        Message:`${name1} has left the chat`
       }
    appendmessage(m,'incoming')
})
socket.on("history",obj1=>{
   // alert("ssd")
   // console.log("obj1",obj1) 
    for(x in obj1){
        let m={
            user:obj1[x].username,
            Message:obj1[x].message
           }
       // console.log(obj1)   
        appendmessage(m,'outgoing')  
        }
})
function scroll(){
    messagearea.scrollTop=messagearea.scrollHeight
}
const form=document.getElementById('login_form');

form.addEventListener("submit",async(e)=>{
    e.preventDefault();
try{
   
const email=document.getElementById('login-email').value;
const password=document.getElementById('login-password').value;
alert(email,password)
const res=await fetch('/user/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
});
const result=await res.json();
if(res.ok)
{
    alert('login success');
    form.reset()
}
}
catch(err)
{
    console.log('login err',err)
}
})
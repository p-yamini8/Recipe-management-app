const form=document.getElementById('login_form');

form.addEventListener("submit",async(e)=>{
    e.preventDefault();
try{
   
const email=document.getElementById('login-email').value;
const password=document.getElementById('login-password').value;

const res=await fetch('/user/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({email,password})
});
const result=await res.json();
if(res.ok)
{localStorage.setItem('token',result.token)
    localStorage.setItem('username',result.name)
    localStorage.setItem('userId',result.id)
    localStorage.setItem('isAdmin',String(result.isAdmin))
    console.log('userId',result.id)
    alert('login success');
   
    window.location.href='../dashboard/dashboard.html'
}
}
catch(err)
{
    console.log('login err',err)
}
})
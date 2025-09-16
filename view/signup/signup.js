const form=document.getElementById("signup_form");

form.addEventListener("submit",async(e)=>{
e.preventDefault();

   try{
const name=document.getElementById('name').value;
const number=document.getElementById('number').value
const email=document.getElementById('email').value;
const password=document.getElementById('password').value;

const response=await fetch('/user/signup',{
    method:'POST',
    headers:{'Content-Type':"application/json"},
    body:JSON.stringify({name,email,number,password})
});
console.log(name,email,number,password)
const result=await response.json();
alert(result.message)
if(response.ok)
{
    form.reset()
    alert('signup success');

}
else{
    alert(result.message||'signup failed')
}
   }
   catch(err)
   {
    
    
    alert('something wet wrong please try again');
   }
});

    //BUSCADOR
    document.addEventListener("keyup", e=>{


        if(e.target.matches(".buscador")){
            console.log("click");
          if(e.key === 27)e.target.value = ""
      
          document.querySelectorAll(".data").forEach(data =>{
            console.log(data);
            console.log("click");
            data.textContent.toLowerCase().includes(e.target.value.toLowerCase())
            ?data.classList.remove("filter")
            :data.classList.add("filter")
          });
        
        };
      
      });
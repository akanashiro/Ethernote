const contractAddress = '0x3312E9fe5d1CCBA4379f5949653eD922E96449D8';
const abi = JSON.parse('[ { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "_Position", "type": "uint256" } ], "name": "deleteEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "aPosition", "type": "uint256" } ], "name": "getNoteEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "position", "type": "uint256" }, { "indexed": false, "internalType": "bool", "name": "isEditable", "type": "bool" } ], "name": "toggleEvent", "type": "event" }, { "inputs": [ { "internalType": "uint256", "name": "aPosition", "type": "uint256" } ], "name": "deleteNote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "aPosition", "type": "uint256" }, { "internalType": "string", "name": "inContent", "type": "string" } ], "name": "editNote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "flushNotes", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "string", "name": "inTitle", "type": "string" }, { "internalType": "string", "name": "inContent", "type": "string" } ], "name": "pushNote", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "aPosition", "type": "uint256" } ], "name": "toggleEditable", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "addrEditor", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "aPosition", "type": "uint256" } ], "name": "getNote", "outputs": [ { "internalType": "string", "name": "outTitle", "type": "string" }, { "internalType": "string", "name": "outContent", "type": "string" }, { "internalType": "bool", "name": "outEditable", "type": "bool" }, { "internalType": "uint256", "name": "outTimestamp", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getNotes", "outputs": [ { "components": [ { "internalType": "string", "name": "strTitle", "type": "string" }, { "internalType": "string", "name": "strContent", "type": "string" }, { "internalType": "bool", "name": "isEditable", "type": "bool" }, { "internalType": "uint256", "name": "timeStamp", "type": "uint256" } ], "internalType": "struct Ethernote.Note[]", "name": "", "type": "tuple[]" } ], "stateMutability": "view", "type": "function" } ]',);

function bindEvents(contract) {

  $("#btn-add").click(function(){

    if (!$("#strTitle").val()){
      alert("Tittle is required");
    }
    else
    {
      if (!$("#strContent").val()){
        alert("Content is required");
      }
      else
      {
        // $("#loader").show();

        aTitle = $("#strTitle").val();
        aContent = $("#strContent").val();
        contract.methods.pushNote(aTitle, aContent).send({from: account});

        contract.events.getNoteEvent({fromBlock: 'latest'}, function(error, event) { 
          if (error) {
           console.log(error); return; 
          } else {
              console.log('ok');
            }
          }).on('data',function(result){
            console.log(result);
                      if (result){
                                    console.log("Add in position "+ result.returnValues.aPosition);
                                    $("#strTitle").val(' ');
                                    $("#strContent").val(' ');
                                    
                                    $("#notesboardTable-Body").html(' ');
                                    //$("#loader").hide();
                                    let ethNote;
                                    getNotes(ethNote,contract);
                                  } else {
                                          $("#loader").hide();
                                          console.log(result);
                                        }
                                      }
                )
                
      }
    }
  })
}

function initMainPage(contratoGlobal) {


  return bindEvents(contratoGlobal);
}


// Web3
const getWeb3 = () => {
    return new Promise((resolve, reject) => {
      window.addEventListener('load', async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          try {
            // ask user permission to access his accounts
            await window.ethereum.request({ method: 'eth_requestAccounts' })
            resolve(web3)
          } catch (error) {
            reject(error)
          }
        } else {
          reject('MetaMask is NOT installed')
        }
      })
    })
  }


//Smart contract functions
const getNotes = async (result, contract) => {
    result = await contract.methods.getNotes().call()
    $("#notesboardTable-Body").html(' ');
    const notesboardTable = document.querySelector(".notesboardTable-Body")


    for (i=0; i < result.length;i++){

      // Remove Button
      let btnRemove = document.createElement("button")


      let notesboardTableBodyRow = document.createElement("tr")
      notesboardTableBodyRow.className = 'notesboardTableBodyRow'

      let noteTitle = document.createElement("td")
      noteTitle.innerText = result[i].strTitle
      noteTitle.className = "divTableCell"

      let noteContent = document.createElement("td")
      noteContent.innerText = result[i].strContent
      noteContent.className = "divTableCell"

      let noteEditable = document.createElement("td")
      noteEditable.className = "divTableCell center"
      if (result[i].isEditable == true){
        noteEditable.innerHTML = "<i class='fa fa-unlock'></i>";
      }else{
        noteEditable.innerHTML = "<i class='fa fa-lock'></i>";
      }
      noteEditable.id = "isEditable" + i
      
      let noteStamp = document.createElement("td")

      //var myObj = $.parseJSON('{"date_created":"1273185387"}'),
      myDate = new Date(1000*result[i].timeStamp);
      noteStamp.innerText = myDate.toLocaleString();
      //noteStamp.innerText = result[i].timeStamp
      noteStamp.className = "divTableCell"

      // Toggle Button
      let btnToggle = document.createElement("button")
      btnToggle.type = "button"
      btnToggle.className = "btn action"
      btnToggle.id = "btn-toggle"
      btnToggle.data = i 
      btnToggle.innerHTML="<i class='fa fa-toggle-on'></i>";
      btnToggle.onclick = (
        function(event){       
          var noteId = parseInt(btnToggle.data);
          contract.methods.toggleEditable(noteId).send({from: account});
          $("#loaderChico"+noteId).show();

          contract.events.toggleEvent({fromBlock: 'latest'}, function(error, event) { 
            if (error) {
             console.log(error); return; 
            } else {
                console.log('ok');
              }
            }).on('data',function(result){
            if (result){
              console.log(result.returnValues.isEditable);
              $("#loaderChico"+noteId).hide();
              var posicion = result.returnValues.position.toString();
              var boolIsEditable = result.returnValues.isEditable.toString();
              console.log(posicion);
              
              if (boolIsEditable== "true"){
                $("#isEditable" + posicion).html("<i class='fa fa-unlock'></i>");
                $("#btn-remove"+posicion).attr("class","btn action");
                $("#btn-remove"+posicion).attr("disabled",false);
              }else{
                $("#isEditable" + posicion).html("<i class='fa fa-lock'></i>");
                $("#btn-remove"+posicion).attr("class","btn disabled");
                $("#btn-remove"+posicion).attr("disabled",true);
              }

            } else {
              $("#loaderChico"+noteId).hide();
              console.log(result);
            }
          }); 
        }
      )

      let noteAction = document.createElement("td");
      noteAction.appendChild(btnToggle);
      noteAction.className = "divTableCell";

      btnRemove.type = "button"
      btnRemove.className = "btn action"
      //btnRemove.value = ""
      btnRemove.id = "btn-remove"+i
      btnRemove.innerHTML="<i class='fa fa-trash'></i>";

      if (result[i].isEditable == true){
        btnRemove.className = "btn action";
        btnRemove.disabled = false;
      }else{
        btnRemove.className = "btn disabled";
        btnRemove.disabled = true;
      }

      btnRemove.data = i
      btnRemove.onclick = (
        function(event){       
          var noteId = parseInt(btnRemove.data);

          contract.methods.deleteNote(noteId).send({from: account});
          $("#loaderChico"+noteId).show();

          contract.events.deleteEvent({fromBlock: 'latest'}, function(error, event) { 
            if (error) {
             console.log(error); return; 
            } else {
                console.log('ok');
              }
            }).on('data',function(result){
            if (result){
              console.log(result.returnValues._Position);
              $("#notesboardTable-Body").html(' ');
              let ethNote;
              getNotes(ethNote, contract);
              //initMainPage(contract);
            } else {
              $("#loaderChico"+noteId).hide();
              console.log(result);
            }
          }); 
        }
      )
      noteAction.appendChild(btnRemove);

      // Icon
      let loaderImg = document.createElement("img");
      loaderImg.src = "./images/Blocks-1s-200px.gif";
      loaderImg.id = "loaderChico"+i;
      loaderImg.className = "loaderChico";
      let noteLoader = document.createElement("td");
      noteLoader.appendChild(loaderImg);
      noteLoader.className = "divTableLoad";
      

      notesboardTableBodyRow.append(noteTitle,noteContent,noteStamp,noteEditable,noteAction, noteLoader)
      notesboardTable.append(notesboardTableBodyRow) 
  }  

  //return await initMainPage(contract)
}

// Contract
const getContract = async web3 => {
    const ethNote = new web3.eth.Contract(abi, contractAddress)
    return ethNote
}

async function App(){
    web3Provider = null
    
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()
    const contract = await getContract(web3)

    /* console.log(contract) 
    for (i=0; i < accounts.length; i++){ 
      var anAccount = accounts[i];
      var strOption = "<option value='" + anAccount + "'>" + anAccount + "</option>";
      $(strOption).appendTo("#addressSelect");
    }*/

    let ethNote

    //contratoGlobal = contract
    account = accounts[0];
  
    document.getElementById('account').innerHTML = account;
    getNotes(ethNote, contract);

   initMainPage(contract);

}

App()

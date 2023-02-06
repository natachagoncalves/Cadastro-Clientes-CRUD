'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active');

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
} 

const getLocalStorage = () => JSON.parse(localStorage.getItem("db-Client")) ?? []; 
const setLocalStorage = (dbClient) => localStorage.setItem("db-Client", JSON.stringify(dbClient)); 

// CRUD creat read update delete

const deleteClient = (indice) => { 
    const dbClient = readClient(); 
    dbClient.splice(indice, 1);  
    setLocalStorage(dbClient);
} 

const updateClient = (indice, client) => {  
    const dbClient = readClient();
    dbClient[indice] = client;
    setLocalStorage(dbClient);
}

const readClient = () => getLocalStorage();

const creatClient = (client) => {  
    const dbClient = getLocalStorage();
    dbClient.push(client); 
    setLocalStorage(dbClient);
}


//interação com o usuário/layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field'); 
    fields.forEach(item => item.value = "");
}


const isValidFields = () => {
    return document.querySelector('#form').reportValidity(); 

}

const saveClient = () => {  
    if(isValidFields()) {   
        const client = {  
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            celular: document.querySelector('#celular').value,
            cidade: document.querySelector('#cidade').value,
        }
        const indice = document.querySelector('#nome').dataset.indice;
        if(indice == 'new') {  
            creatClient(client);
            updateTable();
            closeModal();
        } else {
            updateClient(indice, client);
            updateTable();
            closeModal();
        }

    }
}

const creatRow = (client, indice) => {  
    const newRow = document.createElement('tr'); 
    newRow.innerHTML = `   
        <td data-title="Nome">${client.nome}</td>
        <td data-title="Email">${client.email}</td>
        <td data-title="Celular">${client.celular}</td>
        <td data-title="Estado">${client.cidade}</td>
        <div class="buttons">
            <button type="button" class="button yellow" id="edit-${indice}">editar</button>
            <button type="button" class="button red" id="delete-${indice}">excluir</button>
        </div>
    `  
    document.querySelector("#tableClient>tbody").appendChild(newRow);  
    
}

const clearTable = () => {   
    const rows = document.querySelectorAll("#tableClient>tbody tr"); 
    rows.forEach((row) => {  
        row.parentNode.removeChild(row); 
    })
}

const updateTable = () => {
    const dbClient = readClient();  
    clearTable();  
    dbClient.forEach(creatRow); 
}

updateTable(); 

const fillFields = (client) => {
    document.querySelector('#nome').value = client.nome;
    document.querySelector('#email').value = client.email;
    document.querySelector('#celular').value = client.celular;
    document.querySelector('#cidade').value = client.cidade;
    document.querySelector('#nome').dataset.indice = client.indice;
}

const editClient = (indice) => {  
    const client = readClient()[indice];  
    client.indice = indice;
    fillFields(client);
    openModal();
}

const editDelete = (event) => {
    if(event.target.type == 'button'){ 
       const [action, indice] = event.target.id.split('-');

       if(action == 'edit') {
            editClient(indice); 
       } else {
        const client = readClient()[indice]; 
        const response = confirm(`Deseja realmente excluir o cliente ${client.nome}?`);
        if(response) { 
            deleteClient(indice); 
            updateTable(); 
        }

       }
    } 
} 

//events
document.getElementById('cadastrarCliente') 
    .addEventListener('click', openModal);

document.getElementById('modalClose')
    .addEventListener('click', closeModal);  

document.querySelector("#salvar")             
    .addEventListener("click", saveClient);

document.querySelector("#tableClient>tbody")
    .addEventListener("click", editDelete);   

document.querySelector('#cancelar')
    .addEventListener("click", closeModal);
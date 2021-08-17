
const buyBtn = document.querySelectorAll(".Buy")
const orders = document.getElementById("orders")
const totalBuy = document.getElementById("totalBuy")

buyBtn.forEach( btn =>{
    btn.innerHTML = 'Add'

    btn.addEventListener('click' , function (){
        if(btn.className === 'Buy'){
            btn.innerHTML = 'Remove'
            AddtoCart(this);
        }
        else{
            btn.innerHTML = 'Add'
            removeFromCart(this)
        }
        btn.classList.toggle("remove")
        totalBuy.innerText = products.length;
        orders.innerHTML = ''
    })
})

let products = []
function AddtoCart(receipe){
    const foodContainer = receipe.parentElement
    const foodName = foodContainer.querySelector('.food-title').innerHTML
    const foodPrice = Math.floor(foodContainer.querySelector('.food-price').innerHTML.split(":")[1].split(' ')[2]) || 100;
    const product = {
        name : foodName,
        price : foodPrice
    }
    products.push(product)
}

function removeFromCart(receipe){
    const foodContainer = receipe.parentElement
    const foodName = foodContainer.querySelector('.food-title').innerHTML
    const foodPrice = Math.floor(foodContainer.querySelector('.food-price').innerHTML.split(":")[1].split(' ')[2]) || 100;

    products = products.filter( product => {
        if(product.name !== foodName && product.price !== foodPrice)
            return product
    })
}

function ShowBuys(){
    orders.innerHTML = ''
    products.forEach(product =>{
        const input = document.createElement('div') 
        input.innerHTML = `<span class="productName">${product.name}</span><input type="text" name='${product.name}' value=${product.price} class="menuBuys">`
        orders.append(input)
    })
}

const deliver = document.getElementById('deliveryForm')
deliver.addEventListener('submit', function (e){
    OrderPlace(this)
    e.preventDefault()
})

async function OrderPlace(form , e){
    try{
        if(products.length <= 0){
            alert("Please add receipe for place order.\n0 order cann't be place.")
            return;
        }
        const btnOrder = document.querySelector('.form-button')
        btnOrder.style.pointerEvents = 'none';
        let formData = new Object();
        formData["name" ]   = form.name.value
        formData["phone"]   = form.phone.value
        formData["address"] = form.address.value
        formData["products"] = products
        formData["time"] = new Date().toLocaleString();
        const response = await fetch(form.action, {
            method: "POST",
            headers : {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(formData)
        }) 
        const result = Math.floor(await response.text());
        if(result)
            btnOrder.style.pointerEvents = 'all';
        
        if(result === 1){
            alert("You Order Place Sucessfully!\nThanks for Ordering from our resturant.")
            form.name.value = '';
            form.phone.value = '';
            form.address.value = '';
        }
        else{
            alert("Something went wrong.\nPlace your order after sometimes.")
        }
    }
    catch(err){
        console.error(err)
    }
}



"use strict";

document/addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    const forbiddenEmailDomains = [];

    async function loadForbiddenDomains(){
        try{
            const response = await fetch('forbidden-domains.txt');
            if(response.ok){
                const text = await response.text();
                forbiddenEmailDomains.push(...text.split('\n').map(line =>line.trim()));
            }else{
                console.error('Не удалось загрузить файл с доменами');
            }
        }catch(error){
            console.error('Ошибка при загрузке файлаю')
        }
    }

    function validateName(name){
        const nameRegex = /^[a-zA-Za-яА-яУё\s]{1,100}$/;
        return nameRegex.test(name);
    }

    function validateEmail(email) {
        const emailParts = email.split('@');
        if(emailParts.length !== 2) return false;
        const domain = emailParts[1].toLowerCase();
        return !forbiddenEmailDomains.includes(domain);
    }

    function containsUnsafeCode(value){
        const unsafeCodeRegax = /<\/?[a-zA-z][\s\S]*>||<script[\s\S]*?>[\s\S]*?<\/script>||<\?php[\s\S]*?\?>/i;
        return unsafeCodeRegax.test(value);
    }

    function showError(input, errorElement, message){
        input.classList.add('error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';                    
    }

    function cleanError(input, errorElement){
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = "none";
    }

    function validateForm(){
        let isValid = true;

        if(nameInput.value){
            if(!validateName(nameInput.value)){
                showError(nameInput, nameError, 'Имя должно содержать только буквы и пробелы и не более 100 символов.')
                isValid = false;
            }else{
                cleanError(nameInput, nameError);
            }
        }

        if(emailInput.value){
            if(!validateEmail(emailInput.value)){
                showError(emailInput, emailError, 'Пожалуйста, используйте корректный домен для электронной почты')
                isValid = false;
            }else{
                cleanError(emailInput, emailError);
            }
        }

        if(messageInput.value){
            if(!containsUnsafeCode(messageInput.value)){
                showError(messageInput, messageError, 'Сообщение не должно содержать HTML, JS или PHP код.')
                isValid = false;
            }else{
                cleanError(messageInput, messageError);
            }
        }

        return isValid;
    }
    
    loadForbiddenDomains().then(() => {
        nameInput.addEventListener('input', validateForm);
        emailInput.addEventListener('input', validateForm);
        messageInput.addEventListener('input', validateForm);

        form.addEventListener('submit', function(event){
            event.preventDefault();

            if(validateForm()){
                alert(`Спасибо, ${nameInput.value}! Ваше сообщение отправлено.`);
                form.reset();
            }else{
                alert('Пожалуйста, исправьте ошибки в форме.');
            }
        })


        document.querySelectorAll('nav a').forEach(anchor => {
            anchor.addEventListener('click', function(e){
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                })
            })
        })
    })
    
})
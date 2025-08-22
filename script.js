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
        const nameRegex = /^[a-zA-Za-яА-яУё\s]{1, 100}$/;
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
})